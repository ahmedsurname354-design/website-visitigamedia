import { useEffect, useState } from 'react';
import { deletePortfolio, listPortfolios, savePortfolio } from '@/lib/adminApi';
import { ContentModal, InputField } from '@/components/admin/ContentModal';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { AdminAlert, AdminPageHeader, AdminRowActions, AdminTableState } from '@/components/admin/AdminUi';
import { PORTFOLIO_SLUG_PATTERN, slugifyPortfolioTitle } from '@/lib/portfolioSlug';
import type { Portfolio, PortfolioInput } from '@/types/admin';

function TextArea({ label, name, initial = '', required = false }: { label: string; name: string; initial?: string; required?: boolean }) {
  return <label className="text-sm font-medium sm:col-span-2">{label}
    <textarea name={name} required={required} defaultValue={initial} rows={4} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" />
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

  const remove = async (id: string) => {
    if (!window.confirm('Hapus proyek ini dari website?')) return;
    try { await deletePortfolio(id); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Proyek tidak dapat dihapus.'); }
  };

  return <div className="mx-auto max-w-7xl">
    <AdminPageHeader title="Portofolio" description="Kelola proyek, URL detail, dan metadata SEO halaman Portofolio." onAction={() => openEditor()} />
    {error && <AdminAlert>{error}</AdminAlert>}
    <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-6 py-4">Proyek</th><th className="px-6 py-4">Klien</th><th className="px-6 py-4">Diperbarui</th><th className="px-6 py-4 text-right">Aksi</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{loading ? <AdminTableState colSpan={4} loading>Memuat portofolio...</AdminTableState> : items.length === 0 ? <AdminTableState colSpan={4}>Belum ada proyek.</AdminTableState> : items.map((item) => <tr key={item.id}>
          <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={item.image_url} alt="" className="size-11 rounded object-cover" /><div><p className="font-semibold">{item.title}</p><p className="max-w-64 truncate text-xs text-slate-500">/portfolio/{item.slug}/</p></div></div></td>
          <td className="px-6 py-4">{item.client}</td><td className="px-6 py-4 text-slate-500">{new Date(item.updated_at).toLocaleDateString('id-ID')}</td><AdminRowActions onEdit={() => openEditor(item)} onDelete={() => void remove(item.id)} />
        </tr>)}</tbody></table>
    </div>
    {(creating || editing) && <ContentModal title={editing ? 'Edit proyek' : 'Tambah proyek'} onClose={closeEditor} onSubmit={submit}>
      {modalError && <div className="sm:col-span-2"><AdminAlert>{modalError}</AdminAlert></div>}
      <label className="text-sm font-medium">Judul proyek<input required value={title} onChange={(event) => { setTitle(event.target.value); if (!slugEdited) setSlug(slugifyPortfolioTitle(event.target.value)); }} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" /></label>
      <label className="text-sm font-medium">Slug URL<input required value={slug} maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2" /><span className="mt-1 block text-xs text-slate-500">/portfolio/{slug || 'nama-proyek'}/</span></label>
      <InputField label="Klien" name="client" initial={editing?.client} /><InputField label="Kategori" name="category" initial={editing?.category} />
      <ImageUploadField label="Gambar proyek" name="image_url" initial={editing?.image_url} folder="portfolios" />
      <TextArea label="Deskripsi singkat" name="description" initial={editing?.description} required />
      <TextArea label="Ringkasan" name="overview" initial={editing?.overview} /><TextArea label="Tantangan" name="challenge" initial={editing?.challenge} /><TextArea label="Solusi" name="solution" initial={editing?.solution} />
      <details className="sm:col-span-2"><summary className="cursor-pointer font-semibold">SEO (opsional)</summary><div className="mt-4 grid gap-5"><InputField label="Meta title" name="seo_title" initial={editing?.seo_title} required={false} /><TextArea label="Meta description" name="seo_description" initial={editing?.seo_description} /></div></details>
    </ContentModal>}
  </div>;
}
