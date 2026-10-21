import { useEffect, useState } from 'react';
import { LoaderCircle, Save } from 'lucide-react';
import { getHomepageContent, listPortfolios, saveHomepageContent } from '@/lib/adminApi';
import { translateContent } from '@/lib/translation';
import { defaultHomepageContent } from '@/lib/homepageContent';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { AdminAlert, AdminPageHeader } from '@/components/admin/AdminUi';
import type { HomepageContent, HomepageContentInput, HomepageLocaleContent, Portfolio } from '@/types/admin';

const emptyContent = (): HomepageContent => ({ id: 1, ...defaultHomepageContent, updated_at: '' });

export default function HomepageManagerPage() {
  const [content, setContent] = useState<HomepageContent>(emptyContent);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void Promise.all([getHomepageContent(), listPortfolios()]).then(([saved, items]) => {
      if (saved) { setContent(saved); setSelectedProjects(saved.featured_portfolio_ids); }
      setPortfolios(items);
    }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Konten beranda tidak dapat dimuat.')).finally(() => setLoading(false));
  }, []);

  const toggleProject = (id: string) => setSelectedProjects((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);

  const submit = async (form: FormData) => {
    setSaving(true); setError(''); setMessage('');
    try {
      setMessage('Menerjemahkan ke Bahasa Indonesia…');
      const englishContent = readLocale(form, 'en');
      const next: HomepageContentInput = {
        hero_image_url: String(form.get('hero_image_url') ?? '').trim(),
        about_image_url: String(form.get('about_image_url') ?? '').trim(),
        content_id: await translateContent(englishContent), content_en: englishContent, featured_portfolio_ids: selectedProjects,
      };
      const saved = await saveHomepageContent(next);
      setContent(saved); setMessage('Konten beranda berhasil disimpan.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Konten beranda tidak dapat disimpan.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="py-20 text-center text-sm text-slate-500"><LoaderCircle className="mr-2 inline h-5 w-5 animate-spin" />Memuat konten beranda...</div>;
  return <div className="mx-auto max-w-7xl"><AdminPageHeader title="Beranda" description="Kelola seluruh teks, media, statistik, layanan unggulan, proyek, dan CTA homepage." />{error && <AdminAlert>{error}</AdminAlert>}{message && <p role="status" className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
    <form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }} className="space-y-7">
      <Section title="Media beranda"><div className="grid gap-5 lg:grid-cols-2"><ImageUploadField name="hero_image_url" label="Gambar Hero" initial={content.hero_image_url} folder="homepage" /><ImageUploadField name="about_image_url" label="Gambar bagian Tentang" initial={content.about_image_url} folder="homepage" allowClear /></div></Section>
      <LocalePanel locale="en" content={content.content_en} />
      <TranslationPreview content={content.content_id} />
      <Section title="Proyek unggulan beranda"><p className="mb-4 text-sm text-slate-500">Pilih maksimal tiga proyek dari Portofolio. Urutan pilihan menjadi urutan tampil.</p><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{portfolios.map((item) => <label key={item.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${selectedProjects.includes(item.id) ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}><input type="checkbox" checked={selectedProjects.includes(item.id)} onChange={() => toggleProject(item.id)} /><img src={item.image_url} alt="" className="size-12 rounded object-cover" /><span className="min-w-0"><strong className="block truncate text-sm">{item.title}</strong><small className="block truncate text-xs text-slate-500">{item.category}</small></span></label>)}</div></Section>
      <div className="sticky bottom-4 flex justify-end"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-orange-600 disabled:opacity-50">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? 'Menyimpan...' : 'Simpan perubahan'}</button></div>
    </form>
  </div>;
}

function readLocale(form: FormData, locale: 'id' | 'en'): HomepageLocaleContent {
  const field = (name: string) => String(form.get(`${locale}_${name}`) ?? '').trim();
  const list = (name: string, count: number) => Array.from({ length: count }, (_, index) => field(`${name}_${index}`)).filter(Boolean);
  return {
    hero: { eyebrow: field('hero_eyebrow') || 'VISUAL TECHNOLOGY · INDONESIA', trustNotice: field('hero_trust'), titleLine1: field('hero_title_1'), titleLine2: field('hero_title_2'), titleLine3: field('hero_title_3'), subtitle: field('hero_subtitle'), viewServices: field('hero_services'), viewPortfolio: field('hero_portfolio') },
    stats: Array.from({ length: 4 }, (_, index) => ({ value: field(`stat_${index}_value`), label: field(`stat_${index}_label`) })).filter((item) => item.value || item.label),
    services: { sectionLabel: field('services_label'), heading: field('services_heading'), linkLabel: field('services_link'), cards: Array.from({ length: 4 }, (_, index) => ({ title: field(`service_${index}_title`), description: field(`service_${index}_description`), tags: list(`service_${index}_tag`, 4), action: field(`service_${index}_action`) })).filter((item) => item.title || item.description) },
    about: { sectionLabel: field('about_label'), heading: field('about_heading'), subtitle: field('about_subtitle'), features: list('about_feature', 4), buttonLabel: field('about_button'), clientProofLabel: field('about_clients') },
    cta: { title: field('cta_title'), subtitle: field('cta_subtitle'), callNow: field('cta_call'), emailUs: field('cta_email'), phoneInfo: field('cta_phone'), emailInfo: field('cta_email_address'), locationInfo: field('cta_location') },
  };
}

function LocalePanel({ locale, content }: { locale: 'id' | 'en'; content: HomepageLocaleContent }) {
  const label = locale === 'id' ? 'Bahasa Indonesia' : 'English';
  return <Section title={label}><div className="grid gap-6 lg:grid-cols-2"><Field name={`${locale}_hero_trust`} label="Hero — Trust notice" initial={content.hero.trustNotice} /><Field name={`${locale}_hero_title_1`} label="Hero — Judul baris 1" initial={content.hero.titleLine1} /><Field name={`${locale}_hero_title_2`} label="Hero — Teks aksen" initial={content.hero.titleLine2} /><Field name={`${locale}_hero_title_3`} label="Hero — Judul baris 3" initial={content.hero.titleLine3} /><Area name={`${locale}_hero_subtitle`} label="Hero — Deskripsi" initial={content.hero.subtitle} /><Field name={`${locale}_hero_services`} label="Hero — Tombol layanan" initial={content.hero.viewServices} /><Field name={`${locale}_hero_portfolio`} label="Hero — Tombol portofolio" initial={content.hero.viewPortfolio} />
    <div className="lg:col-span-2"><h4 className="mb-3 font-black">Statistik</h4><div className="grid gap-4 sm:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <div key={index} className="rounded-xl border border-slate-200 p-4"><p className="mb-3 text-xs font-bold uppercase text-orange-600">Statistik {index + 1}</p><Field name={`${locale}_stat_${index}_value`} label="Nilai" initial={content.stats[index]?.value ?? ''} /><Field name={`${locale}_stat_${index}_label`} label="Label" initial={content.stats[index]?.label ?? ''} /></div>)}</div></div>
    <div className="lg:col-span-2"><h4 className="mb-3 font-black">Layanan unggulan</h4><div className="grid gap-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="rounded-xl border border-slate-200 p-4"><p className="mb-3 text-xs font-bold uppercase text-orange-600">Kartu layanan {index + 1}</p><div className="grid gap-4 sm:grid-cols-2"><Field name={`${locale}_service_${index}_title`} label="Judul" initial={content.services.cards[index]?.title ?? ''} /><Field name={`${locale}_service_${index}_action`} label="Teks tautan" initial={content.services.cards[index]?.action ?? ''} /><Area name={`${locale}_service_${index}_description`} label="Deskripsi" initial={content.services.cards[index]?.description ?? ''} /><Field name={`${locale}_service_${index}_tag_0`} label="Tag 1" initial={content.services.cards[index]?.tags[0] ?? ''} /><Field name={`${locale}_service_${index}_tag_1`} label="Tag 2" initial={content.services.cards[index]?.tags[1] ?? ''} /><Field name={`${locale}_service_${index}_tag_2`} label="Tag 3" initial={content.services.cards[index]?.tags[2] ?? ''} /><Field name={`${locale}_service_${index}_tag_3`} label="Tag 4" initial={content.services.cards[index]?.tags[3] ?? ''} /></div></div>)}</div></div>
    <Field name={`${locale}_services_label`} label="Layanan — Label kecil" initial={content.services.sectionLabel} /><Field name={`${locale}_services_heading`} label="Layanan — Judul" initial={content.services.heading} /><Field name={`${locale}_services_link`} label="Layanan — Teks tautan" initial={content.services.linkLabel} />
    <Field name={`${locale}_about_label`} label="Tentang — Label kecil" initial={content.about.sectionLabel} /><Field name={`${locale}_about_heading`} label="Tentang — Judul" initial={content.about.heading} /><Area name={`${locale}_about_subtitle`} label="Tentang — Deskripsi" initial={content.about.subtitle} /><Field name={`${locale}_about_button`} label="Tentang — Teks tombol" initial={content.about.buttonLabel} /><Field name={`${locale}_about_clients`} label="Tentang — Teks logo klien" initial={content.about.clientProofLabel} />{Array.from({ length: 4 }, (_, index) => <Field key={index} name={`${locale}_about_feature_${index}`} label={`Tentang — Keunggulan ${index + 1}`} initial={content.about.features[index] ?? ''} />)}
    <div className="lg:col-span-2"><h4 className="mb-3 font-black">CTA</h4><div className="grid gap-4 sm:grid-cols-2"><Field name={`${locale}_cta_title`} label="Judul" initial={content.cta.title} /><Field name={`${locale}_cta_subtitle`} label="Deskripsi" initial={content.cta.subtitle} /><Field name={`${locale}_cta_call`} label="Teks tombol WhatsApp" initial={content.cta.callNow} /><Field name={`${locale}_cta_email`} label="Teks tombol email" initial={content.cta.emailUs} /><Field name={`${locale}_cta_phone`} label="Nomor WhatsApp" initial={content.cta.phoneInfo} /><Field name={`${locale}_cta_email_address`} label="Alamat email" initial={content.cta.emailInfo} /><Field name={`${locale}_cta_location`} label="Alamat kantor" initial={content.cta.locationInfo} /></div></div>
  </div></Section>;
}

function TranslationPreview({ content }: { content: HomepageLocaleContent }) {
  return <details className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><summary className="cursor-pointer text-lg font-black text-slate-900">Preview Bahasa Indonesia (otomatis)</summary><p className="mt-2 text-sm text-slate-500">Versi Indonesia dibuat otomatis saat menyimpan konten English.</p><pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-white p-4 text-xs leading-6 text-slate-700">{JSON.stringify(content, null, 2)}</pre></details>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h3 className="mb-5 text-lg font-black text-slate-900">{title}</h3>{children}</section>; }
function Field({ name, label, initial }: { name: string; label: string; initial: string }) { return <label className="text-sm font-medium text-slate-700">{label}<input name={name} required={false} defaultValue={initial} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500" /></label>; }
function Area({ name, label, initial }: { name: string; label: string; initial: string }) { return <label className="text-sm font-medium text-slate-700">{label}<textarea name={name} required={false} defaultValue={initial} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500" /></label>; }
