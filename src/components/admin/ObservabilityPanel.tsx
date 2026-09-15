import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, Gauge, LoaderCircle, ShieldAlert } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Observation = {
  id: number;
  kind: 'web_vital' | 'client_error' | 'csp_violation';
  name: string;
  value: number | null;
  rating: 'good' | 'needs-improvement' | 'poor' | null;
  path: string;
  release: string;
  details: Record<string, unknown>;
  created_at: string;
};

function percentile(values: number[], proportion = 0.75) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * proportion) - 1)];
}

function formatMetric(name: string, value: number | null) {
  if (value === null) return '—';
  return name === 'CLS' ? value.toFixed(3) : `${Math.round(value)} ms`;
}

export default function ObservabilityPanel() {
  const [period, setPeriod] = useState<'24h' | '7d'>('24h');
  const [rows, setRows] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const since = new Date(Date.now() - (period === '24h' ? 1 : 7) * 86_400_000).toISOString();
    const { data, error: queryError } = await supabase.from('website_observations').select('id,kind,name,value,rating,path,release,details,created_at').gte('created_at', since).order('created_at', { ascending: false }).limit(1000);
    if (queryError) setError(queryError.message); else { setRows((data ?? []) as Observation[]); setError(''); }
    setLoading(false);
  }, [period]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (supabase) void supabase.rpc('purge_old_website_observations'); }, []);

  const summary = useMemo(() => {
    const errors = rows.filter(({ kind }) => kind === 'client_error');
    const csp = rows.filter(({ kind }) => kind === 'csp_violation');
    const vitals = ['LCP', 'INP', 'CLS'].map((name) => ({ name, value: percentile(rows.filter((row) => row.kind === 'web_vital' && row.name === name && row.value !== null).map((row) => row.value!)) }));
    return { errors, csp, vitals };
  }, [rows]);

  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="observability-heading">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h3 id="observability-heading" className="flex items-center gap-2 text-lg font-bold"><Activity className="h-5 w-5 text-orange-600" />Stabilitas website</h3><p className="mt-1 text-sm text-slate-600">Error client, pelanggaran CSP, dan p75 Core Web Vitals.</p></div>
      <div className="flex rounded-xl bg-slate-100 p-1">{(['24h', '7d'] as const).map((value) => <button key={value} type="button" onClick={() => setPeriod(value)} aria-pressed={period === value} className={`min-h-10 rounded-lg px-4 text-sm font-bold ${period === value ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>{value}</button>)}</div>
    </div>
    {error && <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">Observability belum tersedia. Terapkan migrasi terbaru terlebih dahulu.</p>}
    {loading ? <p className="mt-6 text-sm text-slate-600"><LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />Memuat stabilitas…</p> : <>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard icon={AlertTriangle} label="Error client" value={String(summary.errors.length)} />
        <MetricCard icon={ShieldAlert} label="CSP report" value={String(summary.csp.length)} />
        {summary.vitals.map((metric) => <MetricCard key={metric.name} icon={Gauge} label={`p75 ${metric.name}`} value={formatMetric(metric.name, metric.value)} />)}
      </div>
      <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><tr><th className="py-3 pr-4">Waktu</th><th className="py-3 pr-4">Jenis</th><th className="py-3 pr-4">Nama</th><th className="py-3 pr-4">Route</th><th className="py-3">Release</th></tr></thead><tbody className="divide-y divide-slate-100">{[...summary.errors, ...summary.csp].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 10).map((row) => <tr key={row.id}><td className="whitespace-nowrap py-3 pr-4 text-slate-500">{new Date(row.created_at).toLocaleString('id-ID')}</td><td className="py-3 pr-4 font-semibold text-slate-700">{row.kind}</td><td className="py-3 pr-4">{row.name}</td><td className="py-3 pr-4 font-mono text-xs">{row.path}</td><td className="max-w-32 truncate py-3 font-mono text-xs">{row.release.slice(0, 12)}</td></tr>)}</tbody></table></div>
    </>}
  </section>;
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof Activity; label: string; value: string }) {
  return <article className="rounded-xl border border-slate-200 p-4"><Icon className="h-5 w-5 text-orange-600" /><p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-2xl font-black text-slate-900">{value}</p></article>;
}
