import type { AboutContentInput, AboutLocaleContent, AboutProcessItem } from '@/types/admin';

export const defaultAboutProcess: { content_en: AboutProcessItem[]; content_id: AboutProcessItem[] } = {
  content_en: [
    { title: 'FREE CONSULTANT', description: 'Our discussion focuses on understanding and fulfilling each client’s needs through tailored custom solutions.' },
    { title: 'SOLUTION', description: 'We establish clear and certain solutions that answer the client’s needs with accurate and effective recommendations.' },
    { title: 'PACKAGE', description: 'Our solution plan includes creative design illustrations, hardware, software, construction, mechanical and electrical systems, and cost estimates.' },
    { title: 'IMPLEMENTATION', description: 'Based on the approved media plan, we turn ideas into real and effective media solutions.' },
    { title: 'SERVICE AND MAINTENANCE', description: 'Optimal equipment lifetime is achieved through proper operation and maintenance, including system upgrades.' },
  ],
  content_id: [
    { title: 'KONSULTASI GRATIS', description: 'Fokus diskusi kami adalah untuk memenuhi kebutuhan klien. Kami melayani setiap klien dengan solusi yang disesuaikan secara khusus (custom).' },
    { title: 'SOLUSI', description: 'Kami menetapkan solusi yang jelas dan pasti untuk menjawab kebutuhan klien serta memberikan rekomendasi tepat dan efektif.' },
    { title: 'PAKET', description: 'Rekomendasi solusi rencana kami mencakup ilustrasi desain kreatif, perangkat keras (hardware), perangkat lunak (software), konstruksi, mekanikal elektrikal, dan anggaran biaya.' },
    { title: 'IMPLEMENTASI', description: 'Sesuai dengan perencanaan media yang telah disetujui, kami mewujudkan ide menjadi solusi media yang nyata.' },
    { title: 'LAYANAN DAN PEMELIHARAAN', description: 'Masa pakai perangkat yang optimal dapat dicapai melalui pengoperasian dan pemeliharaan perangkat yang baik dan benar, termasuk peningkatan sistem (up-grading).' },
  ],
};

export const defaultAboutContent: AboutContentInput = {
  content_en: {
    eyebrow: 'Our values',
    title: 'WHY CHOOSE US',
    items: [
      { title: 'Persistence', description: 'Be persistent in keeping with an entrepreneurial attitude.' },
      { title: 'Stewardship', description: 'Continually look for ways to improve profitability and sustainability.' },
      { title: 'Service', description: 'Give our customers the best service and work hard to make a fair relationship.' },
      { title: 'Integrity', description: 'strive to always do the right thing; be honest.' },
    ],
    process: defaultAboutProcess.content_en,
  },
  content_id: {
    eyebrow: 'Nilai kami',
    title: 'MENGAPA MEMILIH KAMI',
    items: [
      { title: 'Ketekunan', description: 'Terus tekun dengan semangat kewirausahaan.' },
      { title: 'Tanggung Jawab', description: 'Terus mencari cara untuk meningkatkan profitabilitas dan keberlanjutan.' },
      { title: 'Pelayanan', description: 'Memberikan pelayanan terbaik dan bekerja keras untuk membangun hubungan yang adil.' },
      { title: 'Integritas', description: 'Selalu berusaha melakukan hal yang benar dan bersikap jujur.' },
    ],
    process: defaultAboutProcess.content_id,
  },
};

export function normalizeAboutContent(value: Partial<{ content_id: AboutLocaleContent; content_en: AboutLocaleContent }> | null | undefined) {
  const fallback = defaultAboutContent;
  return {
    content_en: value?.content_en?.items?.length ? { ...fallback.content_en, ...value.content_en, process: value.content_en.process?.length === 5 ? value.content_en.process : fallback.content_en.process } : fallback.content_en,
    content_id: value?.content_id?.items?.length ? { ...fallback.content_id, ...value.content_id, process: value.content_id.process?.length === 5 ? value.content_id.process : fallback.content_id.process } : fallback.content_id,
  };
}
