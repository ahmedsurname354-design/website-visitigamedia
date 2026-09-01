import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Play, Quote } from 'lucide-react';

const videoImg = '/video-cover.webp';

export default function VideoSection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section className="relative theme-section py-24 md:py-32">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden group cursor-pointer"
        >
          <img
            src={videoImg}
            alt="Cuplikan proyek LED Visitiga"
            loading="lazy"
            decoding="async"
            className="w-full h-[400px] md:h-[560px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-orange-500 flex items-center justify-center shadow-2xl shadow-orange-500/40 group-hover:scale-110 transition-transform duration-300"
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </motion.div>
            <p className="text-white font-semibold text-lg mt-6 tracking-wide">Saksikan Cuplikan Kami</p>
            <p className="text-white/50 text-sm mt-1">2:34 menit — Lihat hasil kerja kami</p>
          </div>

          {/* Quote overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 bg-gradient-to-t from-black to-transparent">
            <Quote className="w-8 h-8 text-orange-500 mb-3" />
            <p className="text-white text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              "LED yang mereka pasang benar-benar mengubah cara orang melihat toko kami. Penjualan naik 40% dalam tiga bulan."
            </p>
            <p className="text-white/50 text-sm mt-3">— Budi Santoso, Klien Ritel</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
