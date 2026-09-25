import NewsComments from '@/components/NewsComments';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Facebook, Link as LinkIcon, Linkedin, LoaderCircle, Mail } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { optimizedImageUrl, restoreOriginalImage } from '@/lib/imageUrl';
import { getPublicNews, listPublicNews } from '@/lib/adminApi';
import type { NewsRecord } from '@/types/admin';
import { useTranslation } from '@/i18n';
import { usePageMeta } from '@/hooks/usePageMeta';
import { absoluteUrl, canonicalPublicPath } from '@/lib/seo';
import LightReveal from '@/components/LightReveal';
import { getPrerenderData } from '@/lib/prerenderData';

const MAX_RELATED_ARTICLES = 6;
const SERVICE_LINKS = [
  { title: 'LED indoor', path: '/services/led-indoor/', terms: ['indoor', 'ruang rapat', 'kampus', 'retail', 'ritel'] },
  { title: 'Videotron outdoor', path: '/services/videotron-outdoor/', terms: ['outdoor', 'videotron', 'luar ruang', 'dooh'] },
  { title: 'Rental LED', path: '/services/rental-led/', terms: ['rental', 'sewa', 'event', 'acara', 'panggung'] },
  { title: 'Media konvensional', path: '/services/media-konvensional/', terms: ['billboard', 'lightbox', 'signage', 'konvensional'] },
];

function getRelatedArticles(article: NewsRecord, articles: NewsRecord[]) {
  const candidates = articles.filter((candidate) => candidate.id !== article.id);
  const normalizedCategory = article.category.toLocaleLowerCase();
  const sameCategory = candidates.filter((candidate) => candidate.category.toLocaleLowerCase() === normalizedCategory);
  const otherCategories = candidates.filter((candidate) => candidate.category.toLocaleLowerCase() !== normalizedCategory);
  return [...sameCategory, ...otherCategories].slice(0, MAX_RELATED_ARTICLES);
}

function getRelatedServices(article: NewsRecord) {
  const text = `${article.title} ${article.category} ${article.excerpt} ${article.target_keyword ?? ''}`.toLocaleLowerCase();
  const matches = SERVICE_LINKS
    .map((service) => ({ service, score: service.terms.filter((term) => text.includes(term)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ service }) => service);
  return (matches.length > 0 ? matches : SERVICE_LINKS).slice(0, 2);
}

function formatPublishedDate(value: string | null) {
  if (!value) return '';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

export default function NewsDetailPage() {
  const { id: slug } = useParams();
  const { lang } = useTranslation();
  const en = lang === 'en';
  const [initialData] = useState(getPrerenderData);
  const bootstrapArticle = initialData?.article;
  const initialArticle = bootstrapArticle?.slug === slug ? bootstrapArticle : undefined;
  const [article, setArticle] = useState<NewsRecord | null | undefined>(initialArticle);
  const [allArticles, setAllArticles] = useState<NewsRecord[]>(initialData?.news ?? []);
  const [loadError, setLoadError] = useState('');
  const [relatedError, setRelatedError] = useState(false);
  const [copied, setCopied] = useState(false);
  const seoTitle = article?.seo_title?.trim() || article?.title;
  const seoDescription = article?.seo_description?.trim() || article?.excerpt;

  usePageMeta({
    title: seoTitle ? `${seoTitle} — Visitiga` : (en ? 'News — Visitiga' : 'Berita — Visitiga'),
    description: seoDescription || (en ? 'Latest news and articles from Visitiga Media.' : 'Berita dan artikel terbaru dari Visitiga Media.'),
    pathname: canonicalPublicPath(slug ? `/news/${slug}` : '/news'),
    image: article?.cover_image,
    type: article ? 'article' : 'website',
    imageAlt: article?.cover_alt?.trim() || article?.title,
    lang,
    noIndex: !article,
    structuredData: article ? [
      { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: seoDescription || article.excerpt, image: article.cover_image.startsWith('http') ? article.cover_image : absoluteUrl(article.cover_image), datePublished: article.published_at, dateModified: article.updated_at, mainEntityOfPage: absoluteUrl(canonicalPublicPath(`/news/${article.slug}`)), author: { '@type': 'Person', name: article.author }, publisher: { '@type': 'Organization', name: 'Visitiga Media', logo: { '@type': 'ImageObject', url: absoluteUrl('/social-preview.png') } }, ...(article.target_keyword?.trim() ? { keywords: article.target_keyword.trim() } : {}) },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: en ? 'Home' : 'Beranda', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: en ? 'News' : 'Berita', item: absoluteUrl(canonicalPublicPath('/news')) },
        { '@type': 'ListItem', position: 3, name: article.title, item: absoluteUrl(canonicalPublicPath(`/news/${article.slug}`)) },
      ] },
    ] : undefined,
  });

  useEffect(() => {
    let active = true;

    async function loadPage() {
      if (!slug) {
        setArticle(null);
        return;
      }
      if (!initialArticle) setArticle(undefined);
      setLoadError('');
      setRelatedError(false);
      const [articleResult, relatedResult] = await Promise.allSettled([getPublicNews(slug), listPublicNews()]);
      if (!active) return;

      if (articleResult.status === 'rejected') {
        setLoadError(en ? 'News could not be loaded. Please try again shortly.' : 'Berita belum dapat dimuat. Silakan coba lagi beberapa saat.');
        setArticle(null);
        return;
      }

      setArticle(articleResult.value);
      if (relatedResult.status === 'fulfilled') {
        setAllArticles(relatedResult.value);
      } else {
        setAllArticles([]);
        setRelatedError(true);
      }
    }

    void loadPage();
    return () => { active = false; };
  }, [en, slug, initialArticle]);

  const relatedArticles = useMemo(
    () => (article ? getRelatedArticles(article, allArticles) : []),
    [article, allArticles],
  );

  if (article === undefined) {
    return (
      <main className="public-surface grid min-h-screen place-items-center">
        <div className="public-muted flex items-center gap-3 text-sm font-semibold">
          <LoaderCircle className="h-5 w-5 animate-spin text-orange-500" /> Memuat berita…
        </div>
      </main>
    );
  }

  if (!article && !loadError) return <Navigate to="/news" replace />;

  if (!article) {
    return (
      <main className="public-surface min-h-screen px-4 pb-20 pt-32 sm:px-6 sm:pt-40">
        <div className="public-card mx-auto max-w-xl rounded-2xl border border-red-200 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black">{en ? 'Unable to load news' : 'Berita gagal dimuat'}</h1>
          <p className="public-muted mt-3 text-sm leading-6">{loadError}</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700">
            {en ? 'Reload' : 'Muat ulang'}
          </button>
        </div>
      </main>
    );
  }

  const pageUrl = window.location.href;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(article.title);
  const shareLinks = [
    { label: 'Bagikan ke LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: <Linkedin className="h-4 w-4" /> },
    { label: 'Bagikan ke WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, icon: <span className="text-[10px] font-black">WA</span> },
    { label: 'Bagikan ke X', href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, icon: <span className="text-sm font-black">X</span> },
    { label: 'Bagikan ke Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: <Facebook className="h-4 w-4" /> },
    { label: 'Bagikan lewat email', href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, icon: <Mail className="h-4 w-4" /> },
  ];

  async function copyPageLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Salin tautan berita ini:', pageUrl);
    }
  }

  return (
    <article className="public-surface min-h-screen pb-20 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <Link to="/news" className="inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-bold text-orange-600 transition hover:text-orange-700">
          <ArrowLeft className="h-4 w-4" /> {en ? 'Back to news' : 'Kembali ke berita'}
        </Link>

        <div className="mt-5 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-14">
          <main className="min-w-0">
            <LightReveal><header>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-orange-600">{article.category}</p>
              <h1 className="mt-3 max-w-5xl text-3xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">{article.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#735c4d]">
                <span className="font-semibold text-[#3d2a20]">{article.author}</span><span aria-hidden="true">·</span><span>{article.category}</span>
                {article.published_at && <><span aria-hidden="true">·</span><time dateTime={article.published_at}>{formatPublishedDate(article.published_at)}</time></>}
              </div>
              {article.excerpt && <p className="mt-6 max-w-4xl text-base leading-7 text-[#735c4d] sm:text-lg sm:leading-8">{article.excerpt}</p>}
            </header></LightReveal>

            <LightReveal delay={0.04} className="mt-8"><img src={optimizedImageUrl(article.cover_image, 1400)} onError={({ currentTarget }) => restoreOriginalImage(currentTarget, article.cover_image)} alt={article.cover_alt?.trim() || article.title} decoding="async" className="news-detail-cover aspect-[16/9] w-full rounded-2xl bg-[#f3e5d7] object-cover shadow-sm" /></LightReveal>
            <LightReveal delay={0.06} className="mt-9"><div
              className="max-w-4xl text-base leading-8 text-[#5d4030] sm:text-[1.05rem] [&_a]:font-semibold [&_a]:text-orange-700 [&_a]:underline [&_a]:decoration-orange-300 [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-400 [&_blockquote]:bg-[#fff2e5] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:italic [&_h1]:mb-4 [&_h1]:mt-9 [&_h1]:text-3xl [&_h1]:font-black [&_h2]:mb-4 [&_h2]:mt-9 [&_h2]:text-2xl [&_h2]:font-black [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-bold [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_strong]:font-bold [&_strong]:text-[#35231a] [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
            /></LightReveal>
            <LightReveal className="public-divider mt-12 border-t pt-8"><NewsComments key={article.id} newsId={article.id} /></LightReveal>
          </main>

          <aside className="public-divider min-w-0 border-t pt-8 lg:sticky lg:top-28 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <LightReveal delay={0.08}>
            <section aria-labelledby="share-heading">
              <h2 id="share-heading" className="text-lg font-black">{en ? 'Share' : 'Bagikan'}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {shareLinks.map((share) => (
                  <a key={share.label} href={share.href} target={share.href.startsWith('http') ? '_blank' : undefined} rel={share.href.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label={share.label} title={share.label} className="public-card grid size-10 place-items-center rounded-full border transition hover:border-orange-500 hover:text-orange-600">
                    {share.icon}
                  </a>
                ))}
                <button type="button" onClick={() => void copyPageLink()} aria-label="Salin tautan berita" title={copied ? 'Tautan disalin' : 'Salin tautan'} className="public-card grid size-10 place-items-center rounded-full border transition hover:border-orange-500 hover:text-orange-600">
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <LinkIcon className="h-4 w-4" />}
                </button>
              </div>
              <p aria-live="polite" className="mt-2 min-h-5 text-xs font-semibold text-green-700">{copied ? 'Tautan berhasil disalin.' : ''}</p>
            </section>

            <section className="public-divider mt-7 border-t pt-7" aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-xl font-black">{en ? 'Related articles' : 'Artikel terkait'}</h2>
              {relatedError ? <p className="mt-4 text-sm leading-6 text-[#735c4d]">Artikel terkait belum dapat dimuat.</p> : relatedArticles.length === 0 ? <p className="mt-4 text-sm leading-6 text-[#735c4d]">Belum ada artikel terkait lainnya.</p> : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {relatedArticles.map((related) => (
                    <Link key={related.id} to={`/news/${related.slug}`} className="related-article-link group grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                      <img src={optimizedImageUrl(related.cover_image, 600)} onError={({ currentTarget }) => restoreOriginalImage(currentTarget, related.cover_image)} alt="" loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-xl bg-[#f3e5d7] object-cover" />
                      <div className="min-w-0 py-0.5"><h3 className="line-clamp-3 text-sm font-bold leading-5 transition group-hover:text-orange-600">{related.title}</h3><p className="mt-2 truncate text-xs text-[#8b7161]">{related.category}</p></div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
            <section className="public-divider mt-7 border-t pt-7" aria-labelledby="service-links-heading">
              <h2 id="service-links-heading" className="text-xl font-black">{en ? 'Related services' : 'Layanan terkait'}</h2>
              <div className="mt-4 grid gap-2">
                {getRelatedServices(article).map((service) => <Link key={service.path} to={service.path} className="public-card rounded-lg border px-4 py-3 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-700">{service.title}</Link>)}
                <Link to="/portfolio/" className="px-1 pt-2 text-sm font-semibold text-orange-700 underline underline-offset-4">{en ? 'View related projects' : 'Lihat portofolio proyek'}</Link>
              </div>
            </section>
            </LightReveal>
          </aside>
        </div>
      </div>
    </article>
  );
}
