import { useEffect, useState } from 'react';
import ServicesSection from '@/components/ServicesSection';
import WebServiceSection from '@/components/WebServiceSection';
import { getServiceContent } from '@/lib/adminApi';
import type { ServiceContent } from '@/types/admin';

export default function ServicesPage() {
  const [content, setContent] = useState<ServiceContent | null>(null);
  useEffect(() => { void getServiceContent().then(setContent).catch(() => undefined); }, []);
  return (
    <>
      <ServicesSection content={content} />
      <WebServiceSection content={content} />
    </>
  );
}
