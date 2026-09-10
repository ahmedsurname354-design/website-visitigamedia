import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, m as motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useMotionPolicy } from '@/hooks/useMotionPolicy';

export default function FAQPage() {
  const { dict } = useTranslation();
  const { reducedMotion } = useMotionPolicy();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const idPrefix = useId().replace(/:/g, '');

  return (
    <section className="faq-page editorial-section">
      <div className="editorial-container">
        <motion.header
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.32 }}
          className="faq-page__header"
        >
          <p className="editorial-eyebrow">{dict.faq.eyebrow}</p>
          <h1 className="editorial-title">{dict.faq.title}</h1>
          <p className="faq-page__introduction">{dict.faq.introduction}</p>
        </motion.header>

        <div className="faq-list">
          {dict.faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `${idPrefix}-faq-button-${index}`;
            const panelId = `${idPrefix}-faq-panel-${index}`;

            return (
              <motion.article
                key={item.question}
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.28, delay: reducedMotion ? 0 : index * 0.025 }}
                className={`faq-item${isOpen ? ' is-open' : ''}`}
              >
                <h2>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="faq-item__button"
                  >
                    <span className="faq-item__number">{String(index + 1).padStart(2, '0')}</span>
                    <span>{item.question}</span>
                    <ChevronDown aria-hidden="true" />
                  </button>
                </h2>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={reducedMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.22 }}
                      className="faq-item__panel"
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

        <div className="faq-cta">
          <div>
            <p className="editorial-eyebrow">Visitiga Media</p>
            <h2>{dict.faq.ctaTitle}</h2>
            <p>{dict.faq.ctaDescription}</p>
          </div>
          <div className="faq-cta__actions">
            <a
              href="https://bit.ly/49NclAE"
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-button editorial-button--primary"
            >
              <MessageCircle aria-hidden="true" />
              {dict.faq.whatsapp}
            </a>
            <Link to="/contact" className="editorial-button editorial-button--outline">
              {dict.faq.contact}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
