import { useState, type FormEvent } from 'react';
import { LogIn } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { session, isAdmin, isConfigured, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (session && isAdmin) return <Navigate to="/admin" replace />;
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true); setError('');
    try { await signIn(String(form.get('email')), String(form.get('password'))); navigate(location.state?.from ?? '/admin', { replace: true }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Login gagal.'); }
    finally { setSubmitting(false); }
  };
  return <main className="grid min-h-screen place-items-center bg-slate-950 p-5"><section className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-7 shadow-2xl sm:p-10"><div className="mb-8"><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-orange-500 font-black text-slate-950">VA</div><p className="text-sm font-semibold text-orange-600">VISITIGA CMS</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Masuk ke admin</h1><p className="mt-2 text-sm text-slate-500">Kelola konten website Anda dengan aman.</p></div>{!isConfigured ? <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Supabase belum dikonfigurasi. Isi variabel environment terlebih dahulu.</p> : session ? <div className="space-y-4"><p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Akun ini tidak memiliki peran administrator.</p><button onClick={() => void signOut()} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white">Keluar</button></div> : <form onSubmit={submit} className="space-y-5"><label className="block text-sm font-medium">Email<input required name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label><label className="block text-sm font-medium">Password<input required name="password" type="password" autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white transition hover:bg-orange-600 disabled:opacity-60"><LogIn className="h-4 w-4" />{submitting ? 'Memproses…' : 'Masuk'}</button></form>}</section></main>;
}
