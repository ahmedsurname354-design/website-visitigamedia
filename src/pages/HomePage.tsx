import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import CTASection from '@/components/CTASection';
import HomeShowcase from '@/components/HomeShowcase';
import { getPrerenderData } from '@/lib/prerenderData';
import { defaultHomepageContent } from '@/lib/homepageContent';
import type { HomepageContent, Portfolio } from '@/types/admin';

export default function HomePage() {
  const initial = getPrerenderData();
  const hasInitialHomepage = Boolean(initial?.homepage);
  const [homepage, setHomepage] = useState<HomepageContent | null>(initial?.homepage ?? null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initial?.portfolios ?? []);
  const [loading, setLoading] = useState(!hasInitialHomepage);

  useEffect(() => {
    let active = true;
    let requestId = 0;
    const load = async (replaceCurrent = false) => {
      const currentRequest = ++requestId;
      if (replaceCurrent) setLoading(true);
      try {
        const { getPublicHomepageContent, listPublicPortfolios } = await import('@/lib/publicApi');
        const [content, items] = await Promise.all([getPublicHomepageContent(), listPublicPortfolios()]);
        if (!active || currentRequest !== requestId) return;
        if (content) setHomepage(content);
        setPortfolios(items);
      } catch { /* Keep the current content if a refresh is temporarily unavailable. */ }
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

  const content = homepage ?? { id: 1, ...defaultHomepageContent, updated_at: '' };
  return (
    <>
      <HeroSection content={content} />
      <StatsSection content={content} />
      <HomeShowcase content={content} portfolios={portfolios} />
      <CTASection variant="compact" content={content} />
    </>
  );
}
