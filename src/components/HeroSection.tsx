import { useRef, type RefObject, type ReactNode } from 'react';
import { m as motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { preloadPublicRoute } from '@/lib/publicRoutes';

import { useMotionPolicy } from '@/hooks/useMotionPolicy';

const heroImg = '/hero-1600.webp';

export default function HeroSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const { reducedMotion, parallax } = useMotionPolicy();

  return (
    <section ref={sectionRef} id="home" className="hero-editorial theme-keep-light relative bg-black">
      <div className="hero-editorial__stage">
        {/* Background image */}
        <HeroBackground sectionRef={sectionRef} parallax={parallax}>
          <img
            src={heroImg}
            srcSet="/hero-640.webp 640w, /hero-960.webp 960w, /hero-1600.webp 1600w"
            sizes="100vw"
            alt="Tampilan LED di kota pada malam hari"
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-[68%_center] sm:object-center"
          />
        </HeroBackground>
        <div className="hero-editorial__scrim absolute inset-0" />

        <div aria-hidden="true" className="hero-editorial__glow absolute inset-0 pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-12 pt-32 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
          <div className="max-w-4xl">
            <div>
              <motion.p initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="hero-editorial__eyebrow"><span /> VISUAL TECHNOLOGY · INDONESIA</motion.p>
              <h1
                className="hero-editorial__title text-white font-semibold text-[clamp(2.75rem,7vw,5.5rem)] leading-[.94] tracking-[-0.06em]"
              >
                {t('hero.titleLine1')} <span className="text-orange-500">{t('hero.titleLine2')}</span> <br />
                {t('hero.titleLine3')}
              </h1>
            </div>

            <div>
              <motion.p
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.06 }}
                className="text-white/70 text-base sm:text-lg mt-6 sm:mt-8 max-w-2xl leading-relaxed"
              >
                {t('hero.subtitle')}
              </motion.p>

              <motion.div
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.12 }}
                className="flex flex-col items-stretch gap-3 mt-8 min-[420px]:flex-row min-[420px]:items-center sm:mt-10"
              >
                <Link
                  to="/services"
                  onPointerEnter={() => void preloadPublicRoute('/services')}
                  onFocus={() => void preloadPublicRoute('/services')}
                  onTouchStart={() => void preloadPublicRoute('/services')}
                  className="editorial-button editorial-button--primary"
                >
                  {t('hero.viewServices')}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/portfolio"
                  onPointerEnter={() => void preloadPublicRoute('/portfolio')}
                  onFocus={() => void preloadPublicRoute('/portfolio')}
                  onTouchStart={() => void preloadPublicRoute('/portfolio')}
                  className="editorial-button editorial-button--ghost"
                >
                  <span className="w-12 h-12 rounded-full border border-white/30 group-hover:border-orange-500 flex items-center justify-center transition-colors duration-300">
                    <Play className="w-4 h-4 fill-current" />
                  </span>
                  {t('hero.viewPortfolio')}
                </Link>
              </motion.div>
              <motion.div initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.18 }} className="hero-editorial__trust"><ShieldCheck /><span>{t('hero.trustNotice')}</span></motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBackground({ sectionRef, parallax, children }: { sectionRef: RefObject<HTMLElement>; parallax: boolean; children: ReactNode }) {
  return parallax ? <ParallaxBackground sectionRef={sectionRef}>{children}</ParallaxBackground> : <div className="absolute inset-0">{children}</div>;
}

// Mount the scroll subscription only while desktop motion is enabled.
function ParallaxBackground({ sectionRef, children }: { sectionRef: RefObject<HTMLElement>; children: ReactNode }) {
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-3%']);
  return <motion.div className="absolute inset-0" style={{ y, scale: 1.08 }}>{children}</motion.div>;
}
