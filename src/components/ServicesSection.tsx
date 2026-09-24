import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Monitor, PanelsTopLeft, Layers3, Grid2x2Plus, ArrowRight, MessageCircle } from 'lucide-react';
import { useTranslation } from '@/i18n';
import type { ServiceContent } from '@/types/admin';
import { Link } from 'react-router-dom';

const servicePaths = ['/services/videotron-outdoor/', '/services/led-indoor/', '/services/rental-led/', '/services/media-konvensional/'];

export default function ServicesSection({ content }: { content?: ServiceContent | null }) {
  const { ref, isInView, reducedMotion } = useScrollReveal();
  const { dict, lang } = useTranslation();
  const services = (content?.cards ?? dict.services.cards).map((card, index) => ({
    ...card,
    desc: 'desc' in card ? card.desc : card.description,
    icon: [Monitor, PanelsTopLeft, Layers3, Grid2x2Plus][index],
  }));

  return (
    <section id="services" className="relative theme-section py-24 md:py-32">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0 : 0.32 }}
          className="max-w-2xl mb-10 sm:mb-16"
        >
          <p className="text-orange-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">{content?.eyebrow ?? dict.services.sectionLabel}</p>
          <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight tracking-tight">
            {content?.heading ?? (lang === 'id' ? 'Solusi LED Terbaik' : 'The Best LED Solutions')} <br />
            <span className="text-orange-500">{content?.heading_accent ?? (lang === 'id' ? 'untuk Setiap Kebutuhan' : 'for Every Need')}</span>
          </h1>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : i * 0.06 }}
              className="group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:bg-white/10"
            >
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-orange-500/0 transition-all duration-500 group-hover:bg-orange-500/10 blur-3xl" />
              <div className="relative flex h-full flex-col">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500 transition-all duration-300 group-hover:bg-orange-500">
                  <service.icon className="h-7 w-7 transition-colors duration-300 group-hover:text-[#211c18]" />
                </div>
                <h3 className="text-white font-semibold text-2xl uppercase mb-4 leading-tight">{service.title}</h3>
                <p className="text-white/70 text-sm leading-7">{service.desc}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:flex-wrap">
                  <Link to={servicePaths[i]} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-current/20 px-4 py-2.5 text-sm font-semibold text-current transition hover:border-orange-500 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
                    {lang === 'id' ? 'Pelajari layanan' : 'Explore service'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="https://bit.ly/49NclAE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brand-button inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {service.action}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
