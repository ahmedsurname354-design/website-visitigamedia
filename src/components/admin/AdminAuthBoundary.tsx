import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';

function AdminMeta() {
  usePageMeta({
    title: 'Visitiga CMS',
    description: 'Area administrasi Visitiga Media.',
    pathname: '/admin',
    noIndex: true,
  });
  return null;
}

export default function AdminAuthBoundary() {
  return (
    <AuthProvider>
      <AdminMeta />
      <Outlet />
    </AuthProvider>
  );
}
