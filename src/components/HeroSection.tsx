import { AnimatePresence, m as motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { useTranslation } from '@/i18n';
import type { HomepageContent, HomepageHeroSlide } from '@/types/admin';
import { useMotionPolicy } from '@/hooks/useMotionPolicy';

const AUTOPLAY_MS = 6000;
const fallbackSlides: HomepageHeroSlide[] = [
  { image_url: '/hero-1600.webp', alt: 'Tampilan LED Visitiga di malam hari' },
  { image_url: '/portfolio/indoor/indoor-9.webp', alt: 'Proyek LED indoor Visitiga' },
  { image_url: '/portfolio/rental/rental-8.webp', alt: 'Proyek rental LED Visitiga' },
  { image_url: '/portfolio/audiovisual/IMG_9584-scaled.webp', alt: 'Proyek audiovisual Visitiga' },
];

function normalizeSlides(content: HomepageContent): HomepageHeroSlide[] {
  const configured = content.hero_slides?.filter((slide) => slide?.image_url);
  if (configured?.length === 4) return configured;
  return fallbackSlides;
}

const fallbackCopies = {
  en: [
    { title: 'ADVERTISING', subtitle: 'By partnering with our clients to create what matters, we improve the human experience.', ctaLabel: 'CONTACT US' },
    { title: 'OUTDOOR LED', subtitle: 'Make your brand visible day and night with powerful visual communication.', ctaLabel: 'EXPLORE OUTDOOR' },
    { title: 'INDOOR EXPERIENCE', subtitle: 'Create sharper, more memorable spaces with premium indoor display solutions.', ctaLabel: 'SEE INDOOR SOLUTIONS' },
    { title: 'EVENT IMPACT', subtitle: 'Bring every event to life with reliable rental LED and audiovisual production.', ctaLabel: 'PLAN YOUR EVENT' },
  ],
  id: [
    { title: 'PERIKLANAN', subtitle: 'Dengan berpartner bersama klien untuk menciptakan hal yang berarti, kami meningkatkan pengalaman manusia.', ctaLabel: 'HUBUNGI KAMI' },
    { title: 'LED OUTDOOR', subtitle: 'Buat brand Anda terlihat siang dan malam melalui komunikasi visual yang kuat.', ctaLabel: 'LIHAT OUTDOOR' },
    { title: 'PENGALAMAN INDOOR', subtitle: 'Ciptakan ruang yang lebih tajam dan berkesan dengan solusi display indoor premium.', ctaLabel: 'LIHAT SOLUSI INDOOR' },
    { title: 'DAMPAK EVENT', subtitle: 'Hidupkan setiap acara dengan rental LED dan produksi audiovisual yang andal.', ctaLabel: 'RENCANAKAN EVENT' },
  ],
};

export default function HeroSection({ content }: { content: HomepageContent }) {
  const { lang } = useTranslation();
  const { reducedMotion } = useMotionPolicy();
  const slides = useMemo(() => normalizeSlides(content), [content]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => setActiveIndex((index + slides.length) % slides.length), [slides.length]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrevious = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const activeSlide = slides[activeIndex] ?? slides[0];
  const activeCopy = lang === 'id' ? activeSlide?.content_id : activeSlide?.content_en;
  const slideCopy = activeCopy ?? fallbackCopies[lang][activeIndex] ?? fallbackCopies[lang][0];

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return undefined;
    const timer = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [goNext, paused, reducedMotion, slides.length]);

  useEffect(() => setActiveIndex(0), [content]);

  return (
    <section
      id="home"
      className="hero-editorial hero-carousel theme-keep-light brand-surface-dark relative"
      aria-roledescription="carousel"
      aria-label={lang === 'id' ? 'Presentasi utama Visitiga' : 'Visitiga featured presentation'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
      onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start === null || end === undefined || Math.abs(end - start) < 45) return;
        if (end < start) goNext(); else goPrevious();
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); goNext(); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); goPrevious(); }
      }}
    >
      <div className="hero-carousel__slides">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return <motion.div key={`${slide.image_url}-${index}`} className="hero-carousel__slide absolute inset-0" initial={false} animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 1.02, x: isActive ? 0 : 8 }} transition={{ duration: reducedMotion ? 0 : .85, ease: [0.22, 1, 0.36, 1] }} aria-hidden={!isActive}>
            <img src={slide.image_url} alt={slide.alt ?? ''} width="1600" height="900" fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />
          </motion.div>;
        })}
      </div>
      <div className="hero-editorial__scrim absolute inset-0" />
      <div aria-hidden="true" className="hero-editorial__glow absolute inset-0 pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-[min(760px,calc(100vh-5rem))] w-full max-w-[1440px] flex-col justify-between px-5 pb-8 pt-32 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${activeIndex}-${slideCopy.title}`} className="max-w-3xl" initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, x: -18 }} transition={{ duration: reducedMotion ? 0 : .58, ease: [0.22, 1, 0.36, 1] }}>
            <motion.h1 initial={reducedMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .58, ease: [0.22, 1, 0.36, 1] }} className="hero-carousel__title">{slideCopy.title}</motion.h1>
            <motion.p initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .48, delay: reducedMotion ? 0 : .12, ease: [0.22, 1, 0.36, 1] }} className="mt-7 max-w-xl text-base leading-relaxed text-white/75 sm:mt-9 sm:text-lg">{slideCopy.subtitle}</motion.p>
            <motion.div initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .48, delay: reducedMotion ? 0 : .26, ease: [0.22, 1, 0.36, 1] }} className="mt-8">
              <Link to="/contact" className="editorial-button editorial-button--primary">{slideCopy.ctaLabel}<ArrowRight className="h-4 w-4" /></Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="hero-carousel__controls" aria-label={lang === 'id' ? 'Kontrol slideshow' : 'Slideshow controls'}>
          <div className="flex items-center gap-3">
            <button type="button" className="hero-carousel__arrow" onClick={goPrevious} aria-label={lang === 'id' ? 'Slide sebelumnya' : 'Previous slide'}><ChevronLeft /></button>
            <button type="button" className="hero-carousel__arrow" onClick={goNext} aria-label={lang === 'id' ? 'Slide berikutnya' : 'Next slide'}><ChevronRight /></button>
          </div>
          <div className="hero-carousel__pagination" role="tablist" aria-label={lang === 'id' ? 'Pilih slide' : 'Choose slide'}>
            {slides.map((slide, index) => <button key={`${slide.image_url}-dot`} type="button" role="tab" aria-selected={index === activeIndex} aria-label={`${lang === 'id' ? 'Slide' : 'Slide'} ${index + 1}`} className={index === activeIndex ? 'is-active' : ''} onClick={() => goTo(index)}><span /></button>)}
          </div>
          <p className="hero-carousel__count"><strong>0{activeIndex + 1}</strong> / 0{slides.length}</p>
        </div>
      </div>
      <div className="sr-only" aria-live="polite">{lang === 'id' ? `Slide ${activeIndex + 1} dari ${slides.length}` : `Slide ${activeIndex + 1} of ${slides.length}`}</div>
    </section>
  );
}
