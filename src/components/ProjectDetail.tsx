import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from '@/i18n';

export type ProjectDetailData = {
  title: string;
  subtitle: string;
  category?: string;
  coverImage: string;
  coverImageAlt?: string;
  role: string;
  timeline: string;
  client: string;
  techStack: string[];
  overview: string;
  challenge: string;
  solution: string;
  gallery?: Array<{
    src: string;
    alt: string;
    caption?: string;
    onClick?: () => void;
  }>;
  liveUrl?: string;
};

type ProjectDetailProps = {
  project: ProjectDetailData;
  /** Route atau URL untuk tombol kembali. */
  backHref?: string;
  backLabel?: string;
  /** Gunakan ini ketika detail ditampilkan di dalam halaman Portfolio. */
  onBack?: () => void;
};

/**
 * Halaman detail proyek dark-theme yang dapat dipakai ulang.
 * Bungkus dengan layout/routing aplikasi Anda, lalu kirimkan data melalui prop `project`.
 */
export default function ProjectDetail({
  project,
  backHref = '/portfolio',
  backLabel,
  onBack,
}: ProjectDetailProps) {
  const { t } = useTranslation();
  const resolvedBackLabel = backLabel ?? t('projectDetail.backToProjects');
  const metaItems = [
    { label: t('projectDetail.role'), value: project.role },
    { label: t('projectDetail.timeline'), value: project.timeline },
    { label: t('projectDetail.client'), value: project.client },
  ];

  return (
    <article className="min-h-screen bg-white pt-20 text-neutral-900 sm:pt-24">
      {/* Header navigation */}
      <div className="mx-auto flex w-full max-w-7xl justify-between px-5 pb-8 pt-8 sm:px-8 lg:px-12 lg:pt-12">
        <BackControl backHref={backHref} backLabel={resolvedBackLabel} onBack={onBack} className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          {backLabel}
        </BackControl>
        {project.category && (
          <span className="hidden rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600 sm:block">
            {project.category}
          </span>
        )}
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        {/* Hero section */}
        <section>
          <div className="relative isolate aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-300 bg-neutral-100 sm:aspect-[16/8] lg:rounded-3xl">
            <img
              src={project.coverImage}
              alt={project.coverImageAlt ?? project.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" aria-hidden="true" />
            {project.category && (
              <span className="absolute bottom-5 left-5 rounded-full border border-orange-500/40 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600 backdrop-blur sm:hidden">
                {project.category}
              </span>
            )}
          </div>

          <div className="max-w-4xl pb-14 pt-10 sm:pb-20 sm:pt-14">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
              {project.subtitle}
            </p>
          </div>
        </section>

        {/* Project metadata */}
        <section className="border-y border-neutral-300 py-7 sm:py-8" aria-label={t('projectDetail.projectGallery')}>
          <dl className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {metaItems.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-600">{item.label}</dt>
                <dd className="mt-2 text-sm leading-6 text-neutral-800">{item.value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{t('projectDetail.techStack')}</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-300">
                    {tech}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </section>

        {/* Project story */}
        <section className="mx-auto max-w-3xl py-16 sm:py-24">
          <div className="space-y-14 sm:space-y-16">
            <ContentBlock title={t('projectDetail.overview')} content={project.overview} />
            <ContentBlock title={t('projectDetail.challenge')} content={project.challenge} />
            <ContentBlock title={t('projectDetail.solution')} content={project.solution} accent />
          </div>
        </section>

        {/* Image gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <section aria-labelledby="gallery-title">
            <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">{t('projectDetail.selectedScreens')}</p>
                <h2 id="gallery-title" className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">{t('projectDetail.projectGallery')}</h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {project.gallery.map((image, index) => (
                <button
                  type="button"
                  key={`${image.src}-${index}`}
                  onClick={image.onClick}
                  disabled={!image.onClick}
                  className="group overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100 text-left disabled:cursor-default lg:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  aria-label={image.onClick ? `${t('projectDetail.viewProject')} ${image.alt}` : undefined}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]" />
                  </div>
                  {image.caption && <span className="block px-4 py-3 text-sm text-neutral-600">{image.caption}</span>}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* CTA and final navigation */}
        <section className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-neutral-300 pt-10 sm:mt-24 sm:flex-row sm:items-center sm:pt-12">
          <div>
            <p className="text-lg font-medium text-white">{t('projectDetail.interested')}</p>
            <p className="mt-1 text-sm text-neutral-600">{t('projectDetail.explore')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
                {t('projectDetail.visitLive')} <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            <BackControl backHref={backHref} backLabel={resolvedBackLabel} onBack={onBack} className="inline-flex items-center gap-2 rounded-full border border-neutral-400 px-5 py-3 text-sm font-semibold text-neutral-800 transition hover:border-orange-500 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
              {resolvedBackLabel} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </BackControl>
          </div>
        </section>
      </div>
    </article>
  );
}

function BackControl({ backHref, backLabel, onBack, className, children }: {
  backHref: string;
  backLabel: string;
  onBack?: () => void;
  className: string;
  children: ReactNode;
}) {
  if (onBack) {
    return <button type="button" onClick={onBack} aria-label={backLabel} className={className}>{children}</button>;
  }

  return <a href={backHref} className={className}>{children}</a>;
}

function ContentBlock({ title, content, accent = false }: { title: string; content: string; accent?: boolean }) {
  return (
    <div className={accent ? 'border-l-2 border-orange-500 pl-5 sm:pl-7' : ''}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-black">{title}</h2>
      <p className="mt-4 text-base leading-8 text-neutral-700 sm:text-lg sm:leading-9">{content}</p>
    </div>
  );
}
