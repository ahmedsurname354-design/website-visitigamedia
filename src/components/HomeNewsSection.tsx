import { ArrowRight } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { useTranslation } from '@/i18n';
import { localizedNews } from '@/lib/contentLocale';
import { responsiveImageSources } from '@/lib/imageUrl';
import type { NewsRecord } from '@/types/admin';

function latestPublishedNews(items: NewsRecord[]) {
  return items
    .filter((item) => Boolean(item.published_at))
    .slice()
    .sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime())
    .slice(0, 3);
}

function formatPublishedDate(value: string | null, lang: 'id' | 'en') {
  if (!value) return '';
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

export default function HomeNewsSection({ articles }: { articles: NewsRecord[] }) {
  const { lang } = useTranslation();
  const en = lang === 'en';
  const latest = latestPublishedNews(articles).map((article) => localizedNews(article, lang));

  if (latest.length === 0) return null;

  return (
    <section className="editorial-section editorial-section--news" aria-labelledby="home-news-title">
      <div className="editorial-container">
        <div className="editorial-heading-row">
          <div>
            <p className="editorial-eyebrow">{en ? 'Visitiga Journal' : 'Visitiga Journal'}</p>
            <h2 id="home-news-title" className="editorial-title">{en ? 'Latest news' : 'Berita terbaru'}</h2>
          </div>
          <Link to="/news" className="editorial-text-link">
            {en ? 'View all news' : 'Lihat semua berita'} <ArrowRight />
          </Link>
        </div>

        <div className="home-news-grid">
          {latest.map((article) => {
            const sources = responsiveImageSources(article.cover_image);
            return (
              <article key={article.id} className="home-news-card">
                <Link to={`/news/${article.slug}`} className="home-news-card__media" aria-label={`${en ? 'Read' : 'Baca'} ${article.title}`}>
                  <img {...sources} width="800" height="450" alt={article.cover_alt?.trim() || article.title} loading="lazy" decoding="async" />
                </Link>
                <div className="home-news-card__body">
                  <div className="home-news-card__meta">
                    <span>{article.category}</span>
                    <time dateTime={article.published_at ?? undefined}>{formatPublishedDate(article.published_at, lang)}</time>
                  </div>
                  <h3><Link to={`/news/${article.slug}`}>{article.title}</Link></h3>
                  <p>{article.excerpt}</p>
                  <Link to={`/news/${article.slug}`} className="home-news-card__link">
                    {en ? 'Read more' : 'Baca selengkapnya'} <ArrowRight />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
