import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, CalendarDays, Eye, LoaderCircle, MousePointerClick, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type EventRow = { visitor_id: string; created_at: string };
type LeadRow = { created_at: string };
type Preset = '7d' | '30d' | '1y' | 'custom';
type ChartItem = { label: string; value: number; title: string };
type Summary = { visitors: number; views: number; leads: number; previousVisitors: number; previousViews: number; previousLeads: number; chart: ChartItem[] };
const DAY_MS = 86_400_000;
const PAGE_SIZE = 1000;
const PRESETS: ReadonlyArray<readonly [Preset, string]> = [
  ['7d', '7 hari'],
  ['30d', '1 bulan'],
  ['1y', '1 tahun'],
  ['custom', 'Kustom'],
];
const emptySummary: Summary = { visitors: 0, views: 0, leads: 0, previousVisitors: 0, previousViews: 0, previousLeads: 0, chart: [] };

function localDateValue(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function startOfDay(value: string | Date) {
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function selectedRange(preset: Preset, customStart: string, customEnd: string) {
  const today = startOfDay(new Date());
  const end = addDays(today, 1);
  let start = new Date(today);
  if (preset === '7d') start.setDate(start.getDate() - 6);
  if (preset === '30d') start.setDate(start.getDate() - 29);
  if (preset === '1y') { start = new Date(today.getFullYear(), today.getMonth(), 1); start.setMonth(start.getMonth() - 11); }
  if (preset === 'custom') {
    start = startOfDay(customStart);
    return { start, end: addDays(startOfDay(customEnd), 1) };
  }
  return { start, end };
}

function previousStart(start: Date, end: Date) {
  return new Date(start.getTime() - (end.getTime() - start.getTime()));
}

function change(current: number, previous: number) {
  if (previous === 0) return current === 0 ? '—' : 'baru';
  const percentage = ((current - previous) / previous) * 100;
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
}

function buildChart(events: EventRow[], start: Date, end: Date): ChartItem[] {
  const days = Math.ceil((end.getTime() - start.getTime()) / DAY_MS);
  const monthly = days > 90;
  const buckets = new Map<string, number>();
  const cursor = new Date(start);
  while (cursor < end) {
    const key = monthly ? `${cursor.getFullYear()}-${cursor.getMonth()}` : localDateValue(cursor);
    if (!buckets.has(key)) buckets.set(key, 0);
    if (monthly) cursor.setMonth(cursor.getMonth() + 1); else cursor.setDate(cursor.getDate() + 1);
  }
  events.forEach((event) => {
    const date = new Date(event.created_at);
    const key = monthly ? `${date.getFullYear()}-${date.getMonth()}` : localDateValue(date);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });
  return [...buckets].map(([key, value]) => {
    const date = monthly ? new Date(Number(key.split('-')[0]), Number(key.split('-')[1]), 1) : startOfDay(key);
    return {
      value,
      label: new Intl.DateTimeFormat('id-ID', monthly ? { month: 'short' } : { day: '2-digit', month: days <= 14 ? 'short' : undefined }).format(date),
      title: new Intl.DateTimeFormat('id-ID', monthly ? { month: 'long', year: 'numeric' } : { dateStyle: 'medium' }).format(date),
    };
  });
}

async function fetchRows<T extends EventRow | LeadRow>(table: 'website_events' | 'contact_messages', columns: string, start: Date, end: Date): Promise<T[]> {
  if (!supabase) return [];
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase.from(table).select(columns).gte('created_at', start.toISOString()).lt('created_at', end.toISOString()).order('created_at').range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const page = (data ?? []) as unknown as T[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

export default function DashboardPage() {
  const today = startOfDay(new Date());
  const [preset, setPreset] = useState<Preset>('7d');
  const [customStart, setCustomStart] = useState(localDateValue(new Date(today.getFullYear(), today.getMonth(), 1)));
  const [customEnd, setCustomEnd] = useState(localDateValue(today));
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const range = useMemo(() => selectedRange(preset, customStart, customEnd), [preset, customStart, customEnd]);

  const load = useCallback(async () => {
    if (!supabase) { setError('Supabase belum dikonfigurasi.'); setLoading(false); return; }
    if (range.start >= range.end) { setError('Tanggal mulai harus sebelum atau sama dengan tanggal akhir.'); setLoading(false); return; }
    setLoading(true);
    const earlier = previousStart(range.start, range.end);
    try {
      const [events, leads] = await Promise.all([
        fetchRows<EventRow>('website_events', 'visitor_id, created_at', earlier, range.end),
        fetchRows<LeadRow>('contact_messages', 'created_at', earlier, range.end),
      ]);
      const currentEvents = events.filter((item) => new Date(item.created_at) >= range.start);
      const oldEvents = events.filter((item) => new Date(item.created_at) < range.start);
      const currentLeads = leads.filter((item) => new Date(item.created_at) >= range.start);
      const oldLeads = leads.filter((item) => new Date(item.created_at) < range.start);
      setSummary({
        visitors: new Set(currentEvents.map((item) => item.visitor_id)).size,
        views: currentEvents.length,
        leads: currentLeads.length,
        previousVisitors: new Set(oldEvents.map((item) => item.visitor_id)).size,
        previousViews: oldEvents.length,
        previousLeads: oldLeads.length,
        chart: buildChart(currentEvents, range.start, range.end),
      });
      setError('');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Data ringkasan tidak dapat dimuat.'); }
    finally { setLoading(false); }
  }, [range]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const client = supabase; if (!client) return;
    const channel = client.channel('dashboard-live-overview').on('postgres_changes', { event: '*', schema: 'public', table: 'website_events' }, () => void load()).on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => void load()).subscribe();
    const interval = window.setInterval(() => void load(), 30_000);
    return () => { window.clearInterval(interval); void client.removeChannel(channel); };
  }, [load]);

  const periodLabel = `${new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(range.start)} – ${new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(range.end.getTime() - 1))}`;
  const stats = [
    { label: 'Pengunjung', value: summary.visitors, previous: summary.previousVisitors, icon: Users, color: 'bg-blue-500' },
    { label: 'Tayangan halaman', value: summary.views, previous: summary.previousViews, icon: Eye, color: 'bg-violet-500' },
    { label: 'Leads kontak', value: summary.leads, previous: summary.previousLeads, icon: MousePointerClick, color: 'bg-orange-500' },
  ];

  return <div className="mx-auto min-w-0 max-w-7xl space-y-8 text-slate-900">
    <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div><h2 className="text-2xl font-black tracking-tight sm:text-3xl">Ringkasan aktivitas</h2><p className="mt-2 text-base leading-relaxed text-slate-600">{periodLabel}. Data diperbarui otomatis.</p></div>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">{PRESETS.map(([value, label]) => <button key={value} type="button" onClick={() => setPreset(value)} aria-pressed={preset === value} className={`min-h-11 rounded-xl px-4 py-2 text-base font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 ${preset === value ? 'bg-orange-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{label}</button>)}</div>
    </div>
    {preset === 'custom' && <section className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><CalendarDays className="mb-2.5 h-5 w-5 text-orange-500" /><DateInput label="Dari tanggal" value={customStart} max={customEnd} onChange={setCustomStart} /><DateInput label="Sampai tanggal" value={customEnd} min={customStart} max={localDateValue(today)} onChange={setCustomEnd} /></section>}
    {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <section className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-4">{stats.map(({ label, value, previous, icon: Icon, color }) => { const trend = change(value, previous); const positive = value >= previous; return <article key={label} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div className={`grid h-11 w-11 place-items-center rounded-xl ${color} text-white`}><Icon className="h-5 w-5" /></div><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-bold ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}{trend}</span></div><p className="mt-6 text-base font-semibold text-slate-700">{label}</p><p className="mt-2 break-words text-4xl font-black leading-tight tracking-tight text-slate-900 tabular-nums sm:text-5xl">{loading ? <><LoaderCircle aria-hidden="true" className="h-9 w-9 animate-spin" /><span className="sr-only">Memuat ringkasan</span></> : value.toLocaleString('id-ID')}</p><p className="mt-3 text-sm leading-relaxed text-slate-600">dibanding periode sebelumnya</p></article>; })}</section>
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div><h3 className="text-lg font-bold text-slate-900">Tayangan per {Math.ceil((range.end.getTime() - range.start.getTime()) / DAY_MS) > 90 ? 'bulan' : 'hari'}</h3><p className="mt-1 text-sm text-slate-600">Tren tayangan halaman dalam rentang terpilih.</p></div>
        <span className="shrink-0 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">Live</span>
      </div>
      {summary.chart.length > 0 ? <ViewsLineChart items={summary.chart} /> : <div className="grid h-72 place-items-center text-sm text-slate-600">{loading ? 'Memuat grafik...' : 'Data grafik belum tersedia.'}</div>}
    </section>
  </div>;
}

function ViewsLineChart({ items }: { items: ChartItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const width = Math.max(640, items.length * 24);
  const height = 280;
  const left = 80;
  const right = width - 48;
  const top = 24;
  const bottom = 232;
  const maximum = Math.max(...items.map((item) => item.value), 1);
  const magnitude = 10 ** Math.floor(Math.log10(maximum / 4));
  const step = Math.max(1, Math.ceil(maximum / 4 / magnitude) * magnitude);
  const ceiling = step * 4;
  const points = items.map((item, index) => ({
    x: items.length === 1 ? (left + right) / 2 : left + index * (right - left) / (items.length - 1),
    y: bottom - item.value / ceiling * (bottom - top),
  }));
  const labelEvery = Math.max(1, Math.ceil(items.length / Math.floor((right - left) / 100)));
  const activeItem = activeIndex === null ? undefined : items[activeIndex];

  return <div className="mt-5">
    <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 text-base leading-relaxed" aria-live="polite">
      <span className="inline-flex items-center gap-2 font-semibold text-slate-600"><span className="h-0.5 w-6 rounded bg-orange-600" />Tayangan halaman</span>
      <span className="text-slate-600">{activeItem ? <>{activeItem.title}: <strong className="text-slate-900">{activeItem.value.toLocaleString('id-ID')} tayangan</strong></> : 'Sorot atau pilih titik untuk melihat detail'}</span>
    </div>
    <div className="overflow-x-auto pb-2">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[640px]" style={{ minWidth: width }} role="group" aria-label="Grafik garis tayangan halaman. Pilih titik untuk melihat tanggal dan jumlah tayangan.">
        {Array.from({ length: 5 }, (_, index) => {
          const y = bottom - index / 4 * (bottom - top);
          return <g key={index}>
            <line x1={left} x2={right} y1={y} y2={y} stroke="#e2e8f0" strokeDasharray={index === 0 ? undefined : '4 4'} />
            <text x={left - 12} y={y + 4} textAnchor="end" fill="#475569" fontSize="14" fontWeight="500">{(step * index).toLocaleString('id-ID', { notation: 'compact' })}</text>
          </g>;
        })}
        <polyline points={points.map(({ x, y }) => `${x},${y}`).join(' ')} fill="none" stroke="#ea580c" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {items.map((item, index) => {
          const { x, y } = points[index];
          const selected = activeIndex === index;
          return <g key={item.title}>
            {selected && <line x1={x} x2={x} y1={top} y2={bottom} stroke="#fdba74" strokeDasharray="4 4" />}
            <circle cx={x} cy={y} r={selected ? 6 : 4} fill="white" stroke="#ea580c" strokeWidth="2.5" />
            <circle cx={x} cy={y} r="12" fill="transparent" tabIndex={0} role="button" aria-label={`${item.title}: ${item.value.toLocaleString('id-ID')} tayangan`} className="cursor-pointer focus:outline-none focus:stroke-orange-600" onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} onFocus={() => setActiveIndex(index)} onBlur={() => setActiveIndex(null)} onClick={() => setActiveIndex(index)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveIndex(index); } }}>
              <title>{item.title}: {item.value.toLocaleString('id-ID')} tayangan</title>
            </circle>
            {(index === items.length - 1 || (index % labelEvery === 0 && items.length - 1 - index >= labelEvery)) && <text x={x} y={bottom + 28} textAnchor="middle" fill="#475569" fontSize="14" fontWeight="500">{item.label}</text>}
          </g>;
        })}
      </svg>
    </div>
    {items.every((item) => item.value === 0) && <p className="mt-2 text-sm text-slate-600">Belum ada tayangan halaman pada periode ini.</p>}
    <p className="mt-2 text-sm text-slate-600">Geser grafik ke samping jika seluruh tanggal belum terlihat.</p>
  </div>;
}

function DateInput({ label, value, min, max, onChange }: { label: string; value: string; min?: string; max?: string; onChange: (value: string) => void }) {
  return <label className="min-w-0 text-sm font-bold text-slate-700">{label}<input required type="date" value={value} min={min} max={max} onChange={(event) => { if (event.target.value) onChange(event.target.value); }} className="mt-2 block min-h-11 max-w-full rounded-xl border border-slate-300 px-3 py-2 text-base font-medium text-slate-700 outline-none focus:border-orange-500" /></label>;
}
