import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Play, Quote } from 'lucide-react';
import { useTranslation } from '@/i18n';

const videoImg = '/video-cover.webp';

export default function VideoSection() {
  const { ref, isInView } = useScrollReveal();
  const [playing, setPlaying] = useState(false);
  const { lang } = useTranslation();

  return (
    <section className="relative theme-section py-24 md:py-32">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <header className="mb-10 max-w-3xl sm:mb-14">
          <p className="editorial-eyebrow">SHOWREEL</p>
          <h1 className="text-white text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {lang === 'id' ? 'Lihat bagaimana ide menjadi pengalaman visual.' : 'See how ideas become visual experiences.'}
          </h1>
        </header>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="relative min-h-[400px] overflow-hidden rounded-3xl md:min-h-[560px]"
        >
          {playing ? (
            <video className="absolute inset-0 h-full w-full bg-black object-contain" controls autoPlay playsInline preload="metadata" poster={videoImg}>
              <source src="/videos/service-showreel.webm" type="video/webm" />
              <source src="/videos/service-showreel.mp4" type="video/mp4" />
              Browser Anda tidak mendukung pemutar video.
            </video>
          ) : <>
          <img src={videoImg} alt="Cuplikan proyek LED Visitiga" loading="lazy" decoding="async" className="h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-[560px]" />
          <div className="absolute inset-0 bg-black/50 transition-colors duration-300 group-hover:bg-black/40" />

          {/* Play button */}
          <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 flex w-full flex-col items-center justify-center text-left" aria-label="Putar cuplikan Visitiga">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-orange-500 flex items-center justify-center shadow-2xl shadow-orange-500/40 group-hover:scale-110 transition-transform duration-300"
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </motion.div>
            <p className="text-white font-semibold text-lg mt-6 tracking-wide">Saksikan Cuplikan Kami</p>
            <p className="text-white/50 text-sm mt-1">2:34 menit — Lihat hasil kerja kami</p>
          </button>

          {/* Quote overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black to-transparent">
            <Quote className="w-8 h-8 text-orange-500 mb-3" />
            <p className="text-white text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              "LED yang mereka pasang benar-benar mengubah cara orang melihat toko kami. Penjualan naik 40% dalam tiga bulan."
            </p>
            <p className="text-white/50 text-sm mt-3">— Budi Santoso, Klien Ritel</p>
          </div>
          </>}
        </motion.div>
      </div>
    </section>
  );
}
