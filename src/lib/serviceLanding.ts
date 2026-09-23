export const serviceLandingSlugs = ['led-indoor', 'videotron-outdoor', 'rental-led', 'media-konvensional'] as const;
export type ServiceLandingSlug = typeof serviceLandingSlugs[number];

type ServiceLanding = {
  slug: ServiceLandingSlug;
  title: string;
  eyebrow: string;
  description: string;
  intro: string;
  considerations: string[];
  process: string[];
  categoryTerms: string[];
};

export const serviceLandings: Record<ServiceLandingSlug, ServiceLanding> = {
  'led-indoor': {
    slug: 'led-indoor', title: 'LED Indoor untuk Ruang Presentasi dan Komersial', eyebrow: 'Layanan LED indoor',
    description: 'Perencanaan LED indoor Visitiga untuk ruang rapat, kampus, retail, dan area presentasi berdasarkan jarak pandang dan kebutuhan ruang.',
    intro: 'LED indoor perlu direncanakan dari jarak pandang, ukuran bidang, sumber konten, pencahayaan ruang, jalur listrik, dan akses perawatan. Spesifikasi disesuaikan dengan kondisi penggunaan.',
    considerations: ['Jarak penonton dan ukuran bidang tayang', 'Pixel pitch dan resolusi materi', 'Sumber konten, jalur listrik, dan akses servis', 'Pencahayaan di sekitar layar'],
    process: ['Survei dan pengukuran ruang', 'Penentuan konfigurasi layar', 'Persiapan struktur dan jalur kabel', 'Pemasangan serta pengujian konten'], categoryTerms: ['indoor'],
  },
  'videotron-outdoor': {
    slug: 'videotron-outdoor', title: 'Videotron Outdoor untuk Berbagai Kondisi Lokasi', eyebrow: 'Layanan LED outdoor',
    description: 'Perencanaan videotron outdoor Visitiga dengan mempertimbangkan struktur, cuaca, tingkat kecerahan, jarak pandang, dan akses perawatan.',
    intro: 'Setiap lokasi outdoor memiliki kondisi struktur, paparan cuaca, arah pandang, dan kebutuhan kecerahan yang berbeda. Pemeriksaan lokasi dilakukan sebelum ukuran, pixel pitch, struktur, dan jalur perawatan ditentukan.',
    considerations: ['Kondisi struktur dan paparan cuaca', 'Jarak serta sudut pandang audiens', 'Kecerahan dan kebutuhan daya', 'Perizinan serta akses perawatan'],
    process: ['Pemeriksaan lokasi dan struktur', 'Penentuan ukuran serta pixel pitch', 'Perencanaan pemasangan', 'Pengujian dari sudut pandang aktual'], categoryTerms: ['outdoor'],
  },
  'rental-led': {
    slug: 'rental-led', title: 'Rental LED untuk Acara dan Panggung', eyebrow: 'Layanan rental LED',
    description: 'Rental LED Visitiga untuk acara, konferensi, pertunjukan, dan nonton bersama dengan konfigurasi sesuai venue dan jarak penonton.',
    intro: 'Konfigurasi rental LED mengikuti tata letak venue, ukuran panggung, jarak penonton, sumber video, jadwal pemasangan, dan kebutuhan operasional acara. Ukuran layar ditentukan setelah kondisi tersebut diketahui.',
    considerations: ['Tata letak venue dan jarak penonton', 'Ukuran panggung atau area tayang', 'Sumber video, listrik, dan jalur sinyal', 'Jadwal pemasangan dan pembongkaran'],
    process: ['Pemeriksaan rundown dan input', 'Survei venue', 'Pemasangan serta uji sinyal', 'Pendampingan sesuai lingkup kerja dan pembongkaran'], categoryTerms: ['rental'],
  },
  'media-konvensional': {
    slug: 'media-konvensional', title: 'Media Konvensional untuk Komunikasi Luar Ruang', eyebrow: 'Layanan media konvensional',
    description: 'Perencanaan billboard, lightbox, dan media konvensional Visitiga berdasarkan lokasi, ukuran bidang, materi visual, struktur, dan pencahayaan.',
    intro: 'Billboard, lightbox, dan media fisik lain perlu disesuaikan terhadap lokasi, arah pandang, struktur, ukuran materi, serta pencahayaan. Setiap bidang direncanakan agar materi sesuai dengan format media yang dipasang.',
    considerations: ['Lokasi serta arah pandang', 'Ukuran dan rasio materi visual', 'Struktur media', 'Pencahayaan dan kondisi sekitar'],
    process: ['Pemeriksaan lokasi', 'Penentuan format dan ukuran', 'Persiapan materi serta struktur', 'Pemasangan dan pemeriksaan hasil'], categoryTerms: ['conventional', 'billboard', 'lightbox'],
  },
};

export function isServiceLandingSlug(value?: string): value is ServiceLandingSlug {
  return Boolean(value && serviceLandingSlugs.includes(value as ServiceLandingSlug));
}
