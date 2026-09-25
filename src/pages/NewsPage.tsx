import { useEffect, useState } from 'react';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listPublicNews } from '@/lib/adminApi';
import { optimizedImageUrl, restoreOriginalImage } from '@/lib/imageUrl';
import type { NewsRecord } from '@/types/admin';
import { useTranslation } from '@/i18n';
import LightReveal from '@/components/LightReveal';
import { getPrerenderData } from '@/lib/prerenderData';

export default function NewsPage() {
  const { lang } = useTranslation();
  const en = lang === 'en';
  const initialNews = getPrerenderData()?.news;
  const [articles, setArticles] = useState<NewsRecord[]>(initialNews ?? []);
  const [loading, setLoading] = useState(!initialNews);
  const [error, setError] = useState('');

  useEffect(() => {
    void listPublicNews()
      .then(setArticles)
      .catch(() => setError(en ? 'News could not be loaded.' : 'Berita belum dapat dimuat.'))
      .finally(() => setLoading(false));
  }, [en]);

  return (
    <section className="journal-page public-surface min-h-screen px-4 pb-24 pt-32 sm:px-6 sm:pt-40 lg:px-8">
      <div className="mx-auto max-w-[1344px]">
        <LightReveal>
          <p className="editorial-eyebrow">Visitiga Journal</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            {en ? 'Latest ' : 'Berita '}<span className="text-orange-500">{en ? 'news.' : 'terbaru.'}</span>
          </h1>
          <p className="public-muted mt-4 max-w-2xl">{en ? 'The latest articles and updates from Visitiga Media.' : 'Artikel dan kabar terbaru dari Visitiga Media.'}</p>
        </LightReveal>

        {loading ? (
          <div className="mt-16 text-slate-500">
            <LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />{en ? 'Loading news…' : 'Memuat berita…'}
          </div>
        ) : error ? (
          <p className="mt-16 text-red-600">{error}</p>
        ) : articles.length === 0 ? (
          <p className="mt-16 text-[#735c4d]">{en ? 'No news has been published yet.' : 'Belum ada berita yang dipublikasikan.'}</p>
        ) : (
          <div className="journal-grid mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <LightReveal key={article.id} delay={Math.min(index * 0.045, 0.18)} className="h-full">
              <article className="journal-card public-card h-full overflow-hidden border shadow-sm">
                <img
                  src={optimizedImageUrl(article.cover_image, 800)}
                  onError={({ currentTarget }) => restoreOriginalImage(currentTarget, article.cover_image)}
                  alt={article.title}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                  className="public-media-placeholder aspect-[16/9] w-full object-cover"
                />
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-orange-600">{article.category}</p>
                  <h2 className="mt-3 text-2xl font-black leading-tight">{article.title}</h2>
                  <p className="public-muted mt-3 line-clamp-3 text-sm leading-6">{article.excerpt}</p>
                  <p className="public-muted mt-5 text-xs">
                    {article.author} · {new Date(article.published_at!).toLocaleDateString(en ? 'en-US' : 'id-ID')}
                  </p>
                  <Link to={`/news/${article.slug}`} className="public-link mt-5 inline-flex items-center gap-2 text-sm font-bold">
                    {en ? 'Read more' : 'Baca selengkapnya'} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
              </LightReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
