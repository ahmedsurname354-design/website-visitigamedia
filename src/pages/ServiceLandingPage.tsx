import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { listPublicPortfolios } from '@/lib/adminApi';
import { optimizedImageUrl, restoreOriginalImage } from '@/lib/imageUrl';
import { getPrerenderData } from '@/lib/prerenderData';
import { isServiceLandingSlug, serviceLandings } from '@/lib/serviceLanding';
import type { Portfolio } from '@/types/admin';

export default function ServiceLandingPage() {
  const { serviceSlug } = useParams();
  const initial = getPrerenderData();
  const [projects, setProjects] = useState<Portfolio[]>(initial?.portfolios ?? []);

  useEffect(() => {
    if (initial?.portfolios) return;
    void listPublicPortfolios().then(setProjects).catch(() => setProjects([]));
  }, [initial?.portfolios]);

  if (!isServiceLandingSlug(serviceSlug)) return <Navigate to="/services/" replace />;
  const service = serviceLandings[serviceSlug];
  const related = projects.filter((project) => service.categoryTerms.some((term) => `${project.category} ${project.title}`.toLowerCase().includes(term))).slice(0, 2);
  const heroImage = related[0]?.image_url;

  return <article className="bg-white text-neutral-900">
    <header className="relative isolate min-h-[32rem] overflow-hidden bg-neutral-950 text-white">
      {heroImage && <img src={optimizedImageUrl(heroImage, 1800)} onError={({ currentTarget }) => restoreOriginalImage(currentTarget, heroImage)} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />}
      <div className="absolute inset-0 -z-10 bg-black/55" />
      <div className="mx-auto flex min-h-[32rem] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8">
        <Link to="/services/" className="mb-9 inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"><ArrowLeft className="size-4" /> Semua layanan</Link>
        <p className="text-sm font-semibold uppercase text-orange-400">{service.eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-6xl">{service.title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">{service.description}</p>
      </div>
    </header>

    <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
        <div><p className="text-sm font-semibold uppercase text-orange-700">Dasar perencanaan</p><h2 className="mt-3 text-3xl font-semibold">Solusi mengikuti kebutuhan lokasi.</h2><p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-700">{service.intro}</p></div>
        <div className="border-t border-neutral-200 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><h2 className="font-semibold">Yang perlu dipastikan</h2><ul className="mt-5 space-y-4">{service.considerations.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-neutral-700"><Check className="mt-1 size-4 shrink-0 text-orange-700" />{item}</li>)}</ul></div>
      </section>

      <section className="mt-20 border-t border-neutral-200 pt-14"><p className="text-sm font-semibold uppercase text-orange-700">Alur kerja</p><h2 className="mt-3 text-3xl font-semibold">Tahapan yang disesuaikan dengan proyek.</h2><ol className="mt-10 grid gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-4">{service.process.map((item, index) => <li key={item} className="bg-white p-6"><span className="text-sm font-semibold text-orange-700">0{index + 1}</span><p className="mt-4 font-semibold leading-6">{item}</p></li>)}</ol></section>

      {related.length > 0 && <section className="mt-20 border-t border-neutral-200 pt-14"><div className="flex items-end justify-between gap-6"><div><p className="text-sm font-semibold uppercase text-orange-700">Portofolio terkait</p><h2 className="mt-3 text-3xl font-semibold">Lihat penerapannya pada proyek.</h2></div><Link to="/portfolio/" className="hidden items-center gap-2 text-sm font-semibold text-orange-700 sm:flex">Semua proyek <ArrowRight className="size-4" /></Link></div><div className="mt-9 grid max-w-4xl gap-6 sm:grid-cols-2">{related.map((project) => <Link key={project.id} to={`/portfolio/${project.slug}/`} className="group"><img src={optimizedImageUrl(project.image_url, 800)} onError={({ currentTarget }) => restoreOriginalImage(currentTarget, project.image_url)} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-md object-cover" /><h3 className="mt-4 text-lg font-semibold group-hover:text-orange-700">{project.title}</h3><p className="mt-1 text-sm text-neutral-500">{project.category}</p></Link>)}</div></section>}

      <section className="mt-20 border-t border-neutral-200 pt-12"><h2 className="text-2xl font-semibold">Diskusikan kebutuhan media Anda.</h2><p className="mt-3 max-w-2xl leading-7 text-neutral-700">Sampaikan lokasi, ukuran area, jarak pandang, dan cara media akan digunakan agar konfigurasi dapat dibahas berdasarkan kebutuhan proyek.</p><Link to="/contact/" className="mt-7 inline-flex items-center gap-2 bg-orange-700 px-5 py-3 text-sm font-semibold !text-white hover:bg-orange-800">Hubungi Visitiga <ArrowRight className="size-4" /></Link></section>
    </div>
  </article>;
}
