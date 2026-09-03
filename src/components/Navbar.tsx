import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { useTranslation } from '@/i18n';
import { preloadPublicRoute } from '@/lib/publicRoutes';

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
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileOpen]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || mobileOpen ? 'theme-navbar backdrop-blur-md py-2.5 shadow-sm' : 'bg-transparent py-3 sm:py-4'
      }`}
    >
      <div className="mx-auto flex max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" aria-label={t('navbar.home')} className="flex items-center gap-3 group">
          <Logo className="h-11 sm:h-12 lg:h-14" />
        </NavLink>

        <div className="hidden lg:flex ml-auto items-center gap-6">
          {/* Desktop nav */}
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.labelKey}>
                <NavLink
                  to={link.href}
                  end={link.href === '/'}
                  onPointerEnter={() => void preloadPublicRoute(link.href)}
                  onFocus={() => void preloadPublicRoute(link.href)}
                  onTouchStart={() => void preloadPublicRoute(link.href)}
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
          className="lg:hidden theme-nav-text inline-grid size-11 place-items-center rounded-full border border-current/10 transition-colors hover:bg-orange-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label={mobileOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
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
            id="mobile-navigation"
            className="lg:hidden overflow-hidden theme-mobile-menu backdrop-blur-md border-t border-black/5"
          >
            <div className="flex h-[calc(100svh-4.5rem)] flex-col px-4 pb-6 pt-3 sm:px-6">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.labelKey}>
                  <NavLink
                    to={link.href}
                    end={link.href === '/'}
                    onPointerEnter={() => void preloadPublicRoute(link.href)}
                    onFocus={() => void preloadPublicRoute(link.href)}
                    onTouchStart={() => void preloadPublicRoute(link.href)}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `flex min-h-12 items-center justify-between rounded-xl px-4 text-base font-semibold transition-colors ${
                      isActive ? 'bg-orange-500/10 text-orange-600' : 'text-white/80 hover:bg-black/5 hover:text-orange-500'
                    }`}
                  >
                    {t(link.labelKey)}
                    <span aria-hidden="true" className="text-lg font-normal">→</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-auto border-t border-black/10 pt-5">
              <button
                onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
                className="flex min-h-12 w-full items-center justify-between rounded-xl border border-black/10 px-4 text-sm font-semibold theme-nav-text"
                aria-label={t('navbar.languageToggle')}
              >
                <span>{t('navbar.languageToggle')}</span><span className="text-orange-600">{lang.toUpperCase()}</span>
              </button>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
