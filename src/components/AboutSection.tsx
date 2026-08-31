import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Check, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n';
import teamPhoto from '@/assets/team-visitiga.png';
import wonderfulIndonesia from '@/assets/clients/wonderful-indonesia.png';
import pertamina from '@/assets/clients/pertamina.png';
import viataViraJati from '@/assets/clients/viata-vira-jati.png';
import dynamix from '@/assets/clients/dynamix.png';
import motogp from '@/assets/clients/motogp.png';
import emc from '@/assets/clients/emc.png';
import ugm from '@/assets/clients/ugm.png';
import mandalika from '@/assets/clients/mandalika.png';
import bankBpdDiy from '@/assets/clients/bank-bpd-diy.png';
import iims from '@/assets/clients/iims.png';
import diskominfoKarawang from '@/assets/clients/diskominfo-karawang.png';
import wonderfulIndonesiaRed from '@/assets/clients/wonderful-indonesia-red.png';

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
  { src: viataViraJati, alt: 'Viata Vira Jati' },
  { src: dynamix, alt: 'Dynamix' },
  { src: motogp, alt: 'MotoGP Universitas Gadjah Mada' },
  { src: emc, alt: 'EMC Healthcare' },
  { src: ugm, alt: 'Universitas Gadjah Mada' },
  { src: mandalika, alt: 'Mandalika International Street Circuit' },
  { src: bankBpdDiy, alt: 'Bank BPD DIY' },
  { src: iims, alt: 'Indonesia International Motor Show' },
  { src: diskominfoKarawang, alt: 'Diskominfo Kabupaten Karawang' },
  { src: wonderfulIndonesiaRed, alt: 'Wonderful Indonesia' },
];

export default function AboutSection() {
  const { ref, isInView } = useScrollReveal();
  const { t } = useTranslation();

  return (
    <section id="about" className="relative theme-section overflow-hidden">
      <div className="mx-auto grid max-w-[1536px] items-center gap-10 px-4 py-16 sm:gap-16 sm:px-6 sm:py-24 md:py-32 lg:grid-cols-2 lg:px-8 xl:gap-24">
        {/* Image */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={aboutImg}
              alt="Tim kami sedang bekerja"
              className="w-full h-[360px] sm:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Floating card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -bottom-4 right-3 sm:-bottom-6 sm:-right-6 bg-orange-500 rounded-2xl p-4 sm:p-6 max-w-[180px] sm:max-w-[200px] shadow-2xl shadow-orange-500/30"
          >
            <p className="text-white font-bold text-3xl">12+</p>
            <p className="text-white/80 text-sm mt-1">Tahun menghadirkan solusi LED terbaik</p>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-orange-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4"
          >
            Tentang Visitiga
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white font-bold text-4xl md:text-5xl leading-tight tracking-tight mb-6"
          >
            Mitra Tepercaya untuk <span className="text-orange-500">Inovasi LED</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/60 text-lg leading-relaxed mb-8"
          >
            {t('about.subtitle')}
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {features.map((feat, i) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
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
            href="#contact"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="group inline-flex items-center gap-2 bg-white/10 hover:bg-orange-500 text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
          >
            {t('about.contactButton')}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
        </div>
      </div>

      <section className="client-wall" aria-labelledby="client-wall-title">
        <div className="client-wall__inner client-wall__layout">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="client-wall__heading"
          >
            <h2 id="client-wall-title">KLIEN KAMI</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="client-wall__gallery"
          >
            <div className="client-wall__logos-grid" aria-label="Daftar klien">
              {clientLogos.map((client) => (
                <div key={client.src} className="client-logo-slot">
                  <img src={client.src} alt={client.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </section>
  );
}
