import { useEffect, useState, type ComponentProps } from 'react';
import { Edit3, LoaderCircle, Trash2 } from 'lucide-react';
import { deleteProduct, listProducts, saveProduct } from '@/lib/adminApi';
import { ContentModal, InputField } from '@/components/admin/ContentModal';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { CatalogueUploadCard } from '@/components/admin/CatalogueUploadCard';
import { Alert, Header as BaseHeader } from '@/pages/admin/PortfoliosPage';
import type { Product } from '@/types/admin';

const defaults = { color: '#2a1a12', accent: '#fb923c' };

function Header(props: ComponentProps<typeof BaseHeader>) {
  return <><BaseHeader {...props} /><CatalogueUploadCard /></>;
}

export default function ProductsManagerPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const load = async () => { setLoading(true); try { setItems(await listProducts()); setError(''); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Katalog produk tidak dapat dimuat.'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const submit = async (form: FormData) => {
    try {
      const imageUrl = String(form.get('image_url')).trim();
      if (!imageUrl) throw new Error('Silakan unggah gambar produk terlebih dahulu.');
      await saveProduct({
        name: String(form.get('name')).trim(), category: String(form.get('category')).trim(), label: String(form.get('label')).trim(), image_url: imageUrl, description: String(form.get('description')).trim(),
        color: String(form.get('color')).trim() || defaults.color, accent: String(form.get('accent')).trim() || defaults.accent,
        sort_order: Number(form.get('sort_order')) || 0,
      }, editing?.id);
      setCreating(false); setEditing(null); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Produk tidak dapat disimpan.'); }
  };
  const remove = async (id: string) => { if (!window.confirm('Hapus produk ini dari katalog website?')) return; try { await deleteProduct(id); await load(); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Produk tidak dapat dihapus.'); } };
  return <div className="mx-auto max-w-7xl"><Header title="Katalog produk" description="Kelola card produk yang tampil pada halaman Product website." onAdd={() => setCreating(true)} />{error && <Alert text={error} />}<div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{loading ? <div className="col-span-full rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500"><LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />Memuat katalog…</div> : items.length === 0 ? <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-sm text-slate-500">Belum ada produk. Tambahkan card pertama untuk memulai.</div> : items.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="relative h-44" style={{ backgroundColor: item.color }}><img src={item.image_url} alt="" className="h-full w-full object-contain p-5" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-700">#{item.sort_order}</span></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">{item.label}</p><h3 className="mt-1 font-black text-slate-900">{item.name}</h3></div><div className="flex gap-1"><span aria-label="Warna latar" title="Warna latar" className="h-5 w-5 rounded-full border border-slate-200" style={{ backgroundColor: item.color }} /><span aria-label="Warna aksen" title="Warna aksen" className="h-5 w-5 rounded-full border border-slate-200" style={{ backgroundColor: item.accent }} /></div></div><p className="mt-2 text-sm text-slate-500">{item.category}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{item.description}</p><div className="mt-4 flex justify-end gap-2"><button onClick={() => setEditing(item)} className="rounded-lg p-2 text-slate-500 hover:bg-orange-50 hover:text-orange-600" aria-label="Edit"><Edit3 className="h-4 w-4" /></button><button onClick={() => void remove(item.id)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Hapus"><Trash2 className="h-4 w-4" /></button></div></div></article>)}</div>{(creating || editing) && <ContentModal title={editing ? 'Edit card produk' : 'Tambah card produk'} onClose={() => { setCreating(false); setEditing(null); }} onSubmit={submit}><InputField label="Nama produk" name="name" initial={editing?.name} /><InputField label="Kategori" name="category" initial={editing?.category} /><InputField label="Label card" name="label" initial={editing?.label} /><InputField label="Urutan tampil" name="sort_order" type="number" initial={String(editing?.sort_order ?? items.length + 1)} /><ImageUploadField label="Gambar produk" name="image_url" initial={editing?.image_url} folder="products" /><InputField label="Warna latar" name="color" initial={editing?.color ?? defaults.color} /><InputField label="Warna aksen" name="accent" initial={editing?.accent ?? defaults.accent} /><label className="sm:col-span-2 text-sm font-medium">Deskripsi<textarea name="description" required defaultValue={editing?.description ?? ''} rows={5} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" /></label></ContentModal>}</div>;
}
