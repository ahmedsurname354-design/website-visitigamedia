import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Check, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n';
import ValuePropositionSection from '@/components/ValuePropositionSection';
import type { AboutLocaleContent } from '@/types/admin';

const features = [
  'Panel LED berkualitas premium',
  'Tim instalasi bersertifikat',
  'Desain sesuai kebutuhan',
  'Dukungan purnajual',
];


export default function AboutSection({ valueContent }: { valueContent: AboutLocaleContent }) {
  const { ref, isInView, reducedMotion } = useScrollReveal();
  const { t } = useTranslation();

  return (
    <section id="about" className="relative theme-section overflow-hidden">
      <div className="mx-auto grid max-w-[1536px] items-center gap-10 px-4 py-16 sm:gap-16 sm:px-6 sm:py-24 md:py-32 lg:grid-cols-2 lg:px-8 xl:gap-24">
        {/* Content */}
        <div ref={ref} className="lg:col-span-2">
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.06 }}
            className="text-orange-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4"
          >
            {t('about.sectionLabel')}
          </motion.p>
          <motion.h1
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.06 }}
            className="text-white font-bold text-4xl md:text-5xl leading-tight tracking-tight mb-6"
          >
            {t('about.headingPrefix')}<span className="inline-block whitespace-nowrap text-orange-500">{t('about.headingAccent')}</span>
          </motion.h1>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.06 }}
            className="text-white/60 text-lg leading-relaxed mb-8"
          >
            {t('about.subtitle')}
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {features.map((feat, i) => (
              <motion.div
                key={feat}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : i * 0.06 }}
                className="flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-orange-500" />
                </span>
                <span className="text-white/80 text-sm">{t(`about.features.${i}`)}</span>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="/contact"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.06 }}
            className="group inline-flex items-center gap-2 bg-white/10 hover:bg-orange-500 text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
          >
            {t('about.contactButton')}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
        </div>
      </div>

      <ValuePropositionSection content={valueContent} />

    </section>
  );
}
