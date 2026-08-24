import { ArrowUpRight, Eye, MousePointerClick, Users } from 'lucide-react';

const stats = [
  { label: 'Total Visitors', value: '12,480', change: '+12.5%', icon: Users, color: 'bg-blue-500' },
  { label: 'Page Views', value: '28,920', change: '+8.2%', icon: Eye, color: 'bg-violet-500' },
  { label: 'Contact Leads', value: '186', change: '+18.4%', icon: MousePointerClick, color: 'bg-orange-500' },
];
const traffic = [34, 51, 45, 72, 58, 87, 74, 92, 84, 108, 96, 124];

export default function DashboardPage() {
  const max = Math.max(...traffic);
  return <div className="mx-auto max-w-7xl space-y-8"><div><h2 className="text-2xl font-black tracking-tight sm:text-3xl">Ringkasan performa</h2><p className="mt-2 text-sm text-slate-500">Statistik tampilan untuk dashboard. Hubungkan analytics saat data produksi sudah tersedia.</p></div><section className="grid gap-4 md:grid-cols-3">{stats.map(({ label, value, change, icon: Icon, color }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div className={`grid h-11 w-11 place-items-center rounded-xl ${color} text-white`}><Icon className="h-5 w-5" /></div><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700"><ArrowUpRight className="h-3.5 w-3.5" />{change}</span></div><p className="mt-6 text-sm font-medium text-slate-500">{label}</p><p className="mt-1 text-3xl font-black tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-400">dibanding 30 hari sebelumnya</p></article>)}</section><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="font-bold">Traffic 12 bulan terakhir</h3><p className="mt-1 text-sm text-slate-500">Contoh visualisasi data pengunjung.</p></div><span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">Mock data</span></div><div className="mt-8 flex h-56 items-end gap-2 sm:gap-4">{traffic.map((value, index) => <div key={index} className="group flex h-full flex-1 flex-col justify-end"><div className="relative rounded-t-lg bg-orange-500/85 transition hover:bg-orange-600" style={{ height: `${(value / max) * 100}%` }}><span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">{value}</span></div><span className="mt-2 text-center text-[10px] text-slate-400">{index + 1}</span></div>)}</div></section></div>;
}
