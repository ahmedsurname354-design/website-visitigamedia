import { useEffect, useState, type CSSProperties } from 'react';
import { responsiveImageSources } from '@/lib/imageUrl';
import { getPrerenderData } from '@/lib/prerenderData';
import { useTranslation } from '@/i18n';
import { localizedProduct } from '@/lib/contentLocale';

type AccordionItem = {
  title: string;
  label: string;
  description: string;
  image: string;
  color: string;
  accent: string;
};

export default function HorizontalAccordionCards() {
  const { lang } = useTranslation();
  const initialProducts = getPrerenderData()?.products;
  const initialProductCount = initialProducts?.length ?? 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [items, setItems] = useState<AccordionItem[]>(() => initialProducts?.map((raw) => { const product = localizedProduct(raw, lang); return { title: product.name, label: product.label, description: product.description, image: product.image_url, color: product.color, accent: product.accent }; }) ?? []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState('');

  const activate = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => void import('@/lib/publicApi').then(({ listPublicProducts }) => listPublicProducts()).then((products) => {
      if (!active) return;
      setItems(products.map((raw) => { const product = localizedProduct(raw, lang); return { title: product.name, label: product.label, description: product.description, image: product.image_url, color: product.color, accent: product.accent }; }));
      setActiveIndex(0);
      setError('');
    }).catch(() => { if (active) setError('Produk belum dapat dimuat. Silakan coba lagi.'); }).finally(() => { if (active) setLoading(false); }), initialProductCount ? 1500 : 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, [initialProductCount, lang]);

  return (
    <div className="accordion-cards" aria-label="Layanan media kami">
      {loading && <p role="status" className="text-sm text-white/70">Memuat produk…</p>}
      {!loading && error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {!loading && !error && items.length === 0 && <p className="text-sm text-white/70">Belum ada produk yang tersedia.</p>}
      {items.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <button
            type="button"
            key={item.title}
            className={`accordion-card ${isActive ? 'is-active' : ''}`}
            style={{ '--card-color': item.color, '--card-accent': item.accent } as CSSProperties}
            onClick={() => activate(index)}
            onMouseEnter={() => activate(index)}
            onFocus={() => activate(index)}
            aria-expanded={isActive}
          >
            <span className="accordion-card__content">
              <span className="accordion-card__label">{item.label}</span>
              <span className="accordion-card__image-wrap">
                <img className="accordion-card__image" {...responsiveImageSources(item.image)} sizes="(min-width: 1024px) 40vw, 90vw" width="900" height="675" alt="" fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />
              </span>
              <span className="accordion-card__copy">
                <span className="accordion-card__title">{item.title}</span>
                <span className="accordion-card__description">{item.description}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
