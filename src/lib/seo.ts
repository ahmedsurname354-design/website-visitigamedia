import type { Lang } from '@/i18n';

export const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://visitiga-media.pages.dev').replace(/\/$/, '');

type SeoCopy = { title: string; description: string };

const seoByPath: Record<string, Record<Lang, SeoCopy>> = {
  '/': {
    id: { title: 'Visitiga — Solusi LED Display Profesional', description: 'Solusi LED display profesional untuk bisnis di Indonesia, mulai dari LED indoor, outdoor, rental, hingga media konvensional.' },
    en: { title: 'Visitiga — Professional LED Display Solutions', description: 'Professional LED display solutions for businesses in Indonesia, including indoor, outdoor, rental, and conventional media.' },
  },
  '/about': {
    id: { title: 'Tentang Visitiga — Mitra Solusi LED', description: 'Kenali Visitiga dan pengalaman kami menghadirkan solusi LED display profesional di Indonesia sejak 2013.' },
    en: { title: 'About Visitiga — Your LED Solutions Partner', description: 'Learn about Visitiga and our experience delivering professional LED display solutions in Indonesia since 2013.' },
  },
  '/services': {
    id: { title: 'Layanan LED Indoor, Outdoor & Rental — Visitiga', description: 'Jelajahi layanan LED videotron outdoor, LED display indoor, rental LED, dan media konvensional dari Visitiga.' },
    en: { title: 'Indoor, Outdoor & Rental LED Services — Visitiga', description: 'Explore outdoor videotron, indoor LED display, LED rental, and conventional media services from Visitiga.' },
  },
  '/product': {
    id: { title: 'Produk LED Display & Videotron — Visitiga', description: 'Jelajahi pilihan produk dan solusi media LED Visitiga yang dapat disesuaikan dengan kebutuhan merek Anda.' },
    en: { title: 'LED Display & Videotron Products — Visitiga', description: 'Explore Visitiga LED products and media solutions tailored to your brand requirements.' },
  },
  '/portfolio': {
    id: { title: 'Portofolio Proyek LED Display — Visitiga', description: 'Lihat portofolio instalasi LED indoor, outdoor, rental, audiovisual, dan media konvensional Visitiga.' },
    en: { title: 'LED Display Project Portfolio — Visitiga', description: 'View Visitiga projects across indoor and outdoor LED, rentals, audiovisual, and conventional media.' },
  },
  '/video': {
    id: { title: 'Showreel Proyek LED — Visitiga', description: 'Saksikan pilihan hasil pemasangan dan pengalaman visual LED dari Visitiga Media.' },
    en: { title: 'LED Project Showreel — Visitiga', description: 'Watch selected LED installations and visual experiences delivered by Visitiga Media.' },
  },
  '/contact': {
    id: { title: 'Hubungi Visitiga — Konsultasi LED Display', description: 'Hubungi Visitiga untuk konsultasi dan penawaran solusi LED display sesuai kebutuhan proyek Anda.' },
    en: { title: 'Contact Visitiga — LED Display Consultation', description: 'Contact Visitiga for consultation and an LED display solution tailored to your project.' },
  },
  '/news': {
    id: { title: 'Berita & Artikel LED Display — Visitiga', description: 'Baca artikel dan kabar terbaru seputar LED display, media visual, dan proyek Visitiga.' },
    en: { title: 'LED Display News & Articles — Visitiga', description: 'Read the latest articles about LED displays, visual media, and Visitiga projects.' },
  },
  '/faq': {
    id: { title: 'FAQ Layanan LED Display — Visitiga', description: 'Temukan jawaban tentang LED indoor, outdoor, rental, pemasangan, dukungan, dan konsultasi Visitiga.' },
    en: { title: 'LED Display Services FAQ — Visitiga', description: 'Find answers about Visitiga indoor and outdoor LED, rentals, installation, support, and consultation.' },
  },
  '/privacy': {
    id: { title: 'Kebijakan Privasi — Visitiga', description: 'Pelajari cara Visitiga mengumpulkan, menggunakan, dan melindungi data yang Anda berikan melalui website.' },
    en: { title: 'Privacy Policy — Visitiga', description: 'Learn how Visitiga collects, uses, and protects information you provide through this website.' },
  },
};

export function getStaticSeo(pathname: string, lang: Lang): SeoCopy {
  return (seoByPath[pathname] ?? seoByPath['/'])[lang];
}

export function absoluteUrl(pathname: string) {
  return `${siteUrl}${pathname === '/' ? '/' : pathname}`;
}
