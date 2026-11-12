import { ArrowRight, Check, Monitor, PanelsTopLeft, Layers3, Grid2x2Plus } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';
import type { HomepageContent, Portfolio } from '@/types/admin';
import { localizedPortfolio } from '@/lib/contentLocale';
import { responsiveImageSources } from '@/lib/imageUrl';

const serviceIcons = [Monitor, PanelsTopLeft, Layers3, Grid2x2Plus];

export default function HomeShowcase({ content, portfolios }: { content: HomepageContent; portfolios: Portfolio[] }) {
  const { ref: servicesRef, isInView: servicesInView } = useScrollReveal();
  const { lang } = useTranslation();
  const locale = lang === 'id' ? content.content_id : content.content_en;
  const projects = content.featured_portfolio_ids.map((id) => portfolios.find((item) => item.id === id)).filter((item): item is Portfolio => Boolean(item)).map((item) => localizedPortfolio(item, lang)).slice(0, 3);
  const visibleProjects = projects;

  return <>
    <section className="editorial-section" aria-labelledby="home-services-title"><div className="editorial-container"><div className="editorial-heading-row"><div><p className="editorial-eyebrow">{locale.services.sectionLabel}</p><h2 id="home-services-title" className="editorial-title">{locale.services.heading}</h2></div><Link to="/services" className="editorial-text-link">{locale.services.linkLabel} <ArrowRight /></Link></div><div ref={servicesRef} className={`service-preview-grid${servicesInView ? ' is-visible' : ''}`}>{locale.services.cards.map((service, index) => { const Icon = serviceIcons[index % serviceIcons.length]; return <article key={`${service.title}-${index}`} className="service-preview-card"><span className="service-preview-number">0{index + 1}</span><Icon aria-hidden="true" /><h3>{service.title}</h3><p>{service.description}</p><Link to="/services" aria-label={`${lang === 'id' ? 'Pelajari' : 'Learn about'} ${service.title}`}><ArrowRight /></Link></article>; })}</div></div></section>
    {visibleProjects.length > 0 && <section className="editorial-section editorial-section--dark content-section-lazy" aria-labelledby="home-work-title"><div className="editorial-container"><div className="editorial-heading-row"><div><p className="editorial-eyebrow">{lang === 'id' ? 'Portofolio' : 'Portfolio'}</p><h2 id="home-work-title" className="editorial-title">{lang === 'id' ? 'Teruji di panggung nyata.' : 'Proven on the real stage.'}</h2></div><Link to="/portfolio" className="editorial-text-link">{lang === 'id' ? 'Jelajahi portofolio' : 'Explore our work'} <ArrowRight /></Link></div><div className="featured-work-grid">{visibleProjects.map((project, index) => { const image = project.image_url; const sources = responsiveImageSources(image); return <Link key={`${project.title}-${index}`} to={`/portfolio/${project.slug}`} className={`featured-work-card featured-work-card--${index + 1}`}><img src={sources.src} srcSet={sources.srcSet} sizes="(min-width: 900px) 50vw, 86vw" width="900" height="675" alt={project.title} decoding="async" /><span className="featured-work-overlay" /><span className="featured-work-meta"><small>{project.category}</small><strong>{project.title}</strong></span></Link>; })}</div></div></section>}
    <section className="editorial-section editorial-story content-section-lazy" aria-labelledby="home-about-title"><div className="editorial-container editorial-story-grid">{content.about_image_url && <div className="editorial-story-image"><img src={content.about_image_url} width="800" height="1000" alt={lang === 'id' ? 'Tim Visitiga Media' : 'Visitiga Media team'} decoding="async" /><span>12+ <small>{lang === 'id' ? 'tahun pengalaman' : 'years of experience'}</small></span></div>}<div className="editorial-story-copy"><p className="editorial-eyebrow">{locale.about.sectionLabel}</p><h2 id="home-about-title" className="editorial-title">{locale.about.heading}</h2><p>{locale.about.subtitle}</p><div className="editorial-checks">{locale.about.features.map((feature) => <span key={feature}><Check />{feature}</span>)}</div><Link to="/about" className="editorial-button editorial-button--outline">{locale.about.buttonLabel} <ArrowRight /></Link></div></div></section>
  </>;
}
