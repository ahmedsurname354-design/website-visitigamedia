import logoUrl from '@/assets/logo-visitiga.webp';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return <img src={logoUrl} alt="Visitiga Media logo" width="500" height="500" className={`w-auto ${className || 'h-36'}`} />;
}
