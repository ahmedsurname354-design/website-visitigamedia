import type { ServiceLandingContent, ServiceLandingLocaleContent, ServiceLandingSlug } from '@/types/admin';

export const serviceLandingSlugs: ServiceLandingSlug[] = ['led-indoor', 'videotron-outdoor', 'rental-led', 'media-konvensional'];

const commonId = {
  intro_eyebrow: 'Dasar perencanaan', intro_title: 'Solusi mengikuti kebutuhan lokasi.', considerations_title: 'Yang perlu dipastikan',
  process_eyebrow: 'Alur kerja', process_title: 'Tahapan yang disesuaikan dengan proyek.', portfolio_eyebrow: 'Portofolio terkait',
  portfolio_title: 'Lihat penerapannya pada proyek.', portfolio_link_text: 'Semua proyek', cta_title: 'Diskusikan kebutuhan media Anda.',
  cta_description: 'Sampaikan lokasi, ukuran area, jarak pandang, dan cara media akan digunakan agar konfigurasi dapat dibahas berdasarkan kebutuhan proyek.',
  cta_button_text: 'Hubungi Visitiga', back_text: 'Semua layanan',
};
const commonEn = {
  intro_eyebrow: 'Planning basis', intro_title: 'A solution shaped by the site.', considerations_title: 'What to confirm',
  process_eyebrow: 'Workflow', process_title: 'Stages adapted to the project.', portfolio_eyebrow: 'Related portfolio',
  portfolio_title: 'See how it works in real projects.', portfolio_link_text: 'All projects', cta_title: 'Discuss your media requirements.',
  cta_description: 'Share the location, available area, viewing distance, and intended use so the configuration can be discussed around your project.',
  cta_button_text: 'Contact Visitiga', back_text: 'All services',
};

function landing(slug: ServiceLandingSlug, content_id: ServiceLandingLocaleContent, content_en: ServiceLandingLocaleContent, seo: [string, string, string, string]): ServiceLandingContent {
  return { slug, hero_image_url: '', content_id, content_en, seo_title_id: seo[0], seo_description_id: seo[1], seo_title_en: seo[2], seo_description_en: seo[3], related_portfolio_ids: [], updated_at: '' };
}

export const defaultServiceLandings: Record<ServiceLandingSlug, ServiceLandingContent> = {
  'led-indoor': landing('led-indoor', {
    ...commonId, eyebrow: 'Layanan LED indoor', title: 'LED Indoor untuk Ruang Presentasi dan Komersial', description: 'Perencanaan LED indoor Visitiga untuk ruang rapat, kampus, retail, dan area presentasi berdasarkan jarak pandang dan kebutuhan ruang.',
    intro: 'LED indoor perlu direncanakan dari jarak pandang, ukuran bidang, sumber konten, pencahayaan ruang, jalur listrik, dan akses perawatan. Spesifikasi disesuaikan dengan kondisi penggunaan.',
    considerations: ['Jarak penonton dan ukuran bidang tayang', 'Pixel pitch dan resolusi materi', 'Sumber konten, jalur listrik, dan akses servis', 'Pencahayaan di sekitar layar'], process: ['Survei dan pengukuran ruang', 'Penentuan konfigurasi layar', 'Persiapan struktur dan jalur kabel', 'Pemasangan serta pengujian konten'],
  }, {
    ...commonEn, intro_title: 'A solution shaped by the space.', eyebrow: 'Indoor LED service', title: 'Indoor LED for Presentation and Commercial Spaces', description: 'Visitiga plans indoor LED displays for meeting rooms, campuses, retail spaces, and presentation areas based on viewing distance and room requirements.',
    intro: 'Indoor LED displays need to account for viewing distance, display size, content sources, ambient lighting, power routes, and maintenance access. Specifications are adapted to actual use.',
    considerations: ['Viewing distance and display size', 'Pixel pitch and content resolution', 'Content source, power routes, and service access', 'Lighting around the display'], process: ['Room survey and measurement', 'Display configuration', 'Structure and cable preparation', 'Installation and content testing'],
  }, ['LED Indoor untuk Ruang Komersial | Visitiga', 'Perencanaan LED indoor untuk ruang rapat, kampus, retail, dan area presentasi berdasarkan jarak pandang serta kebutuhan ruang.', 'Indoor LED for Commercial Spaces | Visitiga', 'Indoor LED planning for meeting rooms, campuses, retail, and presentation areas based on viewing distance and room requirements.']),
  'videotron-outdoor': landing('videotron-outdoor', {
    ...commonId, eyebrow: 'Layanan LED outdoor', title: 'Videotron Outdoor untuk Berbagai Kondisi Lokasi', description: 'Perencanaan videotron outdoor Visitiga dengan mempertimbangkan struktur, cuaca, tingkat kecerahan, jarak pandang, dan akses perawatan.',
    intro: 'Setiap lokasi outdoor memiliki kondisi struktur, paparan cuaca, arah pandang, dan kebutuhan kecerahan yang berbeda. Pemeriksaan lokasi dilakukan sebelum ukuran, pixel pitch, struktur, dan jalur perawatan ditentukan.',
    considerations: ['Kondisi struktur dan paparan cuaca', 'Jarak serta sudut pandang audiens', 'Kecerahan dan kebutuhan daya', 'Perizinan serta akses perawatan'], process: ['Pemeriksaan lokasi dan struktur', 'Penentuan ukuran serta pixel pitch', 'Perencanaan pemasangan', 'Pengujian dari sudut pandang aktual'],
  }, {
    ...commonEn, eyebrow: 'Outdoor LED service', title: 'Outdoor Videotron for Different Site Conditions', description: 'Visitiga plans outdoor videotrons with careful consideration of structure, weather, brightness, viewing distance, and maintenance access.',
    intro: 'Every outdoor site has different structural conditions, weather exposure, viewing directions, and brightness needs. The site is inspected before size, pixel pitch, structure, and maintenance routes are determined.',
    considerations: ['Structure and weather exposure', 'Audience distance and viewing angle', 'Brightness and power requirements', 'Permits and maintenance access'], process: ['Site and structure inspection', 'Size and pixel pitch selection', 'Installation planning', 'Testing from the actual viewing angle'],
  }, ['Videotron Outdoor untuk Berbagai Lokasi | Visitiga', 'Perencanaan videotron outdoor dengan mempertimbangkan struktur, cuaca, kecerahan, jarak pandang, daya, dan akses perawatan.', 'Outdoor Videotron for Different Sites | Visitiga', 'Outdoor videotron planning based on structure, weather exposure, brightness, viewing distance, power, and maintenance access.']),
  'rental-led': landing('rental-led', {
    ...commonId, eyebrow: 'Layanan rental LED', title: 'Rental LED untuk Acara dan Panggung', description: 'Rental LED Visitiga untuk acara, konferensi, pertunjukan, dan nonton bersama dengan konfigurasi sesuai venue dan jarak penonton.',
    intro: 'Konfigurasi rental LED mengikuti tata letak venue, ukuran panggung, jarak penonton, sumber video, jadwal pemasangan, dan kebutuhan operasional acara. Ukuran layar ditentukan setelah kondisi tersebut diketahui.',
    considerations: ['Tata letak venue dan jarak penonton', 'Ukuran panggung atau area tayang', 'Sumber video, listrik, dan jalur sinyal', 'Jadwal pemasangan dan pembongkaran'], process: ['Pemeriksaan rundown dan input', 'Survei venue', 'Pemasangan serta uji sinyal', 'Pendampingan sesuai lingkup kerja dan pembongkaran'],
  }, {
    ...commonEn, intro_title: 'A solution shaped by the venue.', eyebrow: 'LED rental service', title: 'LED Rental for Events and Stages', description: 'Visitiga provides LED rental for events, conferences, performances, and public screenings, configured for the venue and audience distance.',
    intro: 'The rental LED configuration follows the venue layout, stage dimensions, audience distance, video sources, installation schedule, and event operations. Screen size is determined after these conditions are known.',
    considerations: ['Venue layout and audience distance', 'Stage or display area size', 'Video source, power, and signal routes', 'Installation and dismantling schedule'], process: ['Rundown and input review', 'Venue survey', 'Installation and signal testing', 'Operation within scope and dismantling'],
  }, ['Rental LED untuk Acara dan Panggung | Visitiga', 'Rental LED untuk acara, konferensi, pertunjukan, dan nonton bersama dengan konfigurasi sesuai venue serta jarak penonton.', 'LED Rental for Events and Stages | Visitiga', 'LED rental for events, conferences, performances, and public screenings, configured for the venue and viewing distance.']),
  'media-konvensional': landing('media-konvensional', {
    ...commonId, eyebrow: 'Layanan media konvensional', title: 'Media Konvensional untuk Komunikasi Luar Ruang', description: 'Perencanaan billboard, lightbox, dan media konvensional Visitiga berdasarkan lokasi, ukuran bidang, materi visual, struktur, dan pencahayaan.',
    intro: 'Billboard, lightbox, dan media fisik lain perlu disesuaikan terhadap lokasi, arah pandang, struktur, ukuran materi, serta pencahayaan. Setiap bidang direncanakan agar materi sesuai dengan format media yang dipasang.',
    considerations: ['Lokasi serta arah pandang', 'Ukuran dan rasio materi visual', 'Struktur media', 'Pencahayaan dan kondisi sekitar'], process: ['Pemeriksaan lokasi', 'Penentuan format dan ukuran', 'Persiapan materi serta struktur', 'Pemasangan dan pemeriksaan hasil'],
  }, {
    ...commonEn, eyebrow: 'Conventional media service', title: 'Conventional Media for Outdoor Communication', description: 'Visitiga plans billboards, lightboxes, and conventional media around the location, display size, visual material, structure, and lighting.',
    intro: 'Billboards, lightboxes, and other physical media need to suit their location, viewing direction, structure, artwork dimensions, and lighting. Each display is planned around the installed media format.',
    considerations: ['Location and viewing direction', 'Artwork size and ratio', 'Media structure', 'Lighting and surroundings'], process: ['Site inspection', 'Format and size selection', 'Artwork and structure preparation', 'Installation and final inspection'],
  }, ['Billboard dan Media Konvensional | Visitiga', 'Perencanaan billboard, lightbox, dan media konvensional berdasarkan lokasi, bidang visual, struktur, serta pencahayaan.', 'Billboards and Conventional Media | Visitiga', 'Billboard, lightbox, and conventional media planning based on location, display area, structure, and lighting.']),
};

export const serviceLandings = defaultServiceLandings;

export function isServiceLandingSlug(value?: string): value is ServiceLandingSlug {
  return Boolean(value && serviceLandingSlugs.includes(value as ServiceLandingSlug));
}
