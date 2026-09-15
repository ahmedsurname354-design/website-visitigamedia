import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { usePageMeta } from '@/hooks/usePageMeta';
import { absoluteUrl, getStaticSeo } from '@/lib/seo';

export default function PageMeta() {
  const { pathname } = useLocation();
  const { lang, dict } = useTranslation();
  const knownPaths = ['/', '/about', '/services', '/product', '/portfolio', '/video', '/contact', '/news', '/faq', '/privacy'];
  const staticPath = pathname.startsWith('/news/') ? '/news' : pathname;
  const isNewsDetail = pathname.startsWith('/news/');
  const notFound = !pathname.startsWith('/news/') && !knownPaths.includes(pathname);
  const meta = notFound
    ? { title: lang === 'id' ? 'Halaman Tidak Ditemukan — Visitiga' : 'Page Not Found — Visitiga', description: lang === 'id' ? 'Halaman yang Anda cari tidak ditemukan.' : 'The page you are looking for could not be found.' }
    : getStaticSeo(staticPath, lang);
  const structuredData = useMemo(() => {
    const breadcrumbNames: Record<string, string> = { '/about': 'Tentang Kami', '/services': 'Layanan', '/product': 'Produk', '/portfolio': 'Portofolio', '/video': 'Video', '/contact': 'Kontak', '/news': 'Berita', '/faq': 'FAQ', '/privacy': 'Kebijakan Privasi' };
    const breadcrumbs = pathname !== '/' && breadcrumbNames[pathname] ? {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: lang === 'en' ? 'Home' : 'Beranda', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: breadcrumbNames[pathname], item: absoluteUrl(pathname) },
      ],
    } : undefined;
    if (pathname === '/faq') {
      return [{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: dict.faq.items.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
      }, breadcrumbs!];
    }
    if (pathname === '/') {
      return [
        { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${absoluteUrl('/')}#organization`, name: 'Visitiga Media', url: absoluteUrl('/'), logo: absoluteUrl('/social-preview.png'), email: 'marcomm@visitiga.com', telephone: '+62 822 5878 8780' },
        { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${absoluteUrl('/')}#website`, name: 'Visitiga Media', url: absoluteUrl('/'), publisher: { '@id': `${absoluteUrl('/')}#organization` }, inLanguage: lang === 'en' ? 'en-US' : 'id-ID' },
      ];
    }
    return breadcrumbs;
  }, [dict.faq.items, lang, pathname]);
  usePageMeta({ ...meta, pathname, structuredData, noIndex: notFound, lang, disabled: isNewsDetail });
  return null;
}
