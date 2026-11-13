import { BadgeCheck, HardHat, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';

const certifications = ['ISO 37001', 'ISO 9001', 'ISO 45001'];

export default function InstallationAreaSection() {
  const { ref, isInView, reducedMotion } = useScrollReveal();
  const { t } = useTranslation();
  const reveal = (delay = 0) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 18 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : delay },
  });

  return (
    <section ref={ref} className="installation-area" aria-labelledby="installation-area-title">
      <div className="installation-area__inner">
        <div className="installation-area__highlights">
          <motion.article {...reveal(0)} className="installation-highlight">
            <span className="installation-highlight__icon"><HardHat aria-hidden="true" /></span>
            <div>
              <p className="installation-highlight__eyebrow">{t('about.installation.experienceEyebrow')}</p>
              <h3>{t('about.installation.experience')}</h3>
            </div>
          </motion.article>
          <motion.article {...reveal(0.08)} className="installation-highlight">
            <span className="installation-highlight__icon"><BadgeCheck aria-hidden="true" /></span>
            <div>
              <p className="installation-highlight__eyebrow">{t('about.installation.certificationEyebrow')}</p>
              <h3>{t('about.installation.certification')}</h3>
            </div>
          </motion.article>
        </div>

        <motion.div {...reveal(0.14)} className="installation-area__certifications" aria-label={t('about.installation.certificationEyebrow')}>
          {certifications.map((certification) => (
            <div className="iso-badge" key={certification}>
              <span className="iso-badge__ring"><BadgeCheck aria-hidden="true" /></span>
              <strong>{certification}</strong>
            </div>
          ))}
        </motion.div>

        <motion.div {...reveal(0.2)} className="installation-area__heading">
          <p className="installation-area__eyebrow">{t('about.installation.eyebrow')}</p>
          <h2 id="installation-area-title">{t('about.installation.title')}</h2>
        </motion.div>

        <motion.div {...reveal(0.26)} className="installation-map-wrap">
          <figure className="installation-map-figure">
            <img
              className="installation-map"
              src="/installation-area-map.png"
              alt={t('about.installation.mapDescription')}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="installation-map__legend"><MapPin aria-hidden="true" /> <span>{t('about.installation.mapLegend')}</span></figcaption>
          </figure>
        </motion.div>

        <div className="installation-area__offices">
          <motion.div {...reveal(0.32)} className="installation-office">
            <p className="installation-office__label">{t('about.installation.headOfficeLabel')}</p>
            <h3>{t('about.installation.headOffice')}</h3>
          </motion.div>
          <motion.div {...reveal(0.38)} className="installation-office">
            <p className="installation-office__label">{t('about.installation.branchOfficeLabel')}</p>
            <h3>{t('about.installation.branchOffice')}</h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
