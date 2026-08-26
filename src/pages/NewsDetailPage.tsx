import { useEffect, useState } from 'react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { getPublicNews } from '@/lib/adminApi';
import type { NewsRecord } from '@/types/admin';

export default function NewsDetailPage() {
  const { id } = useParams(); const [article, setArticle] = useState<NewsRecord | null | undefined>(undefined);
  useEffect(() => { if (id) void getPublicNews(id).then(setArticle).catch(() => setArticle(null)); }, [id]);
  if (article === undefined) return <main className="grid min-h-screen place-items-center"><LoaderCircle className="h-6 w-6 animate-spin text-orange-500" /></main>;
  if (!article) return <Navigate to="/news" replace />;
  return <article className="min-h-screen bg-[#fffaf3] pb-20 pt-32 text-[#241811] sm:pt-40"><div className="mx-auto max-w-4xl px-4 sm:px-6"><Link to="/news" className="inline-flex items-center gap-2 text-sm font-bold text-orange-600"><ArrowLeft className="h-4 w-4" />Kembali ke berita</Link><p className="mt-10 text-xs font-bold uppercase tracking-[.24em] text-orange-600">{article.category}</p><h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">{article.title}</h1><p className="mt-5 text-lg text-[#735c4d]">{article.excerpt}</p><p className="mt-5 text-sm text-[#735c4d]">{article.author} · {new Date(article.published_at!).toLocaleDateString('id-ID')}</p></div><img src={article.cover_image} alt={article.title} className="mx-auto mt-10 aspect-[16/8] w-full max-w-6xl object-cover sm:rounded-2xl" /><div className="mx-auto mt-12 max-w-2xl px-4 text-base leading-8 text-[#5d4030] sm:px-6 [&_img]:my-6 [&_img]:max-w-full [&_p]:mb-5" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} /></article>;
}
