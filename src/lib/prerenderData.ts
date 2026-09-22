import type { NewsRecord, Portfolio, Product, ProductCatalogue, ServiceContent } from '@/types/admin';
import { normalizePublicPath } from '@/lib/seo';

export interface PrerenderData {
  route: string;
  news?: NewsRecord[];
  article?: NewsRecord | null;
  portfolios?: Portfolio[];
  products?: Product[];
  catalogue?: ProductCatalogue | null;
  serviceContent?: ServiceContent | null;
}

declare global {
  interface Window {
    __VISITIGA_PRERENDER_DATA__?: PrerenderData;
    __VISITIGA_PRERENDER_MODE__?: boolean;
  }
}

export function getPrerenderData(): PrerenderData | undefined {
  if (typeof window === 'undefined') return undefined;
  if (!window.__VISITIGA_PRERENDER_DATA__) {
    const element = document.getElementById('visitiga-prerender-data');
    if (element?.textContent) {
      try { window.__VISITIGA_PRERENDER_DATA__ = JSON.parse(element.textContent) as PrerenderData; }
      catch { /* Invalid bootstrap data falls back to the live API. */ }
    }
  }
  const data = window.__VISITIGA_PRERENDER_DATA__;
  return data && normalizePublicPath(data.route) === normalizePublicPath(window.location.pathname) ? data : undefined;
}

export function isPrerenderedDocument(): boolean {
  return typeof document !== 'undefined' && document.documentElement.dataset.prerendered === 'true';
}
