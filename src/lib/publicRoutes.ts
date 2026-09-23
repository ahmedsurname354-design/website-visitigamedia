import type { ComponentType } from 'react';

type PageModule = { default: ComponentType };
type PageLoader = () => Promise<PageModule>;

export const publicPageLoaders = {
  about: () => import('@/pages/AboutPage'),
  services: () => import('@/pages/ServicesPage'),
  serviceLanding: () => import('@/pages/ServiceLandingPage'),
  product: () => import('@/pages/ProductPage'),
  portfolio: () => import('@/pages/PortfolioPage'),
  portfolioDetail: () => import('@/pages/PortfolioDetailPage'),
  video: () => import('@/pages/VideoPage'),
  contact: () => import('@/pages/ContactPage'),
  faq: () => import('@/pages/FAQPage'),
  privacy: () => import('@/pages/PrivacyPage'),
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
  '/faq': publicPageLoaders.faq,
  '/privacy': publicPageLoaders.privacy,
  '/news': publicPageLoaders.news,
};

export function preloadPublicRoute(path: string): Promise<PageModule | undefined> | undefined {
  const normalizedPath = path.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';
  const loader = normalizedPath.startsWith('/portfolio/')
    ? publicPageLoaders.portfolioDetail
    : normalizedPath.startsWith('/news/')
    ? publicPageLoaders.newsDetail
    : normalizedPath.startsWith('/services/')
    ? publicPageLoaders.serviceLanding
    : routeLoaders[normalizedPath];
  // Speculative loading must never surface an unhandled rejection.
  return loader?.().catch(() => undefined);
}
