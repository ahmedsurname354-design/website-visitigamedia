import { motion } from 'framer-motion';
import HorizontalAccordionCards from '@/components/HorizontalAccordionCards';
import ProductFlipbook from '@/components/ProductFlipbook';
import { useTranslation } from '@/i18n';

export default function ProductPage() {
  const { lang } = useTranslation();
  return (
    <section className="product-page min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            {lang === 'id' ? 'Produk Kami' : 'Our Products'}
          </p>
          <h1 className="product-page__title text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {lang === 'id' ? 'Jelajahi ' : 'Explore our '}<span className="text-orange-500">{lang === 'id' ? 'solusi media' : 'media solutions'}</span>
          </h1>
          <p className="product-page__description mt-5 max-w-xl text-base leading-7">
            {lang === 'id' ? 'Pilih kategori untuk melihat solusi media yang dapat disesuaikan dengan kebutuhan brand Anda.' : 'Choose a category to discover media solutions tailored to your brand.'}
          </p>
        </motion.div>

        <HorizontalAccordionCards />
        <ProductFlipbook />
      </div>
    </section>
  );
}
