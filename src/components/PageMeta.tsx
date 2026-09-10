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
  const notFound = !pathname.startsWith('/news/') && !knownPaths.includes(pathname);
  const meta = notFound
    ? { title: lang === 'id' ? 'Halaman Tidak Ditemukan — Visitiga' : 'Page Not Found — Visitiga', description: lang === 'id' ? 'Halaman yang Anda cari tidak ditemukan.' : 'The page you are looking for could not be found.' }
    : getStaticSeo(staticPath, lang);
  const structuredData = useMemo(() => {
    if (pathname === '/faq') {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: dict.faq.items.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
      };
    }
    if (pathname === '/') {
      return { '@context': 'https://schema.org', '@type': 'Organization', name: 'Visitiga Media', url: absoluteUrl('/'), email: 'marcomm@visitiga.com', telephone: '+62 822 5878 8780' };
    }
    return undefined;
  }, [dict.faq.items, pathname]);
  usePageMeta({ ...meta, pathname, structuredData, noIndex: notFound });
  return null;
}
