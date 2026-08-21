import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const stats = [
  { value: '500+', label: 'Projects Completed', suffix: '+' },
  { value: '12', label: 'Years Experience', suffix: 'th' },
  { value: '98%', label: 'Client Satisfaction', suffix: '' },
  { value: '24/7', label: 'Support Service', suffix: '' },
];

export default function StatsSection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section ref={ref} className="relative theme-section border-y border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="text-center lg:text-left"
          >
            <p className="text-4xl md:text-5xl font-bold text-orange-500 tracking-tight">
              {stat.value}
            </p>
            <p className="text-white/50 text-sm mt-2 tracking-wide">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
