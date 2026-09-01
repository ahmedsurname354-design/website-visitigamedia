import { lazy, Suspense } from 'react';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';

const CTASection = lazy(() => import('@/components/CTASection'));

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <Suspense fallback={null}>
        <CTASection />
      </Suspense>
    </>
  );
}
