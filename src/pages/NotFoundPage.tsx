import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import LightReveal from '@/components/LightReveal';

export default function NotFoundPage() {
  const { lang } = useTranslation();
  const copy = lang === 'id'
    ? { eyebrow: 'Kesalahan 404', title: 'Halaman tidak ditemukan.', body: 'Alamat mungkin salah atau halaman sudah dipindahkan. Gunakan pilihan berikut untuk melanjutkan.', home: 'Kembali ke Beranda', services: 'Lihat Layanan' }
    : { eyebrow: '404 Error', title: 'Page not found.', body: 'The address may be incorrect or the page may have moved. Use one of the options below to continue.', home: 'Back to Home', services: 'View Services' };
  return (
    <section className="editorial-section grid min-h-screen place-items-center pt-32 text-center">
      <LightReveal className="editorial-container max-w-3xl">
        <p className="editorial-eyebrow">{copy.eyebrow}</p>
        <h1 className="editorial-title mx-auto">{copy.title}</h1>
        <p className="mx-auto mt-6 max-w-xl leading-7 text-[#6f6258]">{copy.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="not-found-action editorial-button editorial-button--primary"><Home aria-hidden="true" />{copy.home}</Link>
          <Link to="/services" className="not-found-action editorial-button editorial-button--outline"><ArrowLeft aria-hidden="true" />{copy.services}</Link>
        </div>
      </LightReveal>
    </section>
  );
}
