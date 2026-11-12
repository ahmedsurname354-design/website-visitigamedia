import type { HomepageContentInput, HomepageLocaleContent } from '@/types/admin';

const id: HomepageLocaleContent = {
  hero: { title: 'PERIKLANAN', subtitle: 'Dengan berpartner bersama klien untuk menciptakan hal yang berarti, kami meningkatkan pengalaman manusia.', ctaLabel: 'HUBUNGI KAMI' },
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
  hero: { title: 'ADVERTISING', subtitle: 'By partnering with our clients to create what matters, we improve the human experience.', ctaLabel: 'CONTACT US' },
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
  hero_slides: [
    { image_url: '/hero-1600.webp', alt: 'Tampilan LED Visitiga di malam hari', content_en: { title: 'ADVERTISING', subtitle: 'By partnering with our clients to create what matters, we improve the human experience.', ctaLabel: 'CONTACT US' }, content_id: { title: 'PERIKLANAN', subtitle: 'Dengan berpartner bersama klien untuk menciptakan hal yang berarti, kami meningkatkan pengalaman manusia.', ctaLabel: 'HUBUNGI KAMI' } },
    { image_url: '/portfolio/indoor/indoor-9.webp', alt: 'Proyek LED indoor Visitiga', content_en: { title: 'OUTDOOR LED', subtitle: 'Make your brand visible day and night with powerful visual communication.', ctaLabel: 'EXPLORE OUTDOOR' }, content_id: { title: 'LED OUTDOOR', subtitle: 'Buat brand Anda terlihat siang dan malam melalui komunikasi visual yang kuat.', ctaLabel: 'LIHAT OUTDOOR' } },
    { image_url: '/portfolio/rental/rental-8.webp', alt: 'Proyek rental LED Visitiga', content_en: { title: 'INDOOR EXPERIENCE', subtitle: 'Create sharper, more memorable spaces with premium indoor display solutions.', ctaLabel: 'SEE INDOOR SOLUTIONS' }, content_id: { title: 'PENGALAMAN INDOOR', subtitle: 'Ciptakan ruang yang lebih tajam dan berkesan dengan solusi display indoor premium.', ctaLabel: 'LIHAT SOLUSI INDOOR' } },
    { image_url: '/portfolio/audiovisual/IMG_9584-scaled.webp', alt: 'Proyek audiovisual Visitiga', content_en: { title: 'EVENT IMPACT', subtitle: 'Bring every event to life with reliable rental LED and audiovisual production.', ctaLabel: 'PLAN YOUR EVENT' }, content_id: { title: 'DAMPAK EVENT', subtitle: 'Hidupkan setiap acara dengan rental LED dan produksi audiovisual yang andal.', ctaLabel: 'RENCANAKAN EVENT' } },
  ],
  about_image_url: '',
  content_id: id,
  content_en: en,
  featured_portfolio_ids: [],
};
