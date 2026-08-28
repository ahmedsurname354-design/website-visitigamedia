import { useEffect, useState } from 'react';
import { FileText, LoaderCircle, Upload } from 'lucide-react';
import { getProductCatalogue, saveProductCatalogue } from '@/lib/adminApi';
import { supabase } from '@/lib/supabase';

const MAX_PDF_SIZE = 30 * 1024 * 1024;
const MEDIA_BUCKET = 'website-media';
const CATALOGUE_FOLDER = 'catalogues';

async function removeOldCatalogues(activeFileName: string) {
  if (!supabase) return;
  const storage = supabase.storage.from(MEDIA_BUCKET);
  const oldPaths: string[] = [];
  const pageSize = 100;

  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await storage.list(CATALOGUE_FOLDER, { limit: pageSize, offset, sortBy: { column: 'name', order: 'asc' } });
    if (error) throw error;
    oldPaths.push(...data.filter((item) => item.name !== activeFileName).map((item) => `${CATALOGUE_FOLDER}/${item.name}`));
    if (data.length < pageSize) break;
  }

  if (oldPaths.length > 0) {
    const { error } = await storage.remove(oldPaths);
    if (error) throw error;
  }
}

export function CatalogueUploadCard() {
  const [title, setTitle] = useState('Product Catalogue');
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void getProductCatalogue()
      .then((catalogue) => {
        if (catalogue) { setTitle(catalogue.title); setFileUrl(catalogue.file_url); }
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Data katalog tidak dapat dimuat.'))
      .finally(() => setLoading(false));
  }, []);

  const upload = async (file?: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) { setError('File katalog harus berformat PDF.'); return; }
    if (file.size > MAX_PDF_SIZE) { setError('Ukuran PDF maksimal 30 MB.'); return; }
    if (!supabase) { setError('Supabase belum dikonfigurasi.'); return; }
    setUploading(true); setError(''); setMessage('');
    const fileName = `${crypto.randomUUID()}.pdf`;
    const path = `${CATALOGUE_FOLDER}/${fileName}`;
    let catalogueSaved = false;
    try {
      const storage = supabase.storage.from(MEDIA_BUCKET);
      const { error: uploadError } = await storage.upload(path, file, { cacheControl: '3600', contentType: 'application/pdf', upsert: false });
      if (uploadError) throw uploadError;
      const { data } = storage.getPublicUrl(path);
      await saveProductCatalogue(title.trim() || 'Product Catalogue', data.publicUrl);
      catalogueSaved = true;
      setFileUrl(data.publicUrl);
      try {
        await removeOldCatalogues(fileName);
        setMessage('Katalog berhasil diganti dan file katalog lama sudah dibersihkan.');
      } catch (cleanupError) {
        console.warn('Katalog aktif, tetapi file lama tidak dapat dibersihkan:', cleanupError);
        setMessage('Katalog berhasil diganti, tetapi beberapa file lama belum dapat dibersihkan.');
      }
    } catch (reason) {
      if (!catalogueSaved) {
        const { error: rollbackError } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
        if (rollbackError) console.warn('File upload yang gagal disimpan tidak dapat dibersihkan:', rollbackError);
      }
      setError(reason instanceof Error ? reason.message : 'Katalog tidak dapat diunggah.');
    }
    finally { setUploading(false); }
  };

  return <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div className="flex-1"><p className="text-xs font-bold uppercase tracking-wider text-orange-600">Interactive catalogue</p><h2 className="mt-1 text-lg font-black text-slate-900">Ganti PDF katalog</h2><p className="mt-1 text-sm text-slate-500">Upload PDF baru untuk mengganti flipbook pada halaman Product.</p><label className="mt-4 block max-w-lg text-sm font-medium text-slate-700">Judul katalog<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" /></label></div><div className="flex flex-wrap items-center gap-3">{fileUrl && <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><FileText className="h-4 w-4" />Lihat PDF aktif</a>}<label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"><input type="file" accept="application/pdf,.pdf" className="sr-only" disabled={uploading || loading} onChange={(event) => void upload(event.target.files?.[0])} />{uploading || loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{uploading ? 'Mengunggah…' : 'Pilih PDF baru'}</label></div></div><p className="mt-3 text-xs text-slate-500">PDF maksimal 30 MB. Jumlah halaman terdeteksi otomatis.</p>{message && <p role="status" className="mt-3 text-sm font-medium text-emerald-600">{message}</p>}{error && <p role="alert" className="mt-3 text-sm font-medium text-red-600">{error}</p>}</section>;
}
