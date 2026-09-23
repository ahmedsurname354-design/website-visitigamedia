import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Star } from 'lucide-react';
import { deletePortfolio, listPortfolios, savePortfolio, setPortfolioHeroSlides } from '@/lib/adminApi';
import { ContentModal, InputField } from '@/components/admin/ContentModal';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { AdminAlert, AdminPageHeader, AdminRowActions, AdminTableState } from '@/components/admin/AdminUi';
import { PORTFOLIO_SLUG_PATTERN, slugifyPortfolioTitle } from '@/lib/portfolioSlug';
import { isSlidePosition } from '@/lib/portfolioSlides';
import type { Portfolio, PortfolioInput } from '@/types/admin';

function TextArea({ label, name, initial = '', required = false }: { label: string; name: string; initial?: string; required?: boolean }) {
  return <label className="text-sm font-medium sm:col-span-2">{label}
    <textarea name={name} required={required} defaultValue={initial} rows={4} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" />
  </label>;
}

export default function PortfoliosPage() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSlides, setSavingSlides] = useState(false);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const slides = items.filter((item) => isSlidePosition(item.hero_position)).sort((a, b) => a.hero_position! - b.hero_position!);

  const load = async () => {
    setLoading(true);
    try { setItems(await listPortfolios()); setError(''); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Portofolio tidak dapat dimuat.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const openEditor = (item?: Portfolio) => {
    setEditing(item ?? null); setCreating(!item);
    setTitle(item?.title ?? ''); setSlug(item?.slug ?? ''); setSlugEdited(Boolean(item)); setModalError('');
  };
  const closeEditor = () => { setCreating(false); setEditing(null); setModalError(''); };

  const submit = async (form: FormData) => {
    try {
      const input: PortfolioInput = {
        title: title.trim(), slug: slug.trim(), image_url: String(form.get('image_url') ?? '').trim(),
        client: String(form.get('client') ?? '').trim(), category: String(form.get('category') ?? '').trim(),
        description: String(form.get('description') ?? '').trim(), overview: String(form.get('overview') ?? '').trim(),
        challenge: String(form.get('challenge') ?? '').trim(), solution: String(form.get('solution') ?? '').trim(),
        seo_title: String(form.get('seo_title') ?? '').trim(), seo_description: String(form.get('seo_description') ?? '').trim(),
        hero_image_url: String(form.get('hero_image_url') ?? '').trim(),
      };
      if (!input.image_url) throw new Error('Silakan unggah gambar proyek terlebih dahulu.');
      if (!PORTFOLIO_SLUG_PATTERN.test(input.slug) || input.slug.length > 100) throw new Error('Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (maksimal 100 karakter).');
      if (items.some((item) => item.slug === input.slug && item.id !== editing?.id)) throw new Error('Slug sudah dipakai proyek lain.');
      await savePortfolio(input, editing?.id);
      closeEditor(); await load();
    } catch (reason) {
      const code = (reason as { code?: string } | null)?.code;
      setModalError(code === '23505' ? 'Slug sudah dipakai, termasuk oleh URL lama.' : reason instanceof Error ? reason.message : 'Proyek tidak dapat disimpan.');
    }
  };

  const saveSlides = async (ids: string[]) => {
    if (ids.length > 6 || savingSlides) return;
    setSavingSlides(true);
    try { await setPortfolioHeroSlides(ids); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Urutan slide tidak dapat disimpan.'); }
    finally { setSavingSlides(false); }
  };
  const toggleSlide = (item: Portfolio) => {
    const ids = slides.map((slide) => slide.id);
    if (isSlidePosition(item.hero_position)) void saveSlides(ids.filter((id) => id !== item.id));
    else if (ids.length < 6) void saveSlides([...ids, item.id]);
    else setError('Maksimal 6 proyek untuk slideshow. Lepas salah satu terlebih dahulu.');
  };
  const moveSlide = (index: number, direction: -1 | 1) => {
    const ids = slides.map((slide) => slide.id);
    const next = index + direction;
    if (next < 0 || next >= ids.length) return;
    [ids[index], ids[next]] = [ids[next], ids[index]];
    void saveSlides(ids);
  };
  const remove = async (id: string) => {
    if (!window.confirm('Hapus proyek ini dari website?')) return;
    try { await deletePortfolio(id); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Proyek tidak dapat dihapus.'); }
  };

  return <div className="mx-auto max-w-7xl">
    <AdminPageHeader title="Portofolio" description="Kelola proyek, URL detail, dan slideshow halaman Portofolio." onAction={() => openEditor()} />
    {error && <AdminAlert>{error}</AdminAlert>}
    <section className="mt-8 border-b border-slate-200 pb-6" aria-labelledby="hero-slides-title">
      <div className="flex items-center justify-between"><h2 id="hero-slides-title" className="text-lg font-semibold">Slide hero</h2><span className="text-sm text-slate-500">{slides.length}/6</span></div>
      {slides.length ? <ol className="mt-4 divide-y divide-slate-200 border-y border-slate-200">{slides.map((slide, index) => <li key={slide.id} className="flex min-h-14 items-center gap-3 py-2 text-sm">
        <span className="w-6 text-slate-500">{index + 1}.</span><img src={slide.hero_image_url || slide.image_url} alt="" className="h-10 w-16 rounded object-cover" /><span className="min-w-0 flex-1 truncate font-medium">{slide.title}</span>
        <button type="button" title="Naikkan slide" aria-label={`Naikkan ${slide.title}`} disabled={savingSlides || index === 0} onClick={() => moveSlide(index, -1)} className="admin-icon-button disabled:opacity-40"><ArrowUp className="size-4" /></button>
        <button type="button" title="Turunkan slide" aria-label={`Turunkan ${slide.title}`} disabled={savingSlides || index === slides.length - 1} onClick={() => moveSlide(index, 1)} className="admin-icon-button disabled:opacity-40"><ArrowDown className="size-4" /></button>
        <button type="button" title="Lepas dari slide" aria-label={`Lepas ${slide.title} dari slide`} disabled={savingSlides} onClick={() => toggleSlide(slide)} className="admin-icon-button text-amber-600 disabled:opacity-40"><Star className="size-4" fill="currentColor" /></button>
      </li>)}</ol> : <p className="mt-3 text-sm text-slate-500">Belum ada proyek di slideshow.</p>}
    </section>
    <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-6 py-4">Proyek</th><th className="px-6 py-4">Klien</th><th className="px-6 py-4">Slide</th><th className="px-6 py-4">Diperbarui</th><th className="px-6 py-4 text-right">Aksi</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{loading ? <AdminTableState colSpan={5} loading>Memuat portofolio...</AdminTableState> : items.length === 0 ? <AdminTableState colSpan={5}>Belum ada proyek.</AdminTableState> : items.map((item) => <tr key={item.id}>
          <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={item.image_url} alt="" className="size-11 rounded object-cover" /><div><p className="font-semibold">{item.title}</p><p className="max-w-64 truncate text-xs text-slate-500">/portfolio/{item.slug}/</p></div></div></td>
          <td className="px-6 py-4">{item.client}</td><td className="px-6 py-4"><button type="button" disabled={savingSlides} title={!isSlidePosition(item.hero_position) ? 'Masukkan ke slide' : 'Lepas dari slide'} aria-label={!isSlidePosition(item.hero_position) ? `Masukkan ${item.title} ke slide` : `Lepas ${item.title} dari slide`} aria-pressed={isSlidePosition(item.hero_position)} onClick={() => toggleSlide(item)} className="admin-icon-button disabled:opacity-40"><Star className="size-4" fill={!isSlidePosition(item.hero_position) ? 'none' : 'currentColor'} /></button></td>
          <td className="px-6 py-4 text-slate-500">{new Date(item.updated_at).toLocaleDateString('id-ID')}</td><AdminRowActions onEdit={() => openEditor(item)} onDelete={() => void remove(item.id)} />
        </tr>)}</tbody></table>
    </div>
    {(creating || editing) && <ContentModal title={editing ? 'Edit proyek' : 'Tambah proyek'} onClose={closeEditor} onSubmit={submit}>
      {modalError && <div className="sm:col-span-2"><AdminAlert>{modalError}</AdminAlert></div>}
      <label className="text-sm font-medium">Judul proyek<input required value={title} onChange={(event) => { setTitle(event.target.value); if (!slugEdited) setSlug(slugifyPortfolioTitle(event.target.value)); }} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" /></label>
      <label className="text-sm font-medium">Slug URL<input required value={slug} maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" /><span className="mt-1 block text-xs text-slate-500">/portfolio/{slug || 'nama-proyek'}/</span></label>
      <InputField label="Klien" name="client" initial={editing?.client} /><InputField label="Kategori" name="category" initial={editing?.category} />
      <ImageUploadField label="Gambar proyek" name="image_url" initial={editing?.image_url} folder="portfolios" />
      <ImageUploadField label="Gambar banner (opsional)" name="hero_image_url" initial={editing?.hero_image_url} folder="portfolios" clearable />
      <TextArea label="Deskripsi singkat" name="description" initial={editing?.description} required />
      <TextArea label="Ringkasan" name="overview" initial={editing?.overview} /><TextArea label="Tantangan" name="challenge" initial={editing?.challenge} /><TextArea label="Solusi" name="solution" initial={editing?.solution} />
      <details className="sm:col-span-2"><summary className="cursor-pointer font-semibold">SEO (opsional)</summary><div className="mt-4 grid gap-5"><InputField label="Meta title" name="seo_title" initial={editing?.seo_title} required={false} /><TextArea label="Meta description" name="seo_description" initial={editing?.seo_description} /></div></details>
    </ContentModal>}
  </div>;
}
