import { useEffect, useState } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { AdminAlert } from '@/components/admin/AdminUi';
import { getCareersPageContent, saveCareersPageContent } from '@/lib/adminApi';
import { defaultCareersPageContent, normalizeCareersPageContent } from '@/lib/careersPageContent';
import type { CareersPageContentInput, CareersPageLocaleContent } from '@/types/admin';

type Locale = 'id' | 'en';
type FieldKey = keyof CareersPageLocaleContent;

const fields: Array<{ key: FieldKey; label: string; textarea?: boolean }> = [
  { key: 'eyebrow', label: 'Eyebrow' },
  { key: 'title', label: 'Judul hero' },
  { key: 'intro', label: 'Deskripsi pembuka', textarea: true },
  { key: 'partner_title', label: 'Judul kemitraan' },
  { key: 'partner_text', label: 'Deskripsi kemitraan', textarea: true },
  { key: 'partner_button', label: 'Tombol kemitraan' },
  { key: 'jobs_eyebrow', label: 'Eyebrow lowongan' },
  { key: 'jobs_title', label: 'Judul lowongan' },
  { key: 'jobs_empty', label: 'Teks saat belum ada lowongan', textarea: true },
  { key: 'open_positions_suffix', label: 'Label jumlah lowongan' },
  { key: 'apply_button', label: 'Tombol melamar' },
  { key: 'apply_by', label: 'Label deadline' },
  { key: 'form_eyebrow', label: 'Eyebrow form' },
  { key: 'form_title', label: 'Judul form' },
  { key: 'name_label', label: 'Label nama' },
  { key: 'email_label', label: 'Label email' },
  { key: 'phone_label', label: 'Label nomor telepon' },
  { key: 'type_label', label: 'Label tipe pengajuan' },
  { key: 'partnership_option', label: 'Pilihan partnership' },
  { key: 'application_option', label: 'Pilihan lamaran kerja' },
  { key: 'job_label', label: 'Label lowongan' },
  { key: 'job_placeholder', label: 'Placeholder lowongan' },
  { key: 'message_label', label: 'Label pesan' },
  { key: 'message_placeholder', label: 'Placeholder pesan', textarea: true },
  { key: 'submit_button', label: 'Tombol kirim' },
  { key: 'success_message', label: 'Pesan sukses', textarea: true },
  { key: 'error_message', label: 'Pesan error', textarea: true },
  { key: 'privacy_text', label: 'Teks persetujuan privasi', textarea: true },
  { key: 'cv_note', label: 'Catatan CV/portfolio', textarea: true },
];

const required: FieldKey[] = ['title', 'intro', 'form_title', 'submit_button'];

export default function CareersPageContentEditor() {
  const [value, setValue] = useState<CareersPageContentInput>(defaultCareersPageContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void getCareersPageContent().then((content) => {
      if (content) setValue(normalizeCareersPageContent(content));
    }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Konten Careers gagal dimuat.')).finally(() => setLoading(false));
  }, []);

  const update = (locale: Locale, key: FieldKey, next: string) => {
    setValue((current) => ({ ...current, [`content_${locale}`]: { ...current[`content_${locale}`], [key]: next } }));
  };

  const save = async () => {
    setMessage(''); setError('');
    for (const locale of ['id', 'en'] as Locale[]) {
      for (const key of required) {
        if (!value[`content_${locale}`][key].trim()) {
          setError(`${locale === 'id' ? 'Bahasa Indonesia' : 'English'}: ${key} wajib diisi.`);
          return;
        }
      }
    }
    try {
      setSaving(true);
      const saved = await saveCareersPageContent(value);
      setValue(normalizeCareersPageContent(saved));
      setMessage('Konten Careers berhasil disimpan.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Konten Careers gagal disimpan.');
    } finally { setSaving(false); }
  };

  const panel = (locale: Locale) => {
    const content = value[`content_${locale}`];
    return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-lg font-black">{locale === 'id' ? 'Bahasa Indonesia' : 'English'}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => <label key={field.key} className="text-sm font-semibold sm:last:col-span-2">
          {field.label}{required.includes(field.key) && <span className="text-orange-600"> *</span>}
          {field.textarea ? <textarea rows={3} value={content[field.key]} onChange={(event) => update(locale, field.key, event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal" /> : <input value={content[field.key]} onChange={(event) => update(locale, field.key, event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal" />}
        </label>)}
      </div>
    </div>;
  };

  if (loading) return <div className="mt-8 flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" />Memuat konten Careers...</div>;
  return <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-orange-600">Konten publik</p><h2 className="mt-2 text-2xl font-black">Konten halaman Careers</h2><p className="mt-1 text-sm text-slate-500">Edit seluruh teks halaman dalam Bahasa Indonesia dan English.</p></div><label className="text-sm font-semibold">Email Careers<input type="email" value={value.careers_email} onChange={(event) => setValue({ ...value, careers_email: event.target.value })} className="mt-1 w-full min-w-64 rounded-xl border border-slate-300 px-3 py-2 font-normal" /></label></div>
    {error && <AdminAlert>{error}</AdminAlert>}{message && <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p>}
    <div className="mt-6 grid gap-5 xl:grid-cols-2">{panel('id')}{panel('en')}</div>
    <div className="mt-6 flex justify-end"><button type="button" disabled={saving} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Menyimpan...' : 'Simpan konten'}</button></div>
  </section>;
}
