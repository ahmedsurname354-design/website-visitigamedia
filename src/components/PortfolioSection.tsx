import { useEffect, useMemo, useState } from 'react';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import { useTranslation } from '@/i18n';
import { listPublicPortfolios } from '@/lib/adminApi';
import { getPrerenderData } from '@/lib/prerenderData';
import { optimizedImageUrl, restoreOriginalImage } from '@/lib/imageUrl';
import type { Portfolio } from '@/types/admin';

export default function PortfolioSection() {
  const { lang } = useTranslation();
  const [projects, setProjects] = useState<Portfolio[]>(getPrerenderData()?.portfolios ?? []);
  const [category, setCategory] = useState('Lihat semua');
  const [error, setError] = useState(false);
  useEffect(() => { let active = true; void listPublicPortfolios().then((data) => { if (active) { setProjects(data); setError(false); } }).catch(() => { if (active) setError(true); }); return () => { active = false; }; }, []);
  const categories = useMemo(() => ['Lihat semua', ...new Set(projects.map((project) => project.category))], [projects]);
  const filtered = category === 'Lihat semua' ? projects : projects.filter((project) => project.category === category);
  return <div>
    <section id="portfolio" className="theme-section-alt public-surface-alt px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1536px]">
      <p className="text-xs font-semibold uppercase text-orange-600">Karya Kami</p>
      <h1 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">{lang === 'en' ? 'Projects' : 'Proyek'}</h1>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">{categories.map((name) => <button key={name} type="button" onClick={() => setCategory(name)} aria-pressed={category === name} className={`rounded-full border px-4 py-2 text-sm font-medium ${category === name ? 'border-orange-600 bg-orange-600 text-white' : 'public-card border-neutral-300 bg-white text-neutral-700 hover:border-orange-500'}`}>{name}</button>)}</div>
      {error && !projects.length && <p role="alert" className="mt-8 text-sm text-red-700">Portofolio belum dapat dimuat. Silakan coba lagi.</p>}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{filtered.map((project) => <Link key={project.id} to={`/portfolio/${project.slug}/`} className="brand-surface-dark public-dark group relative block aspect-[4/3] overflow-hidden rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"><img src={optimizedImageUrl(project.image_url, 900)} onError={({ currentTarget }) => restoreOriginalImage(currentTarget, project.image_url)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-5 text-white"><p className="portfolio-card__category text-xs font-semibold uppercase text-orange-300">{project.category}</p><h2 className="portfolio-card__title mt-1 text-lg font-semibold leading-snug">{project.title}</h2></div></Link>)}</div>
      {!filtered.length && !error && <p className="mt-8 text-sm text-neutral-600">Belum ada proyek untuk kategori ini.</p>}
      </div>
    </section>
  </div>;
}
