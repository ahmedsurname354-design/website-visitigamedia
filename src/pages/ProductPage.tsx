import { motion } from 'framer-motion';
import HorizontalAccordionCards from '@/components/HorizontalAccordionCards';
import ProductFlipbook from '@/components/ProductFlipbook';

export default function ProductPage() {
  return (
    <section className="product-page min-h-screen py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            Our Products
          </p>
          <h1 className="product-page__title text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Explore our <span className="text-orange-500">media solutions</span>
          </h1>
          <p className="product-page__description mt-5 max-w-xl text-base leading-7">
            Pilih kategori untuk melihat solusi media yang dapat disesuaikan dengan kebutuhan brand Anda.
          </p>
        </motion.div>

        <HorizontalAccordionCards />
        <ProductFlipbook />
      </div>
    </section>
  );
}
