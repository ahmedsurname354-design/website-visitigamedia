import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getServiceLanding, listPublicPortfolios } from '@/lib/adminApi';
import { optimizedImageUrl, restoreOriginalImage } from '@/lib/imageUrl';
import { getPrerenderData } from '@/lib/prerenderData';
import { defaultServiceLandings, isServiceLandingSlug } from '@/lib/serviceLanding';
import { useTranslation } from '@/i18n';
import { usePageMeta } from '@/hooks/usePageMeta';
import { absoluteUrl } from '@/lib/seo';
import type { Portfolio, ServiceLandingContent } from '@/types/admin';

export default function ServiceLandingPage() {
  const { serviceSlug } = useParams();
  const validSlug = isServiceLandingSlug(serviceSlug) ? serviceSlug : undefined;
  const { lang } = useTranslation();
  const initial = getPrerenderData();
  const fallback = validSlug ? defaultServiceLandings[validSlug] : defaultServiceLandings['led-indoor'];
  const initialService = initial?.serviceLanding;
  const [service, setService] = useState<ServiceLandingContent>(initialService?.slug === validSlug ? (initialService ?? fallback) : fallback);
  const [projects, setProjects] = useState<Portfolio[]>(initial?.portfolios ?? []);

  useEffect(() => {
    if (!validSlug) return;
    let active = true;
    if (initial?.serviceLanding?.slug !== validSlug) {
      void getServiceLanding(validSlug).then((value) => { if (active && value) setService(value); }).catch(() => undefined);
    }
    if (!initial?.portfolios) void listPublicPortfolios().then((value) => { if (active) setProjects(value); }).catch(() => undefined);
    return () => { active = false; };
  }, [initial?.portfolios, initial?.serviceLanding, validSlug]);

  const copy = lang === 'en' ? service.content_en : service.content_id;
  const related = service.related_portfolio_ids
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is Portfolio => Boolean(project));
  const heroImage = service.hero_image_url || related[0]?.image_url;
  const pathname = `/services/${validSlug ?? service.slug}/`;
  const metaTitle = lang === 'en' ? service.seo_title_en : service.seo_title_id;
  const metaDescription = lang === 'en' ? service.seo_description_en : service.seo_description_id;
  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'en' ? 'Home' : 'Beranda', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: lang === 'en' ? 'Services' : 'Layanan', item: absoluteUrl('/services/') },
      { '@type': 'ListItem', position: 3, name: copy.title, item: absoluteUrl(pathname) },
    ],
  }), [copy.title, lang, pathname]);
  usePageMeta({ title: metaTitle, description: metaDescription, pathname, image: heroImage, imageAlt: copy.title, structuredData, noIndex: !validSlug, lang });

  if (!validSlug) return <Navigate to="/services/" replace />;

  return <article className="bg-white text-neutral-900">
    <header className="brand-surface-dark relative isolate min-h-[32rem] overflow-hidden bg-neutral-950 text-white">
      {heroImage && <img src={optimizedImageUrl(heroImage, 1800)} onError={({ currentTarget }) => restoreOriginalImage(currentTarget, heroImage)} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />}
      <div className="absolute inset-0 -z-10 bg-black/55" />
      <div className="mx-auto flex min-h-[32rem] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8">
        <Link to="/services/" className="mb-9 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"><ArrowLeft className="size-4" /> {copy.back_text}</Link>
        <p className="text-sm font-semibold uppercase text-orange-400">{copy.eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-6xl">{copy.title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">{copy.description}</p>
      </div>
    </header>

    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
        <div><p className="text-sm font-semibold uppercase text-orange-700">{copy.intro_eyebrow}</p><h2 className="mt-3 text-3xl font-semibold">{copy.intro_title}</h2><p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-700">{copy.intro}</p></div>
        <div className="border-t border-neutral-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><h2 className="font-semibold">{copy.considerations_title}</h2><ul className="mt-5 space-y-4">{copy.considerations.map((item, index) => <li key={`${index}-${item}`} className="flex gap-3 text-sm leading-6 text-neutral-700"><Check className="mt-1 size-4 shrink-0 text-orange-700" />{item}</li>)}</ul></div>
      </section>

      <section className="mt-20 border-t border-neutral-200 pt-14"><p className="text-sm font-semibold uppercase text-orange-700">{copy.process_eyebrow}</p><h2 className="mt-3 text-3xl font-semibold">{copy.process_title}</h2><ol className="mt-10 grid gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">{copy.process.map((item, index) => <li key={`${index}-${item}`} className="bg-white p-6"><span className="text-sm font-semibold text-orange-700">{String(index + 1).padStart(2, '0')}</span><p className="mt-4 font-semibold leading-6">{item}</p></li>)}</ol></section>

      {related.length > 0 && <section className="mt-20 border-t border-neutral-200 pt-14"><div className="flex items-end justify-between gap-6"><div><p className="text-sm font-semibold uppercase text-orange-700">{copy.portfolio_eyebrow}</p><h2 className="mt-3 text-3xl font-semibold">{copy.portfolio_title}</h2></div><Link to="/portfolio/" className="hidden items-center gap-2 text-sm font-semibold text-orange-700 sm:flex">{copy.portfolio_link_text} <ArrowRight className="size-4" /></Link></div><div className="mt-9 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((project) => <Link key={project.id} to={`/portfolio/${project.slug}/`} className="group"><img src={optimizedImageUrl(project.image_url, 800)} onError={({ currentTarget }) => restoreOriginalImage(currentTarget, project.image_url)} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" /><h3 className="mt-4 text-lg font-semibold group-hover:text-orange-700">{project.title}</h3><p className="mt-1 text-sm text-neutral-500">{project.category}</p></Link>)}</div></section>}

      <section className="mt-20 border-t border-neutral-200 pt-12"><h2 className="text-2xl font-semibold">{copy.cta_title}</h2><p className="mt-3 max-w-2xl leading-7 text-neutral-700">{copy.cta_description}</p><Link to="/contact/" className="brand-button mt-7 inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold">{copy.cta_button_text} <ArrowRight className="size-4" /></Link></section>
    </div>
  </article>;
}
