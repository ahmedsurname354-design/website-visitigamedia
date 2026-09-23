import { useState } from 'react';
import { saveNews } from '@/lib/adminApi';
import { ContentModal, InputField } from '@/components/admin/ContentModal';
import { ImageUploadField } from '@/components/admin/ImageUploadField';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { AdminAlert } from '@/components/admin/AdminUi';
import { NEWS_SLUG_PATTERN, slugifyNewsTitle } from '@/lib/newsSlug';
import type { NewsRecord } from '@/types/admin';
import { normalizeArticleHeadings } from '@/lib/articleSeo';

export function NewsEditor({ article, onClose, onSaved }: { article: NewsRecord | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const [title, setTitle] = useState(article?.title ?? '');
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(Boolean(article));
  const [error, setError] = useState('');

  const submit = async (form: FormData) => {
    try {
      const coverImage = String(form.get('cover_image')).trim();
      const content = String(form.get('content')).trim();
      const date = String(form.get('published_at'));
      if (!NEWS_SLUG_PATTERN.test(slug) || slug.length > 100) throw new Error('Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (maksimal 100 karakter).');
      if (!coverImage) throw new Error('Silakan unggah cover berita terlebih dahulu.');
      if (!content || content === '<p><br></p>') throw new Error('Isi artikel tidak boleh kosong.');
      await saveNews({
        title: title.trim(), slug, author: String(form.get('author')).trim(),
        category: String(form.get('category')).trim(), cover_image: coverImage,
        excerpt: String(form.get('excerpt')).trim(), content: normalizeArticleHeadings(content),
        seo_title: String(form.get('seo_title')).trim(), seo_description: String(form.get('seo_description')).trim(),
        cover_alt: String(form.get('cover_alt')).trim(), target_keyword: String(form.get('target_keyword')).trim(),
        published_at: date ? new Date(`${date}T00:00:00`).toISOString() : null,
      }, article?.id);
      await onSaved();
      onClose();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Berita tidak dapat disimpan.');
    }
  };

  return <ContentModal title={article ? 'Edit berita' : 'Tambah berita'} onClose={onClose} onSubmit={submit}>
    {error && <div className="sm:col-span-2"><AdminAlert>{error}</AdminAlert></div>}
    <label className="text-sm font-medium sm:col-span-2">Judul artikel
      <input name="title" required maxLength={200} value={title} onChange={(event) => {
        const nextTitle = event.target.value;
        setTitle(nextTitle);
        if (!slugEdited) setSlug(slugifyNewsTitle(nextTitle));
      }} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" />
    </label>
    <label className="text-sm font-medium sm:col-span-2">URL berita
      <span className="mt-2 flex min-w-0 items-center rounded-xl border border-slate-300 focus-within:border-orange-500">
        <span className="shrink-0 border-r border-slate-300 px-3 py-2 text-slate-500">/news/</span>
        <input name="slug" required maxLength={100} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={slug} onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }} className="min-w-0 flex-1 px-3 py-2 outline-none" />
      </span>
    </label>
    <InputField label="Penulis" name="author" initial={article?.author} />
    <InputField label="Kategori" name="category" initial={article?.category} />
    <InputField label="Tanggal publikasi" name="published_at" type="date" required={false} initial={article?.published_at?.slice(0, 10)} />
    <ImageUploadField label="Cover berita" name="cover_image" initial={article?.cover_image} folder="news" />
    <label className="text-sm font-medium sm:col-span-2">Ringkasan
      <textarea name="excerpt" required defaultValue={article?.excerpt ?? ''} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" />
    </label>
    <details className="sm:col-span-2">
      <summary className="cursor-pointer font-semibold">SEO artikel</summary>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <InputField label="SEO title (opsional)" name="seo_title" initial={article?.seo_title} required={false} maxLength={70} />
        <InputField label="Target keyword (internal)" name="target_keyword" initial={article?.target_keyword} required={false} maxLength={100} />
        <label className="text-sm font-medium sm:col-span-2">Meta description (opsional)<textarea name="seo_description" maxLength={180} defaultValue={article?.seo_description ?? ''} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" /></label>
        <label className="text-sm font-medium sm:col-span-2">Alt text cover (opsional)<input name="cover_alt" maxLength={180} defaultValue={article?.cover_alt ?? ''} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-orange-500" /></label>
      </div>
    </details>
    <RichTextEditor name="content" initial={article?.content} />
  </ContentModal>;
}
