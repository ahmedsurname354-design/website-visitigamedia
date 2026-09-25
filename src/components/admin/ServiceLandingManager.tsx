import { useEffect, useState } from 'react';
import { ExternalLink, LoaderCircle, Save } from 'lucide-react';
import { getServiceLanding, listPortfolios, saveServiceLanding } from '@/lib/adminApi';
import { defaultServiceLandings, serviceLandingSlugs } from '@/lib/serviceLanding';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import type { Portfolio, ServiceLandingContent, ServiceLandingLocaleContent, ServiceLandingSlug } from '@/types/admin';

const labels: Record<ServiceLandingSlug, string> = {
  'led-indoor': 'LED Indoor', 'videotron-outdoor': 'Videotron Outdoor', 'rental-led': 'Rental LED', 'media-konvensional': 'Media Konvensional',
};

function value(form: FormData, name: string) { return String(form.get(name) ?? '').trim(); }
function lines(form: FormData, name: string) { return value(form, name).split('\n').map((item) => item.trim()).filter(Boolean); }

function localeFromForm(form: FormData, locale: 'id' | 'en'): ServiceLandingLocaleContent {
  const field = (name: string) => value(form, `${locale}_${name}`);
  return {
    eyebrow: field('eyebrow'), title: field('title'), description: field('description'),
    intro_eyebrow: field('intro_eyebrow'), intro_title: field('intro_title'), intro: field('intro'),
    considerations_title: field('considerations_title'), considerations: lines(form, `${locale}_considerations`),
    process_eyebrow: field('process_eyebrow'), process_title: field('process_title'), process: lines(form, `${locale}_process`),
    portfolio_eyebrow: field('portfolio_eyebrow'), portfolio_title: field('portfolio_title'), portfolio_link_text: field('portfolio_link_text'),
    cta_title: field('cta_title'), cta_description: field('cta_description'), cta_button_text: field('cta_button_text'), back_text: field('back_text'),
  };
}

export function ServiceLandingManager() {
  const [slug, setSlug] = useState<ServiceLandingSlug>('led-indoor');
  const [landing, setLanding] = useState<ServiceLandingContent>(defaultServiceLandings['led-indoor']);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true); setError(''); setMessage('');
    void Promise.all([getServiceLanding(slug), listPortfolios()]).then(([record, projects]) => {
      if (!active) return;
      setLanding(record ?? defaultServiceLandings[slug]); setPortfolios(projects);
    }).catch((reason) => { if (active) { setLanding(defaultServiceLandings[slug]); setError(reason instanceof Error ? reason.message : 'Detail layanan tidak dapat dimuat.'); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  const submit = async (form: FormData) => {
    setSaving(true); setError(''); setMessage('');
    try {
      const related = ['portfolio_1', 'portfolio_2', 'portfolio_3'].map((name) => value(form, name)).filter(Boolean);
      const contentId = localeFromForm(form, 'id');
      const contentEn = localeFromForm(form, 'en');
      if (!contentId.considerations.length || !contentId.process.length || !contentEn.considerations.length || !contentEn.process.length) throw new Error('Daftar pertimbangan dan tahapan harus berisi minimal satu item pada setiap bahasa.');
      const saved = await saveServiceLanding({
        slug, hero_image_url: value(form, 'hero_image_url'), content_id: contentId, content_en: contentEn,
        seo_title_id: value(form, 'seo_title_id'), seo_description_id: value(form, 'seo_description_id'),
        seo_title_en: value(form, 'seo_title_en'), seo_description_en: value(form, 'seo_description_en'), related_portfolio_ids: related,
      });
      setLanding(saved); setMessage(`Halaman ${labels[slug]} berhasil disimpan.`);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Detail layanan tidak dapat disimpan.'); }
    finally { setSaving(false); }
  };

  return <section className="mt-12 border-t border-slate-200 pt-10">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-orange-600">Halaman detail</p><h2 className="mt-2 text-2xl font-black text-slate-900">Detail layanan dan SEO</h2><p className="mt-2 text-sm text-slate-500">Kelola konten dua bahasa dan maksimal tiga portofolio terkait.</p></div><a href={`/services/${slug}/`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Pratinjau <ExternalLink className="h-4 w-4" /></a></div>
    <div className="mb-7 flex flex-wrap gap-2" role="tablist" aria-label="Pilih halaman layanan">{serviceLandingSlugs.map((item) => <button key={item} type="button" role="tab" aria-selected={slug === item} onClick={() => setSlug(item)} className={`rounded-full px-4 py-2 text-sm font-semibold ${slug === item ? 'bg-orange-500 text-white' : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'}`}>{labels[item]}</button>)}</div>
    {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
    {loading ? <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500"><LoaderCircle className="mr-2 inline h-5 w-5 animate-spin" />Memuat detail layanan...</div> :
      <form key={`${slug}-${landing.updated_at}`} onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }} className="space-y-7">
        <Panel title="Gambar hero"><ImageUploadField name="hero_image_url" label="Gambar hero (opsional)" initial={landing.hero_image_url} folder="services" allowClear /><p className="text-xs text-slate-500 sm:col-span-2">Jika kosong, gambar portofolio terkait urutan pertama akan digunakan.</p></Panel>
        <LocalePanel locale="id" title="Konten Bahasa Indonesia" content={landing.content_id} />
        <LocalePanel locale="en" title="English content" content={landing.content_en} />
        <Panel title="Portofolio terkait (maksimal 3)"><PortfolioSelects projects={portfolios} selected={landing.related_portfolio_ids} /></Panel>
        <Panel title="SEO"><Field name="seo_title_id" label="Meta title — Indonesia" initial={landing.seo_title_id} /><Area name="seo_description_id" label="Meta description — Indonesia" initial={landing.seo_description_id} /><Field name="seo_title_en" label="Meta title — English" initial={landing.seo_title_en} /><Area name="seo_description_en" label="Meta description — English" initial={landing.seo_description_en} /></Panel>
        <div className="sticky bottom-4 flex justify-end"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-orange-600 disabled:opacity-50">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? 'Menyimpan...' : 'Simpan halaman detail'}</button></div>
      </form>}
  </section>;
}

function LocalePanel({ locale, title, content }: { locale: 'id' | 'en'; title: string; content: ServiceLandingLocaleContent }) {
  const n = (field: string) => `${locale}_${field}`;
  return <Panel title={title}>
    <Field name={n('back_text')} label="Teks kembali" initial={content.back_text} /><Field name={n('eyebrow')} label="Label hero" initial={content.eyebrow} />
    <Field name={n('title')} label="Judul hero" initial={content.title} /><Area name={n('description')} label="Deskripsi hero" initial={content.description} />
    <Field name={n('intro_eyebrow')} label="Label bagian pengantar" initial={content.intro_eyebrow} /><Field name={n('intro_title')} label="Judul pengantar" initial={content.intro_title} />
    <Area name={n('intro')} label="Isi pengantar" initial={content.intro} /><Field name={n('considerations_title')} label="Judul pertimbangan" initial={content.considerations_title} />
    <Area name={n('considerations')} label="Daftar pertimbangan (satu per baris)" initial={content.considerations.join('\n')} />
    <Field name={n('process_eyebrow')} label="Label alur kerja" initial={content.process_eyebrow} /><Field name={n('process_title')} label="Judul alur kerja" initial={content.process_title} />
    <Area name={n('process')} label="Tahapan (satu per baris)" initial={content.process.join('\n')} />
    <Field name={n('portfolio_eyebrow')} label="Label portofolio" initial={content.portfolio_eyebrow} /><Field name={n('portfolio_title')} label="Judul portofolio" initial={content.portfolio_title} />
    <Field name={n('portfolio_link_text')} label="Teks semua proyek" initial={content.portfolio_link_text} /><Field name={n('cta_title')} label="Judul CTA" initial={content.cta_title} />
    <Area name={n('cta_description')} label="Deskripsi CTA" initial={content.cta_description} /><Field name={n('cta_button_text')} label="Teks tombol CTA" initial={content.cta_button_text} />
  </Panel>;
}

function PortfolioSelects({ projects, selected }: { projects: Portfolio[]; selected: string[] }) {
  const [values, setValues] = useState([selected[0] ?? '', selected[1] ?? '', selected[2] ?? '']);
  return <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">{values.map((current, index) => <label key={index} className="text-sm font-medium text-slate-700">Urutan {index + 1}<select name={`portfolio_${index + 1}`} value={current} onChange={(event) => setValues((items) => items.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-orange-500"><option value="">Tidak dipilih</option>{projects.map((project) => <option key={project.id} value={project.id} disabled={values.some((value, valueIndex) => valueIndex !== index && value === project.id)}>{project.title}</option>)}</select></label>)}</div>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6"><h3 className="text-lg font-black text-slate-900 sm:col-span-2">{title}</h3>{children}</section>; }
function Field({ name, label, initial }: { name: string; label: string; initial: string }) { return <label className="text-sm font-medium text-slate-700">{label}<input name={name} required defaultValue={initial} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500" /></label>; }
function Area({ name, label, initial }: { name: string; label: string; initial: string }) { return <label className="text-sm font-medium text-slate-700">{label}<textarea name={name} required defaultValue={initial} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500" /></label>; }
