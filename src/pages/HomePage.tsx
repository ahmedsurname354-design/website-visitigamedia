import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import CTASection from '@/components/CTASection';
import HomeShowcase from '@/components/HomeShowcase';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HomeShowcase />
      <CTASection variant="compact" />
    </>
  );
}
