import NewsCommentsModal from '@/components/admin/NewsCommentsModal';
import { useEffect, useState } from 'react';
import { deleteNews, listNews } from '@/lib/adminApi';
import { NewsEditor } from '@/pages/admin/NewsEditor';
import { AdminAlert, AdminPageHeader, AdminRowActions, AdminTableState } from '@/components/admin/AdminUi';
import type { NewsRecord } from '@/types/admin';

export default function NewsManagerPage() {
  const [commentsArticle, setCommentsArticle] = useState<NewsRecord | null>(null);
  const [items, setItems] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<NewsRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const load = async () => {
    setLoading(true);
    try { setItems(await listNews()); setError(''); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Berita tidak dapat dimuat.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const remove = async (id: string) => {
    if (!window.confirm('Hapus berita ini dari website?')) return;
    try { await deleteNews(id); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Berita tidak dapat dihapus.'); }
  };

  return <div className="mx-auto max-w-7xl">
    <AdminPageHeader title="Berita" description="Tambah, edit, atau hapus artikel yang tampil di halaman Berita." onAction={() => setCreating(true)} />
    {error && <AdminAlert>{error}</AdminAlert>}
    <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4">Artikel</th><th className="px-6 py-4">Penulis</th><th className="px-6 py-4">Publikasi</th><th className="px-6 py-4">Komentar</th><th className="px-6 py-4 text-right">Aksi</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? <AdminTableState colSpan={5} loading>Memuat berita...</AdminTableState> : items.length === 0 ? <AdminTableState colSpan={5}>Belum ada berita.</AdminTableState> : items.map((item) => <tr key={item.id}>
            <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={item.cover_image} alt="" className="h-11 w-11 rounded-lg bg-slate-100 object-cover" /><div><p className="font-semibold text-slate-800">{item.title}</p><p className="max-w-64 truncate text-xs text-slate-500">/news/{item.slug}</p></div></div></td>
            <td className="px-6 py-4 text-slate-600">{item.author}</td>
            <td className="px-6 py-4 text-slate-500">{item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : 'Draft'}</td>
            <td className="px-6 py-4"><button type="button" onClick={() => setCommentsArticle(item)} className="rounded-lg border border-orange-200 px-3 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50">Komentar</button></td>
            <AdminRowActions onEdit={() => setEditing(item)} onDelete={() => void remove(item.id)} />
          </tr>)}
        </tbody>
      </table>
    </div>
    {commentsArticle && <NewsCommentsModal article={commentsArticle} onClose={() => setCommentsArticle(null)} />}
    {(creating || editing) && <NewsEditor key={editing?.id ?? 'new'} article={editing} onClose={() => { setCreating(false); setEditing(null); }} onSaved={load} />}
  </div>;
}
