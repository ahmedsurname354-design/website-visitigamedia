import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { deletePortfolio, listPortfolios, savePortfolio } from '@/lib/adminApi';
import { ContentModal, InputField } from '@/components/admin/ContentModal';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { AdminAlert, AdminPageHeader, AdminRowActions, AdminTableState } from '@/components/admin/AdminUi';
import { missingFeaturedFields, PORTFOLIO_SLUG_PATTERN, slugifyPortfolioTitle } from '@/lib/portfolio';
import type { Portfolio, PortfolioInput } from '@/types/admin';

const MAX_FEATURED = 6;

function rowInput(item: Portfolio): PortfolioInput {
  const { title, slug, image_url, client, category, description, overview, challenge, solution,
    is_featured, location, audience, specs, work_process, title_en, description_en, audience_en,
    overview_en, challenge_en, process_en, solution_en, specs_en } = item;
  return { title, slug, image_url, client, category, description, overview, challenge, solution,
    is_featured, location, audience, specs, work_process, title_en, description_en, audience_en,
    overview_en, challenge_en, process_en, solution_en, specs_en };
}

function TextArea({ label, name, initial = '', required = false, rows = 3 }: {
  label: string; name: string; initial?: string; required?: boolean; rows?: number;
}) {
  return <label className="text-sm font-medium sm:col-span-2">{label}
    <textarea name={name} required={required} defaultValue={initial} rows={rows} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" />
  </label>;
}

export default function PortfoliosPage() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [featured, setFeatured] = useState(false);
  const featuredCount = items.filter((item) => item.is_featured).length;

  const load = async () => {
    setLoading(true);
    try { setItems(await listPortfolios()); setError(''); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Portofolio tidak dapat dimuat.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const openEditor = (item?: Portfolio) => {
    setEditing(item ?? null);
    setCreating(!item);
    setTitle(item?.title ?? '');
    setSlug(item?.slug ?? '');
    setSlugEdited(Boolean(item));
    setFeatured(item?.is_featured ?? false);
    setModalError('');
  };
  const closeEditor = () => { setCreating(false); setEditing(null); setModalError(''); };

  const submit = async (form: FormData) => {
    try {
      const imageUrl = String(form.get('image_url') ?? '').trim();
      if (!imageUrl) throw new Error('Silakan unggah gambar proyek terlebih dahulu.');
      const input: PortfolioInput = {
        title: title.trim(), slug: slug.trim(), image_url: imageUrl,
        client: String(form.get('client') ?? '').trim(), category: String(form.get('category') ?? '').trim(),
        description: String(form.get('description') ?? '').trim(),
        overview: String(form.get('overview') ?? '').trim(), challenge: String(form.get('challenge') ?? '').trim(),
        solution: String(form.get('solution') ?? '').trim(), is_featured: featured,
        location: String(form.get('location') ?? '').trim(), audience: String(form.get('audience') ?? '').trim(),
        specs: String(form.get('specs') ?? '').split(/\r?\n/).map((value) => value.trim()).filter(Boolean),
        work_process: String(form.get('work_process') ?? '').trim(),
        title_en: String(form.get('title_en') ?? '').trim(), description_en: String(form.get('description_en') ?? '').trim(),
        audience_en: String(form.get('audience_en') ?? '').trim(), overview_en: String(form.get('overview_en') ?? '').trim(),
        challenge_en: String(form.get('challenge_en') ?? '').trim(), process_en: String(form.get('process_en') ?? '').trim(),
        solution_en: String(form.get('solution_en') ?? '').trim(),
        specs_en: String(form.get('specs_en') ?? '').split(/\r?\n/).map((value) => value.trim()).filter(Boolean),
      };
      if (!PORTFOLIO_SLUG_PATTERN.test(input.slug) || input.slug.length > 100) throw new Error('Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (maksimal 100 karakter).');
      if (items.some((item) => item.slug === input.slug && item.id !== editing?.id)) throw new Error('Slug sudah dipakai proyek lain.');
      if (featured && !editing?.is_featured && featuredCount >= MAX_FEATURED) throw new Error('Maksimal 6 proyek unggulan. Lepas salah satu terlebih dahulu.');
      if (featured) {
        const missing = missingFeaturedFields(input);
        if (missing.length) throw new Error(`Lengkapi detail unggulan: ${missing.join(', ')}.`);
      }
      await savePortfolio(input, editing?.id);
      closeEditor();
      await load();
    } catch (reason) {
      const code = (reason as { code?: string } | null)?.code;
      const message = reason instanceof Error ? reason.message : 'Proyek tidak dapat disimpan.';
      setModalError(code === '23505' ? 'Slug sudah dipakai, termasuk oleh URL lama.' : message);
    }
  };

  const toggleFeatured = async (item: Portfolio) => {
    if (!item.is_featured) {
      if (featuredCount >= MAX_FEATURED) { setError('Maksimal 6 proyek unggulan. Lepas salah satu terlebih dahulu.'); return; }
      if (missingFeaturedFields(rowInput(item)).length) { openEditor(item); setFeatured(true); return; }
    }
    try { await savePortfolio({ ...rowInput(item), is_featured: !item.is_featured }, item.id); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Status unggulan tidak dapat diubah.'); }
  };
  const remove = async (id: string) => {
    if (!window.confirm('Hapus proyek ini dari website?')) return;
    try { await deletePortfolio(id); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Proyek tidak dapat dihapus.'); }
  };

  return <div className="mx-auto max-w-7xl">
    <AdminPageHeader title="Portofolio" description={`Kelola proyek dan studi kasus unggulan (${featuredCount}/${MAX_FEATURED}).`} onAction={() => openEditor()} />
    {error && <AdminAlert>{error}</AdminAlert>}
    <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-6 py-4">Proyek</th><th className="px-6 py-4">Klien</th><th className="px-6 py-4">Unggulan</th><th className="px-6 py-4">Diperbarui</th><th className="px-6 py-4 text-right">Aksi</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{loading ? <AdminTableState colSpan={5} loading>Memuat portofolio…</AdminTableState> : items.length === 0 ? <AdminTableState colSpan={5}>Belum ada proyek.</AdminTableState> : items.map((item) => <tr key={item.id}>
          <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={item.image_url} alt="" className="size-11 rounded bg-slate-100 object-cover" /><div><p className="font-semibold text-slate-800">{item.title}</p><p className="max-w-64 truncate text-xs text-slate-500">{item.category} · /portfolio/{item.slug}/</p></div></div></td>
          <td className="px-6 py-4 text-slate-600">{item.client}</td>
          <td className="px-6 py-4"><button type="button" aria-label={item.is_featured ? `Lepas ${item.title} dari unggulan` : `Jadikan ${item.title} unggulan`} aria-pressed={item.is_featured} title={item.is_featured ? 'Lepas dari unggulan' : 'Jadikan unggulan'} onClick={() => void toggleFeatured(item)} className={`inline-flex size-9 items-center justify-center rounded border ${item.is_featured ? 'border-amber-400 bg-amber-50 text-amber-600' : 'border-slate-200 text-slate-400 hover:text-amber-600'}`}><Star className="size-4" fill={item.is_featured ? 'currentColor' : 'none'} /></button></td>
          <td className="px-6 py-4 text-slate-500">{new Date(item.updated_at).toLocaleDateString('id-ID')}</td>
          <AdminRowActions onEdit={() => openEditor(item)} onDelete={() => void remove(item.id)} />
        </tr>)}</tbody>
      </table>
    </div>
    {(creating || editing) && <ContentModal title={editing ? 'Edit proyek' : 'Tambah proyek'} onClose={closeEditor} onSubmit={submit}>
      {modalError && <div className="sm:col-span-2"><AdminAlert>{modalError}</AdminAlert></div>}
      <label className="text-sm font-medium">Judul proyek<input name="title" required value={title} onChange={(event) => { setTitle(event.target.value); if (!slugEdited) setSlug(slugifyPortfolioTitle(event.target.value)); }} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" /></label>
      <label className="text-sm font-medium">Slug URL<input name="slug" required value={slug} onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }} pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" /><span className="mt-1 block text-xs text-slate-500">/portfolio/{slug || 'nama-proyek'}/</span></label>
      <InputField label="Klien" name="client" initial={editing?.client} />
      <InputField label="Kategori" name="category" initial={editing?.category} />
      <ImageUploadField label="Gambar proyek" name="image_url" initial={editing?.image_url} folder="portfolios" />
      <label className="flex items-center gap-3 text-sm font-medium sm:col-span-2"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="size-4 accent-orange-600" />Jadikan proyek unggulan <span className="text-xs font-normal text-slate-500">({featuredCount}/{MAX_FEATURED})</span></label>
      <TextArea label="Ringkasan" name="description" initial={editing?.description} required={featured} />
      <InputField label="Lokasi" name="location" initial={editing?.location} required={featured} />
      <InputField label="Audiens / pengguna" name="audience" initial={editing?.audience} required={featured} />
      <TextArea label="Spesifikasi (satu per baris)" name="specs" initial={editing?.specs.join('\n')} required={featured} />
      <TextArea label="Konteks dan kebutuhan" name="overview" initial={editing?.overview} required={featured} rows={4} />
      <TextArea label="Pertimbangan teknis" name="challenge" initial={editing?.challenge} required={featured} rows={4} />
      <TextArea label="Proses pekerjaan" name="work_process" initial={editing?.work_process} required={featured} rows={4} />
      <TextArea label="Hasil yang terdokumentasi" name="solution" initial={editing?.solution} required={featured} rows={4} />
      <details className="sm:col-span-2"><summary className="cursor-pointer font-semibold">Terjemahan Inggris (opsional)</summary><div className="mt-5 grid gap-5 sm:grid-cols-2">
        <InputField label="Judul Inggris" name="title_en" initial={editing?.title_en} required={false} />
        <InputField label="Audiens Inggris" name="audience_en" initial={editing?.audience_en} required={false} />
        <TextArea label="Ringkasan Inggris" name="description_en" initial={editing?.description_en} />
        <TextArea label="Spesifikasi Inggris (satu per baris)" name="specs_en" initial={editing?.specs_en.join('\n')} />
        <TextArea label="Konteks Inggris" name="overview_en" initial={editing?.overview_en} />
        <TextArea label="Pertimbangan teknis Inggris" name="challenge_en" initial={editing?.challenge_en} />
        <TextArea label="Proses Inggris" name="process_en" initial={editing?.process_en} />
        <TextArea label="Hasil Inggris" name="solution_en" initial={editing?.solution_en} />
      </div></details>
    </ContentModal>}
  </div>;
}
