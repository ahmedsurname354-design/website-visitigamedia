import { type FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CTASection() {
  const { ref, isInView } = useScrollReveal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setFormStatus('error');
      return;
    }

    setIsSubmitting(true);
    setFormStatus('idle');

    const form = new FormData(event.currentTarget);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: String(form.get('name') ?? '').trim(),
        email: String(form.get('email') ?? '').trim(),
        phone: String(form.get('phone') ?? '').trim() || null,
        message: String(form.get('message') ?? '').trim(),
      });

      if (error) {
        console.error('Failed to submit contact message:', error.message);
        setFormStatus('error');
        return;
      }

      event.currentTarget.reset();
      setFormStatus('success');
    } catch (error) {
      console.error('Unexpected error while submitting contact message:', error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative theme-section py-24 md:py-32 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="theme-keep-light bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-white/5 rounded-full" />

          <div className="relative">
            <h2 className="text-white font-bold text-3xl md:text-5xl leading-tight tracking-tight max-w-2xl mx-auto">
              Ready to Light Up Your Brand?
            </h2>
            <p className="text-white/80 text-lg mt-4 max-w-xl mx-auto">
              Get a free consultation and quote today. Our team is ready to bring your vision to life.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
              <a
                href="https://bit.ly/49NclAE"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 bg-black hover:bg-orange-950 text-white px-7 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <Phone className="w-4 h-4" />
                Call Us Now
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="mailto:marcomm@visitiga.com"
                className="bg-white/20 hover:bg-white/30 text-white px-7 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                Email Us
              </a>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-10 grid gap-4 rounded-3xl border border-white/15 bg-black/10 p-5 text-left sm:grid-cols-2 sm:p-6 max-w-3xl mx-auto"
            >
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-white">Nama</label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Nama Anda"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-white focus:bg-white/15"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-white">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="email@anda.com"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-white focus:bg-white/15"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-white">Nomor WhatsApp <span className="text-white/60">(opsional)</span></label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-white focus:bg-white/15"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-white">Kebutuhan Anda</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Ceritakan kebutuhan LED display Anda..."
                  className="w-full resize-y rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 outline-none transition focus:border-white focus:bg-white/15"
                />
              </div>
              <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-white px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Permintaan'}
                </button>
                {formStatus === 'success' && <p role="status" className="text-sm text-white">Pesan berhasil dikirim. Terima kasih!</p>}
                {formStatus === 'error' && <p role="alert" className="text-sm text-white">Pesan belum terkirim. Periksa koneksi atau konfigurasi formulir, lalu coba lagi.</p>}
              </div>
            </form>

            {/* Contact info */}
            <div className="grid lg:grid-cols-[1fr,320px] gap-6 mt-14 max-w-4xl mx-auto items-start">
              <div className="grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white/90">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-orange-400" />
                    <span>+62 812 3456 7890</span>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white/90">
                  <a href="mailto:marcomm@visitiga.com" className="flex items-center gap-3 text-sm text-white/90 hover:text-white transition-colors duration-200">
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span>marcomm@visitiga.com</span>
                  </a>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white/90">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>Jl. Setra Dago Barat No.9 Antapani, Bandung</span>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/UqC6Q9s5XSWrotai6"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-3xl overflow-hidden border border-white/10 bg-white/10 transition-shadow duration-300 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="relative h-44 bg-black">
                  <iframe
                    src="https://www.google.com/maps?q=Jl.+Setra+Dago+Barat+No.9+Antapani+Bandung&output=embed"
                    title="Office location map"
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                  />
                </div>
                <div className="bg-black/90 p-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Head Office Location</p>
                  <p className="mt-3 text-white font-semibold text-sm">Jl. Setra Dago Barat No.9 Antapani, Bandung</p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-2 text-sm font-semibold text-black transition-colors duration-300 group-hover:bg-orange-400">
                    Open in Maps
                  </p>
                </div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
