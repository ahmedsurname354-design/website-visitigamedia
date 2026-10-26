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
  const [homepage, setHomepage] = useState<HomepageContent | null>(initial?.homepage ?? null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initial?.portfolios ?? []);

  useEffect(() => {
    let active = true;
    let requestId = 0;
    const load = async () => {
      const currentRequest = ++requestId;
      try {
        const { getPublicHomepageContent, listPublicPortfolios } = await import('@/lib/adminApi');
        const [content, items] = await Promise.all([getPublicHomepageContent(), listPublicPortfolios()]);
        if (!active || currentRequest !== requestId) return;
        if (content) setHomepage(content);
        setPortfolios(items);
      } catch { /* Keep the current content if a refresh is temporarily unavailable. */ }
    };
    const refreshWhenVisible = () => { if (document.visibilityState === 'visible') void load(); };
    void load();
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      active = false;
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

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
