import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, LayoutDashboard, LogOut, Menu, Newspaper, PanelsTopLeft } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/portfolios', label: 'Portofolio', icon: PanelsTopLeft },
  { to: '/admin/news', label: 'Berita', icon: Newspaper },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const email = session?.user.email ?? 'Admin';

  const logout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AnimatePresence>
        {mobileOpen && <motion.button aria-label="Tutup menu" className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />}
      </AnimatePresence>
      <motion.aside animate={{ width: collapsed ? 88 : 256 }} className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-950 text-slate-200 shadow-2xl transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-500 font-black text-slate-950">VA</div>
          {!collapsed && <span className="whitespace-nowrap font-bold tracking-tight text-white">Visitiga Admin</span>}
        </div>
        <nav className="flex-1 space-y-2 p-3">
          {links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-orange-500 text-slate-950' : 'hover:bg-white/10 hover:text-white'}`}>
            <Icon className="h-5 w-5 shrink-0" /> {!collapsed && <span>{label}</span>}
          </NavLink>)}
        </nav>
        <button onClick={() => setCollapsed((value) => !value)} className="hidden border-t border-white/10 p-4 text-slate-400 transition hover:text-white lg:flex lg:items-center lg:justify-center" aria-label="Ubah ukuran sidebar"><ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} /></button>
      </motion.aside>
      <div className={`min-h-screen transition-[margin] duration-300 ${collapsed ? 'lg:ml-[88px]' : 'lg:ml-64'}`}>
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Buka menu"><Menu className="h-5 w-5" /></button><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-orange-600">Content control</p><h1 className="font-bold">Admin Dashboard</h1></div></div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="max-w-48 truncate text-sm font-semibold">{email}</p><p className="text-xs text-slate-500">Administrator</p></div><div className="grid h-10 w-10 place-items-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">{email.slice(0, 1).toUpperCase()}</div><button onClick={() => void logout()} className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600" aria-label="Keluar"><LogOut className="h-5 w-5" /></button></div>
        </header>
        <main className="p-4 sm:p-8"><motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}><Outlet /></motion.div></main>
      </div>
    </div>
  );
}
