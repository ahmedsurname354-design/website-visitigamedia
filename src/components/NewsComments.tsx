import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { deleteNewsComment, listNewsComments, submitNewsComment, type NewsComment } from '@/lib/newsComments';
import { useTranslation } from '@/i18n';

export default function NewsComments({ newsId, admin = false }: { newsId: string; admin?: boolean }) {
  const { lang } = useTranslation();
  const en = !admin && lang === 'en';
  const [items, setItems] = useState<NewsComment[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const mutationLock = useRef(false);
  const active = useRef(true);
  const generation = useRef(0);

  const load = useCallback(async (cursor?: NewsComment) => {
    const request = ++generation.current;
    setLoading(true);
    setLoadError('');
    try {
      const page = await listNewsComments(newsId, cursor);
      if (!active.current || request !== generation.current) return;
      setItems((previous) => cursor ? [...previous, ...page.items.filter((item) => !previous.some((old) => old.id === item.id))] : page.items);
      setHasMore(page.hasMore);
    } catch {
      if (active.current && request === generation.current) setLoadError(en ? 'Comments could not be loaded. Please try again.' : 'Komentar belum dapat dimuat. Silakan coba lagi.');
    } finally {
      if (active.current && request === generation.current) setLoading(false);
    }
  }, [en, newsId]);

  useEffect(() => {
    active.current = true;
    void load();
    return () => { active.current = false; };
  }, [load]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutationLock.current) return;
    setError(''); setSuccess('');
    if ([...name.trim()].length < 2 || [...name.trim()].length > 80 || !body.trim() || [...body.trim()].length > 2000) {
      setError(en ? 'Enter a name of 2–80 characters and a comment of 1–2,000 characters.' : 'Isi nama 2–80 karakter dan komentar 1–2.000 karakter.');
      return;
    }
    const honeypot = String(new FormData(event.currentTarget).get('company') ?? '');
    mutationLock.current = true; setBusy(true);
    try {
      await submitNewsComment(newsId, name, body, honeypot);
      if (!active.current) return;
      setBody(''); setSuccess(en ? 'Your comment was submitted.' : 'Komentar berhasil dikirim.');
      await load();
    } catch (reason) {
      if (active.current) setError(reason instanceof Error ? reason.message : (en ? 'Your comment was not submitted. Please try again.' : 'Komentar belum terkirim. Silakan coba lagi.'));
    } finally {
      mutationLock.current = false;
      if (active.current) setBusy(false);
    }
  }

  async function remove(id: string) {
    if (mutationLock.current || !window.confirm('Hapus komentar ini secara permanen?')) return;
    mutationLock.current = true; setBusy(true); setError(''); setSuccess('');
    try {
      await deleteNewsComment(id);
      if (!active.current) return;
      setItems((previous) => previous.filter((item) => item.id !== id));
      setSuccess('Komentar telah dihapus.');
      await load();
    } catch (reason) {
      if (active.current) setError(reason instanceof Error ? reason.message : 'Komentar gagal dihapus.');
    } finally {
      mutationLock.current = false;
      if (active.current) setBusy(false);
    }
  }

  const fieldClass = 'mt-2 block w-full rounded-xl border border-[#ddc9b8] bg-white px-4 py-3 text-[#241811] outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:opacity-60';
  return <section aria-label={en ? 'Article comments' : 'Komentar artikel'} className="text-[#241811]">
    {!admin && <><h2 className="text-2xl font-bold">{en ? 'Comments' : 'Komentar'}</h2><p className="mt-2 text-sm text-[#735c4d]">{en ? 'Share your thoughts by entering your name and comment.' : 'Bagikan pendapat Anda dengan mengisi nama dan komentar.'}</p>
      <form onSubmit={(event) => void submit(event)} className="mt-5 space-y-4">
        <label className="block text-sm font-semibold">{en ? 'Name' : 'Nama'}<input name="name" required minLength={2} maxLength={80} autoComplete="name" value={name} disabled={busy} onChange={(event) => setName(event.target.value)} className={fieldClass} /></label>
        <label className="block text-sm font-semibold">{en ? 'Comment' : 'Komentar'}<textarea name="body" required maxLength={2000} rows={4} value={body} disabled={busy} onChange={(event) => setBody(event.target.value)} className={fieldClass} /></label>
        <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label>Perusahaan<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
        <button type="submit" disabled={busy || loading} className="editorial-button editorial-button--primary disabled:opacity-50">{busy ? (en ? 'Sending…' : 'Mengirim…') : (en ? 'Submit comment' : 'Kirim komentar')}</button>
      </form></>}
    {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
    {success && <p role="status" className="mt-4 text-sm text-green-700">{success}</p>}
    <div className="mt-6 space-y-4" aria-busy={loading}>
      {items.map((item) => <div key={item.id} className="rounded-xl border border-[#ead5c1] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><p className="break-words font-bold">{item.name}</p><time dateTime={item.created_at} className="mt-1 block text-xs text-[#735c4d]">{new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</time></div>
          {admin && <button type="button" disabled={busy || loading} onClick={() => void remove(item.id)} className="rounded-lg px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Hapus</button>}
        </div><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7">{item.body}</p>
      </div>)}
      {loading && <p role="status" className="text-sm text-[#735c4d]">{en ? 'Loading comments…' : 'Memuat komentar…'}</p>}
      {!loading && !loadError && items.length === 0 && <p className="text-sm text-[#735c4d]">{en ? 'No comments yet.' : 'Belum ada komentar.'}</p>}
      {loadError && <div role="alert"><p className="text-sm text-red-700">{loadError}</p><button type="button" disabled={loading || busy} onClick={() => void load()} className="mt-2 rounded-lg border px-4 py-2 text-sm font-semibold">{en ? 'Try again' : 'Coba lagi'}</button></div>}
      {hasMore && !loadError && <button type="button" disabled={loading || busy} onClick={() => void load(items[items.length - 1])} className="rounded-xl border border-[#ddc9b8] px-5 py-3 text-sm font-semibold disabled:opacity-50">{en ? 'Load more' : 'Muat lainnya'}</button>}
    </div>
  </section>;
}
