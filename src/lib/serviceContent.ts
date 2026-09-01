import type { ServiceContentInput } from '@/types/admin';

export const defaultServiceContent: ServiceContentInput = {
  eyebrow: 'Layanan Kami',
  heading: 'Solusi LED Terbaik',
  heading_accent: 'untuk Setiap Kebutuhan',
  cards: [
    { title: 'LED Display', description: 'Solusi layar LED berkualitas untuk kebutuhan indoor maupun outdoor.', tags: ['Indoor', 'Outdoor', 'Videotron'], action: 'Konsultasi sekarang' },
    { title: 'Media Placement', description: 'Penempatan media strategis untuk menjangkau audiens yang tepat.', tags: ['OOH', 'DOOH', 'Campaign'], action: 'Konsultasi sekarang' },
    { title: 'Audio Visual', description: 'Sistem audio visual terintegrasi untuk ruang dan acara profesional.', tags: ['Audio', 'Visual', 'Integration'], action: 'Konsultasi sekarang' },
    { title: 'Creative Content', description: 'Konten visual kreatif yang dirancang untuk menarik perhatian audiens.', tags: ['Design', 'Motion', 'Content'], action: 'Konsultasi sekarang' },
  ],
  showreel_eyebrow: 'Layanan Kami',
  showreel_heading: 'Visual Memukau,',
  showreel_accent: 'Kesan Luar Biasa',
  showreel_description: 'Menampilkan hasil pemasangan dan konten videotron kami kombinasi warna tajam, pencahayaan presisi, dan performa optimal untuk hasil visual maksimal.',
  primary_button_text: 'Konsultasi Sekarang',
  primary_button_url: 'https://bit.ly/49NclAE',
  secondary_button_text: 'Email Marketing',
  secondary_button_url: 'mailto:marcomm@visitiga.com?subject=Konsultasi%20Visitiga%20Media',
  video_webm_url: '/videos/service-showreel.webm',
  video_mp4_url: '/videos/service-showreel.mp4',
  video_poster_url: '/videos/service-showreel-poster.webp',
};
