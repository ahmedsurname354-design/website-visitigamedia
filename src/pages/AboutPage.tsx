import { useEffect, useState } from 'react';
import AboutSection from '@/components/AboutSection';
import { useTranslation } from '@/i18n';
import { getPrerenderData } from '@/lib/prerenderData';
import type { AboutContent } from '@/types/admin';

export default function AboutPage() {
  const { lang } = useTranslation();
  const initial = getPrerenderData()?.about;
  const [content, setContent] = useState<AboutContent | null>(initial ?? null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void import('@/lib/publicApi').then(({ getPublicAboutContent }) => getPublicAboutContent()).then((next) => {
      if (active && next) { setContent(next); setError(''); }
      else if (active) setError('Konten tentang kami belum tersedia.');
    }).catch(() => { if (active) setError('Konten tentang kami belum dapat dimuat. Silakan coba lagi.'); });
    return () => { active = false; };
  }, []);

  if (error && !content) return <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6" role="alert"><p className="text-center text-sm text-red-700">{error}</p></div>;
  if (!content) return <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6" role="status">Memuat konten…</div>;
  const localized = lang === 'en' ? content.content_en : content.content_id;
  return <AboutSection valueContent={localized} />;
}
