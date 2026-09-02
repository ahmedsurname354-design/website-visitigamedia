import { useEffect, useState } from 'react';
import { LoaderCircle, Save, Upload } from 'lucide-react';
import { getServiceContent, saveServiceContent } from '@/lib/adminApi';
import { defaultServiceContent } from '@/lib/serviceContent';
import { supabase } from '@/lib/supabase';
import type { ServiceContentInput } from '@/types/admin';

export default function ServicesManagerPage() {
  const [content, setContent] = useState<ServiceContentInput>(defaultServiceContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const persistUploadedVideo = async (url: string) => {
    const saved = await saveServiceContent({ ...content, video_mp4_url: url });
    setContent(saved);
    setMessage('Video baru berhasil diunggah dan langsung ditayangkan.');
    setError('');
  };

  useEffect(() => {
    void getServiceContent().then((value) => { if (value) setContent(value); }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Konten layanan tidak dapat dimuat.')).finally(() => setLoading(false));
  }, []);

  const submit = async (form: FormData) => {
    setSaving(true); setError(''); setMessage('');
    try {
      const cards = content.cards.map((_, index) => ({
        title: String(form.get(`card_title_${index}`)).trim(),
        description: String(form.get(`card_description_${index}`)).trim(),
        tags: String(form.get(`card_tags_${index}`)).split(',').map((tag) => tag.trim()).filter(Boolean),
        action: String(form.get(`card_action_${index}`)).trim(),
      }));
      const next: ServiceContentInput = {
        eyebrow: String(form.get('eyebrow')).trim(), heading: String(form.get('heading')).trim(), heading_accent: String(form.get('heading_accent')).trim(), cards,
        showreel_eyebrow: String(form.get('showreel_eyebrow')).trim(), showreel_heading: String(form.get('showreel_heading')).trim(), showreel_accent: String(form.get('showreel_accent')).trim(), showreel_description: String(form.get('showreel_description')).trim(),
        primary_button_text: String(form.get('primary_button_text')).trim(), primary_button_url: String(form.get('primary_button_url')).trim(), secondary_button_text: String(form.get('secondary_button_text')).trim(), secondary_button_url: String(form.get('secondary_button_url')).trim(),
        video_webm_url: content.video_webm_url, video_mp4_url: content.video_mp4_url, video_poster_url: String(form.get('video_poster_url')).trim(),
      };
      const saved = await saveServiceContent(next); setContent(saved); setMessage('Konten layanan berhasil disimpan.');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Konten layanan tidak dapat disimpan.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="py-20 text-center text-sm text-slate-500"><LoaderCircle className="mr-2 inline h-5 w-5 animate-spin" />Memuat konten layanan…</div>;

  return <div className="mx-auto max-w-7xl"><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-orange-600">Konten website</p><h2 className="mt-2 text-3xl font-black text-slate-900">Layanan</h2><p className="mt-2 text-slate-500">Atur judul, kartu layanan, tombol, poster, dan video showreel.</p></div>
    {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
    <form onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }} className="space-y-7">
      <Section title="Judul layanan"><div className="grid gap-5 sm:grid-cols-3"><Field name="eyebrow" label="Label kecil" initial={content.eyebrow} /><Field name="heading" label="Judul" initial={content.heading} /><Field name="heading_accent" label="Teks aksen" initial={content.heading_accent} /></div></Section>
      <Section title="Kartu layanan"><div className="grid gap-5 lg:grid-cols-2">{content.cards.map((card, index) => <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="mb-4 text-sm font-bold text-orange-600">Kartu {index + 1}</p><div className="grid gap-4"><Field name={`card_title_${index}`} label="Judul" initial={card.title} /><Area name={`card_description_${index}`} label="Deskripsi" initial={card.description} /><Field name={`card_tags_${index}`} label="Tag (pisahkan dengan koma)" initial={card.tags.join(', ')} /><Field name={`card_action_${index}`} label="Teks tautan" initial={card.action} /></div></div>)}</div></Section>
      <Section title="Teks showreel"><div className="grid gap-5 sm:grid-cols-2"><Field name="showreel_eyebrow" label="Label kecil" initial={content.showreel_eyebrow} /><Field name="showreel_heading" label="Judul" initial={content.showreel_heading} /><Field name="showreel_accent" label="Teks aksen" initial={content.showreel_accent} /><Area name="showreel_description" label="Deskripsi" initial={content.showreel_description} /><Field name="primary_button_text" label="Teks tombol utama" initial={content.primary_button_text} /><Field name="primary_button_url" label="URL tombol utama" initial={content.primary_button_url} /><Field name="secondary_button_text" label="Teks tombol kedua" initial={content.secondary_button_text} /><Field name="secondary_button_url" label="URL tombol kedua" initial={content.secondary_button_url} /></div></Section>
      <Section title="Media showreel"><div className="grid gap-5 lg:grid-cols-2"><VideoUpload value={content.video_mp4_url} onChange={persistUploadedVideo} /><Field name="video_poster_url" label="URL poster video" initial={content.video_poster_url} /></div>{content.video_mp4_url && <video key={content.video_mp4_url} controls preload="metadata" poster={content.video_poster_url} className="mt-5 aspect-video w-full max-w-2xl rounded-xl bg-black"><source src={content.video_mp4_url} type="video/mp4" /></video>}</Section>
      <div className="sticky bottom-4 flex justify-end"><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-orange-600 disabled:opacity-50">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? 'Menyimpan…' : 'Simpan perubahan'}</button></div>
    </form>
  </div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h3 className="mb-5 text-lg font-black text-slate-900">{title}</h3>{children}</section>; }
function Field({ name, label, initial, className = '' }: { name: string; label: string; initial: string; className?: string }) { return <label className={`text-sm font-medium text-slate-700 ${className}`}>{label}<input name={name} required defaultValue={initial} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500" /></label>; }
function Area({ name, label, initial }: { name: string; label: string; initial: string }) { return <label className="text-sm font-medium text-slate-700">{label}<textarea name={name} required defaultValue={initial} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-orange-500" /></label>; }

function VideoUpload({ value, onChange }: { value: string; onChange: (url: string) => Promise<void> }) {
  const [uploading, setUploading] = useState(false); const [error, setError] = useState('');
  const upload = async (file?: File) => { if (!file) return; if (file.type !== 'video/mp4' || !file.name.toLowerCase().endsWith('.mp4')) { setError('Video harus berformat MP4.'); return; } if (file.size > 30 * 1024 * 1024) { setError('Video maksimal 30 MB.'); return; } if (!supabase) { setError('Supabase belum dikonfigurasi.'); return; } setUploading(true); setError(''); const path = `services/${crypto.randomUUID()}.mp4`; try { const { error: uploadError } = await supabase.storage.from('website-media').upload(path, file, { cacheControl: '31536000', contentType: 'video/mp4', upsert: false }); if (uploadError) throw uploadError; const url = supabase.storage.from('website-media').getPublicUrl(path).data.publicUrl; try { await onChange(url); } catch (saveError) { await supabase.storage.from('website-media').remove([path]); throw saveError; } } catch (reason) { setError(reason instanceof Error ? reason.message : 'Video gagal diunggah.'); } finally { setUploading(false); } };
  return <div><p className="text-sm font-medium text-slate-700">Video MP4</p><p className="mt-2 truncate rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">{value}</p><label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"><input type="file" accept="video/mp4,.mp4" className="sr-only" disabled={uploading} onChange={(event) => void upload(event.target.files?.[0])} />{uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}{uploading ? 'Mengunggah dan menyimpan…' : 'Pilih video MP4'}</label><p className="mt-2 text-xs text-slate-500">Hanya MP4, maksimal 30 MB. Video otomatis tersimpan setelah upload selesai.</p>{error && <p className="mt-2 text-xs text-red-600">{error}</p>}</div>;
}
