import { useEffect, useState } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { AdminAlert, AdminPageHeader } from '@/components/admin/AdminUi';
import { getAboutContent, saveAboutContent } from '@/lib/adminApi';
import { defaultAboutContent } from '@/lib/aboutContent';
import { translateContent } from '@/lib/translation';
import type { AboutContent, AboutContentInput, AboutLocaleContent } from '@/types/admin';

const emptyContent = (): AboutContent => ({ id: 1, ...defaultAboutContent, updated_at: '' });

export default function AboutManagerPage() {
  const [content, setContent] = useState<AboutContent>(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void getAboutContent().then((saved) => { if (saved) setContent(saved); }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Konten About tidak dapat dimuat.')).finally(() => setLoading(false));
  }, []);

  const submit = async (form: FormData) => {
    setSaving(true); setError(''); setMessage('');
    try {
      const englishContent = readLocale(form);
      const payload: AboutContentInput = { content_en: englishContent, content_id: await translateContent(englishContent) };
      const saved = await saveAboutContent(payload);
      setContent(saved); setMessage('Value Proposition berhasil disimpan dan diterjemahkan.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Konten About tidak dapat disimpan.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="py-20 text-center text-sm text-slate-500"><LoaderCircle className="mr-2 inline h-5 w-5 animate-spin" />Memuat konten About...</div>;
  return <div className="mx-auto max-w-5xl"><AdminPageHeader title="About" description="Kelola konten Value Proposition pada halaman About. English menjadi sumber terjemahan otomatis." />{error && <AdminAlert>{error}</AdminAlert>}{message && <p role="status" className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
    <form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }} className="space-y-7">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h3 className="mb-5 text-lg font-black text-slate-900">English</h3><div className="grid gap-5"><Field name="eyebrow" label="Label kecil" initial={content.content_en.eyebrow} /><Field name="title" label="Judul" initial={content.content_en.title} />{Array.from({ length: 4 }, (_, index) => <div key={index} className="rounded-xl border border-slate-200 p-4"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-orange-600">Value {index + 1}</p><div className="grid gap-4"><Field name={`item_${index}_title`} label="Nama value" initial={content.content_en.items[index]?.title ?? ''} /><Area name={`item_${index}_description`} label="Deskripsi" initial={content.content_en.items[index]?.description ?? ''} /></div></div>)}</div></section>
      <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><summary className="cursor-pointer text-lg font-black text-slate-900">Preview Bahasa Indonesia (otomatis)</summary><p className="mt-2 text-sm text-slate-500">Versi Indonesia dibuat otomatis saat menyimpan konten English.</p><pre className="mt-4 overflow-auto whitespace-pre-wrap rounded-xl bg-white p-4 text-xs leading-6 text-slate-700">{JSON.stringify(content.content_id, null, 2)}</pre></details>
      <div className="sticky bottom-4 flex justify-end"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-orange-600 disabled:opacity-50">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? 'Menyimpan...' : 'Simpan perubahan'}</button></div>
    </form>
  </div>;
}

function readLocale(form: FormData): AboutLocaleContent {
  const field = (name: string) => String(form.get(name) ?? '').trim();
  return { eyebrow: field('eyebrow'), title: field('title'), items: Array.from({ length: 4 }, (_, index) => ({ title: field(`item_${index}_title`), description: field(`item_${index}_description`) })) };
}

function Field({ name, label, initial }: { name: string; label: string; initial: string }) { return <label className="text-sm font-medium text-slate-700">{label}<input name={name} required={false} defaultValue={initial} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500" /></label>; }
function Area({ name, label, initial }: { name: string; label: string; initial: string }) { return <label className="text-sm font-medium text-slate-700">{label}<textarea name={name} required={false} defaultValue={initial} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500" /></label>; }
