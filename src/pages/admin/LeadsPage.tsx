import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, ExternalLink, LoaderCircle, Mail, MessageCircle, Search, Trash2, X } from 'lucide-react';
import { deleteContactLead, listContactLeads, updateContactLead } from '@/lib/adminApi';
import type { ContactLead, LeadStatus } from '@/types/admin';

const statusOptions: ReadonlyArray<{ value: LeadStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Semua status' }, { value: 'new', label: 'Baru' },
  { value: 'contacted', label: 'Dihubungi' }, { value: 'completed', label: 'Selesai' }, { value: 'spam', label: 'Spam' },
];
const statusStyle: Record<LeadStatus, string> = {
  new: 'bg-blue-50 text-blue-700', contacted: 'bg-amber-50 text-amber-700',
  completed: 'bg-emerald-50 text-emerald-700', spam: 'bg-red-50 text-red-700',
};
const statusLabel: Record<LeadStatus, string> = { new: 'Baru', contacted: 'Dihubungi', completed: 'Selesai', spam: 'Spam' };

function whatsappUrl(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits.startsWith('0') ? `62${digits.slice(1)}` : digits}`;
}

function csvCell(value: string | number | null) {
  let text = String(value ?? '');
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export default function LeadsPage() {
  const [items, setItems] = useState<ContactLead[]>([]);
  const [selected, setSelected] = useState<ContactLead | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<LeadStatus | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await listContactLeads()); setError(''); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Leads tidak dapat dimuat.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (status !== 'all' && item.status !== status) return false;
      if (startDate && new Date(item.created_at) < new Date(`${startDate}T00:00:00`)) return false;
      if (endDate && new Date(item.created_at) > new Date(`${endDate}T23:59:59.999`)) return false;
      return !needle || [item.name, item.email, item.phone ?? '', item.message].some((value) => value.toLowerCase().includes(needle));
    });
  }, [endDate, items, query, startDate, status]);

  const remove = async (lead: ContactLead) => {
    if (!window.confirm(`Hapus lead dari ${lead.name}? Tindakan ini tidak dapat dibatalkan.`)) return;
    try { await deleteContactLead(lead.id); if (selected?.id === lead.id) setSelected(null); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Lead tidak dapat dihapus.'); }
  };

  const exportCsv = () => {
    const header = ['Nama', 'Email', 'WhatsApp', 'Pesan', 'Status', 'Catatan', 'Tanggal masuk'];
    const rows = filtered.map((item) => [item.name, item.email, item.phone, item.message, statusLabel[item.status], item.notes, new Date(item.created_at).toLocaleString('id-ID')]);
    const csv = `\uFEFF${[header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url);
  };

  return <div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-black tracking-tight sm:text-3xl">Leads kontak</h2><p className="mt-2 text-sm text-slate-500">Kelola dan tindak lanjuti pesan yang masuk dari formulir website.</p></div><button type="button" onClick={exportCsv} disabled={filtered.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"><Download className="h-4 w-4" />Export CSV</button></div>
    <section className="mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(220px,1fr),180px,160px,160px]"><label className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, email, WhatsApp…" className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-500" /></label><select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus | 'all')} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500">{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><label className="text-xs font-bold text-slate-500">Dari<input type="date" value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal" /></label><label className="text-xs font-bold text-slate-500">Sampai<input type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal" /></label></section>
    {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    <section className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Kontak</th><th className="px-5 py-4">Kebutuhan</th><th className="px-5 py-4">Tanggal</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={5} className="px-5 py-14 text-center text-slate-500"><LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />Memuat leads…</td></tr> : filtered.length === 0 ? <tr><td colSpan={5} className="px-5 py-14 text-center text-slate-500">Tidak ada lead yang sesuai filter.</td></tr> : filtered.map((item) => <tr key={item.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><button type="button" onClick={() => setSelected(item)} className="text-left"><span className="font-bold text-slate-900 hover:text-orange-600">{item.name}</span><span className="block text-xs text-slate-500">{item.email}</span><span className="block text-xs text-slate-400">{item.phone || 'Tanpa WhatsApp'}</span></button></td><td className="max-w-sm px-5 py-4"><p className="line-clamp-2 text-slate-600">{item.message}</p></td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{new Date(item.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle[item.status]}`}>{statusLabel[item.status]}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button type="button" onClick={() => setSelected(item)} className="rounded-lg p-2 text-slate-500 hover:bg-orange-50 hover:text-orange-600" aria-label="Buka detail"><ExternalLink className="h-4 w-4" /></button><button type="button" onClick={() => void remove(item)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Hapus lead"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></section>
    {selected && <LeadDetail lead={selected} onClose={() => setSelected(null)} onSaved={async () => { setSelected(null); await load(); }} onDelete={() => void remove(selected)} />}
  </div>;
}

function LeadDetail({ lead, onClose, onSaved, onDelete }: { lead: ContactLead; onClose: () => void; onSaved: () => Promise<void>; onDelete: () => void }) {
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const save = async () => { setSaving(true); try { await updateContactLead(lead.id, { status, notes: notes.trim() }); await onSaved(); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Perubahan tidak dapat disimpan.'); } finally { setSaving(false); } };
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/60 p-3 sm:p-6"><section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">Detail lead</p><h3 className="mt-1 text-2xl font-black">{lead.name}</h3><p className="mt-1 text-xs text-slate-400">Masuk {new Date(lead.created_at).toLocaleString('id-ID')}</p></div><button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Tutup"><X className="h-5 w-5" /></button></div><div className="mt-6 flex flex-wrap gap-2"><a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"><Mail className="h-4 w-4" />{lead.email}</a>{lead.phone && <a href={whatsappUrl(lead.phone)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600"><MessageCircle className="h-4 w-4" />WhatsApp</a>}</div><div className="mt-6 rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Kebutuhan</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{lead.message}</p></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Status<select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal">{statusOptions.slice(1).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label className="sm:col-span-2 text-sm font-bold text-slate-700">Catatan admin<textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={5000} rows={5} placeholder="Catatan follow-up, penawaran, atau informasi lain…" className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-orange-500" /></label></div>{error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}<div className="mt-7 flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" />Hapus</button><div className="flex gap-2"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-bold hover:bg-slate-100">Batal</button><button type="button" disabled={saving} onClick={() => void save()} className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50">{saving ? 'Menyimpan…' : 'Simpan perubahan'}</button></div></div></section></div>;
}
