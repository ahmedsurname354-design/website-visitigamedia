import { useEffect, useRef } from 'react';
import NewsComments from '@/components/NewsComments';
import type { NewsRecord } from '@/types/admin';

export default function NewsCommentsModal({ article, onClose }: { article: NewsRecord; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={dialog} onCancel={onClose} aria-labelledby="comments-modal-title" className="m-auto max-h-[90svh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 text-slate-900 shadow-xl backdrop:bg-slate-950/60 sm:p-7">
    <div className="mb-6 flex items-start justify-between gap-4"><div><h2 id="comments-modal-title" className="text-xl font-bold">Komentar artikel</h2><p className="mt-2 text-sm text-slate-500">{article.title}</p></div><button type="button" onClick={onClose} className="rounded-lg border px-3 py-2 text-sm font-semibold">Tutup</button></div>
    <NewsComments key={article.id} newsId={article.id} admin />
  </dialog>;
}
