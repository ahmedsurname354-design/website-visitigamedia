import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface VisionMissionSectionProps {
  visionTitle: string;
  missionTitle: string;
}

export default function VisionMissionSection({ visionTitle, missionTitle }: VisionMissionSectionProps) {
  const { ref, isInView, reducedMotion } = useScrollReveal();
  const cards = [
    { label: 'Our vision', title: visionTitle },
    { label: 'Our mission', title: missionTitle },
  ];

  return (
    <section ref={ref} className="vision-mission" aria-labelledby="vision-mission-title">
      <div className="vision-mission__inner">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0 : 0.35 }}
          className="vision-mission__heading"
        >
          <p className="vision-mission__eyebrow">Our direction</p>
          <h2 id="vision-mission-title">Purpose behind every solution.</h2>
        </motion.div>
        <div className="vision-mission__grid">
          {cards.map((card, index) => (
            <motion.article
              key={card.label}
              initial={reducedMotion ? false : { opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: reducedMotion ? 0 : 0.35, delay: reducedMotion ? 0 : index * 0.08 }}
              className="vision-mission__card"
            >
              <p className="vision-mission__label">{card.label}</p>
              <h3>{card.title}</h3>
              <span className="vision-mission__rule" aria-hidden="true" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
