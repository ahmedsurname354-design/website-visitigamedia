import { useEffect, useState } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { AdminAlert, AdminPageHeader } from '@/components/admin/AdminUi';
import { getContactSettings, saveContactSettings } from '@/lib/adminApi';
import { defaultContactSettings } from '@/lib/contactSettings';
import type { ContactSettings, ContactSettingsInput } from '@/types/admin';

const emptySettings = (): ContactSettings => ({ ...defaultContactSettings });

export default function ContactManagerPage() {
  const [settings, setSettings] = useState<ContactSettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void getContactSettings().then((saved) => { if (saved) setSettings({ ...defaultContactSettings, ...saved }); }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Pengaturan kontak tidak dapat dimuat.')).finally(() => setLoading(false));
  }, []);

  const submit = async (form: FormData) => {
    setSaving(true); setError(''); setMessage('');
    const input: ContactSettingsInput = {
      marketing_phone: String(form.get('marketing_phone') ?? ''),
      marketing_email: String(form.get('marketing_email') ?? ''),
      procurement_phone: String(form.get('procurement_phone') ?? ''),
      procurement_email: String(form.get('procurement_email') ?? ''),
    };
    try {
      const saved = await saveContactSettings(input);
      setSettings(saved);
      setMessage('Pengaturan kontak berhasil disimpan.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Pengaturan kontak tidak dapat disimpan.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="py-20 text-center text-sm text-slate-500"><LoaderCircle className="mr-2 inline h-5 w-5 animate-spin" />Memuat pengaturan kontak...</div>;
  return <div className="mx-auto max-w-5xl"><AdminPageHeader title="Kontak" description="Kelola nomor WhatsApp dan email Marketing serta Procurement yang tampil di seluruh website." />{error && <AdminAlert>{error}</AdminAlert>}{message && <p role="status" className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
    <form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }} className="space-y-7">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h3 className="mb-5 text-lg font-black text-slate-900">Kontak Marketing</h3><div className="grid gap-5 sm:grid-cols-2"><Field name="marketing_phone" label="Nomor WhatsApp" type="tel" initial={settings.marketing_phone} /><Field name="marketing_email" label="Email" type="email" initial={settings.marketing_email} /></div><p className="mt-4 text-xs text-slate-500">Subject email: Konsultasi Visitiga Media</p></section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h3 className="mb-5 text-lg font-black text-slate-900">Kontak Procurement</h3><div className="grid gap-5 sm:grid-cols-2"><Field name="procurement_phone" label="Nomor WhatsApp" type="tel" initial={settings.procurement_phone} /><Field name="procurement_email" label="Email" type="email" initial={settings.procurement_email} /></div><p className="mt-4 text-xs text-slate-500">Subject email: Kerjasama Procurement</p></section>
      <div className="sticky bottom-4 flex justify-end"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-orange-600 disabled:opacity-50">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? 'Menyimpan...' : 'Simpan perubahan'}</button></div>
    </form>
  </div>;
}

function Field({ name, label, type, initial }: { name: string; label: string; type: 'email' | 'tel'; initial: string }) {
  return <label className="text-sm font-medium text-slate-700">{label}<input required name={name} type={type} defaultValue={initial} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500" /></label>;
}
