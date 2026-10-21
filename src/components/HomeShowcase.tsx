import { ArrowRight, Check, Monitor, PanelsTopLeft, Layers3, Grid2x2Plus } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { useMotionPolicy } from '@/hooks/useMotionPolicy';
import { m as motion } from 'framer-motion';
import { useTranslation } from '@/i18n';
import teamPhoto from '@/assets/team-visitiga.webp';
import wonderfulIndonesia from '@/assets/clients/wonderful-indonesia.webp';
import pertamina from '@/assets/clients/pertamina.webp';
import motogp from '@/assets/clients/motogp.webp';
import ugm from '@/assets/clients/ugm.webp';
import mandalika from '@/assets/clients/mandalika.webp';
import iims from '@/assets/clients/iims.webp';
import type { HomepageContent, Portfolio } from '@/types/admin';

const serviceIcons = [Monitor, PanelsTopLeft, Layers3, Grid2x2Plus];
const fallbackProjects = [
  { image: '/portfolio/outdoor/outdoor-13.webp', fallbackImage: '/portfolio/outdoor/outdoor-13.jpg', title: 'Mandalika International Circuit', category: 'Outdoor LED', slug: '' },
  { image: '/portfolio/indoor/indoor-9.webp', fallbackImage: '/portfolio/indoor/indoor-9.jpg', title: 'Plaza Indonesia', category: 'Indoor Display', slug: '' },
  { image: '/portfolio/rental/rental-8.webp', fallbackImage: '/portfolio/rental/rental-8.jpg', title: 'MotoGP Mandalika 2025', category: 'Rental LED', slug: '' },
];
const clients = [wonderfulIndonesia, pertamina, motogp, ugm, mandalika, iims];

export default function HomeShowcase({ content, portfolios }: { content: HomepageContent; portfolios: Portfolio[] }) {
  const { reducedMotion } = useMotionPolicy();
  const { lang } = useTranslation();
  const locale = lang === 'id' ? content.content_id : content.content_en;
  const projects = content.featured_portfolio_ids.map((id) => portfolios.find((item) => item.id === id)).filter((item): item is Portfolio => Boolean(item)).slice(0, 3);
  const visibleProjects = projects.length > 0 ? projects : fallbackProjects;

  return <>
    <section className="editorial-section" aria-labelledby="home-services-title"><div className="editorial-container"><div className="editorial-heading-row"><div><p className="editorial-eyebrow">{locale.services.sectionLabel}</p><h2 id="home-services-title" className="editorial-title">{locale.services.heading}</h2></div><Link to="/services" className="editorial-text-link">{locale.services.linkLabel} <ArrowRight /></Link></div><div className="service-preview-grid">{locale.services.cards.map((service, index) => { const Icon = serviceIcons[index % serviceIcons.length]; return <motion.article key={`${service.title}-${index}`} initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={reducedMotion ? { opacity: 1, y: 0 } : undefined} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px 80px 0px', amount: 'some' }} transition={{ duration: reducedMotion ? 0 : .32, delay: reducedMotion ? 0 : index * .06 }} className="service-preview-card"><span className="service-preview-number">0{index + 1}</span><Icon aria-hidden="true" /><h3>{service.title}</h3><p>{service.description}</p><Link to="/services" aria-label={`${lang === 'id' ? 'Pelajari' : 'Learn about'} ${service.title}`}><ArrowRight /></Link></motion.article>; })}</div></div></section>
    <section className="editorial-section editorial-section--dark" aria-labelledby="home-work-title"><div className="editorial-container"><div className="editorial-heading-row"><div><p className="editorial-eyebrow">{lang === 'id' ? 'Portofolio' : 'Portfolio'}</p><h2 id="home-work-title" className="editorial-title">{lang === 'id' ? 'Teruji di panggung nyata.' : 'Proven on the real stage.'}</h2></div><Link to="/portfolio" className="editorial-text-link">{lang === 'id' ? 'Jelajahi portofolio' : 'Explore our work'} <ArrowRight /></Link></div><div className="featured-work-grid">{visibleProjects.map((project, index) => { const isPortfolio = 'image_url' in project; const image = isPortfolio ? project.image_url : project.image; const fallback = isPortfolio ? image : project.fallbackImage; const href = isPortfolio ? `/portfolio/${project.slug}` : '/portfolio'; return <Link key={`${project.title}-${index}`} to={href} className={`featured-work-card featured-work-card--${index + 1}`}><img src={image} onError={({ currentTarget }) => { currentTarget.onerror = null; currentTarget.src = fallback; }} alt={project.title} loading="lazy" decoding="async" /><span className="featured-work-overlay" /><span className="featured-work-meta"><small>{project.category}</small><strong>{project.title}</strong></span></Link>; })}</div></div></section>
    <section className="editorial-section editorial-story" aria-labelledby="home-about-title"><div className="editorial-container editorial-story-grid"><div className="editorial-story-image"><img src={content.about_image_url || teamPhoto} alt={lang === 'id' ? 'Tim Visitiga Media' : 'Visitiga Media team'} loading="lazy" decoding="async" /><span>12+ <small>{lang === 'id' ? 'tahun pengalaman' : 'years of experience'}</small></span></div><div className="editorial-story-copy"><p className="editorial-eyebrow">{locale.about.sectionLabel}</p><h2 id="home-about-title" className="editorial-title">{locale.about.heading}</h2><p>{locale.about.subtitle}</p><div className="editorial-checks">{locale.about.features.map((feature) => <span key={feature}><Check />{feature}</span>)}</div><Link to="/about" className="editorial-button editorial-button--outline">{locale.about.buttonLabel} <ArrowRight /></Link></div></div><div className="editorial-container client-proof"><p>{locale.about.clientProofLabel}</p><div>{clients.map((src, index) => <img key={src} src={src} alt="" aria-hidden="true" loading="lazy" className={index === 0 ? 'client-proof--wide' : ''} />)}</div></div></section>
  </>;
}
