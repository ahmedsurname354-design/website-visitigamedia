import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Play, ArrowUpRight } from 'lucide-react';

export default function WebServiceSection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section className="relative theme-section py-24 md:py-32">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr,1.05fr] items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <p className="text-orange-500 text-sm font-semibold tracking-[0.3em] uppercase mb-4">Layanan Kami</p>
            <h2 className="text-white font-bold text-4xl md:text-5xl leading-tight tracking-tight">
              Visual Memukau, <span className="text-orange-500">Kesan Luar Biasa</span>
            </h2>
            <p className="text-white/70 mt-6 text-lg leading-relaxed">
              Menampilkan hasil pemasangan dan konten videotron kami kombinasi warna tajam, pencahayaan presisi, dan performa optimal untuk hasil visual maksimal.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://bit.ly/49NclAE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange-500 text-black px-7 py-4 rounded-full font-semibold transition-all duration-300 hover:bg-orange-400"
              >
                Konsultasi Sekarang
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="mailto:marcomm@visitiga.com?subject=Konsultasi%20Visitiga%20Media"
                className="inline-flex items-center gap-2 border border-white/10 bg-white/5 text-white px-7 py-4 rounded-full font-semibold transition-all duration-300 hover:bg-white/10"
              >
                Email Marketing
                <Play className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.25)]"
          >
            <video
              aria-label="Service showreel"
              className="block aspect-[4/3] w-full object-cover sm:aspect-video lg:aspect-auto lg:h-[520px]"
              playsInline
              controls
              preload="none"
              poster="/videos/service-showreel-poster.webp"
            >
              <source src="/videos/service-showreel.webm" type="video/webm" />
              <source src="/videos/service-showreel.mp4" type="video/mp4" />
              Browser Anda tidak mendukung pemutaran video.
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
