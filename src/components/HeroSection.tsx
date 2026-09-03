import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { preloadPublicRoute } from '@/lib/publicRoutes';

const heroImg = '/hero-1600.webp';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section id="home" className="hero-editorial theme-keep-light relative flex min-h-[100svh] items-end overflow-hidden bg-black sm:min-h-[92svh]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          srcSet="/hero-640.webp 640w, /hero-960.webp 960w, /hero-1600.webp 1600w"
          sizes="100vw"
          alt="Tampilan LED di kota pada malam hari"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-[68%_center] sm:object-center"
        />
        <div className="hero-editorial__scrim absolute inset-0" />
      </div>

      {/* Floating glow orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-12 pt-32 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="max-w-4xl">
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="hero-editorial__eyebrow"><span /> VISUAL TECHNOLOGY · INDONESIA</motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.05 }}
            className="hero-editorial__title text-white font-semibold text-[clamp(2.75rem,8vw,6.75rem)] leading-[.94] tracking-[-0.06em]"
          >
            {t('hero.titleLine1')} <span className="text-orange-500">{t('hero.titleLine2')}</span> <br />
            {t('hero.titleLine3')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.1 }}
            className="text-white/70 text-base sm:text-lg mt-6 sm:mt-8 max-w-2xl leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.15 }}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }} className="hero-editorial__trust"><ShieldCheck /><span>{t('hero.trustNotice')}</span></motion.div>
        </div>
      </div>

    </section>
  );
}
