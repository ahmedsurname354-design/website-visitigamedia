import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';

type CoreValue = {
  value: string;
  title: string;
  description: string;
};

const values = {
  en: {
    eyebrow: 'Our core values',
    title: 'Our Core Values: PILAR',
    subtitle: 'The five foundational principles that guide how we engineer, collaborate, and deliver excellence.',
    items: [
      { value: 'Pillar', title: 'Built on a Solid Foundation', description: 'We approach every project with rigorous planning and technical precision, ensuring reliable, long-lasting results you can depend on.' },
      { value: 'Integrity', title: 'Uncompromising Transparency', description: 'Trust is earned through honesty. We uphold clear communication, accurate specifications, and full accountability at every stage.' },
      { value: 'Leadership', title: 'Innovation & Ownership', description: 'We lead by example, taking proactive responsibility for challenges and continuously adopting better technologies to set industry benchmarks.' },
      { value: 'Attainability', title: 'Practical, Measurable Results', description: 'We believe in realistic commitments. Every solution is tailored to your exact objectives, budget, and timeline, delivered without empty promises.' },
      { value: 'Respect', title: 'Mutual Trust & Professionalism', description: 'We value every client, partner, and team member, fostering collaborative partnerships grounded in workplace safety and mutual respect.' },
    ],
  },
  id: {
    eyebrow: 'Nilai inti kami',
    title: 'Nilai Inti Kami: PILAR',
    subtitle: 'Lima prinsip dasar yang memandu cara kami merancang, berkolaborasi, dan menghadirkan hasil terbaik.',
    items: [
      { value: 'Pilar', title: 'Dibangun di Atas Fondasi yang Kuat', description: 'Kami mengerjakan setiap proyek dengan perencanaan yang matang dan ketelitian teknis, untuk memastikan hasil yang andal dan bertahan lama.' },
      { value: 'Integritas', title: 'Transparansi Tanpa Kompromi', description: 'Kepercayaan dibangun melalui kejujuran. Kami menjaga komunikasi yang jelas, spesifikasi yang akurat, dan tanggung jawab penuh di setiap tahap.' },
      { value: 'Kepemimpinan', title: 'Inovasi & Tanggung Jawab', description: 'Kami memberi contoh, mengambil tanggung jawab secara proaktif, dan terus mengadopsi teknologi yang lebih baik untuk mencapai standar industri.' },
      { value: 'Ketercapaian', title: 'Hasil Praktis dan Terukur', description: 'Kami percaya pada komitmen yang realistis. Setiap solusi disesuaikan dengan tujuan, anggaran, dan jadwal Anda, tanpa janji yang berlebihan.' },
      { value: 'Rasa Hormat', title: 'Saling Percaya & Profesionalisme', description: 'Kami menghargai setiap klien, mitra, dan anggota tim, serta membangun kolaborasi yang berlandaskan keselamatan kerja dan rasa saling menghormati.' },
    ],
  },
} satisfies Record<'en' | 'id', { eyebrow: string; title: string; subtitle: string; items: CoreValue[] }>;

export default function CoreValuesSection() {
  const { ref, isInView, reducedMotion } = useScrollReveal();
  const { lang } = useTranslation();
  const content = values[lang];

  return (
    <section ref={ref} className="core-values-section" aria-labelledby="core-values-title">
      <div className="core-values-section__inner">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0 : 0.35 }}
          className="core-values-section__heading"
        >
          <p className="core-values-section__eyebrow">{content.eyebrow}</p>
          <h2 id="core-values-title">{content.title}</h2>
          <p className="core-values-section__subtitle">{content.subtitle}</p>
        </motion.div>

        <div className="core-values-section__grid">
          {content.items.map((item, index) => (
            <motion.article
              key={item.value}
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: reducedMotion ? 0 : 0.35, delay: reducedMotion ? 0 : index * 0.05 }}
              className="core-values-section__row"
            >
              <span className="core-values-section__number">0{index + 1}</span>
              <h3 className="core-values-section__value">{item.value}</h3>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
