import { useEffect, useRef, useState } from 'react';
import ServicesSection from '@/components/ServicesSection';
import WebServiceSection from '@/components/WebServiceSection';
import { getServiceContent } from '@/lib/adminApi';
import type { ServiceContent } from '@/types/admin';
import { getPrerenderData } from '@/lib/prerenderData';
import { useTranslation } from '@/i18n';
import { localizedServiceContent } from '@/lib/contentLocale';

export default function ServicesPage() {
  const { lang } = useTranslation();
  const initial = getPrerenderData();
  const hasInitialServiceContent = Boolean(initial?.serviceContent);
  const [content, setContent] = useState<ServiceContent | null>(() => initial?.serviceContent ?? null);
  const [loading, setLoading] = useState(!hasInitialServiceContent);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  useEffect(() => {
    let active = true;
    const load = async (replaceCurrent = false) => {
      const currentRequest = ++requestId.current;
      if (replaceCurrent) setLoading(true);
      try {
        const value = await getServiceContent();
        if (active && currentRequest === requestId.current) { setContent(value); setError(''); }
      } catch {
        if (active && currentRequest === requestId.current) setError('Konten terbaru belum dapat dimuat. Silakan muat ulang halaman.');
      } finally {
        if (active && currentRequest === requestId.current) setLoading(false);
      }
    };
    const refreshWhenVisible = () => { if (document.visibilityState === 'visible') void load(true); };
    void load(!hasInitialServiceContent);
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      active = false;
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [hasInitialServiceContent]);
  if (loading) {
    return <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6" role="status" aria-live="polite"><div className="rounded-full border border-current/10 px-5 py-3 text-sm opacity-70 shadow-sm">Memuat layanan terbaru…</div></div>;
  }
  const displayContent = content ? localizedServiceContent(content, lang) : content;
  return (
    <>
      {error && <div role="alert" className="bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">{error}</div>}
      <ServicesSection content={displayContent} />
      <WebServiceSection content={displayContent} />
    </>
  );
}
