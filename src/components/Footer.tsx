import { Instagram, Facebook, Youtube, ArrowUp } from 'lucide-react';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';
import { MouseEvent } from 'react';

const footerLinks = {
  Perusahaan: ['Tentang Kami', 'Tim Kami', 'Karier', 'Kontak'],
  Layanan: ['LED Luar Ruang', 'Layar Dalam Ruang', 'Papan Neon', 'Pemeliharaan'],
  Informasi: ['Portofolio', 'Berita', 'Tanya Jawab', 'Dukungan'],
};

const linkMap: Record<string, string> = {
  'Tentang Kami': '/about',
  'Tim Kami': '/about',
  Karier: '/about',
  Kontak: 'https://bit.ly/49NclAE',
  'LED Luar Ruang': '/services',
  'Layar Dalam Ruang': '/services',
  'Papan Neon': '/services',
  Pemeliharaan: '/services',
  Portofolio: '/portfolio',
  Berita: '/news',
  'Tanya Jawab': '/faq',
  Dukungan: 'mailto:marcomm@visitiga.com?subject=Konsultasi%20Visitiga%20Media',
};

const socials = [
  { Icon: Instagram, href: 'https://www.instagram.com/visitigamedia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
  { Icon: Facebook, href: 'https://www.facebook.com/visitiga' },
  { Icon: Youtube, href: 'https://www.youtube.com/visitiga' },
];

export default function Footer() {
  return (
    <footer className="site-footer border-t border-slate-800 pt-14 pb-8">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
            <div className="lg:col-span-2">
            <Logo className="h-24 mb-5" />
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
              Solusi LED display profesional untuk bisnis Anda di seluruh Indonesia.
              Kualitas premium, desain kreatif, dan layanan terbaik.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-orange-500 flex items-center justify-center transition-colors duration-300"
                >
                  <Icon className="w-4 h-4 text-white/70 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-white font-semibold text-sm mb-4">{title}</p>
              <ul className="space-y-3">
                {links.map((link) => {
                  const path = linkMap[link] ?? '/';
                  const isExternal = path.startsWith('http') || path.startsWith('mailto:');
                  return (
                    <li key={link}>
                      {isExternal ? (
                        <a
                          href={path}
                          target={path.startsWith('http') ? '_blank' : undefined}
                          rel={path.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-white/50 hover:text-orange-500 text-sm transition-colors duration-300"
                        >
                          {link}
                        </a>
                      ) : (
                        <Link
                          to={path}
                          className="text-white/50 hover:text-orange-500 text-sm transition-colors duration-300"
                        >
                          {link}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © 2026 Visitiga LED Solutions. Seluruh hak cipta dilindungi.
          </p>
          <a
            href="#home"
            onClick={(e: MouseEvent) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-white/50 hover:text-orange-500 text-xs transition-colors duration-300"
          >
            Kembali ke atas
            <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
              <ArrowUp className="w-3.5 h-3.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
