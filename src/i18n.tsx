import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'id' | 'en';

const translations = {
  id: {
    navbar: {
      home: 'Beranda',
      about: 'Tentang Kami',
      services: 'Layanan',
      product: 'Produk',
      portfolio: 'Portfolio',
      news: 'Berita',
      contact: 'Kontak',
      openMenu: 'Buka menu',
      closeMenu: 'Tutup menu',
      languageToggle: 'Ganti bahasa',
    },
    hero: {
      trustNotice: 'Dipercaya lebih dari 500 bisnis di Indonesia',
      titleLine1: 'Wujudkan',
      titleLine2: 'Brand Anda',
      titleLine3: 'Lebih Bersinar dengan LED Premium',
      subtitle: 'Solusi LED display profesional untuk bisnis Anda. Kami menyediakan, memasang, dan merawat layar LED berkualitas tinggi yang membuat brand Anda tampil menonjol, siang dan malam.',
      viewServices: 'Lihat Layanan',
      viewPortfolio: 'Lihat Portofolio',
      scroll: 'Gulir',
    },
    about: {
      sectionLabel: 'Tentang Visitiga',
      heading: 'Mitra Tepercaya untuk Inovasi LED',
      subtitle: 'Sejak 2013, Visitiga telah menjadi pelopor dalam penyediaan solusi LED display di Indonesia. Dengan tim ahli yang berpengalaman, kami menghadirkan kualitas premium, desain kreatif, dan pelayanan terbaik untuk setiap klien.',
      features: [
        'Panel LED berkualitas premium',
        'Tim instalasi bersertifikat',
        'Desain sesuai kebutuhan',
        'Dukungan purnajual',
      ],
      contactButton: 'Hubungi Kami',
    },
    services: {
      sectionLabel: 'Layanan Kami',
      heading: 'Solusi LED Terbaik untuk Setiap Kebutuhan',
      cards: [
        {
          title: 'LED Videotron Outdoor',
          desc: 'Display LED berkualitas tinggi untuk jalan raya, gedung, dan area publik. Visibilitas maksimal siang dan malam dengan kecerahan tinggi serta tahan cuaca ekstrem.',
          tags: ['P6 / P8 / P10', 'Tahan Air', 'Kecerahan Tinggi', 'Kendali Jarak Jauh'],
          action: 'Konsultasi Outdoor',
        },
        {
          title: 'LED Display Indoor',
          desc: 'Tampilan tajam untuk lobi, mal, bank, kampus, dan ruang konferensi. Pixel pitch kecil menghasilkan visual memukau dari jarak dekat.',
          tags: ['P1.5 / P2.5 / P3.9', 'Ultra HD', 'Kipas Senyap', 'Ukuran Kustom'],
          action: 'Konsultasi Indoor',
        },
        {
          title: 'Sewa / Rental LED',
          desc: 'Solusi sewa LED videotron untuk event, konser, pameran, pernikahan, dan acara korporat. Tersedia berbagai ukuran dengan dukungan tim teknis profesional di lokasi.',
          tags: ['Event & Pameran', 'Pernikahan', 'Konser', 'Pemasangan Cepat'],
          action: 'Cek Ketersediaan',
        },
        {
          title: 'Media Konvensional',
          desc: 'Lightbox, billboard, signage toko, totem, dan neon sign untuk membangun kesadaran brand yang kuat dan tahan lama dengan dampak visual besar.',
          tags: ['Billboard', 'Lightbox', 'Totem Sign', 'Signage Toko'],
          action: 'Konsultasi Signage',
        },
      ],
    },
    portfolio: {
      sectionLabel: 'Portfolio',
      heading: 'Featured Projects',
      subtitle: 'A glimpse of our recent LED installations across retail, outdoor advertising, and events.',
      projects: [
        { title: 'Pavilion LED Billboard', category: 'Outdoor Display' },
        { title: 'Cafe Neon Signage', category: 'Neon & Signage' },
        { title: 'Retail Store LED Wall', category: 'Indoor Screen' },
        { title: 'City Billboard Campaign', category: 'Outdoor Display' },
        { title: 'Storefront Open Sign', category: 'Neon & Signage' },
        { title: 'Nightlife LED Display', category: 'Indoor Screen' },
      ],
    },
    cta: {
      title: 'Ready to Light Up Your Brand?',
      subtitle: 'Get a free consultation and quote today. Our team is ready to bring your vision to life.',
      callNow: 'Call Us Now',
      emailUs: 'Email Us',
      phoneInfo: '+62 822 5878 8780',
      emailInfo: 'marcomm@visitiga.com',
      locationInfo: 'Jl. Setra Dago Barat No.9 Antapani, Bandung',
    },
    footer: {
      brandDescription: 'Solusi LED display profesional untuk bisnis Anda di seluruh Indonesia. Premium quality, creative design, exceptional service.',
      links: {
        Company: ['About Us', 'Our Team', 'Careers', 'Contact'],
        Services: ['Outdoor LED', 'Indoor Screen', 'Neon Signage', 'Maintenance'],
        Resources: ['Portfolio', 'Blog', 'FAQ', 'Support'],
      },
      copyright: '© 2026 Visitiga LED Solutions. All rights reserved.',
      backToTop: 'Back to top',
    },
    stats: {
      data: [
        { value: '500+', label: 'Projects Completed' },
        { value: '12', label: 'Years Experience' },
        { value: '98%', label: 'Client Satisfaction' },
        { value: '24/7', label: 'Support Service' },
      ],
    },
    video: {
      watchButton: 'Watch Our Showreel',
      duration: '2:34 min — See our work in action',
      quoteText: '"The LED they installed truly changed how customers see our store. Sales went up 40% in three months."',
      quoteAuthor: '— Budi Santoso, Retail Client',
    },
    projectDetail: {
      backToProjects: 'Kembali ke Proyek',
      role: 'Peran',
      timeline: 'Durasi',
      client: 'Klien',
      techStack: 'Teknologi',
      overview: 'Ringkasan',
      challenge: 'Tantangan',
      solution: 'Solusi',
      selectedScreens: 'Pilihan layar',
      projectGallery: 'Galeri Proyek',
      interested: 'Tertarik dengan proyek serupa?',
      explore: 'Jelajahi pengalaman langsung atau kembali ke portofolio.',
      visitLive: 'Kunjungi Situs',
      viewProject: 'Lihat proyek',
    },
    loading: 'Loading...',
  },
  en: {
    navbar: {
      home: 'Home',
      about: 'About Us',
      services: 'Services',
      product: 'Product',
      portfolio: 'Portfolio',
      news: 'News',
      contact: 'Contact',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      languageToggle: 'Change language',
    },
    hero: {
      trustNotice: 'Trusted by over 500 businesses in Indonesia',
      titleLine1: 'Bring Your',
      titleLine2: 'Brand',
      titleLine3: 'to Shine with Premium LED',
      subtitle: 'Professional LED display solutions for your business. We provide, install, and maintain high-quality LED screens that make your brand stand out, day and night.',
      viewServices: 'View Services',
      viewPortfolio: 'View Portfolio',
      scroll: 'Scroll',
    },
    about: {
      sectionLabel: 'About Visitiga',
      heading: 'Trusted Partner for LED Innovation',
      subtitle: 'Since 2013, Visitiga has been a pioneer in providing LED display solutions in Indonesia. With an experienced expert team, we deliver premium quality, creative design, and excellent service for every client.',
      features: [
        'Premium quality LED panels',
        'Certified installation team',
        'Custom design solutions',
        'Post-sale support',
      ],
      contactButton: 'Contact Us',
    },
    services: {
      sectionLabel: 'Our Services',
      heading: 'The Best LED Solutions for Every Need',
      cards: [
        {
          title: 'Outdoor LED Videotron',
          desc: 'High-quality LED displays for roads, buildings, and public areas. Maximum visibility day and night with high brightness and extreme weather resistance.',
          tags: ['P6 / P8 / P10', 'Water Resistant', 'High Brightness', 'Remote Control'],
          action: 'Outdoor Consultation',
        },
        {
          title: 'Indoor LED Display',
          desc: 'Sharp visuals for lobbies, malls, banks, campuses, and conference rooms. Small pixel pitch delivers stunning visuals up close.',
          tags: ['P1.5 / P2.5 / P3.9', 'Ultra HD', 'Quiet Fans', 'Custom Size'],
          action: 'Indoor Consultation',
        },
        {
          title: 'LED Rental / Lease',
          desc: 'LED videotron rental solutions for events, concerts, exhibitions, weddings, and corporate shows. Available in various sizes with professional on-site technical support.',
          tags: ['Events & Exhibitions', 'Weddings', 'Concerts', 'Fast Installation'],
          action: 'Check Availability',
        },
        {
          title: 'Conventional Media',
          desc: 'Lightbox, billboards, store signage, totems, and neon signs to build strong, lasting brand awareness with big visual impact.',
          tags: ['Billboard', 'Lightbox', 'Totem Sign', 'Store Signage'],
          action: 'Signage Consultation',
        },
      ],
    },
    portfolio: {
      sectionLabel: 'Portfolio',
      heading: 'Featured Projects',
      subtitle: 'A glimpse of our recent LED installations across retail, outdoor advertising, and events.',
      projects: [
        { title: 'Pavilion LED Billboard', category: 'Outdoor Display' },
        { title: 'Cafe Neon Signage', category: 'Neon & Signage' },
        { title: 'Retail Store LED Wall', category: 'Indoor Screen' },
        { title: 'City Billboard Campaign', category: 'Outdoor Display' },
        { title: 'Storefront Open Sign', category: 'Neon & Signage' },
        { title: 'Nightlife LED Display', category: 'Indoor Screen' },
      ],
    },
    cta: {
      title: 'Ready to Light Up Your Brand?',
      subtitle: 'Get a free consultation and quote today. Our team is ready to bring your vision to life.',
      callNow: 'Call Us Now',
      emailUs: 'Email Us',
      phoneInfo: '+62 822 5878 8780',
      emailInfo: 'marcomm@visitiga.com',
      locationInfo: 'Jl. Setra Dago Barat No.9 Antapani, Bandung',
    },
    footer: {
      brandDescription: 'Professional LED display solutions for your business across Indonesia. Premium quality, creative design, exceptional service.',
      links: {
        Company: ['About Us', 'Our Team', 'Careers', 'Contact'],
        Services: ['Outdoor LED', 'Indoor Screen', 'Neon Signage', 'Maintenance'],
        Resources: ['Portfolio', 'Blog', 'FAQ', 'Support'],
      },
      copyright: '© 2026 Visitiga LED Solutions. All rights reserved.',
      backToTop: 'Back to top',
    },
    stats: {
      data: [
        { value: '500+', label: 'Projects Completed' },
        { value: '12', label: 'Years Experience' },
        { value: '98%', label: 'Client Satisfaction' },
        { value: '24/7', label: 'Support Service' },
      ],
    },
    video: {
      watchButton: 'Watch Our Showreel',
      duration: '2:34 min — See our work in action',
      quoteText: '"The LED they installed truly changed how customers see our store. Sales went up 40% in three months."',
      quoteAuthor: '— Budi Santoso, Retail Client',
    },
    projectDetail: {
      backToProjects: 'Back to Projects',
      role: 'Role',
      timeline: 'Timeline',
      client: 'Client',
      techStack: 'Tech Stack',
      overview: 'Overview',
      challenge: 'The Challenge',
      solution: 'The Solution',
      selectedScreens: 'Selected screens',
      projectGallery: 'Project Gallery',
      interested: 'Interested in a similar project?',
      explore: 'Explore the live experience or return to the portfolio.',
      visitLive: 'Visit Live Site',
      viewProject: 'View project',
    },
    loading: 'Loading...',
  },
};

type Dictionary = typeof translations.id;

function getTranslationValue(dictionary: Dictionary, path: string) {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }

    return undefined;
  }, dictionary);
}

interface TranslationContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => string;
  dict: Dictionary;
}

const LanguageContext = createContext<TranslationContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'id';
    const stored = localStorage.getItem('lang');
    return stored === 'en' ? 'en' : 'id';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const dict = useMemo(() => translations[lang], [lang]);
  const t = (path: string) => {
    const result = getTranslationValue(dict, path);
    return typeof result === 'string' ? result : path;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
