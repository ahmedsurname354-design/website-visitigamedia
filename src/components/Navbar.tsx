import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { useTranslation } from '@/i18n';

const navLinks = [
  { labelKey: 'navbar.home', href: '/' },
  { labelKey: 'navbar.about', href: '/about' },
  { labelKey: 'navbar.services', href: '/services' },
  { labelKey: 'navbar.product', href: '/product' },
  { labelKey: 'navbar.portfolio', href: '/portfolio' },
  { labelKey: 'navbar.news', href: '/news' },
  { labelKey: 'navbar.contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'theme-navbar backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-3 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" aria-label={t('navbar.home')} className="flex items-center gap-3 group">
          <Logo className="h-14 sm:h-20 lg:h-24" />
        </NavLink>

        <div className="hidden lg:flex ml-auto items-center gap-8">
          {/* Desktop nav */}
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.labelKey}>
                <NavLink
                  to={link.href}
                  end={link.href === '/'}
                  className={({ isActive }) => `text-sm font-medium tracking-wide transition-colors duration-300 relative group ${
                    isActive ? 'text-orange-500' : 'text-white/80 hover:text-orange-500'
                  }`}
                >
                  {t(link.labelKey)}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-orange-500 transition-all duration-300 group-hover:w-full group-[.active]:w-full" />
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="theme-toggle px-3 py-2 border rounded-full text-sm border-white/10 text-white/80 hover:text-white hover:border-orange-500 transition-all duration-300"
            aria-label={t('navbar.languageToggle')}
            title={t('navbar.languageToggle')}
          >
            {lang.toUpperCase()}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden theme-nav-text"
          aria-label={mobileOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden theme-mobile-menu backdrop-blur-md"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <li key={link.labelKey}>
                  <NavLink
                    to={link.href}
                    end={link.href === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `text-sm font-medium block py-2 transition-colors ${
                      isActive ? 'text-orange-500' : 'text-white/80 hover:text-orange-500'
                    }`}
                  >
                    {t(link.labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
