import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Eye, LoaderCircle, MousePointerClick, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type EventRow = { visitor_id: string; created_at: string };
type LeadRow = { created_at: string };
type Summary = { visitors: number; views: number; leads: number; previousVisitors: number; previousViews: number; previousLeads: number; hourlyViews: number[] };
const emptySummary: Summary = { visitors: 0, views: 0, leads: 0, previousVisitors: 0, previousViews: 0, previousLeads: 0, hourlyViews: Array.from({ length: 24 }, () => 0) };

function dayRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(start); end.setDate(end.getDate() + 1);
  const previousStart = new Date(start); previousStart.setDate(previousStart.getDate() - 1);
  return { start, end, previousStart };
}

function change(current: number, previous: number) {
  if (previous === 0) return current === 0 ? '—' : 'baru';
  const percentage = ((current - previous) / previous) * 100;
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!supabase) { setError('Supabase belum dikonfigurasi.'); setLoading(false); return; }
    const { start, end, previousStart } = dayRange();
    try {
      const [eventsResult, leadsResult] = await Promise.all([
        supabase.from('website_events').select('visitor_id, created_at').gte('created_at', previousStart.toISOString()).lt('created_at', end.toISOString()).limit(10000),
        supabase.from('contact_messages').select('created_at').gte('created_at', previousStart.toISOString()).lt('created_at', end.toISOString()).limit(10000),
      ]);
      if (eventsResult.error) throw eventsResult.error;
      if (leadsResult.error) throw leadsResult.error;
      const events = (eventsResult.data ?? []) as EventRow[];
      const leads = (leadsResult.data ?? []) as LeadRow[];
      const isToday = (value: string) => new Date(value) >= start;
      const todayEvents = events.filter((item) => isToday(item.created_at));
      const previousEvents = events.filter((item) => !isToday(item.created_at));
      const todayLeads = leads.filter((item) => isToday(item.created_at));
      const previousLeads = leads.filter((item) => !isToday(item.created_at));
      const hourlyViews = Array.from({ length: 24 }, () => 0);
      todayEvents.forEach((item) => { hourlyViews[new Date(item.created_at).getHours()] += 1; });
      setSummary({ visitors: new Set(todayEvents.map((item) => item.visitor_id)).size, views: todayEvents.length, leads: todayLeads.length, previousVisitors: new Set(previousEvents.map((item) => item.visitor_id)).size, previousViews: previousEvents.length, previousLeads: previousLeads.length, hourlyViews });
      setError('');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Data ringkasan tidak dapat dimuat.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const channel = client.channel('dashboard-live-overview').on('postgres_changes', { event: '*', schema: 'public', table: 'website_events' }, () => void load()).on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => void load()).subscribe();
    const interval = window.setInterval(() => void load(), 30_000);
    return () => { window.clearInterval(interval); void client.removeChannel(channel); };
  }, [load]);

  const stats = useMemo(() => [
    { label: 'Pengunjung hari ini', value: summary.visitors, previous: summary.previousVisitors, icon: Users, color: 'bg-blue-500' },
    { label: 'Tayangan halaman hari ini', value: summary.views, previous: summary.previousViews, icon: Eye, color: 'bg-violet-500' },
    { label: 'Leads kontak hari ini', value: summary.leads, previous: summary.previousLeads, icon: MousePointerClick, color: 'bg-orange-500' },
  ], [summary]);
  const max = Math.max(...summary.hourlyViews, 1);
  const today = new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date());

  return <div className="mx-auto max-w-7xl space-y-8"><div><h2 className="text-2xl font-black tracking-tight sm:text-3xl">Ringkasan real-time</h2><p className="mt-2 text-sm text-slate-500">Aktivitas website hari ini, {today}. Data diperbarui otomatis.</p></div>{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<section className="grid gap-4 md:grid-cols-3">{stats.map(({ label, value, previous, icon: Icon, color }) => { const trend = change(value, previous); const positive = value >= previous; return <article key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-xl ${color} text-white`}><Icon className="h-5 w-5" /></div><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{trend}</span></div><p className="mt-6 text-sm font-medium text-slate-500">{label}</p><p className="mt-1 text-3xl font-black tracking-tight">{loading ? <LoaderCircle className="h-7 w-7 animate-spin" /> : value.toLocaleString('id-ID')}</p><p className="mt-1 text-xs text-slate-400">dibanding kemarin</p></article>; })}</section><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="font-bold">Tayangan per jam</h3><p className="mt-1 text-sm text-slate-500">Distribusi page view hari ini.</p></div><span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">Live</span></div><div className="mt-8 flex h-56 items-end gap-1 sm:gap-2">{summary.hourlyViews.map((value, index) => <div key={index} className="group flex h-full min-w-0 flex-1 flex-col justify-end"><div className="relative min-h-1 rounded-t-lg bg-orange-500/85 transition hover:bg-orange-600" style={{ height: `${(value / max) * 100}%` }}><span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">{value}</span></div><span className="mt-2 text-center text-[9px] text-slate-400">{index % 2 === 0 ? String(index).padStart(2, '0') : ''}</span></div>)}</div></section></div>;
}
