import logoUrl from '@/assets/logo-visitiga.png';

interface LogoProps {
  className?: string;
  alt?: string;
}

export default function Logo({ className = '', alt = 'Visitiga Media logo' }: LogoProps) {
  return <img src={logoUrl} alt={alt} width="2100" height="749" className={`w-auto ${className || 'h-16'}`} />;
}
