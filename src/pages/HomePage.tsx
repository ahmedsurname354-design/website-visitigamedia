import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import CTASection from '@/components/CTASection';
import HomeShowcase from '@/components/HomeShowcase';
import HomeNewsSection from '@/components/HomeNewsSection';
import { getPrerenderData } from '@/lib/prerenderData';
import type { HomepageContent, NewsRecord, Portfolio } from '@/types/admin';

export default function HomePage() {
  const initial = getPrerenderData();
  const hasInitialHomepage = Boolean(initial?.homepage);
  const [homepage, setHomepage] = useState<HomepageContent | null>(initial?.homepage ?? null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initial?.portfolios ?? []);
  const [news, setNews] = useState<NewsRecord[]>(initial?.news ?? []);
  const [loading, setLoading] = useState(!hasInitialHomepage);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let requestId = 0;
    const load = async (replaceCurrent = false) => {
      const currentRequest = ++requestId;
      if (replaceCurrent) setLoading(true);
      try {
        const { getPublicHomepageContent, listPublicNews, listPublicPortfolios } = await import('@/lib/publicApi');
        const [contentResult, portfoliosResult, newsResult] = await Promise.allSettled([getPublicHomepageContent(), listPublicPortfolios(), listPublicNews()]);
        if (!active || currentRequest !== requestId) return;
        if (contentResult.status === 'fulfilled' && contentResult.value) { setHomepage(contentResult.value); setError(''); }
        else setError(contentResult.status === 'rejected' ? 'Konten beranda belum dapat dimuat. Silakan coba lagi.' : 'Konten beranda belum tersedia. Silakan coba lagi nanti.');
        if (portfoliosResult.status === 'fulfilled') setPortfolios(portfoliosResult.value);
        if (newsResult.status === 'fulfilled') setNews(newsResult.value);
      } catch { if (active && currentRequest === requestId) setError('Konten beranda belum dapat dimuat. Silakan coba lagi.'); }
      finally {
        if (active && currentRequest === requestId) setLoading(false);
      }
    };
    const refreshWhenVisible = () => { if (document.visibilityState === 'visible') void load(true); };
    const timer = window.setTimeout(() => void load(!hasInitialHomepage), hasInitialHomepage ? 1500 : 0);
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      active = false;
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      window.clearTimeout(timer);
    };
  }, [hasInitialHomepage]);

  if (loading) {
    return <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6" role="status" aria-live="polite"><div className="rounded-full border border-current/10 px-5 py-3 text-sm opacity-70 shadow-sm">Memuat konten terbaru…</div></div>;
  }

  if (error && !homepage) {
    return <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6" role="alert"><p className="text-center text-sm text-red-700">{error}</p></div>;
  }
  if (!homepage) return null;
  const content = homepage;
  return (
    <>
      <HeroSection content={content} />
      <StatsSection content={content} />
      <HomeShowcase content={content} portfolios={portfolios} />
      <CTASection variant="compact" content={content} />
      <HomeNewsSection articles={news} />
    </>
  );
}
