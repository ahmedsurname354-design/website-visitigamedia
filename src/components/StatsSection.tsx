import { m as motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';

export default function StatsSection() {
  const { ref, isInView, reducedMotion } = useScrollReveal();
  const { dict } = useTranslation();

  return (
    <section ref={ref} className="stats-editorial relative border-y py-10 sm:py-12">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
        {dict.stats.data.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : i * 0.06 }}
            className="stats-editorial__item text-left px-3 py-5 sm:px-6 lg:px-8"
          >
            <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-orange-500 tracking-[-.05em]">
              {stat.value}
            </p>
            <p className="text-white/50 text-sm mt-2 tracking-wide">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
