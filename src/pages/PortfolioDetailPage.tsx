import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPortfolioAlias, getPublicPortfolioById, getPublicPortfolioBySlug, listPublicPortfolios } from '@/lib/adminApi';
import { getPrerenderData } from '@/lib/prerenderData';
import { usePageMeta } from '@/hooks/usePageMeta';
import { absoluteUrl, canonicalPublicPath } from '@/lib/seo';
import { optimizedImageUrl, restoreOriginalImage } from '@/lib/imageUrl';
import { useTranslation } from '@/i18n';
import type { Portfolio } from '@/types/admin';

function clean(value: string) {
  return value.trim().startsWith('Tulis ') ? '' : value.trim();
}

export default function PortfolioDetailPage() {
  const { slug } = useParams();
  const { lang } = useTranslation();
  const initial = getPrerenderData();
  const [project, setProject] = useState<Portfolio | null | undefined>(initial?.portfolio?.slug === slug ? initial?.portfolio : undefined);
  const [related, setRelated] = useState<Portfolio[]>(initial?.portfolios ?? []);
  const [redirect, setRedirect] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    if (!slug) { setProject(null); return; }
    void Promise.all([getPublicPortfolioBySlug(slug), listPublicPortfolios()]).then(async ([found, projects]) => {
      if (!active) return;
      setRelated(projects);
      if (found) { setProject(found); return; }
      const alias = await getPortfolioAlias(slug);
      if (!active) return;
      if (alias) {
        const target = await getPublicPortfolioById(alias.portfolio_id);
        if (!active) return;
        if (target) { setRedirect(`/portfolio/${target.slug}/`); return; }
      }
      setProject(null);
    }).catch(() => { if (active) { setError(true); setProject(null); } });
    return () => { active = false; };
  }, [slug]);

  const pathname = canonicalPublicPath(`/portfolio/${project?.slug || slug || ''}`);
  const description = project ? clean(project.seo_description) || clean(project.description) || `${project.title} - portofolio Visitiga Media.` : '';
  const structuredData = useMemo(() => project ? [
    { '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description, image: project.image_url.startsWith('http') ? project.image_url : absoluteUrl(project.image_url), url: absoluteUrl(pathname), creator: { '@type': 'Organization', name: 'Visitiga Media' } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Portofolio', item: absoluteUrl('/portfolio/') },
      { '@type': 'ListItem', position: 3, name: project.title, item: absoluteUrl(pathname) },
    ] },
  ] : undefined, [description, pathname, project]);
  usePageMeta({ title: project ? `${clean(project.seo_title) || project.title} | Visitiga Media` : 'Proyek | Visitiga Media', description, pathname, image: project?.image_url, imageAlt: project?.title, structuredData, noIndex: !project, lang });
  if (redirect) return <Navigate to={redirect} replace />;
  if (project === undefined) return <div className="public-surface min-h-screen pt-36 text-center text-sm text-neutral-600" role="status">Memuat proyek...</div>;
  if (!project) return <div className="public-surface min-h-screen px-5 pt-36 text-center text-neutral-900"><h1 className="text-3xl font-bold">{error ? 'Proyek belum dapat dimuat' : 'Proyek tidak ditemukan'}</h1><Link to="/portfolio/" className="public-link mt-5 inline-block text-orange-700 underline">Kembali ke portofolio</Link></div>;
  const sections = [
    { title: lang === 'en' ? 'Overview' : 'Ringkasan', body: clean(project.overview) },
    { title: lang === 'en' ? 'Challenge' : 'Tantangan', body: clean(project.challenge) },
    { title: lang === 'en' ? 'Solution' : 'Solusi', body: clean(project.solution) },
  ].filter((item) => item.body);
  const nearby = related.filter((item) => item.id !== project.id && item.category === project.category).slice(0, 3);
  return <article className="public-surface min-h-screen pb-20 pt-24 text-neutral-900">
    <div className="mx-auto max-w-[1536px] px-5 sm:px-8 lg:px-12">
      <Link to="/portfolio/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-neutral-700 hover:text-orange-700"><ArrowLeft className="size-4" /> Kembali ke portofolio</Link>
      <div className="public-media-placeholder mt-5 aspect-[4/3] overflow-hidden rounded-md bg-neutral-100 sm:aspect-[16/8]"><img src={optimizedImageUrl(project.image_url, 1800)} onError={({ currentTarget }) => restoreOriginalImage(currentTarget, project.image_url)} alt={project.title} className="h-full w-full object-cover" /></div>
      <header className="max-w-4xl py-10 sm:py-14"><p className="text-xs font-semibold uppercase text-orange-700">{project.category}</p><h1 className="mt-3 text-3xl font-bold leading-tight sm:text-5xl">{project.title}</h1>{clean(project.description) && <p className="mt-5 text-base leading-7 text-neutral-700 sm:text-lg">{clean(project.description)}</p>}</header>
      {project.client && <p className="public-divider border-y border-neutral-200 py-5 text-sm"><span className="font-semibold">Klien: </span>{project.client}</p>}
      {sections.length > 0 && <div className="max-w-3xl space-y-12 py-14">{sections.map((section) => <section key={section.title}><h2 className="text-xl font-semibold">{section.title}</h2><p className="mt-4 whitespace-pre-line leading-8 text-neutral-700">{section.body}</p></section>)}</div>}
      {nearby.length > 0 && <section className="public-divider border-t border-neutral-200 pt-12"><h2 className="text-2xl font-semibold">Proyek terkait</h2><div className="mt-6 grid gap-5 sm:grid-cols-3">{nearby.map((item) => <Link key={item.id} to={`/portfolio/${item.slug}/`} className="group"><img src={optimizedImageUrl(item.image_url, 700)} alt="" loading="lazy" className="public-media-placeholder aspect-[4/3] w-full rounded-md object-cover" /><h3 className="mt-3 font-semibold group-hover:text-orange-700">{item.title}</h3></Link>)}</div></section>}
    </div>
  </article>;
}
