import { type FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const submissionKeyName = 'visitiga_contact_submission_key';

function contactSubmissionKey() {
  const existing = localStorage.getItem(submissionKeyName);
  if (existing && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing)) return existing;
  const key = crypto.randomUUID();
  localStorage.setItem(submissionKeyName, key);
  return key;
}

function getContactErrorMessage(error: { code?: string; message?: string }) {
  if (error.message?.toLowerCase().includes('rate limit')) {
    return 'Terlalu banyak percobaan. Tunggu sekitar 15 menit sebelum mengirim kembali.';
  }

  if (error.code === '401' || error.message?.toLowerCase().includes('unauthorized')) {
    return 'Layanan formulir menolak kredensial website. Periksa kembali publishable key Supabase di Vercel.';
  }

  if (error.code === '42501') {
    return 'Pengiriman ditolak oleh konfigurasi keamanan form. Pastikan migration security terbaru sudah dijalankan di Supabase.';
  }

  if (error.code === '23514') {
    return 'Periksa kembali data: nama minimal 2 karakter, pesan minimal 10 karakter, dan nomor WhatsApp bila diisi harus valid.';
  }

  if (error.message?.toLowerCase().includes('fetch')) {
    return 'Tidak dapat terhubung ke layanan formulir. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di Vercel.';
  }

  return 'Pesan belum terkirim. Periksa koneksi, lalu coba lagi.';
}

export default function CTASection() {
  const { ref, isInView } = useScrollReveal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;

    if (!supabase) {
      setFormError('Konfigurasi formulir belum tersedia. Hubungi administrator website.');
      setFormStatus('error');
      return;
    }

    setIsSubmitting(true);
    setFormStatus('idle');
    setFormError('');

    const form = new FormData(formElement);
    try {
      const { error } = await supabase.rpc('submit_contact_message', {
        p_name: String(form.get('name') ?? '').trim(),
        p_email: String(form.get('email') ?? '').trim(),
        p_phone: String(form.get('phone') ?? '').trim() || null,
        p_message: String(form.get('message') ?? '').trim(),
        p_submission_key: contactSubmissionKey(),
        p_honeypot: String(form.get('company') ?? ''),
      });

      if (error) {
        console.error('Failed to submit contact message:', error.message);
        setFormError(getContactErrorMessage(error));
        setFormStatus('error');
        return;
      }

      formElement.reset();
      setFormStatus('success');
    } catch (error) {
      console.error('Unexpected error while submitting contact message:', error);
      setFormError(getContactErrorMessage(error instanceof Error ? error : {}));
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative theme-section py-24 md:py-32 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
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

            <div className="flex flex-col items-stretch justify-center gap-3 mt-8 min-[440px]:flex-row min-[440px]:items-center sm:mt-10">
              <a
                href="https://bit.ly/49NclAE"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-12 items-center justify-center gap-2 bg-black hover:bg-orange-950 text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                <Phone className="w-4 h-4" />
                Call Us Now
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="mailto:marcomm@visitiga.com?subject=Konsultasi%20Visitiga%20Media"
                className="flex min-h-12 items-center justify-center bg-white/20 hover:bg-white/30 text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                Email Us
              </a>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-4 rounded-2xl border border-white/15 bg-black/10 p-4 text-left sm:mt-10 sm:grid-cols-2 sm:rounded-3xl sm:p-6 max-w-3xl mx-auto"
            >
              <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="contact-company">Perusahaan<input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" /></label>
              </div>
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-white">Nama</label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  placeholder="Nama Anda"
                  className="contact-field w-full rounded-xl px-4 py-3 outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-white">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="email@anda.com"
                  className="contact-field w-full rounded-xl px-4 py-3 outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-white">Nomor WhatsApp <span className="text-white/60">(opsional)</span></label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  minLength={7}
                  maxLength={30}
                  autoComplete="tel"
                  placeholder="08xxxxxxxxxx"
                  className="contact-field w-full rounded-xl px-4 py-3 outline-none transition"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-white">Kebutuhan Anda</label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={4}
                  placeholder="Ceritakan kebutuhan LED display Anda..."
                  className="contact-field w-full resize-y rounded-xl px-4 py-3 outline-none transition"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-h-12 rounded-full bg-white px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim Permintaan'}
                </button>
                {formStatus === 'success' && <p role="status" className="text-sm text-white">Pesan berhasil dikirim. Terima kasih!</p>}
                {formStatus === 'error' && <p role="alert" className="text-sm text-white">{formError}</p>}
              </div>
            </form>

            {/* Contact info */}
            <div className="grid lg:grid-cols-[1fr,320px] gap-6 mt-10 sm:mt-14 max-w-4xl mx-auto items-start">
              <div className="grid gap-4">
                <div className="contact-info-card rounded-3xl p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-orange-400" />
                    <span>+62 822 5878 8780</span>
                  </div>
                </div>
                <div className="contact-info-card rounded-3xl p-4">
                  <a href="mailto:marcomm@visitiga.com?subject=Konsultasi%20Visitiga%20Media" className="flex items-center gap-3 text-sm transition-colors duration-200">
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span>marcomm@visitiga.com</span>
                  </a>
                </div>
                <div className="contact-info-card rounded-3xl p-4">
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
