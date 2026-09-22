import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getPortfolioAlias, getPublicPortfolioById, getPublicPortfolioBySlug, listPublicPortfolios } from '@/lib/adminApi';
import { featuredPortfolios, portfolioCopy } from '@/lib/portfolio';
import { useTranslation } from '@/i18n';
import { usePageMeta } from '@/hooks/usePageMeta';
import { absoluteUrl } from '@/lib/seo';
import { optimizedImageUrl } from '@/lib/imageUrl';
import { getPrerenderData } from '@/lib/prerenderData';
import type { Portfolio } from '@/types/admin';

export default function CaseStudyPage() {
  const { slug } = useParams();
  const { lang } = useTranslation();
  const bootstrap = getPrerenderData();
  const [project, setProject] = useState<Portfolio | null | undefined>(() => bootstrap?.portfolio);
  const [projects, setProjects] = useState<Portfolio[]>(() => bootstrap?.portfolios ?? []);
  const [redirectSlug, setRedirectSlug] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!slug) { setProject(null); return; }
      setRedirectSlug('');
      setError('');
      const initial = getPrerenderData()?.portfolio;
      if (initial?.slug !== slug) setProject(undefined);
      try {
        const [found, all] = await Promise.all([getPublicPortfolioBySlug(slug), listPublicPortfolios()]);
        if (!active) return;
        setProjects(all);
        if (found) { setProject(found); return; }
        const alias = await getPortfolioAlias(slug);
        if (!active) return;
        if (alias) {
          const target = await getPublicPortfolioById(alias.portfolio_id);
          if (!active) return;
          if (target) { setProject(null); setRedirectSlug(target.slug); return; }
        }
        setProject(null);
      } catch {
        if (active) {
          if (!initial || initial.slug !== slug) setProject(null);
          setError(lang === 'en' ? 'Project data could not be loaded. Please try again.' : 'Data proyek belum dapat dimuat. Silakan coba lagi.');
        }
      }
    };
    void load();
    return () => { active = false; };
  }, [slug, lang]);

  const copy = project ? portfolioCopy(project, lang) : null;
  const pathname = project ? `/portfolio/${project.slug}/` : slug ? `/portfolio/${slug}/` : '/portfolio/';
  const structuredData = project && copy ? [
    { '@context': 'https://schema.org', '@type': 'CreativeWork', name: copy.title, description: copy.summary,
      image: project.image_url.startsWith('http') ? project.image_url : absoluteUrl(project.image_url),
      url: absoluteUrl(pathname), inLanguage: lang === 'en' ? 'en-US' : 'id-ID', creator: { '@type': 'Organization', name: 'Visitiga Media' } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'en' ? 'Home' : 'Beranda', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: lang === 'en' ? 'Portfolio' : 'Portofolio', item: absoluteUrl('/portfolio/') },
      { '@type': 'ListItem', position: 3, name: copy.title, item: absoluteUrl(pathname) },
    ] },
  ] : undefined;
  usePageMeta({ title: copy ? `${copy.title} | Visitiga Media` : lang === 'en' ? 'Project not found | Visitiga Media' : 'Proyek tidak ditemukan | Visitiga Media',
    description: copy?.summary ?? (lang === 'en' ? 'Project not found.' : 'Proyek tidak ditemukan.'),
    pathname, image: project?.image_url, structuredData, noIndex: !project, lang });

  if (redirectSlug) return <Navigate to={`/portfolio/${redirectSlug}/`} replace />;
  if (project === undefined) return <div role="status" className="min-h-[60vh] pt-32 text-center text-neutral-600">{lang === 'en' ? 'Loading project…' : 'Memuat proyek…'}</div>;
  if (!project || !copy) return <section className="mx-auto min-h-[65vh] max-w-6xl px-5 py-32"><h1 className="text-3xl font-semibold">{lang === 'en' ? 'Project not found' : 'Proyek tidak ditemukan'}</h1>{error && <p role="alert" className="mt-4">{error}</p>}<Link to="/portfolio/" className="mt-6 inline-flex text-orange-600">{lang === 'en' ? 'Back to portfolio' : 'Kembali ke portofolio'}</Link></section>;

  const related = featuredPortfolios(projects).filter((item) => item.id !== project.id && item.category === project.category).slice(0, 2);
  return <article className="bg-white text-neutral-900">
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 lg:pt-32">
      <Link to="/portfolio/" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-orange-600"><ArrowLeft className="size-4" /> {lang === 'en' ? 'Portfolio' : 'Portofolio'}</Link>
      <header className="mt-8 max-w-4xl">
        <p className="text-sm font-semibold uppercase text-orange-600">{project.category}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{copy.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">{copy.summary}</p>
        <p className="mt-5 inline-flex items-center gap-2 text-sm text-neutral-600"><MapPin className="size-4" /> {project.location}</p>
        <p className="mt-2 text-sm text-neutral-600">{lang === 'en' ? 'User context' : 'Konteks pengguna'}: {copy.audience}</p>
      </header>
      <img src={optimizedImageUrl(project.image_url, 1600)} alt={copy.title} className="mt-10 max-h-[75vh] w-full rounded-lg bg-neutral-100 object-contain" />
      <div className="mt-12 grid gap-10 border-t border-neutral-200 pt-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="max-w-3xl space-y-10">
          <section><h2 className="text-2xl font-semibold">{lang === 'en' ? 'Context and needs' : 'Konteks dan kebutuhan'}</h2><p className="mt-3 leading-8 text-neutral-700">{copy.context}</p></section>
          <section><h2 className="text-2xl font-semibold">{lang === 'en' ? 'Technical considerations' : 'Pertimbangan teknis'}</h2><p className="mt-3 leading-8 text-neutral-700">{copy.decision}</p></section>
          <section><h2 className="text-2xl font-semibold">{lang === 'en' ? 'Work process' : 'Proses pekerjaan'}</h2><p className="mt-3 leading-8 text-neutral-700">{copy.process}</p></section>
          <section><h2 className="text-2xl font-semibold">{lang === 'en' ? 'Documented outcome' : 'Hasil yang terdokumentasi'}</h2><p className="mt-3 leading-8 text-neutral-700">{copy.outcome}</p></section>
        </div>
        <aside className="lg:border-l lg:border-neutral-200 lg:pl-8"><h2 className="text-sm font-semibold uppercase text-neutral-500">{lang === 'en' ? 'Recorded specifications' : 'Spesifikasi tercatat'}</h2><ul className="mt-4 space-y-3">{copy.specs.map((spec) => <li key={spec} className="border-b border-neutral-200 pb-3 text-sm font-medium">{spec}</li>)}</ul></aside>
      </div>
      {related.length > 0 && <section className="mt-20 border-t border-neutral-200 pt-10"><h2 className="text-2xl font-semibold">{lang === 'en' ? 'Related projects' : 'Proyek terkait'}</h2><div className="mt-6 grid gap-6 sm:grid-cols-2">{related.map((item) => <Link key={item.id} to={`/portfolio/${item.slug}/`} className="group flex items-center gap-4 border-b border-neutral-200 pb-4"><img src={optimizedImageUrl(item.image_url, 360)} alt="" loading="lazy" className="size-24 rounded object-cover" /><span className="flex-1 font-semibold">{portfolioCopy(item, lang).title}</span><ArrowUpRight className="size-5 text-orange-600" /></Link>)}</div></section>}
      <div className="mt-16 border-t border-neutral-200 pt-8"><Link to="/portfolio/" className="inline-flex items-center gap-2 font-semibold text-orange-600">{lang === 'en' ? 'View all projects' : 'Lihat semua proyek'} <ArrowUpRight className="size-4" /></Link></div>
    </div>
  </article>;
}
