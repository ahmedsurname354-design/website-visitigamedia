import { useEffect, useState } from 'react';
import ServicesSection from '@/components/ServicesSection';
import WebServiceSection from '@/components/WebServiceSection';
import { getServiceContent } from '@/lib/adminApi';
import type { ServiceContent } from '@/types/admin';

export default function ServicesPage() {
  const [content, setContent] = useState<ServiceContent | null>(null);
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
  return (
    <>
      {error && <div role="alert" className="bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">{error}</div>}
      <ServicesSection content={content} />
      <WebServiceSection content={content} />
    </>
  );
}
