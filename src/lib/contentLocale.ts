import type { Lang } from '@/i18n';
import type { NewsRecord, Portfolio, Product, ServiceContent } from '@/types/admin';

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
