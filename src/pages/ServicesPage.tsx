import { useEffect, useState } from 'react';
import ServicesSection from '@/components/ServicesSection';
import WebServiceSection from '@/components/WebServiceSection';
import { getServiceContent } from '@/lib/adminApi';
import type { ServiceContent } from '@/types/admin';
import { getPrerenderData } from '@/lib/prerenderData';
import { useTranslation } from '@/i18n';
import { localizedServiceContent } from '@/lib/contentLocale';

export default function ServicesPage() {
  const { lang } = useTranslation();
  const [content, setContent] = useState<ServiceContent | null>(() => getPrerenderData()?.serviceContent ?? null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const value = await getServiceContent();
        if (active) { setContent(value); setError(''); }
      } catch {
        if (active) setError('Konten terbaru belum dapat dimuat. Silakan muat ulang halaman.');
      }
    };
    const refreshWhenVisible = () => { if (document.visibilityState === 'visible') void load(); };
    void load();
    window.addEventListener('focus', load);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      active = false;
      window.removeEventListener('focus', load);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);
  const displayContent = content ? localizedServiceContent(content, lang) : content;
  return (
    <>
      {error && <div role="alert" className="bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">{error}</div>}
      <ServicesSection content={displayContent} />
      <WebServiceSection content={displayContent} />
    </>
  );
}
