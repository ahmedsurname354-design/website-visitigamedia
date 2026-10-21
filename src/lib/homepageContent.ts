import type { HomepageContentInput, HomepageLocaleContent } from '@/types/admin';

const id: HomepageLocaleContent = {
  hero: { eyebrow: 'VISUAL TECHNOLOGY · INDONESIA', trustNotice: 'Dipercaya lebih dari 500 bisnis di Indonesia', titleLine1: 'Wujudkan', titleLine2: 'Merek Anda', titleLine3: 'Lebih Bersinar dengan LED Premium', subtitle: 'Solusi layar LED profesional untuk bisnis Anda. Kami menyediakan, memasang, dan merawat layar LED berkualitas tinggi yang membuat merek Anda tampil menonjol, siang dan malam.', viewServices: 'Lihat Layanan', viewPortfolio: 'Lihat Portofolio' },
  stats: [{ value: '500+', label: 'Proyek Diselesaikan' }, { value: '12', label: 'Tahun Pengalaman' }, { value: '98%', label: 'Kepuasan Klien' }, { value: '24/7', label: 'Layanan Dukungan' }],
  services: { sectionLabel: 'Layanan Kami', heading: 'Solusi visual untuk setiap ruang.', linkLabel: 'Lihat semua layanan', cards: [
    { title: 'LED Videotron Outdoor', description: 'Display LED berkualitas tinggi untuk jalan raya, gedung, dan area publik. Visibilitas maksimal siang dan malam dengan kecerahan tinggi serta tahan cuaca ekstrem.', tags: ['P6 / P8 / P10', 'Tahan Air', 'Kecerahan Tinggi', 'Kendali Jarak Jauh'], action: 'Konsultasi Outdoor' },
    { title: 'LED Display Indoor', description: 'Tampilan tajam untuk lobi, mal, bank, kampus, dan ruang konferensi. Pixel pitch kecil menghasilkan visual memukau dari jarak dekat.', tags: ['P1.5 / P2.5 / P3.9', 'Ultra HD', 'Kipas Senyap', 'Ukuran Kustom'], action: 'Konsultasi Indoor' },
    { title: 'Sewa / Rental LED', description: 'Solusi sewa LED videotron untuk event, konser, pameran, pernikahan, dan acara korporat. Tersedia berbagai ukuran dengan dukungan tim teknis profesional di lokasi.', tags: ['Event & Pameran', 'Pernikahan', 'Konser', 'Pemasangan Cepat'], action: 'Cek Ketersediaan' },
    { title: 'Media Konvensional', description: 'Lightbox, billboard, signage toko, totem, dan neon sign untuk membangun kesadaran brand yang kuat dan tahan lama dengan dampak visual besar.', tags: ['Billboard', 'Lightbox', 'Totem Sign', 'Signage Toko'], action: 'Konsultasi Signage' },
  ] },
  about: { sectionLabel: 'Tentang Visitiga', heading: 'Partner yang memahami dampak sebuah tampilan.', subtitle: 'Sejak 2013, Visitiga telah menjadi pelopor dalam penyediaan solusi LED display di Indonesia. Dengan tim ahli yang berpengalaman, kami menghadirkan kualitas premium, desain kreatif, dan pelayanan terbaik untuk setiap klien.', features: ['Panel LED berkualitas premium', 'Tim instalasi bersertifikat', 'Desain sesuai kebutuhan', 'Dukungan purnajual'], buttonLabel: 'Tentang Visitiga', clientProofLabel: 'Dipercaya oleh brand dan institusi terkemuka' },
  cta: { title: 'Siap Membuat Merek Anda Lebih Bersinar?', subtitle: 'Dapatkan konsultasi dan penawaran gratis. Tim kami siap mewujudkan kebutuhan visual Anda.', callNow: 'Hubungi Kami', emailUs: 'Kirim Email', phoneInfo: '+62 822 5878 8780', emailInfo: 'marcomm@visitiga.com', locationInfo: 'Jl. Setra Dago Barat No.9 Antapani, Bandung' },
};

const en: HomepageLocaleContent = {
  hero: { eyebrow: 'VISUAL TECHNOLOGY · INDONESIA', trustNotice: 'Trusted by over 500 businesses in Indonesia', titleLine1: 'Bring Your', titleLine2: 'Brand', titleLine3: 'to Shine with Premium LED', subtitle: 'Professional LED display solutions for your business. We provide, install, and maintain high-quality LED screens that make your brand stand out, day and night.', viewServices: 'View Services', viewPortfolio: 'View Portfolio' },
  stats: [{ value: '500+', label: 'Projects Completed' }, { value: '12', label: 'Years Experience' }, { value: '98%', label: 'Client Satisfaction' }, { value: '24/7', label: 'Support Service' }],
  services: { sectionLabel: 'Our Services', heading: 'Visual solutions for every space.', linkLabel: 'Explore all services', cards: [
    { title: 'Outdoor LED Videotron', description: 'High-quality LED displays for roads, buildings, and public areas. Maximum visibility day and night with high brightness and extreme weather resistance.', tags: ['P6 / P8 / P10', 'Water Resistant', 'High Brightness', 'Remote Control'], action: 'Outdoor Consultation' },
    { title: 'Indoor LED Display', description: 'Sharp visuals for lobbies, malls, banks, campuses, and conference rooms. Small pixel pitch delivers stunning visuals up close.', tags: ['P1.5 / P2.5 / P3.9', 'Ultra HD', 'Quiet Fans', 'Custom Size'], action: 'Indoor Consultation' },
    { title: 'LED Rental / Lease', description: 'LED videotron rental solutions for events, concerts, exhibitions, weddings, and corporate shows. Available in various sizes with professional on-site technical support.', tags: ['Events & Exhibitions', 'Weddings', 'Concerts', 'Fast Installation'], action: 'Check Availability' },
    { title: 'Conventional Media', description: 'Lightbox, billboards, store signage, totems, and neon signs to build strong, lasting brand awareness with big visual impact.', tags: ['Billboard', 'Lightbox', 'Totem Sign', 'Store Signage'], action: 'Signage Consultation' },
  ] },
  about: { sectionLabel: 'About Visitiga', heading: 'A partner who understands the impact of every display.', subtitle: 'Since 2013, Visitiga has been a pioneer in providing LED display solutions in Indonesia. With an experienced expert team, we deliver premium quality, creative design, and excellent service for every client.', features: ['Premium quality LED panels', 'Certified installation team', 'Custom design solutions', 'Post-sale support'], buttonLabel: 'About Visitiga', clientProofLabel: 'Trusted by leading brands and institutions' },
  cta: { title: 'Ready to Light Up Your Brand?', subtitle: 'Get a free consultation and quote today. Our team is ready to bring your vision to life.', callNow: 'Call Us Now', emailUs: 'Email Us', phoneInfo: '+62 822 5878 8780', emailInfo: 'marcomm@visitiga.com', locationInfo: 'Jl. Setra Dago Barat No.9 Antapani, Bandung' },
};

export const defaultHomepageContent: HomepageContentInput = {
  hero_image_url: '/hero-1600.webp',
  about_image_url: '',
  content_id: id,
  content_en: en,
  featured_portfolio_ids: [],
};
