import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import caseStudies from '@/data/case-studies.json';
import englishStudies from '@/data/case-studies-en.json';
import { useTranslation } from '@/i18n';
import { listPublicPortfolios } from '@/lib/adminApi';
import { getPrerenderData } from '@/lib/prerenderData';
import { optimizedImageUrl, restoreOriginalImage } from '@/lib/imageUrl';
import type { Portfolio } from '@/types/admin';

const MotionLink = motion(Link);


const projects = [
  {
    img: '/portfolio/indoor-1.jpg',
    title: 'Mall Pesona Square',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-2.jpg',
    title: 'Matahari Mall',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-3.jpg',
    title: 'Pascal 23',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-4.jpg',
    title: 'Event Dynamix',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-5.jpg',
    title: 'Bank BPD DIY',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-6.jpg',
    title: 'Bandara Soekarno Hatta Terminal 2',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-7.jpg',
    title: 'Gedung DPR MPR',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-8.jpg',
    title: 'Bank BPD DIY',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-9.jpg',
    title: 'Plaza Indonesia',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-10.jpg',
    title: 'LED VIDEOTRON P2.5 AL-Azhar',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-11.jpg',
    title: 'LED Videotron Indoor 2.5 Jambore',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/indoor-12.jpg',
    title: 'LED Videotron Indoor 2.5 Gedung Graha Dirgantara',
    category: 'Indoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-1.jpg',
    title: 'Metro Tanah Abang',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-2.jpg',
    title: 'Main Gate Bandara Halim Perdana Kusuma',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-3.jpg',
    title: 'Menara T Tower',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-4.jpg',
    title: 'Pemerintahan Kabupaten Bojonegoro',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-5.jpg',
    title: 'Totem Minitron Sampoerna',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-6.jpg',
    title: 'Signature Park Pierre Tendean',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-7.jpg',
    title: 'Bank BPD DIY Senopati',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-8.jpg',
    title: 'Simpang Lima Semarang',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-9.jpg',
    title: 'RS EMC Pekayon',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-10.jpg',
    title: 'RS EMC Alam Sutera',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-11.jpg',
    title: 'JPO depan Plaza Lawu Madiun',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-12.jpg',
    title: 'LED Videotron P8 Simpang Lima Semarang',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-13.jpg',
    title: 'LED Videotron P5 Outdoor Lombok Mandalika',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-14.jpg',
    title: 'LED Videotron P6 Outdoor Lombok Mandalika',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-15.jpg',
    title: 'LED Videotron P3.9 Outdoor Lombok Mandalika',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-16.jpg',
    title: 'LED Videotron P3.9 Outdoor Lombok Mandalika',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/outdoor/outdoor-17.jpg',
    title: 'LED Videotron P8 Outdoor Sanur Bali',
    category: 'Outdoor Media',
  },
  {
    img: '/portfolio/rental/rental-1.png',
    title: 'Rental LED Event 1',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-2.jpg',
    title: 'Event Nobar Videotron Madiun',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-3.jpg',
    title: 'Event Ynot Games Vol 2',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-4.jpg',
    title: 'Event Pupuk Kujang',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-5.jpg',
    title: 'Wisuda UGM',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-6.jpg',
    title: 'Indonesia International Motor Show Surabaya',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-7.jpg',
    title: 'MOEHI SMA Muhamadiyah 1 Yogyakarta',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-8.jpg',
    title: 'Event MotoGP Internasional 2025 Sirkuit Mandalika',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-9.jpg',
    title: 'JCI National Convention Padma Hotel',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-10.jpg',
    title: 'Budhi Hartono Sanjaja’s Birthday',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-11.jpg',
    title: 'Marcell & Rere’s Wedding',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/rental/rental-12.jpg',
    title: 'Indonesia Sport Summit 2025 GBK',
    category: 'Rental LED',
  },
  {
    img: '/portfolio/audiovisual/IMG_6406-scaled.jpg',
    title: 'Golo Convention Golomori, Labuan Bajo NTT',
    category: 'Audio Visual',
  },
  {
    img: '/portfolio/audiovisual/IMG_9584-scaled.jpg',
    title: 'Meeting Room Sarinah',
    category: 'Audio Visual',
  },
  {
    img: '/portfolio/conventional/Billboard-Paramount-Petals.jpeg',
    title: 'Paramount Petals',
    category: 'Conventional Media',
  },
  {
    img: '/portfolio/conventional/Display-Booth.jpeg',
    title: 'Display Booth',
    category: 'Conventional Media',
  },
  {
    img: '/portfolio/conventional/Gambar-WhatsApp-2025-04-08-pukul-10.30.44_fca1b51d.jpg',
    title: 'Letter Sign Kuta Mandalika',
    category: 'Conventional Media',
  },
  {
    img: '/portfolio/conventional/Lightbox-Indoor-Railink-Sudirman.jpeg',
    title: 'Stasiun Railink Sudirman',
    category: 'Conventional Media',
  },
  {
    img: '/portfolio/conventional/Lightbox-Outdoor.jpeg',
    title: 'Lightbox Outdoor',
    category: 'Conventional Media',
  },
  {
    img: '/portfolio/conventional/Shopsign-Toko-Taurus-Braga-Bandung.jpeg',
    title: 'Toko Taurus Braga',
    category: 'Conventional Media',
  },
];


export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState('Lihat semua');
  // null means Supabase is unavailable; an empty array means the admin has
  // intentionally removed every project, so do not resurrect static content.
  const [remoteProjects, setRemoteProjects] = useState<Portfolio[] | null>(() => getPrerenderData()?.portfolios ?? null);
  const [previewProject, setPreviewProject] = useState<{ img: string; title: string; category: string } | null>(null);
  const { ref, isInView, reducedMotion } = useScrollReveal();
  const { lang } = useTranslation();

  useEffect(() => {
    // Keep the prerender/bootstrap snapshot when a background refresh fails.
    // A successful empty response still intentionally clears the public list.
    void listPublicPortfolios().then(setRemoteProjects).catch(() => undefined);
  }, []);
  useEffect(() => {
    if (!previewProject) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setPreviewProject(null); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [previewProject]);
  const displayedProjects = remoteProjects !== null
    ? remoteProjects.map((project) => ({ img: project.image_url, title: project.title, category: project.category, client: project.client, description: project.description, overview: project.overview, challenge: project.challenge, solution: project.solution }))
    : projects;
  const displayedCategories = ['Lihat semua', ...Array.from(new Set(displayedProjects.map((project) => project.category)))];

  const filteredProjects = useMemo(
    () => (selectedCategory === 'Lihat semua' ? displayedProjects : displayedProjects.filter((project) => project.category === selectedCategory)),
    [displayedProjects, selectedCategory]
  );

  return (
    <section id="portfolio" className="relative theme-section-alt py-24 md:py-32">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0 : 0.32 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-16"
        >
          <div className="max-w-2xl">
            <p className="text-orange-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
              {lang === 'en' ? 'Our Work' : 'Karya Kami'}
            </p>
            <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight tracking-tight">
              {lang === 'en' ? <>Featured <span className="text-orange-500">Projects</span></> : <>Proyek <span className="text-orange-500">Unggulan</span></>}
            </h1>
          </div>
        </motion.div>

        <div className="mb-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label={lang === 'en' ? 'Selected case studies' : 'Studi kasus pilihan'}>
          {caseStudies.map((study) => {
            const copy = lang === 'en' ? englishStudies.find((item) => item.slug === study.slug) ?? study : study;
            return (
            <Link key={study.slug} to={`/portfolio/${study.slug}/`} className="group overflow-hidden rounded-lg border border-white/15 bg-white/5 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
              <img src={optimizedImageUrl(study.image, 900)} alt={copy.title} loading="lazy" decoding="async" className={`aspect-[4/3] w-full object-cover ${study.slug === 'videotron-outdoor-mandalika' ? 'object-[center_30%]' : 'object-center'}`} />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase text-orange-400">{study.category} · {study.location}</p>
                <div className="mt-3 flex items-start justify-between gap-3"><h2 className="text-xl font-semibold text-white">{copy.title}</h2><ArrowUpRight className="mt-1 size-5 shrink-0 text-orange-400" aria-hidden="true" /></div>
                <p className="mt-3 text-sm leading-6 text-white/70">{copy.summary}</p>
                <p className="mt-3 border-t border-white/15 pt-3 text-xs text-white/55">{copy.audience}</p>
              </div>
            </Link>
          );})}
        </div>

        <h2 className="mb-8 text-2xl font-semibold text-white">{lang === 'en' ? 'Project gallery' : 'Galeri proyek'}</h2>

        <div className="flex flex-wrap gap-3 mb-12">
          {displayedCategories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {category === 'Lihat semua' && lang === 'en' ? 'View all' : category}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredProjects.map((proj, i) => {
            const study = caseStudies.find((item) => item.image === proj.img);
            const Card = study ? MotionLink : motion.button;
            return <Card
              {...(study ? { to: `/portfolio/${study.slug}/` } : { type: 'button' as const, onClick: () => setPreviewProject(proj) })}
              key={proj.img}
              layout="position"
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : Math.min(i, 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group relative block rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff1df]"
            >
              <img
                src={optimizedImageUrl(proj.img, 900)}
                onError={({ currentTarget }) => restoreOriginalImage(currentTarget, proj.img)}
                alt={proj.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="portfolio-card__category text-orange-500 text-xs font-semibold tracking-widest uppercase mb-1">
                  {proj.category}
                </p>
                <h2 className="portfolio-card__title text-white font-bold text-xl">
                  {proj.title}
                </h2>
              </div>
            </Card>;
          })}
        </div>
      </div>
      {previewProject && <div role="dialog" aria-modal="true" aria-label={previewProject.title} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewProject(null)}>
        <button type="button" aria-label="Tutup" className="absolute right-4 top-4 text-white" onClick={() => setPreviewProject(null)}><X className="size-7" /></button>
        <div className="max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}><img src={previewProject.img} alt={previewProject.title} className="max-h-[80vh] w-full object-contain" /><p className="mt-3 text-center text-white">{previewProject.title} · {previewProject.category}</p></div>
      </div>}
    </section>
  );
}
