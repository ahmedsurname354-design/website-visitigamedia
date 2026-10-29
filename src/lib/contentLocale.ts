import type { Lang } from '@/i18n';
import type { NewsRecord, Portfolio, Product, ServiceContent } from '@/types/admin';

export type PortfolioCategoryKey = 'conventional' | 'indoor' | 'outdoor' | 'rental' | 'audio-visual' | `custom:${string}`;

const portfolioCategoryLabels: Record<Exclude<PortfolioCategoryKey, `custom:${string}`>, Record<Lang, string>> = {
  conventional: { id: 'Media Konvensional', en: 'Conventional Media' },
  indoor: { id: 'Media Dalam Ruangan', en: 'Indoor Media' },
  outdoor: { id: 'Media Luar Ruang', en: 'Outdoor Media' },
  rental: { id: 'Penyewaan LED', en: 'Rental LED' },
  'audio-visual': { id: 'Audio Visual', en: 'Audio Visual' },
};

export function portfolioCategoryKey(category: string): PortfolioCategoryKey {
  const value = category.trim().toLocaleLowerCase().replace(/[&/]+/g, ' ').replace(/\s+/g, ' ');
  if (value.includes('konvensional') || value.includes('conventional')) return 'conventional';
  if (value.includes('rental') || value.includes('sewa')) return 'rental';
  if (value.includes('audio visual') || value.includes('audiovisual')) return 'audio-visual';
  if (value.includes('indoor') || value.includes('dalam ruang')) return 'indoor';
  if (value.includes('outdoor') || value.includes('luar ruang')) return 'outdoor';
  return `custom:${value}`;
}

export function portfolioCategoryLabel(category: string, lang: Lang): string {
  const key = portfolioCategoryKey(category);
  return key.startsWith('custom:') ? category : portfolioCategoryLabels[key][lang];
}

export function localizedPortfolio(item: Portfolio, lang: Lang): Portfolio {
  const locale = lang === 'id' ? item.content_id : item.content_en;
  return locale && Object.keys(locale).length > 0 ? { ...item, ...locale } : item;
}

export function localizedNews(item: NewsRecord, lang: Lang): NewsRecord {
  const locale = lang === 'id' ? item.content_id : item.content_en;
  return locale && Object.keys(locale).length > 0 ? { ...item, ...locale } : item;
}

export function localizedProduct(item: Product, lang: Lang): Product {
  const locale = lang === 'id' ? item.content_id : item.content_en;
  return locale && Object.keys(locale).length > 0 ? { ...item, ...locale } : item;
}

export function localizedServiceContent(item: ServiceContent, lang: Lang): ServiceContent {
  const locale = lang === 'id' ? item.content_id : item.content_en;
  return locale && Object.keys(locale).length > 0 ? { ...item, ...locale } : item;
}
