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
    void import('@/lib/adminApi').then(({ getPublicHomepageContent, listPublicPortfolios }) => Promise.all([getPublicHomepageContent(), listPublicPortfolios()])).then(([content, items]) => {
      if (content) setHomepage(content);
      setPortfolios(items);
    }).catch(() => undefined);
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
