import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, BriefcaseBusiness, ChevronLeft, ContactRound, Film, Home, Inbox, LayoutDashboard, LoaderCircle, LogOut, Menu, Newspaper, Package, PanelsTopLeft, Sparkles } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminNotificationCounts } from '@/lib/adminApi';
import { supabase } from '@/lib/supabase';
import type { AdminNotificationCounts } from '@/types/admin';

type AdminLink = { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean; notification?: 'contacts' | 'careers' };
const groups: Array<{ label: string; links: AdminLink[] }> = [
  { label: 'Dashboard', links: [{ to: '/admin', label: 'Ringkasan', icon: LayoutDashboard, end: true }] },
  { label: 'Konten website', links: [
    { to: '/admin/homepage', label: 'Beranda', icon: Home }, { to: '/admin/about', label: 'About', icon: Sparkles },
    { to: '/admin/careers/content', label: 'Careers · Konten', icon: BriefcaseBusiness },
    { to: '/admin/products', label: 'Produk', icon: Package }, { to: '/admin/services', label: 'Layanan', icon: Film },
    { to: '/admin/portfolios', label: 'Portofolio', icon: PanelsTopLeft }, { to: '/admin/news', label: 'Berita', icon: Newspaper },
  ] },
  { label: 'Pesan & leads', links: [{ to: '/admin/leads', label: 'Prospek', icon: Inbox, notification: 'contacts' as const }, { to: '/admin/careers/submissions', label: 'Careers · Pesan', icon: BriefcaseBusiness, notification: 'careers' as const }] },
  { label: 'Pengaturan', links: [{ to: '/admin/contact', label: 'Kontak', icon: ContactRound }] },
];

const emptyNotifications: AdminNotificationCounts = { contacts: 0, partnerships: 0, applications: 0 };

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [notifications, setNotifications] = useState(emptyNotifications);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const email = session?.user.email ?? 'Admin';

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const refresh = () => void getAdminNotificationCounts().then(setNotifications).catch(() => undefined);
    refresh();
    const channel = client.channel('admin-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'careers_submissions' }, refresh)
      .subscribe();
    const interval = window.setInterval(refresh, 30_000);
    return () => { window.clearInterval(interval); void client.removeChannel(channel); };
  }, []);

  const logout = async () => {
    setLoggingOut(true);
    setLogoutError('');
    try {
      await signOut();
      navigate('/admin/login', { replace: true });
    } catch (reason) {
      setLogoutError(reason instanceof Error ? reason.message : 'Sesi tidak dapat diakhiri. Silakan coba lagi.');
    } finally { setLoggingOut(false); }
  };

  return (
    <div className="admin-shell">
      <a href="#admin-content" className="sr-only z-[80] rounded-lg bg-white px-4 py-3 font-semibold text-slate-900 shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Lewati navigasi</a>
      <AnimatePresence>
        {mobileOpen && <motion.button aria-label="Tutup menu" className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />}
      </AnimatePresence>
      <motion.aside aria-label="Navigasi admin" animate={{ width: collapsed ? 88 : 256 }} className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-950 text-slate-200 shadow-2xl transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-500 font-black text-slate-950">VA</div>
          {!collapsed && <span className="whitespace-nowrap font-bold tracking-tight text-white">Visitiga Admin</span>}
        </div>
        <nav aria-label="Menu utama admin" className="flex-1 space-y-5 overflow-y-auto p-3">
          {groups.map((group) => <div key={group.label}><p className={`mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[.18em] text-slate-500 ${collapsed ? 'sr-only' : ''}`}>{group.label}</p><div className="space-y-1">{group.links.map(({ to, label, icon: Icon, end, notification }) => { const count = notification === 'contacts' ? notifications.contacts : notification === 'careers' ? notifications.partnerships + notifications.applications : 0; return <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-orange-500 text-slate-950' : 'hover:bg-white/10 hover:text-white'}`}><Icon className="h-5 w-5 shrink-0" /> {!collapsed && <span>{label}</span>}{notification && count > 0 && <span className={`${collapsed ? 'absolute right-2 top-2 h-2.5 w-2.5 p-0' : 'ml-auto min-w-6 px-1.5 py-0.5 text-center text-[11px]'} rounded-full bg-red-500 font-bold text-white`}>{collapsed ? '' : count > 99 ? '99+' : count}</span>}</NavLink>; })}</div></div>)}
        </nav>
        <button onClick={() => setCollapsed((value) => !value)} className="hidden min-h-14 border-t border-white/10 p-4 text-slate-400 transition hover:text-white lg:flex lg:items-center lg:justify-center" aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'} aria-expanded={!collapsed}><ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} /></button>
      </motion.aside>
      <div className={`min-h-screen transition-[margin] duration-300 ${collapsed ? 'lg:ml-[88px]' : 'lg:ml-64'}`}>
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Buka menu"><Menu className="h-5 w-5" /></button><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-orange-600">Pengelolaan Konten</p><h1 className="font-bold">Dasbor Admin</h1></div></div>
          <div className="flex items-center gap-3"><NotificationCenter counts={notifications} open={notificationOpen} onToggle={() => setNotificationOpen((value) => !value)} onClose={() => setNotificationOpen(false)} /><div className="hidden text-right sm:block"><p className="max-w-48 truncate text-sm font-semibold">{email}</p><p className="text-xs text-slate-500">Administrator</p></div><div className="grid h-10 w-10 place-items-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">{email.slice(0, 1).toUpperCase()}</div><button disabled={loggingOut} onClick={() => void logout()} className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-wait disabled:opacity-60" aria-label="Keluar" title="Keluar">{loggingOut ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}<span className="hidden md:inline">Keluar</span></button></div>
        </header>
        <main id="admin-content" className="admin-main">{logoutError && <p role="alert" className="mx-auto mb-5 max-w-7xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{logoutError}</p>}<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}><Outlet /></motion.div></main>
      </div>
    </div>
  );
}

function NotificationCenter({ counts, open, onToggle, onClose }: { counts: AdminNotificationCounts; open: boolean; onToggle: () => void; onClose: () => void }) {
  const total = counts.contacts + counts.partnerships + counts.applications;
  const items = useMemo(() => [{ label: 'Prospek kontak', count: counts.contacts, to: '/admin/leads' }, { label: 'Partnership Careers', count: counts.partnerships, to: '/admin/careers/submissions' }, { label: 'Lamaran pekerjaan', count: counts.applications, to: '/admin/careers/submissions' }], [counts]);
  return <div className="relative"><button type="button" onClick={onToggle} aria-label={`Notifikasi${total ? `, ${total} belum dilihat` : ''}`} aria-expanded={open} className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-orange-600"><Bell className="h-5 w-5" />{total > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1 text-center text-[10px] font-black leading-5 text-white">{total > 99 ? '99+' : total}</span>}</button>{open && <><button type="button" aria-label="Tutup notifikasi" className="fixed inset-0 z-40 cursor-default" onClick={onClose} /><div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-black text-slate-900">Notifikasi</h2><span className="text-xs font-bold text-slate-400">{total} belum dilihat</span></div><div className="mt-3 space-y-1">{items.map((item) => <NavLink key={item.label} to={item.to} onClick={onClose} className="flex items-center justify-between rounded-xl px-3 py-3 text-sm hover:bg-slate-50"><span className="text-slate-600">{item.label}</span><span className={`rounded-full px-2 py-1 text-xs font-black ${item.count ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'}`}>{item.count}</span></NavLink>)}</div></div></>}</div>;
}
