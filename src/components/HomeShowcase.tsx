import { ArrowRight, Check, Monitor, PanelsTopLeft, Layers3, Grid2x2Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '@/i18n';
import teamPhoto from '@/assets/team-visitiga.webp';
import wonderfulIndonesia from '@/assets/clients/wonderful-indonesia.webp';
import pertamina from '@/assets/clients/pertamina.webp';
import motogp from '@/assets/clients/motogp.webp';
import ugm from '@/assets/clients/ugm.webp';
import mandalika from '@/assets/clients/mandalika.webp';
import iims from '@/assets/clients/iims.webp';

const serviceIcons = [Monitor, PanelsTopLeft, Layers3, Grid2x2Plus];
const projects = [
  { image: '/portfolio/outdoor/outdoor-13.webp', title: 'Mandalika International Circuit', category: 'Outdoor LED' },
  { image: '/portfolio/indoor-9.webp', title: 'Plaza Indonesia', category: 'Indoor Display' },
  { image: '/portfolio/rental/rental-8.webp', title: 'MotoGP Mandalika 2025', category: 'Rental LED' },
];
const clients = [wonderfulIndonesia, pertamina, motogp, ugm, mandalika, iims];

export default function HomeShowcase() {
  const { dict, lang } = useTranslation();
  const id = lang === 'id';

  return (
    <>
      <section className="editorial-section" aria-labelledby="home-services-title">
        <div className="editorial-container">
          <div className="editorial-heading-row">
            <div>
              <p className="editorial-eyebrow">{dict.services.sectionLabel}</p>
              <h2 id="home-services-title" className="editorial-title">{id ? 'Solusi visual untuk setiap ruang.' : 'Visual solutions for every space.'}</h2>
            </div>
            <Link to="/services" className="editorial-text-link">{id ? 'Lihat semua layanan' : 'Explore all services'} <ArrowRight /></Link>
          </div>
          <div className="service-preview-grid">
            {dict.services.cards.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <motion.article key={service.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .06 }} className="service-preview-card">
                  <span className="service-preview-number">0{index + 1}</span>
                  <Icon aria-hidden="true" />
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <Link to="/services" aria-label={`${id ? 'Pelajari' : 'Learn about'} ${service.title}`}><ArrowRight /></Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-section--dark" aria-labelledby="home-work-title">
        <div className="editorial-container">
          <div className="editorial-heading-row">
            <div>
              <p className="editorial-eyebrow">{dict.portfolio.sectionLabel}</p>
              <h2 id="home-work-title" className="editorial-title">{id ? 'Teruji di panggung nyata.' : 'Proven on the real stage.'}</h2>
            </div>
            <Link to="/portfolio" className="editorial-text-link">{id ? 'Jelajahi portofolio' : 'Explore our work'} <ArrowRight /></Link>
          </div>
          <div className="featured-work-grid">
            {projects.map((project, index) => (
              <Link key={project.title} to="/portfolio" className={`featured-work-card featured-work-card--${index + 1}`}>
                <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
                <span className="featured-work-overlay" />
                <span className="featured-work-meta"><small>{project.category}</small><strong>{project.title}</strong></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section editorial-story" aria-labelledby="home-about-title">
        <div className="editorial-container editorial-story-grid">
          <div className="editorial-story-image"><img src={teamPhoto} alt={id ? 'Tim Visitiga Media' : 'Visitiga Media team'} loading="lazy" decoding="async" /><span>12+ <small>{id ? 'tahun pengalaman' : 'years of experience'}</small></span></div>
          <div className="editorial-story-copy">
            <p className="editorial-eyebrow">{dict.about.sectionLabel}</p>
            <h2 id="home-about-title" className="editorial-title">{id ? 'Partner yang memahami dampak sebuah tampilan.' : 'A partner who understands the impact of every display.'}</h2>
            <p>{dict.about.subtitle}</p>
            <div className="editorial-checks">{dict.about.features.map((feature) => <span key={feature}><Check />{feature}</span>)}</div>
            <Link to="/about" className="editorial-button editorial-button--outline">{id ? 'Tentang Visitiga' : 'About Visitiga'} <ArrowRight /></Link>
          </div>
        </div>
        <div className="editorial-container client-proof">
          <p>{id ? 'Dipercaya oleh brand dan institusi terkemuka' : 'Trusted by leading brands and institutions'}</p>
          <div>{clients.map((src, index) => <img key={src} src={src} alt="" aria-hidden="true" loading="lazy" className={index === 0 ? 'client-proof--wide' : ''} />)}</div>
        </div>
      </section>
    </>
  );
}
