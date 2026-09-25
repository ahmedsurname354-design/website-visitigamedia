import type { Lang } from '@/i18n';

export const publicLanguages: Lang[] = ['id', 'en'];

export function getPathLanguage(pathname: string): Lang | undefined {
  const segment = pathname.split('/').filter(Boolean)[0];
  return segment === 'id' || segment === 'en' ? segment : undefined;
}

export function stripLanguagePrefix(pathname: string) {
  const language = getPathLanguage(pathname);
  if (!language) return pathname || '/';
  const stripped = pathname.slice(language.length + 1);
  return stripped || '/';
}

export function localizedPublicPath(pathname: string, lang: Lang) {
  if (!pathname.startsWith('/') || pathname.startsWith('//')) return pathname;
  const stripped = stripLanguagePrefix(pathname).replace(/\/+$/, '') || '/';
  return stripped === '/' ? `/${lang}/` : `/${lang}${stripped}/`;
}

export function isExternalTarget(target: string) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(target);
}
