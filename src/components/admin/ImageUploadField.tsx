import { useEffect, useId, useState } from 'react';
import { ImagePlus, LoaderCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export function ImageUploadField({ name, label = 'Gambar', initial = '', folder }: { name: string; label?: string; initial?: string; folder: 'products' | 'portfolios' | 'news' }) {
  const inputId = useId();
  const [url, setUrl] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setUrl(initial); setError(''); }, [initial]);

  const upload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Pilih file gambar (JPG, PNG, WebP, dan sejenisnya).'); return; }
    if (file.size > MAX_FILE_SIZE) { setError('Ukuran gambar maksimal 8 MB.'); return; }
    if (!supabase) { setError('Supabase belum dikonfigurasi.'); return; }
    setUploading(true); setError('');
    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${folder}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('website-media').upload(path, file, { cacheControl: '3600', contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('website-media').getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Gambar tidak dapat diunggah.'); }
    finally { setUploading(false); }
  };

  return <div className="sm:col-span-2"><label className="text-sm font-medium" htmlFor={inputId}>{label}</label><input name={name} value={url} readOnly className="sr-only" aria-hidden="true" /><div className="mt-2 flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 sm:flex-row sm:items-center"><div className="grid h-24 w-full shrink-0 place-items-center overflow-hidden rounded-lg bg-white sm:w-32">{url ? <img src={url} alt="Preview unggahan" className="h-full w-full object-cover" /> : <ImagePlus className="h-6 w-6 text-slate-400" />}</div><div><label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"><input id={inputId} type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(event) => void upload(event.target.files?.[0])} />{uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}{uploading ? 'Mengunggah…' : url ? 'Ganti gambar' : 'Pilih gambar'}</label><p className="mt-2 text-xs text-slate-500">JPG, PNG, WebP, maksimal 8 MB.</p>{error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}</div></div></div>;
}
