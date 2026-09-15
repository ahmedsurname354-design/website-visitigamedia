import { useEffect } from 'react';
import { absoluteUrl } from '@/lib/seo';

type PageMeta = {
  title: string;
  description: string;
  pathname: string;
  image?: string;
  type?: 'website' | 'article';
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
  imageAlt?: string;
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

export function usePageMeta({ title, description, pathname, image = '/social-preview.png', type = 'website', structuredData, noIndex = false, imageAlt, lang = 'id', disabled = false }: PageMeta) {
  useEffect(() => {
    if (disabled) return;
    const canonicalUrl = absoluteUrl(pathname);
    const imageUrl = image.startsWith('http') ? image : absoluteUrl(image);
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
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '2000');
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '2000');
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', imageAlt || title);
    setMeta('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, follow' : 'index, follow');
    document.documentElement.lang = lang;

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

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
  }, [description, disabled, image, imageAlt, lang, noIndex, pathname, structuredData, title, type]);
}
