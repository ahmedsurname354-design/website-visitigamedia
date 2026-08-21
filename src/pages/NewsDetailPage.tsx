import { ArrowLeft, Share2 } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { featuredArticles, localizeArticle, popularArticles } from '@/pages/NewsPage';

export default function NewsDetailPage() {
  const { id } = useParams();
  const { lang } = useTranslation();
  const article = [...featuredArticles, ...popularArticles].find((item) => item.id === Number(id));

  if (!article) return <Navigate to="/news" replace />;
  const story = localizeArticle(article, lang);
  const copy = lang === 'id'
    ? { back: 'Kembali ke berita', intro: 'Artikel Visitiga', share: 'Bagikan artikel' }
    : { back: 'Back to news', intro: 'Visitiga article', share: 'Share article' };

  return (
    <article className="bg-[#fffaf3] pb-20 pt-28 text-[#241811] sm:pt-36">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link to="/news" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition hover:-translate-x-1"><ArrowLeft className="h-4 w-4" />{copy.back}</Link>
        <p className="mt-10 text-xs font-bold uppercase tracking-[0.24em] text-orange-600">{story.category}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.045em] sm:text-6xl">{story.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#735c4d]">{story.excerpt}</p>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6"><img src={story.image} alt="" className="aspect-[16/8] w-full rounded-2xl object-cover shadow-xl shadow-orange-950/10" /></div>
      <div className="mx-auto mt-14 max-w-2xl px-4 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-600">{copy.intro}</p><div className="mt-6 space-y-5">{story.content.map((paragraph) => <p key={paragraph} className="text-base leading-8 text-[#5d4030]">{paragraph}</p>)}</div><button className="mt-10 inline-flex items-center gap-2 rounded-full border border-orange-300 px-5 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-100"><Share2 className="h-4 w-4" />{copy.share}</button></div>
    </article>
  );
}
