import { motion } from 'framer-motion';
import { Handshake, Layers3, ShieldCheck, Sprout } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { AboutLocaleContent } from '@/types/admin';

const icons = [Sprout, Handshake, Layers3, ShieldCheck];

export default function ValuePropositionSection({ content }: { content: AboutLocaleContent }) {
  const { ref, isInView, reducedMotion } = useScrollReveal();
  return (
    <section ref={ref} className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-labelledby="value-proposition-title">
      <div className="mx-auto max-w-[1280px]">
        <motion.div initial={reducedMotion ? false : { opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: reducedMotion ? 0 : 0.35 }} className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-orange-600">{content.eyebrow}</p>
          <h2 id="value-proposition-title" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{content.title}</h2>
          <span className="mt-5 block h-1 w-16 rounded-full bg-orange-500" aria-hidden="true" />
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2">
          {content.items.slice(0, 4).map((item, index) => {
            const Icon = icons[index];
            return <motion.article key={`${item.title}-${index}`} initial={reducedMotion ? false : { opacity: 0, y: 16 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: reducedMotion ? 0 : 0.35, delay: reducedMotion ? 0 : index * 0.06 }} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition-colors duration-300 hover:border-orange-300 hover:bg-orange-50 sm:p-6">
              <div className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20"><Icon className="size-5" aria-hidden="true" /></span>
                <div><h3 className="text-xl font-bold text-slate-900">{item.title}</h3><p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p></div>
              </div>
            </motion.article>;
          })}
        </div>
      </div>
    </section>
  );
}
