import { useEffect, useId, useState } from 'react';
import { ImagePlus, LoaderCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;
const HOMEPAGE_MAX_IMAGE_DIMENSION = 2400;
const DEFAULT_IMAGE_QUALITY = 0.78;
const HOMEPAGE_IMAGE_QUALITY = 0.9;

async function compressForUpload(file: File, folder: ImageUploadFieldProps['folder']): Promise<File> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size < 350 * 1024) return file;
  const bitmap = await createImageBitmap(file);
  const isHomepageImage = folder === 'homepage';
  const maxDimension = isHomepageImage ? HOMEPAGE_MAX_IMAGE_DIMENSION : MAX_IMAGE_DIMENSION;
  const quality = isHomepageImage ? HOMEPAGE_IMAGE_QUALITY : DEFAULT_IMAGE_QUALITY;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) { bitmap.close(); return file; }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
}

type ImageUploadFieldProps = { name: string; label?: string; initial?: string; folder: 'products' | 'portfolios' | 'news' | 'services' | 'homepage'; allowClear?: boolean };

export function ImageUploadField({ name, label = 'Gambar', initial = '', folder, allowClear = false }: ImageUploadFieldProps) {
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
      const uploadFile = await compressForUpload(file, folder);
      const extension = uploadFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${folder}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('website-media').upload(path, uploadFile, { cacheControl: '31536000', contentType: uploadFile.type, upsert: false });
      if (uploadError) throw uploadError;
      setUrl(supabase.storage.from('website-media').getPublicUrl(path).data.publicUrl);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Gambar tidak dapat diunggah.'); }
    finally { setUploading(false); }
  };

  return <div className="sm:col-span-2"><label className="text-sm font-medium" htmlFor={inputId}>{label}</label><input name={name} value={url} readOnly className="sr-only" aria-hidden="true" /><div className="mt-2 flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 sm:flex-row sm:items-center"><div className="grid h-24 w-full shrink-0 place-items-center overflow-hidden rounded-lg bg-white sm:w-32">{url ? <img src={url} alt="Preview unggahan" className="h-full w-full object-cover" /> : <ImagePlus className="h-6 w-6 text-slate-400" />}</div><div><div className="flex flex-wrap gap-2"><label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100"><input id={inputId} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; event.currentTarget.value = ''; void upload(file); }} />{uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}{uploading ? 'Mengunggah...' : url ? 'Ganti gambar' : 'Pilih gambar'}</label>{allowClear && url && <button type="button" onClick={() => setUrl('')} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50">Hapus gambar</button>}</div><p className="mt-2 text-xs text-slate-500">JPG, PNG, dan WebP dikompresi otomatis. Gambar slideshow dipertahankan hingga 2400 px dengan kualitas lebih tinggi.</p>{error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}</div></div></div>;
}
