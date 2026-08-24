import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute() {
  const { session, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="grid min-h-screen place-items-center bg-slate-950 text-sm text-white">Memeriksa sesi…</div>;
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace state={{ from: location.pathname, unauthorized: Boolean(session) }} />;

  return <Outlet />;
}
