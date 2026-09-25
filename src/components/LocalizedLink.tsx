import { forwardRef } from 'react';
import { Link, NavLink, type LinkProps, type NavLinkProps } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { isExternalTarget, localizedPublicPath } from '@/lib/localizedRoutes';

function localizeTarget(to: LinkProps['to'], lang: 'id' | 'en') {
  if (typeof to === 'string') return isExternalTarget(to) ? to : localizedPublicPath(to, lang);
  return { ...to, pathname: to.pathname ? localizedPublicPath(to.pathname, lang) : to.pathname };
}

export const LocalizedLink = forwardRef<HTMLAnchorElement, LinkProps>(function LocalizedLink({ to, ...props }, ref) {
  const { lang } = useTranslation();
  return <Link ref={ref} to={localizeTarget(to, lang)} {...props} />;
});

export const LocalizedNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function LocalizedNavLink({ to, ...props }, ref) {
  const { lang } = useTranslation();
  return <NavLink ref={ref} to={localizeTarget(to, lang)} {...props} />;
});
