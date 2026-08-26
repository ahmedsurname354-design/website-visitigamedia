import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { useTranslation } from '@/i18n';

const heroImg = 'https://images.pexels.com/photos/38833542/pexels-photo-38833542.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section id="home" className="theme-keep-light relative flex min-h-[82svh] items-center overflow-hidden bg-white sm:min-h-[88svh]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          srcSet={`${heroImg}&w=768&dpr=1 768w, ${heroImg} 1260w`}
          sizes="100vw"
          alt="Tampilan LED di kota pada malam hari"
          fetchPriority="high"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-24">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-white font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
          >
            {t('hero.titleLine1')} <span className="text-orange-500">{t('hero.titleLine2')}</span> <br />
            {t('hero.titleLine3')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-white/70 text-lg md:text-xl mt-6 max-w-xl leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="flex flex-wrap items-center gap-4 mt-10"
          >
            <Link
              to="/services"
              className="group flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-7 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5"
            >
              {t('hero.viewServices')}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/portfolio"
              className="group flex items-center gap-3 text-white hover:text-orange-500 px-5 py-4 font-medium transition-colors duration-300"
            >
              <span className="w-12 h-12 rounded-full border border-white/30 group-hover:border-orange-500 flex items-center justify-center transition-colors duration-300">
                <Play className="w-4 h-4 fill-current" />
              </span>
              {t('hero.viewPortfolio')}
            </Link>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
