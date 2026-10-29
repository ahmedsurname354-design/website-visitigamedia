import { useEffect, useState } from 'react';
import AboutSection from '@/components/AboutSection';
import { useTranslation } from '@/i18n';
import { getPrerenderData } from '@/lib/prerenderData';
import { normalizeAboutContent } from '@/lib/aboutContent';
import type { AboutContent } from '@/types/admin';

export default function AboutPage() {
  const { lang } = useTranslation();
  const initial = getPrerenderData()?.about;
  const [content, setContent] = useState<AboutContent | null>(initial ?? null);

  useEffect(() => {
    let active = true;
    void import('@/lib/publicApi').then(({ getPublicAboutContent }) => getPublicAboutContent()).then((next) => {
      if (active && next) setContent(next);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const localized = normalizeAboutContent(content);
  return <AboutSection valueContent={lang === 'en' ? localized.content_en : localized.content_id} />;
}
