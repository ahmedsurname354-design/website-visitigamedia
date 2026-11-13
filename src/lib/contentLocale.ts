import type { Lang } from '@/i18n';
import type { NewsRecord, Portfolio, Product, ServiceContent } from '@/types/admin';
import { defaultServiceContent } from '@/lib/serviceContent';

export type PortfolioCategoryKey = 'conventional' | 'indoor' | 'outdoor' | 'rental' | 'audio-visual' | `custom:${string}`;
type StandardPortfolioCategoryKey = Exclude<PortfolioCategoryKey, `custom:${string}`>;

const portfolioCategoryLabels: Record<StandardPortfolioCategoryKey, Record<Lang, string>> = {
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
  if (key.startsWith('custom:')) return category;
  return portfolioCategoryLabels[key as StandardPortfolioCategoryKey][lang];
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
  return {
    ...item,
    ...(locale && Object.keys(locale).length > 0 ? locale : {}),
    process_eyebrow: locale?.process_eyebrow ?? item.process_eyebrow ?? defaultServiceContent.process_eyebrow,
    process_title: locale?.process_title ?? item.process_title ?? defaultServiceContent.process_title,
    process: locale?.process?.length === 5 ? locale.process : item.process?.length === 5 ? item.process : defaultServiceContent.process,
  };
}
