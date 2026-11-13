import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { AboutProcessItem } from '@/types/admin';

interface ProcessSectionProps {
  eyebrow: string;
  title: string;
  process: AboutProcessItem[];
}

export default function ProcessSection({ eyebrow, title, process }: ProcessSectionProps) {
  const { ref, reducedMotion } = useScrollReveal();

  return (
    <section className="process-section" aria-labelledby="process-section-title">
      <div ref={ref} className="process-section__inner">
        <div className="process-section__heading">
          <p className="process-section__eyebrow">{eyebrow}</p>
          <h2 id="process-section-title">{title}</h2>
        </div>
        <div className="process-section__grid">
          {process.slice(0, 5).map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: reducedMotion ? 0 : 0.35, delay: reducedMotion ? 0 : index * 0.05 }}
              className="process-section__card"
            >
              <span className="process-section__number">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
