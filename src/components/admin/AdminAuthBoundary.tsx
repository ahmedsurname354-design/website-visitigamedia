import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AdminAuthBoundary() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
