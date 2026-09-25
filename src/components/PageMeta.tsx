import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { usePageMeta } from '@/hooks/usePageMeta';
import { absoluteUrl, canonicalPublicPath, getStaticSeo, normalizePublicPath } from '@/lib/seo';
import { isServiceLandingSlug } from '@/lib/serviceLanding';

export default function PageMeta() {
  const { pathname } = useLocation();
  const path = normalizePublicPath(pathname);
  const { lang, dict } = useTranslation();
  const serviceSlug = path.startsWith('/services/') ? path.slice('/services/'.length) : undefined;
  const isServiceLanding = isServiceLandingSlug(serviceSlug);
  const knownPaths = ['/', '/about', '/services', '/product', '/portfolio', '/video', '/contact', '/news', '/faq', '/privacy'];
  const staticPath = path.startsWith('/news/') ? '/news' : path;
  const isNewsDetail = path.startsWith('/news/');
  const isCaseStudy = path.startsWith('/portfolio/');
  const notFound = !isNewsDetail && !isCaseStudy && !isServiceLanding && !knownPaths.includes(path);
  const meta = notFound
    ? { title: lang === 'id' ? 'Halaman Tidak Ditemukan — Visitiga' : 'Page Not Found — Visitiga', description: lang === 'id' ? 'Halaman yang Anda cari tidak ditemukan.' : 'The page you are looking for could not be found.' }
    : getStaticSeo(staticPath, lang);
  const structuredData = useMemo(() => {
    const breadcrumbNames: Record<string, string> = { '/about': 'Tentang Kami', '/services': 'Layanan', '/product': 'Produk', '/portfolio': 'Portofolio', '/video': 'Video', '/contact': 'Kontak', '/news': 'Berita', '/faq': 'FAQ', '/privacy': 'Kebijakan Privasi' };
    const currentName = breadcrumbNames[path] || (isServiceLanding ? getStaticSeo(path, lang).title.split('|')[0].trim() : '');
    const breadcrumbs = path !== '/' && currentName ? {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: lang === 'en' ? 'Home' : 'Beranda', item: absoluteUrl('/') },
        ...(isServiceLanding ? [{ '@type': 'ListItem', position: 2, name: lang === 'en' ? 'Services' : 'Layanan', item: absoluteUrl('/services/') }] : []),
        { '@type': 'ListItem', position: isServiceLanding ? 3 : 2, name: currentName, item: absoluteUrl(canonicalPublicPath(path)) },
      ],
    } : undefined;
    if (path === '/faq') {
      return [{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: dict.faq.items.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
      }, breadcrumbs!];
    }
    if (path === '/') {
      return [
        { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${absoluteUrl('/')}#organization`, name: 'Visitiga Media', url: absoluteUrl('/'), logo: absoluteUrl('/social-preview.png'), email: 'marcomm@visitiga.com', telephone: '+62 822 5878 8780' },
        { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${absoluteUrl('/')}#website`, name: 'Visitiga Media', url: absoluteUrl('/'), publisher: { '@id': `${absoluteUrl('/')}#organization` }, inLanguage: lang === 'en' ? 'en-US' : 'id-ID' },
      ];
    }
    return breadcrumbs;
  }, [dict.faq.items, isServiceLanding, lang, path]);
  usePageMeta({ ...meta, pathname: canonicalPublicPath(path), structuredData, noIndex: notFound, lang, disabled: isNewsDetail || isCaseStudy || isServiceLanding });
  return null;
}
