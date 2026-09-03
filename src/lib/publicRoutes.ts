import type { ComponentType } from 'react';

type PageModule = { default: ComponentType };
type PageLoader = () => Promise<PageModule>;

export const publicPageLoaders = {
  about: () => import('@/pages/AboutPage'),
  services: () => import('@/pages/ServicesPage'),
  product: () => import('@/pages/ProductPage'),
  portfolio: () => import('@/pages/PortfolioPage'),
  video: () => import('@/pages/VideoPage'),
  contact: () => import('@/pages/ContactPage'),
  news: () => import('@/pages/NewsPage'),
  newsDetail: () => import('@/pages/NewsDetailPage'),
} satisfies Record<string, PageLoader>;

const routeLoaders: Record<string, PageLoader> = {
  '/about': publicPageLoaders.about,
  '/services': publicPageLoaders.services,
  '/product': publicPageLoaders.product,
  '/portfolio': publicPageLoaders.portfolio,
  '/video': publicPageLoaders.video,
  '/contact': publicPageLoaders.contact,
  '/news': publicPageLoaders.news,
};

export function preloadPublicRoute(path: string): Promise<PageModule> | undefined {
  const normalizedPath = path.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';
  const loader = normalizedPath.startsWith('/news/')
    ? publicPageLoaders.newsDetail
    : routeLoaders[normalizedPath];
  return loader?.();
}

export function preloadPublicRoutesWhenIdle(): () => void {
  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const paths = ['/services', '/portfolio', '/about', '/product', '/news', '/contact', '/video'];
  let cancelled = false;
  let timeoutId: number | undefined;
  let idleId: number | undefined;
  let index = 0;

  const loadNext = () => {
    if (cancelled || index >= paths.length) return;
    void preloadPublicRoute(paths[index++]);
    schedule();
  };
  const schedule = () => {
    if (typeof idleWindow.requestIdleCallback === 'function') {
      idleId = idleWindow.requestIdleCallback(loadNext, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(loadNext, 400);
    }
  };

  schedule();
  return () => {
    cancelled = true;
    if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  };
}
