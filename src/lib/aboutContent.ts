import type { AboutContentInput, AboutLocaleContent } from '@/types/admin';

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
  },
};

export function normalizeAboutContent(value: Partial<{ content_id: AboutLocaleContent; content_en: AboutLocaleContent }> | null | undefined) {
  const fallback = defaultAboutContent;
  return {
    content_en: value?.content_en?.items?.length ? value.content_en : fallback.content_en,
    content_id: value?.content_id?.items?.length ? value.content_id : fallback.content_id,
  };
}
