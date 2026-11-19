import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { LocalizedNavLink as NavLink } from '@/components/LocalizedLink';
import { m as motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Handshake, Mail, Megaphone, Menu, Phone, X } from 'lucide-react';
import { useMotionPolicy } from '@/hooks/useMotionPolicy';
import Logo from '@/components/Logo';
import { useTranslation } from '@/i18n';
import { preloadPublicRoute } from '@/lib/publicRoutes';
import { useContactSettings } from '@/hooks/useContactSettings';
import { whatsappHref } from '@/lib/contactSettings';

const navLinks = [
  { labelKey: 'navbar.home', href: '/' },
  { labelKey: 'navbar.about', href: '/about' },
  { labelKey: 'navbar.services', href: '/services' },
  { labelKey: 'navbar.product', href: '/product' },
  { labelKey: 'navbar.portfolio', href: '/portfolio' },
  { labelKey: 'navbar.news', href: '/news' },
  { labelKey: 'navbar.contact', href: '/contact' },
];

const marketingSubject = 'Konsultasi Visitiga Media';
const procurementSubject = 'Kerjasama Procurement';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 30);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
  const { lang, setLang, t } = useTranslation();
  const contactSettings = useContactSettings();
  const location = useLocation();
  const { reducedMotion } = useMotionPolicy();
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const contactToggle = useRef<HTMLButtonElement>(null);
  const contactFirstLink = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const solid = !/^\/(?:id|en)\/?$/.test(location.pathname) || scrolled || mobileOpen;

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const nextScrolled = window.scrollY > 30;
        setScrolled((current) => current === nextScrolled ? current : nextScrolled);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setContactMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!contactMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContactMenuOpen(false);
        contactToggle.current?.focus();
      }
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setContactMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    contactFirstLink.current?.focus();
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
    };
  }, [contactMenuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        mobileToggle.current?.focus();
      }
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
      ref={navRef}
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0 }}
      className={`site-navbar fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        solid ? 'site-navbar--solid theme-navbar backdrop-blur-md py-2.5' : 'site-navbar--transparent bg-transparent py-3 sm:py-4'
      }`}
    >
      <div className="mx-auto flex max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" aria-label={t('navbar.home')} className="flex items-center gap-3 group">
          <Logo className="h-11 sm:h-12 lg:h-14" />
        </NavLink>

        <div className="hidden lg:flex ml-auto items-center gap-7">
          {/* Desktop nav */}
          <ul className="flex items-center gap-7">
            {navLinks.slice(0, -1).map((link) => (
              <li key={link.labelKey}>
                <NavLink
                  to={link.href}
                  end={link.href === '/'}
                  onPointerEnter={() => void preloadPublicRoute(link.href)}
                  onFocus={() => void preloadPublicRoute(link.href)}
                  onTouchStart={() => void preloadPublicRoute(link.href)}
                  className={({ isActive }) => `site-nav-link text-[13px] font-semibold tracking-wide ${isActive ? 'is-active' : ''}`}
                >
                  {t(link.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>

          <span className="site-navbar__divider" />
          <button
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="theme-toggle px-3 py-2 border rounded-full text-sm border-white/10 text-white/80 hover:text-white hover:border-orange-500 transition-all duration-300"
            aria-label={t('navbar.languageToggle')}
            title={t('navbar.languageToggle')}
          >
            {lang.toUpperCase()}
          </button>
          <div className="site-navbar__contact">
            <button
              ref={contactToggle}
              type="button"
              className="site-navbar__cta"
              aria-haspopup="menu"
              aria-expanded={contactMenuOpen}
              aria-controls="desktop-contact-menu"
              onClick={() => setContactMenuOpen((open) => !open)}
            >
              {t('navbar.contact')} <ChevronDown className={contactMenuOpen ? 'rotate-180' : ''} />
            </button>
            {contactMenuOpen && (
              <div id="desktop-contact-menu" role="menu" className="site-navbar__contact-menu">
                <div className="site-navbar__contact-option">
                  <div className="site-navbar__contact-option-heading"><Megaphone aria-hidden="true" /><span>{lang === 'id' ? 'Marketing' : 'Marketing'}</span></div>
                  <p>{lang === 'id' ? 'Konsultasi media dan kebutuhan proyek.' : 'Media consultation and project requirements.'}</p>
                  <div className="site-navbar__contact-option-links">
                    <a ref={contactFirstLink} role="menuitem" href={whatsappHref(contactSettings.marketing_phone, marketingSubject)} target="_blank" rel="noopener noreferrer"><Phone aria-hidden="true" />WhatsApp</a>
                    <a role="menuitem" href={`mailto:${contactSettings.marketing_email}?subject=${encodeURIComponent(marketingSubject)}`}><Mail aria-hidden="true" />Email</a>
                  </div>
                </div>
                <div className="site-navbar__contact-option">
                  <div className="site-navbar__contact-option-heading"><Handshake aria-hidden="true" /><span>{lang === 'id' ? 'Procurement' : 'Procurement'}</span></div>
                  <p>{lang === 'id' ? 'Kerjasama, pengadaan, dan kebutuhan vendor.' : 'Partnership, procurement, and vendor requirements.'}</p>
                  <div className="site-navbar__contact-option-links">
                    <a role="menuitem" href={whatsappHref(contactSettings.procurement_phone, procurementSubject)} target="_blank" rel="noopener noreferrer"><Phone aria-hidden="true" />WhatsApp</a>
                    <a role="menuitem" href={`mailto:${contactSettings.procurement_email}?subject=${encodeURIComponent(procurementSubject)}`}><Mail aria-hidden="true" />Email</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          ref={mobileToggle}
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
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            id="mobile-navigation"
            className="site-mobile-menu lg:hidden overflow-hidden theme-mobile-menu backdrop-blur-md border-t border-black/5"
          >
            <div className="site-mobile-menu__content flex flex-col px-5 pb-6 pt-4 sm:px-8">
            <ul className="flex shrink-0 flex-col gap-1">
              {navLinks.filter((link) => link.labelKey !== 'navbar.contact').map((link) => (
                <li key={link.labelKey}>
                  <NavLink
                    to={link.href}
                    end={link.href === '/'}
                    onPointerEnter={() => void preloadPublicRoute(link.href)}
                    onFocus={() => void preloadPublicRoute(link.href)}
                    onTouchStart={() => void preloadPublicRoute(link.href)}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `site-mobile-link flex min-h-14 items-center justify-between border-b border-black/10 px-1 text-lg font-semibold ${isActive ? 'is-active' : ''}`}
                  >
                    <span className="site-mobile-link__label">{t(link.labelKey)}</span>
                    <span aria-hidden="true" className="text-lg font-normal">→</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="site-mobile-contact mt-5">
              <button
                type="button"
                className="site-mobile-contact__toggle"
                aria-haspopup="menu"
                aria-expanded={contactMenuOpen}
                aria-controls="mobile-contact-menu"
                onClick={() => setContactMenuOpen((open) => !open)}
              >
                <span>{t('navbar.contact')}</span><ChevronDown className={contactMenuOpen ? 'rotate-180' : ''} />
              </button>
              {contactMenuOpen && (
                <div id="mobile-contact-menu" role="menu" className="site-mobile-contact__menu">
                  <div className="site-mobile-contact__option">
                    <p className="site-mobile-contact__label"><Megaphone aria-hidden="true" />Marketing</p>
                    <p>{lang === 'id' ? 'Konsultasi media dan kebutuhan proyek.' : 'Media consultation and project requirements.'}</p>
                    <div className="site-mobile-contact__links">
                      <a ref={contactFirstLink} role="menuitem" href={whatsappHref(contactSettings.marketing_phone, marketingSubject)} target="_blank" rel="noopener noreferrer"><Phone aria-hidden="true" />WhatsApp</a>
                      <a role="menuitem" href={`mailto:${contactSettings.marketing_email}?subject=${encodeURIComponent(marketingSubject)}`}><Mail aria-hidden="true" />Email</a>
                    </div>
                  </div>
                  <div className="site-mobile-contact__option">
                    <p className="site-mobile-contact__label"><Handshake aria-hidden="true" />Procurement</p>
                    <p>{lang === 'id' ? 'Kerjasama, pengadaan, dan kebutuhan vendor.' : 'Partnership, procurement, and vendor requirements.'}</p>
                    <div className="site-mobile-contact__links">
                      <a role="menuitem" href={whatsappHref(contactSettings.procurement_phone, procurementSubject)} target="_blank" rel="noopener noreferrer"><Phone aria-hidden="true" />WhatsApp</a>
                      <a role="menuitem" href={`mailto:${contactSettings.procurement_email}?subject=${encodeURIComponent(procurementSubject)}`}><Mail aria-hidden="true" />Email</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-auto shrink-0 border-t border-black/10 pt-5">
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
