import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Monitor, PanelsTopLeft, Layers3, Grid2x2Plus, ArrowUpRight } from 'lucide-react';
import { useTranslation } from '@/i18n';
import type { ServiceContent } from '@/types/admin';

export default function ServicesSection({ content }: { content?: ServiceContent | null }) {
  const { ref, isInView } = useScrollReveal();
  const { dict } = useTranslation();
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
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-10 sm:mb-16"
        >
          <p className="text-orange-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">{content?.eyebrow ?? 'Layanan Kami'}</p>
          <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight tracking-tight">
            {content?.heading ?? 'Solusi LED Terbaik'} <br />
            <span className="text-orange-500">{content?.heading_accent ?? 'untuk Setiap Kebutuhan'}</span>
          </h1>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:bg-white/10"
            >
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-orange-500/0 transition-all duration-500 group-hover:bg-orange-500/10 blur-3xl" />
              <div className="relative">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-500/10 text-orange-500 transition-all duration-300 group-hover:bg-orange-500">
                  <service.icon className="h-7 w-7 transition-colors duration-300 group-hover:text-white" />
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
                <a
                  href="https://bit.ly/49NclAE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 text-orange-500 text-sm font-semibold transition-all duration-300 hover:gap-3"
                >
                  {service.action}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
