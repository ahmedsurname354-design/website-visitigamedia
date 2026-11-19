import { Instagram, Facebook, Youtube, ArrowUp, ArrowUpRight, Phone, Mail } from 'lucide-react';
import Logo from '@/components/Logo';
import { LocalizedLink as Link } from '@/components/LocalizedLink';
import type { MouseEvent } from 'react';
import { useTranslation } from '@/i18n';

const socials = [
  { label: 'Instagram', Icon: Instagram, href: 'https://www.instagram.com/visitigamedia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
  { label: 'Facebook', Icon: Facebook, href: 'https://www.facebook.com/share/1F286rZHBz/' },
  { label: 'YouTube', Icon: Youtube, href: 'https://youtube.com/shorts/Su5HT7g-GNk?si=epsEldCO89YpUtBd' },
];

const footerCopy = {
  id: {
    description: 'Solusi LED display profesional untuk bisnis Anda di seluruh Indonesia. Kualitas premium, desain kreatif, dan layanan terbaik.',
    partnership: { title: 'Kerjasama', phone: '+62 822 5878 8780', email: 'marcomm@visitiga.com', cta: 'Hubungi Procurement' },
    groups: [
      { title: 'Perusahaan', links: [['Tentang Kami', '/about'], ['Kontak', '/contact'], ['Kebijakan Privasi', '/privacy']] },
      { title: 'Layanan', links: [['LED Luar Ruang', '/services'], ['Layar Dalam Ruang', '/services'], ['Sewa LED', '/services'], ['Produk', '/product']] },
      { title: 'Informasi', links: [['Portofolio', '/portfolio'], ['Berita', '/news'], ['Tanya Jawab', '/faq'], ['Dukungan', 'mailto:marcomm@visitiga.com?subject=Konsultasi%20Visitiga%20Media']] },
    ],
    copyright: '© 2026 Visitiga LED Solutions. Seluruh hak cipta dilindungi.', back: 'Kembali ke atas',
  },
  en: {
    description: 'Professional LED display solutions for businesses across Indonesia. Premium quality, creative design, and excellent service.',
    partnership: { title: 'Partnership', phone: '+62 822 5878 8780', email: 'marcomm@visitiga.com', cta: 'Contact Procurement' },
    groups: [
      { title: 'Company', links: [['About Us', '/about'], ['Contact', '/contact'], ['Privacy Policy', '/privacy']] },
      { title: 'Services', links: [['Outdoor LED', '/services'], ['Indoor Display', '/services'], ['LED Rental', '/services'], ['Products', '/product']] },
      { title: 'Information', links: [['Portfolio', '/portfolio'], ['News', '/news'], ['FAQ', '/faq'], ['Support', 'mailto:marcomm@visitiga.com?subject=Visitiga%20Media%20Consultation']] },
    ],
    copyright: '© 2026 Visitiga LED Solutions. All rights reserved.', back: 'Back to top',
  },
};

export default function Footer() {
  const { lang } = useTranslation();
  const copy = footerCopy[lang];
  return (
    <footer className="site-footer border-t border-slate-800 pt-16 pb-8 sm:pt-20">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="site-footer__top grid gap-12 mb-14 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="site-footer__logo-mark" aria-label="Visitiga">
              <span className="site-footer__logo-crop"><Logo alt="Visitiga" className="!h-auto !w-[7.4rem]" /></span>
            </div>
            <div className="mt-6 flex gap-3">
              {socials.map(({ label, Icon, href }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="site-footer__social w-11 h-11 rounded-full bg-white/5 hover:bg-orange-500 flex items-center justify-center transition-colors duration-300"><Icon aria-hidden="true" className="w-4 h-4 text-white/70" /></a>)}
            </div>
          </div>
          {copy.groups.map((group) => <div key={group.title}>
            <p className="site-footer__heading text-white font-semibold text-sm mb-5">{group.title}</p>
            <ul className="space-y-3">{group.links.map(([label, path]) => <li key={label}>{path.startsWith('mailto:')
              ? <a href={path} className="text-white/50 hover:text-orange-500 text-sm transition-colors duration-300">{label}</a>
              : <Link to={path} className="text-white/50 hover:text-orange-500 text-sm transition-colors duration-300">{label}</Link>}</li>)}</ul>
          </div>)}
          <div className="site-footer__partnership rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="site-footer__heading text-white font-semibold text-sm mb-5">{copy.partnership.title}</p>
            <div className="space-y-4">
              <a href="https://wa.me/628225878780" target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 text-white/70 hover:text-orange-500 text-sm transition-colors duration-300" aria-label={`${copy.partnership.title}: ${copy.partnership.phone}`}>
                <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap underline-offset-4 group-hover:underline">{copy.partnership.phone}</span>
              </a>
              <a href={`mailto:${copy.partnership.email}`} className="group flex items-start gap-3 text-white/70 hover:text-orange-500 text-xs transition-colors duration-300" aria-label={`${copy.partnership.title}: ${copy.partnership.email}`}>
                <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap underline-offset-4 group-hover:underline">{copy.partnership.email}</span>
              </a>
              <a href="https://wa.me/628225878780" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-2 rounded-full bg-orange-500 px-3.5 py-2 text-xs font-semibold text-black transition hover:bg-orange-400" aria-label={copy.partnership.cta}>
                {copy.partnership.cta}
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">{copy.copyright}</p>
          <a href="#top" onClick={(event: MouseEvent) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 text-white/50 hover:text-orange-500 text-xs transition-colors duration-300">
            {copy.back}<span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center"><ArrowUp aria-hidden="true" className="w-3.5 h-3.5" /></span>
          </a>
        </div>
      </div>
    </footer>
  );
}
