import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Check, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n';
import teamPhoto from '@/assets/team-visitiga.webp';
import wonderfulIndonesia from '@/assets/clients/wonderful-indonesia.webp';
// These legacy filenames do not match the artwork; map by the actual logo.
import pertamina from '@/assets/clients/viata-vira-jati.webp';
import dynamix from '@/assets/clients/motogp.webp';
import motogp from '@/assets/clients/dynamix.webp';
import emc from '@/assets/clients/emc.webp';
import mandalika from '@/assets/clients/mandalika.webp';
import iims from '@/assets/clients/iims.webp';
import wonderfulIndonesiaRed from '@/assets/clients/wonderful-indonesia-red.webp';

const aboutImg = teamPhoto;

const features = [
  'Panel LED berkualitas premium',
  'Tim instalasi bersertifikat',
  'Desain sesuai kebutuhan',
  'Dukungan purnajual',
];

const clientLogos = [
  { src: wonderfulIndonesia, alt: 'Wonderful Indonesia' },
  { src: pertamina, alt: 'Pertamina' },
  { src: dynamix, alt: 'Dynamix' },
  { src: motogp, alt: 'MotoGP' },
  { src: emc, alt: 'EMC Healthcare' },
  { src: mandalika, alt: 'Mandalika International Street Circuit' },
  { src: iims, alt: 'Indonesia International Motor Show' },
  { src: wonderfulIndonesiaRed, alt: 'Wonderful Indonesia' },
];

export default function AboutSection() {
  const { ref, isInView, reducedMotion } = useScrollReveal();
  const { t } = useTranslation();

  return (
    <section id="about" className="relative theme-section overflow-hidden">
      <div className="mx-auto grid max-w-[1536px] items-center gap-10 px-4 py-16 sm:gap-16 sm:px-6 sm:py-24 md:py-32 lg:grid-cols-2 lg:px-8 xl:gap-24">
        {/* Image */}
        <motion.div
          ref={ref}
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: reducedMotion ? 0 : 0.32 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={aboutImg}
              alt="Tim kami sedang bekerja"
              fetchPriority="high"
              decoding="async"
              className="w-full h-[360px] sm:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Floating card */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.06 }}
            className="absolute -bottom-4 right-3 sm:-bottom-6 sm:-right-6 bg-orange-500 rounded-2xl p-4 sm:p-6 max-w-[180px] sm:max-w-[200px] shadow-2xl shadow-orange-500/30"
          >
            <p className="text-white font-bold text-3xl">12+</p>
            <p className="text-white/80 text-sm mt-1">Tahun menghadirkan solusi LED terbaik</p>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.06 }}
            className="text-orange-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4"
          >
            Tentang Visitiga
          </motion.p>
          <motion.h1
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.06 }}
            className="text-white font-bold text-4xl md:text-5xl leading-tight tracking-tight mb-6"
          >
            Mitra Tepercaya untuk <span className="text-orange-500">Inovasi LED</span>
          </motion.h1>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.06 }}
            className="text-white/60 text-lg leading-relaxed mb-8"
          >
            {t('about.subtitle')}
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {features.map((feat, i) => (
              <motion.div
                key={feat}
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : i * 0.06 }}
                className="flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-orange-500" />
                </span>
                <span className="text-white/80 text-sm">{t(`about.features.${i}`)}</span>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="/contact"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: reducedMotion ? 0 : 0.32, delay: reducedMotion ? 0 : 0.06 }}
            className="group inline-flex items-center gap-2 bg-white/10 hover:bg-orange-500 text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
          >
            {t('about.contactButton')}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
        </div>
      </div>

      <section className="client-wall" aria-labelledby="client-wall-title">
        <div className="client-wall__heading">
          <h2 id="client-wall-title">Klien Kami</h2>
        </div>
        <div className="client-wall__gallery">
          <ul className="client-wall__logos-grid" aria-label="Daftar klien">
            {clientLogos.map((client) => (
              <li key={client.src} className="client-logo-slot">
                <img src={client.src} alt={client.alt} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
}
