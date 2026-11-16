import type { ServiceContentInput } from '@/types/admin';
import { defaultAboutProcess } from '@/lib/aboutContent';

export const defaultServiceContent: ServiceContentInput = {
  eyebrow: 'Layanan Kami',
  heading: 'Solusi LED Terbaik',
  heading_accent: 'untuk Setiap Kebutuhan',
  cards: [
    { title: 'Digital Media Solution', description: 'Solusi layar LED indoor dan outdoor dengan visual tajam untuk berbagai kebutuhan ruang dan lokasi.', tags: ['Indoor', 'Outdoor', 'Videotron'], action: 'Konsultasi sekarang' },
    { title: 'Conventional Media', description: 'Billboard, lightbox, dan signage untuk menyampaikan pesan brand di lokasi yang tepat.', tags: ['Billboard', 'Lightbox', 'Signage'], action: 'Konsultasi sekarang' },
    { title: 'Architectural & Media Construction', description: 'Solusi struktur sipil, interior, baja, facade, ballroom, dan media structure yang terintegrasi.', tags: ['Construction', 'Ballroom', 'Media Structure'], action: 'Konsultasi sekarang' },
    { title: 'Media Placement & Creative Content', description: 'Strategi OOH dan DOOH yang dipadukan dengan konsep kreatif dan produksi konten.', tags: ['OOH', 'DOOH', 'Campaign'], action: 'Konsultasi sekarang' },
    { title: 'Audio Visual', description: 'Sistem audio visual terintegrasi untuk meeting room, presentasi, venue, dan event.', tags: ['Audio', 'Visual', 'Integration'], action: 'Konsultasi sekarang' },
    { title: 'Event Production', description: 'Dukungan produksi visual dan teknis untuk event, stage, conference, dan live experience.', tags: ['Events', 'Staging', 'Technical Support'], action: 'Konsultasi sekarang' },
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
  process_eyebrow: 'Our process',
  process_title: 'From needs to real solutions',
  process: defaultAboutProcess.content_en,
};

export function normalizeServiceContent(value: ServiceContentInput): ServiceContentInput {
  const locale = value.content_en;
  return {
    ...defaultServiceContent,
    ...value,
    cards: [...(value.cards ?? []), ...defaultServiceContent.cards.slice(value.cards?.length ?? 0)].slice(0, 6),
    process_eyebrow: locale?.process_eyebrow ?? value.process_eyebrow ?? defaultServiceContent.process_eyebrow,
    process_title: locale?.process_title ?? value.process_title ?? defaultServiceContent.process_title,
    process: locale?.process?.length === 5 ? locale.process : value.process?.length === 5 ? value.process : defaultServiceContent.process,
  };
}
