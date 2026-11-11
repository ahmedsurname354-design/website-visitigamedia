import logoUrl from '@/assets/logo-visitiga.png';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return <img src={logoUrl} alt="Visitiga Media logo" width="2100" height="749" className={`w-auto ${className || 'h-16'}`} />;
}
