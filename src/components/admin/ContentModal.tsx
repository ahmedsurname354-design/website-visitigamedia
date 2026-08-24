import { useState, type FormEvent, type ReactNode } from 'react';
import { X } from 'lucide-react';

export function ContentModal({ title, children, onClose, onSubmit }: { title: string; children: ReactNode; onClose: () => void; onSubmit: (form: FormData) => Promise<void> }) {
  const [saving, setSaving] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaving(true); try { await onSubmit(new FormData(event.currentTarget)); } finally { setSaving(false); } };
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/60 p-4"><form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-xl font-black">{title}</h3><button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Tutup"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{children}</div><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-slate-100">Batal</button><button disabled={saving} className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50">{saving ? 'Menyimpan…' : 'Simpan'}</button></div></form></div>;
}

export function InputField({ label, name, initial = '', type = 'text', required = true, className = '' }: { label: string; name: string; initial?: string; type?: string; required?: boolean; className?: string }) { return <label className={`text-sm font-medium ${className}`}>{label}<input name={name} type={type} required={required} defaultValue={initial} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>; }
