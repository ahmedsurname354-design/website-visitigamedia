import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { listPublicPortfolios } from '@/lib/adminApi';
import { getPrerenderData } from '@/lib/prerenderData';
import { optimizedImageUrl, restoreOriginalImage } from '@/lib/imageUrl';
import { isSlidePosition } from '@/lib/portfolioSlides';
import type { Portfolio } from '@/types/admin';

export function PortfolioHero({ slides }: { slides: Portfolio[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (slides.length < 2 || paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, paused, reducedMotion]);
  useEffect(() => { if (index >= slides.length) setIndex(0); }, [index, slides.length]);
  if (!slides.length) return null;
  const active = slides[index] ?? slides[0];
  const move = (next: number) => { setPaused(true); setIndex((next + slides.length) % slides.length); };
  return <section aria-label="Proyek pilihan" className="portfolio-hero relative isolate h-[min(70vh,640px)] min-h-[360px] overflow-hidden bg-neutral-900 text-white sm:min-h-[480px]" onMouseEnter={() => setPaused(true)} onFocusCapture={() => setPaused(true)} onTouchStart={() => setPaused(true)}>
    {slides.map((slide, slideIndex) => <img key={slide.id} src={optimizedImageUrl(slide.hero_image_url || slide.image_url, 1800)} onError={({ currentTarget }) => restoreOriginalImage(currentTarget, slide.hero_image_url || slide.image_url)} alt="" aria-hidden="true" loading={slideIndex === 0 ? 'eager' : 'lazy'} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${slideIndex === index ? 'opacity-100' : 'opacity-0'}`} />)}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" aria-hidden="true" />
    <div className="relative mx-auto flex h-full max-w-[1536px] flex-col justify-end px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12">
      <p className="text-xs font-semibold uppercase text-orange-300">{active.category}</p>
      <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">{active.title}</h1>
      {active.description && <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/90 sm:text-base">{active.description}</p>}
      <Link to={`/portfolio/${active.slug}/`} className="mt-5 w-fit border-b border-orange-300 pb-1 text-sm font-semibold text-white hover:text-orange-200">Lihat proyek</Link>
    </div>
    {slides.length > 1 && <div className="absolute bottom-5 right-5 flex items-center gap-2 sm:bottom-8 sm:right-8">
      <button type="button" aria-label="Slide sebelumnya" onClick={() => move(index - 1)} className="grid size-11 place-items-center rounded-full border border-white/70 bg-black/30 hover:bg-black/60"><ChevronLeft className="size-5" /></button>
      <span className="min-w-12 text-center text-sm tabular-nums">{index + 1}/{slides.length}</span>
      <button type="button" aria-label="Slide berikutnya" onClick={() => move(index + 1)} className="grid size-11 place-items-center rounded-full border border-white/70 bg-black/30 hover:bg-black/60"><ChevronRight className="size-5" /></button>
    </div>}
    {slides.length > 1 && <div className="absolute bottom-5 left-5 flex sm:bottom-8 sm:left-8 lg:left-12">{slides.map((slide, slideIndex) => <button key={slide.id} type="button" aria-label={`Tampilkan slide ${slideIndex + 1}`} aria-current={slideIndex === index ? 'true' : undefined} onClick={() => move(slideIndex)} className="grid size-6 place-items-center"><span aria-hidden="true" className={`h-2 rounded-full transition-[width,background-color] ${slideIndex === index ? 'w-5 bg-orange-400' : 'w-2 bg-white/70'}`} /></button>)}</div>}
  </section>;
}

export default function PortfolioSection() {
  const { lang } = useTranslation();
  const [projects, setProjects] = useState<Portfolio[]>(getPrerenderData()?.portfolios ?? []);
  const [category, setCategory] = useState('Lihat semua');
  const [error, setError] = useState(false);
  useEffect(() => { let active = true; void listPublicPortfolios().then((data) => { if (active) { setProjects(data); setError(false); } }).catch(() => { if (active) setError(true); }); return () => { active = false; }; }, []);
  const categories = useMemo(() => ['Lihat semua', ...new Set(projects.map((project) => project.category))], [projects]);
  const filtered = category === 'Lihat semua' ? projects : projects.filter((project) => project.category === category);
  const slides = useMemo(() => projects
    .filter((project) => isSlidePosition(project.hero_position))
    .sort((a, b) => a.hero_position! - b.hero_position!)
    .slice(0, 6), [projects]);
  return <div>
    <PortfolioHero slides={slides} />
    <section id="portfolio" className="theme-section-alt px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1536px]">
      <p className="text-xs font-semibold uppercase text-orange-600">Karya Kami</p>
      {slides.length ? <h2 className="mt-2 text-3xl font-bold text-[#211c18] sm:text-4xl">{lang === 'en' ? 'All Projects' : 'Semua Proyek'}</h2> : <h1 className="mt-2 text-3xl font-bold text-[#211c18] sm:text-4xl">{lang === 'en' ? 'Projects' : 'Portofolio'}</h1>}
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">{categories.map((name) => <button key={name} type="button" onClick={() => setCategory(name)} aria-pressed={category === name} className={`rounded-full border px-4 py-2 text-sm font-medium ${category === name ? 'border-orange-600 bg-orange-600 text-white' : 'border-neutral-300 bg-white text-neutral-700 hover:border-orange-500'}`}>{name}</button>)}</div>
      {error && !projects.length && <p role="alert" className="mt-8 text-sm text-red-700">Portofolio belum dapat dimuat. Silakan coba lagi.</p>}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">{filtered.map((project) => <Link key={project.id} to={`/portfolio/${project.slug}/`} className="group relative block aspect-[4/3] overflow-hidden rounded-md bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-500"><img src={optimizedImageUrl(project.image_url, 900)} onError={({ currentTarget }) => restoreOriginalImage(currentTarget, project.image_url)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-5 text-white"><p className="portfolio-card__category text-xs font-semibold uppercase text-orange-300">{project.category}</p><h3 className="portfolio-card__title mt-1 text-lg font-semibold leading-snug">{project.title}</h3></div></Link>)}</div>
      {!filtered.length && !error && <p className="mt-8 text-sm text-neutral-600">Belum ada proyek untuk kategori ini.</p>}
      </div>
    </section>
  </div>;
}
