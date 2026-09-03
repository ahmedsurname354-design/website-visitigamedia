import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';

export default function StatsSection() {
  const { ref, isInView } = useScrollReveal();
  const { dict } = useTranslation();

  return (
    <section ref={ref} className="stats-editorial relative border-y py-10 sm:py-12">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
        {dict.stats.data.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12 }}
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
