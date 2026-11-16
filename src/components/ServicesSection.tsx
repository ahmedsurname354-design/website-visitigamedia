import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowRight, MessageCircle } from 'lucide-react';
import type { ServiceContent } from '@/types/admin';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { serviceIcons, servicePaths } from '@/lib/serviceConfig';

export default function ServicesSection({ content }: { content: ServiceContent }) {
  const { ref, isInView, reducedMotion } = useScrollReveal();
  const services = content.cards.slice(0, 6).map((card, index) => ({ ...card, icon: serviceIcons[index] }));

  return (
    <section id="services" className="services-section theme-section">
      <div className="services-section__inner">
        <motion.div
          ref={ref}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0 : 0.32 }}
          className="services-section__heading"
        >
          <p className="services-section__eyebrow">{content.eyebrow}</p>
          <h1>
            {content.heading} <br />
            <span>{content.heading_accent}</span>
          </h1>
        </motion.div>

        <div className="services-card-grid">
          {services.map((service, i) => (
            <motion.article
              key={service.title}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : i * 0.06 }}
              className="services-card"
            >
              <div className="services-card__icon"><service.icon aria-hidden="true" /></div>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <div className="services-card__tags">
                  {service.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              <div className="services-card__actions">
                  <Link to={servicePaths[i]} className="services-card__learn">
                    Pelajari layanan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="https://bit.ly/49NclAE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brand-button services-card__consult"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {service.action}
                  </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
