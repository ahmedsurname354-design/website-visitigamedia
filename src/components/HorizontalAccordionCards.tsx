import { useEffect, useState, type CSSProperties } from 'react';
import { listPublicProducts } from '@/lib/adminApi';

type AccordionItem = {
  title: string;
  label: string;
  description: string;
  image: string;
  color: string;
  accent: string;
};

// Ubah isi array ini untuk mengganti teks, warna, dan gambar setiap kartu.
const fallbackItems: AccordionItem[] = [
  {
    title: 'LED OUTDOOR',
    label: '01 / Experience',
    description: 'High definition LED display dengan fine pixel pitch, high refresh rate, dan desain slim/lightweight yang hemat energi. Menghasilkan visual tajam flicker-free serta mudah diinstal. Ideal untuk roadside billboard hingga commercial venue.',
    image: '/products/outdoor.webp',
    color: '#2a1a12',
    accent: '#fb923c',
  },
  {
    title: 'LED INDOOR',
    label: '02 / Campaign',
    description: 'Layar dengan piksel rapat dan refresh rate tinggi untuk visual mulus dan cerah dari jarak dekat. Berdesain tipis, ringan, dan efisien daya, memudahkan setup serta perawatan di conference room, lobi hotel, hingga storefront.',
    image: '/products/indoor.webp',
    color: '#3b2013',
    accent: '#fed7aa',
  },
  {
    title: 'LED RENTAL',
    label: '03 / Retail',
    description: 'Display LED portabel untuk acara indoor/outdoor seperti konser, pameran, dan wedding. Menampilkan visual mulus flicker-free dengan modul slim dan hemat energi yang cepat dipasang maupun dibongkar.',
    image: '/products/rental.webp',
    color: '#1c1511',
    accent: '#fdba74',
  },
  {
    title: 'LED TRANSPARENT',
    label: '04 / Impact',
    description: 'Layar transparan berteknologi tinggi yang menampilkan visual cerah tanpa menghalangi pandangan di baliknya. Ringan dan efisien energi, sangat cocok untuk storefront, fasad, dan arsitektur modern (indoor/outdoor).',
    image: '/products/transparent.webp',
    color: '#331b10',
    accent: '#ffedd5',
  },
  {
    title: 'LED CREATIVE',
    label: '05 / Event',
    description: 'Display fleksibel yang dapat dikustomisasi ke berbagai bentuk unik (lengkung, silinder, dll.) untuk pengalaman visual imersif. Pilihan tepat untuk retail dan pameran yang ingin tampil beda dan eye-catching.',
    image: '/products/creative.webp',
    color: '#452516',
    accent: '#fb923c',
  },
  {
    title: 'LED ALL IN ONE',
    label: '06 / Motion',
    description: 'Solusi plug-and-play praktis yang menggabungkan layar dan sistem dalam satu unit slim dan portabel. Menghadirkan performa visual profesional tanpa instalasi rumit, ideal untuk meeting room dan presentasi.',
    image: '/products/all%20in%20one.webp',
    color: '#21150f',
    accent: '#fed7aa',
  },
];

export default function HorizontalAccordionCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [items, setItems] = useState<AccordionItem[]>(fallbackItems);

  useEffect(() => {
    let active = true;
    void listPublicProducts().then((products) => {
      if (!active || products.length === 0) return;
      setItems(products.map((product) => ({ title: product.name, label: product.label, description: product.description, image: product.image_url, color: product.color, accent: product.accent })));
      setActiveIndex(0);
    }).catch(() => {
      // Static cards keep the public product page functional until Supabase is configured.
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="accordion-cards" aria-label="Layanan media kami">
      {items.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <button
            type="button"
            key={item.title}
            className={`accordion-card ${isActive ? 'is-active' : ''}`}
            style={{ '--card-color': item.color, '--card-accent': item.accent } as CSSProperties}
            onClick={() => setActiveIndex(index)}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            aria-expanded={isActive}
          >
            <span className="accordion-card__content">
              <span className="accordion-card__label">{item.label}</span>
              <span className="accordion-card__image-wrap">
                <img className="accordion-card__image" src={item.image} alt="" decoding="async" />
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
