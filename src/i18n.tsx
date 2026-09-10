import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'id' | 'en';

const translations = {
  id: {
    navbar: {
      home: 'Beranda',
      about: 'Tentang Kami',
      services: 'Layanan',
      product: 'Produk',
      portfolio: 'Portofolio',
      news: 'Berita',
      contact: 'Kontak',
      openMenu: 'Buka menu',
      closeMenu: 'Tutup menu',
      languageToggle: 'Ganti bahasa',
    },
    hero: {
      trustNotice: 'Dipercaya lebih dari 500 bisnis di Indonesia',
      titleLine1: 'Wujudkan',
      titleLine2: 'Merek Anda',
      titleLine3: 'Lebih Bersinar dengan LED Premium',
      subtitle: 'Solusi layar LED profesional untuk bisnis Anda. Kami menyediakan, memasang, dan merawat layar LED berkualitas tinggi yang membuat merek Anda tampil menonjol, siang dan malam.',
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
      sectionLabel: 'Portofolio',
      heading: 'Proyek Unggulan',
      subtitle: 'Lihat pilihan instalasi LED terbaru kami untuk kebutuhan ritel, iklan luar ruang, dan acara.',
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
      title: 'Siap Membuat Merek Anda Lebih Bersinar?',
      subtitle: 'Dapatkan konsultasi dan penawaran gratis. Tim kami siap mewujudkan kebutuhan visual Anda.',
      callNow: 'Hubungi Kami',
      emailUs: 'Kirim Email',
      phoneInfo: '+62 822 5878 8780',
      emailInfo: 'marcomm@visitiga.com',
      locationInfo: 'Jl. Setra Dago Barat No.9 Antapani, Bandung',
    },
    faq: {
      eyebrow: 'Tanya Jawab',
      title: 'Pertanyaan yang Sering Diajukan',
      introduction: 'Temukan informasi umum tentang solusi media Visitiga. Untuk harga, jadwal, garansi, dan ketersediaan, tim kami akan memberikan informasi sesuai kebutuhan proyek Anda.',
      items: [
        {
          question: 'Layanan apa saja yang tersedia di Visitiga?',
          answer: 'Visitiga menyediakan LED videotron outdoor, LED display indoor, rental LED untuk berbagai acara, serta media konvensional seperti billboard, lightbox, totem sign, signage toko, dan neon sign.',
        },
        {
          question: 'Apa perbedaan LED display indoor dan outdoor?',
          answer: 'LED outdoor dirancang untuk area luar ruang dengan tingkat kecerahan tinggi dan ketahanan terhadap cuaca. LED indoor mengutamakan ketajaman visual dari jarak dekat untuk lokasi seperti lobi, mal, bank, kampus, dan ruang konferensi.',
        },
        {
          question: 'Apakah Visitiga menyediakan rental LED untuk acara?',
          answer: 'Ya. Rental LED tersedia untuk event, konser, pameran, pernikahan, dan acara korporat, dengan pilihan ukuran serta dukungan tim teknis di lokasi. Ketersediaan perlu dikonfirmasi kepada tim Visitiga.',
        },
        {
          question: 'Media konvensional apa saja yang dapat dikerjakan?',
          answer: 'Pilihan media konvensional meliputi billboard, lightbox, signage toko, totem sign, dan neon sign. Tim Visitiga dapat membantu menentukan solusi berdasarkan lokasi dan kebutuhan visual merek Anda.',
        },
        {
          question: 'Apakah ukuran dan spesifikasi LED dapat disesuaikan?',
          answer: 'Ya. Solusi dapat disesuaikan dengan kebutuhan proyek. Visitiga menyediakan beberapa pilihan pixel pitch untuk penggunaan indoor dan outdoor; spesifikasi akhirnya ditentukan setelah kebutuhan dan lokasi ditinjau.',
        },
        {
          question: 'Bagaimana proses konsultasi dan permintaan penawaran?',
          answer: 'Sampaikan kebutuhan Anda melalui WhatsApp, email, atau formulir kontak. Tim Visitiga akan mempelajari informasi proyek terlebih dahulu sebelum memberikan rekomendasi dan penawaran yang relevan.',
        },
        {
          question: 'Apakah Visitiga menangani pemasangan dan dukungan setelah penjualan?',
          answer: 'Ya. Layanan Visitiga mencakup penyediaan, pemasangan, dan perawatan LED display, serta dukungan purnajual. Detail cakupan dukungan dan garansi akan dikonfirmasi sesuai produk atau proyek yang dipilih.',
        },
        {
          question: 'Apakah layanan tersedia untuk proyek di luar Bandung?',
          answer: 'Visitiga melayani kebutuhan solusi LED untuk bisnis di Indonesia. Silakan informasikan lokasi proyek agar tim dapat mengonfirmasi jangkauan layanan, kebutuhan teknis, dan ketersediaannya.',
        },
        {
          question: 'Informasi apa yang perlu disiapkan sebelum konsultasi?',
          answer: 'Siapkan jenis kebutuhan, lokasi pemasangan atau acara, perkiraan ukuran layar, kondisi indoor atau outdoor, serta jadwal yang diharapkan. Foto lokasi atau referensi visual juga dapat membantu proses konsultasi.',
        },
        {
          question: 'Bagaimana cara menghubungi Visitiga?',
          answer: 'Anda dapat menghubungi Visitiga melalui WhatsApp, mengirim email ke marcomm@visitiga.com, atau mengisi formulir pada halaman Kontak. Kantor pusat Visitiga berada di Jl. Setra Dago Barat No.9 Antapani, Bandung.',
        },
      ],
      ctaTitle: 'Masih punya pertanyaan?',
      ctaDescription: 'Ceritakan kebutuhan visual Anda dan dapatkan informasi yang sesuai langsung dari tim Visitiga.',
      whatsapp: 'Konsultasi via WhatsApp',
      contact: 'Buka Halaman Kontak',
    },
    footer: {
      brandDescription: 'Solusi layar LED profesional untuk bisnis Anda di seluruh Indonesia. Kualitas premium, desain kreatif, dan layanan terbaik.',
      links: {
        Company: ['About Us', 'Our Team', 'Careers', 'Contact'],
        Services: ['Outdoor LED', 'Indoor Screen', 'Neon Signage', 'Maintenance'],
        Resources: ['Portfolio', 'Blog', 'FAQ', 'Support'],
      },
      copyright: '© 2026 Visitiga LED Solutions. Seluruh hak cipta dilindungi.',
      backToTop: 'Kembali ke atas',
    },
    stats: {
      data: [
        { value: '500+', label: 'Proyek Diselesaikan' },
        { value: '12', label: 'Tahun Pengalaman' },
        { value: '98%', label: 'Kepuasan Klien' },
        { value: '24/7', label: 'Layanan Dukungan' },
      ],
    },
    video: {
      watchButton: 'Saksikan Cuplikan Kami',
      duration: '2:34 menit — Lihat hasil kerja kami',
      quoteText: '"LED yang mereka pasang benar-benar mengubah cara pelanggan melihat toko kami. Penjualan meningkat 40% dalam tiga bulan."',
      quoteAuthor: '— Budi Santoso, Klien Ritel',
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
    loading: 'Memuat...',
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
    faq: {
      eyebrow: 'Frequently Asked Questions',
      title: 'How Can We Help?',
      introduction: 'Find general information about Visitiga media solutions. For pricing, schedules, warranties, and availability, our team will provide details based on your project requirements.',
      items: [
        {
          question: 'What services does Visitiga provide?',
          answer: 'Visitiga provides outdoor LED videotrons, indoor LED displays, LED rentals for various events, and conventional media such as billboards, lightboxes, totem signs, store signage, and neon signs.',
        },
        {
          question: 'What is the difference between indoor and outdoor LED displays?',
          answer: 'Outdoor LED displays are designed for exterior locations with high brightness and weather resistance. Indoor LED displays prioritize sharp visuals at close viewing distances for locations such as lobbies, malls, banks, campuses, and conference rooms.',
        },
        {
          question: 'Does Visitiga provide LED rentals for events?',
          answer: 'Yes. LED rentals are available for events, concerts, exhibitions, weddings, and corporate functions, with a choice of sizes and on-site technical support. Availability must be confirmed with the Visitiga team.',
        },
        {
          question: 'What types of conventional media are available?',
          answer: 'Conventional media options include billboards, lightboxes, store signage, totem signs, and neon signs. The Visitiga team can help determine a solution based on the location and your brand\'s visual requirements.',
        },
        {
          question: 'Can the LED size and specifications be customized?',
          answer: 'Yes. Solutions can be tailored to project requirements. Visitiga provides several pixel-pitch options for indoor and outdoor use; final specifications are determined after reviewing the requirements and location.',
        },
        {
          question: 'How do consultations and quotation requests work?',
          answer: 'Share your requirements through WhatsApp, email, or the contact form. The Visitiga team will review the project information before providing a relevant recommendation and quotation.',
        },
        {
          question: 'Does Visitiga handle installation and after-sales support?',
          answer: 'Yes. Visitiga services include supplying, installing, and maintaining LED displays, as well as after-sales support. The scope of support and warranty details will be confirmed for the selected product or project.',
        },
        {
          question: 'Are services available for projects outside Bandung?',
          answer: 'Visitiga serves business LED solution needs across Indonesia. Share the project location so the team can confirm service coverage, technical requirements, and availability.',
        },
        {
          question: 'What information should I prepare before a consultation?',
          answer: 'Prepare the type of requirement, installation or event location, estimated screen size, indoor or outdoor conditions, and expected schedule. Location photos or visual references can also support the consultation.',
        },
        {
          question: 'How can I contact Visitiga?',
          answer: 'You can contact Visitiga through WhatsApp, email marcomm@visitiga.com, or submit the form on the Contact page. Visitiga\'s head office is at Jl. Setra Dago Barat No.9 Antapani, Bandung.',
        },
      ],
      ctaTitle: 'Still have questions?',
      ctaDescription: 'Tell us about your visual requirements and get relevant information directly from the Visitiga team.',
      whatsapp: 'Consult via WhatsApp',
      contact: 'Open Contact Page',
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
    document.documentElement.lang = lang;
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
