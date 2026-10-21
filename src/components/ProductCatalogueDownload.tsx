import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { getProductCatalogue } from '@/lib/adminApi';
import { getPrerenderData } from '@/lib/prerenderData';

const FALLBACK_PDF = '/products/product-catalogue-2026.pdf';

export default function ProductCatalogueDownload() {
  const { lang } = useTranslation();
  const initialCatalogue = getPrerenderData()?.catalogue;
  const [title, setTitle] = useState(initialCatalogue?.title || (lang === 'id' ? 'Katalog Produk 2026' : 'Product Catalogue 2026'));
  const [fileUrl, setFileUrl] = useState(initialCatalogue?.file_url || FALLBACK_PDF);

  useEffect(() => {
    let active = true;
    void getProductCatalogue()
      .then((catalogue) => {
        if (!active || !catalogue) return;
        setTitle(catalogue.title);
        setFileUrl(catalogue.file_url);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const heading = lang === 'id' ? 'Unduh katalog produk' : 'Download the product catalogue';
  const description = lang === 'id'
    ? 'Dapatkan katalog lengkap solusi media kami dalam format PDF.'
    : 'Get our complete media solutions catalogue in PDF format.';
  const buttonLabel = lang === 'id' ? 'Download katalog PDF' : 'Download PDF catalogue';

  return (
    <section className="mt-20 border-t border-current/10 pt-16 md:mt-24 md:pt-20" aria-labelledby="catalogue-title">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
          {lang === 'id' ? 'Katalog Produk' : 'Product Catalogue'}
        </p>
        <h2 id="catalogue-title" className="product-page__title mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {heading}
        </h2>
        <p className="product-page__description mt-3 max-w-xl leading-7">{description}</p>
        <a
          href={fileUrl}
          download="product-catalogue.pdf"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          <Download className="h-4 w-4" />
          {buttonLabel}
        </a>
        <p className="mt-3 text-sm text-current/60">{title}</p>
      </div>
    </section>
  );
}
