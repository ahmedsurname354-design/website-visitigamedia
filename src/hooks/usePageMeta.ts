import { useEffect } from 'react';
import { localizedPublicPath, stripLanguagePrefix } from '@/lib/localizedRoutes';

type PageMeta = {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  type?: 'website' | 'article';
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  lang?: 'id' | 'en';
  disabled?: boolean;
};

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function getSiteOrigin() {
  const prerenderOrigin = typeof window !== 'undefined' ? window.__VISITIGA_SITE_URL__ : undefined;
  if (prerenderOrigin) return prerenderOrigin;
  const configured = document.documentElement.dataset.siteUrl;
  if (configured) return configured;
  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  return canonical ? new URL(canonical).origin : window.location.origin;
}

export function usePageMeta({ title, description, pathname, image = '/social-preview.png', type = 'website', structuredData, noIndex = false, imageAlt, imageWidth, imageHeight, lang = 'id', disabled = false }: PageMeta) {
  useEffect(() => {
    if (disabled) return;
    const publicPath = stripLanguagePrefix(pathname);
    const siteOrigin = getSiteOrigin();
    const canonicalUrl = `${siteOrigin}${localizedPublicPath(publicPath, lang)}`;
    const imageUrl = image.startsWith('http') ? image : `${siteOrigin}${image}`;
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', type);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', imageAlt || title);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Visitiga Media');
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', lang === 'en' ? 'en_US' : 'id_ID');
    const resolvedWidth = imageWidth ?? (image === '/social-preview.png' ? 1920 : undefined);
    const resolvedHeight = imageHeight ?? (image === '/social-preview.png' ? 1920 : undefined);
    const widthMeta = document.head.querySelector('meta[property="og:image:width"]');
    const heightMeta = document.head.querySelector('meta[property="og:image:height"]');
    if (resolvedWidth) setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', String(resolvedWidth));
    else widthMeta?.remove();
    if (resolvedHeight) setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', String(resolvedHeight));
    else heightMeta?.remove();
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', imageAlt || title);
    setMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, follow' : 'index, follow');
    document.documentElement.lang = lang;
    document.documentElement.dataset.siteUrl = new URL(canonicalUrl).origin;

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    for (const alternateLanguage of ['id', 'en'] as const) {
      let alternate = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${alternateLanguage}"]`);
      if (!alternate) {
        alternate = document.createElement('link');
        alternate.rel = 'alternate';
        alternate.hreflang = alternateLanguage;
        document.head.appendChild(alternate);
      }
      alternate.href = `${siteOrigin}${localizedPublicPath(publicPath, alternateLanguage)}`;
    }
    let defaultAlternate = document.head.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="x-default"]');
    if (!defaultAlternate) {
      defaultAlternate = document.createElement('link');
      defaultAlternate.rel = 'alternate';
      defaultAlternate.hreflang = 'x-default';
      document.head.appendChild(defaultAlternate);
    }
    defaultAlternate.href = `${siteOrigin}${localizedPublicPath(publicPath, 'id')}`;

    const scriptId = 'page-structured-data';
    document.getElementById(scriptId)?.remove();
    if (structuredData) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData).replace(/</g, '\\u003c');
      document.head.appendChild(script);
    }
    return () => document.getElementById(scriptId)?.remove();
  }, [description, disabled, image, imageAlt, imageHeight, imageWidth, lang, noIndex, pathname, structuredData, title, type]);
}
