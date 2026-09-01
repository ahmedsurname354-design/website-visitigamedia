import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from 'lucide-react';
import { getProductCatalogue } from '@/lib/adminApi';

type PageFlipInstance = { loadFromHTML: (items: HTMLElement[]) => void; flipNext: () => void; flipPrev: () => void; destroy: () => void; on: (event: 'flip', handler: (event: { data: number }) => void) => void };
const FALLBACK_PDF = '/products/product-catalogue-2026.pdf';

export default function ProductFlipbook() {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlipInstance | null>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const hydrateRef = useRef<(page: number) => void>(() => undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [title, setTitle] = useState('Katalog Produk');
  const [renderedPages, setRenderedPages] = useState<Record<number, string>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [status, setStatus] = useState('Memuat katalog produk…');

  const changePage = (direction: 'next' | 'previous') => {
    hydrateRef.current(currentPage + (direction === 'next' ? 1 : -1));
    if (direction === 'next') flipRef.current?.flipNext(); else flipRef.current?.flipPrev();
  };
  const openFullscreen = () => { setIsFullscreen(true); hydrateRef.current(currentPage); void fullscreenRef.current?.requestFullscreen().catch(() => undefined); };
  const closeFullscreen = async () => { if (document.fullscreenElement) await document.exitFullscreen(); setIsFullscreen(false); };

  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement === fullscreenRef.current);
    document.addEventListener('fullscreenchange', sync); return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: '500px 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    let cancelled = false;
    let pageFlip: PageFlipInstance | null = null;
    const objectUrls = new Set<string>();
    async function initialise() {
      try {
        const [flipModule, pdfjs, workerModule, catalogue] = await Promise.all([
          import('page-flip/dist/js/page-flip.module.js'), import('pdfjs-dist'),
          import('pdfjs-dist/build/pdf.worker.min.mjs?url'), getProductCatalogue().catch(() => null),
        ]);
        pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default;
        const catalogueTitle = catalogue?.title || 'Katalog Produk 2026';
        const pdf = await pdfjs.getDocument({ url: catalogue?.file_url || FALLBACK_PDF }).promise;
        const host = hostRef.current;
        if (cancelled || !host) return;
        setTitle(catalogueTitle); setPageCount(pdf.numPages);
        const book = document.createElement('div'); book.className = 'mx-auto w-full'; host.replaceChildren(book);
        const images: HTMLImageElement[] = [];
        const pages = Array.from({ length: pdf.numPages }, (_, index) => {
          const page = document.createElement('div'); page.className = 'pdf-flipbook-page';
          page.dataset.density = index === 0 || index === pdf.numPages - 1 ? 'hard' : 'soft';
          const img = document.createElement('img'); img.alt = `Halaman katalog ${index + 1}`;
          Object.assign(img.style, { width: '100%', height: '100%', objectFit: 'contain' });
          images.push(img); page.appendChild(img); book.appendChild(page); return page;
        });
        const rendering = new Map<number, Promise<void>>();
        const renderPage = (index: number): Promise<void> => {
          if (index < 0 || index >= pdf.numPages || images[index].src) return Promise.resolve();
          const existing = rendering.get(index); if (existing) return existing;
          const task = pdf.getPage(index + 1).then(async (pdfPage) => {
            const base = pdfPage.getViewport({ scale: 1 });
            const viewport = pdfPage.getViewport({ scale: Math.min(2, 1200 / base.width) });
            const canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
            const context = canvas.getContext('2d'); if (!context) throw new Error('Kanvas tidak tersedia.');
            await pdfPage.render({ canvas, canvasContext: context, viewport }).promise;
            const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Halaman gagal ditampilkan.')), 'image/jpeg', 0.9));
            if (cancelled) return;
            const url = URL.createObjectURL(blob); objectUrls.add(url); images[index].src = url;
            setRenderedPages((current) => ({ ...current, [index]: url }));
          }).finally(() => rendering.delete(index));
          rendering.set(index, task); return task;
        };
        const hydrate = (active: number) => { for (let i = Math.max(0, active - 1); i <= Math.min(pdf.numPages - 1, active + 2); i += 1) void renderPage(i); };
        hydrateRef.current = hydrate; hydrate(0);
        pageFlip = new flipModule.PageFlip(book, { width: 420, height: 560, size: 'stretch', minWidth: 260, maxWidth: 500, minHeight: 380, maxHeight: 640, drawShadow: true, maxShadowOpacity: 0.45, flippingTime: 800, usePortrait: true, showCover: true, mobileScrollSupport: true });
        pageFlip.on('flip', (event) => { setCurrentPage(event.data); hydrate(event.data); });
        pageFlip.loadFromHTML(pages); flipRef.current = pageFlip; setCurrentPage(0);
        setStatus('Geser halaman atau gunakan tombol navigasi untuk menjelajahi katalog.');
      } catch (error) { console.error('Katalog produk tidak dapat dimuat.', error); setStatus('Katalog tidak dapat dimuat. Silakan muat ulang halaman.'); }
    }
    void initialise();
    return () => { cancelled = true; flipRef.current = null; hydrateRef.current = () => undefined; pageFlip?.destroy(); objectUrls.forEach(URL.revokeObjectURL); };
  }, [shouldLoad]);

  const total = pageCount || 1;
  return <section ref={sectionRef} className="mt-20 border-t border-current/10 pt-16 md:mt-24 md:pt-20" aria-labelledby="catalogue-title">
    <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center"><p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">Katalog Interaktif</p><h2 id="catalogue-title" className="product-page__title mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2><p className="product-page__description mt-3 max-w-xl leading-7">{status}</p></div>
    <div className="mx-auto w-full max-w-[1000px] rounded-2xl bg-black/20 p-2 shadow-[0_25px_65px_rgba(36,24,17,0.28)] sm:rounded-[2rem] sm:p-5"><div ref={hostRef} className="flex min-h-[360px] items-center justify-center sm:min-h-[380px]"><div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" /></div></div>
    <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4"><Control label="Sebelumnya" onClick={() => changePage('previous')}><ChevronLeft className="h-4 w-4" /></Control><span className="min-w-12 text-center text-sm font-semibold text-orange-500">{currentPage + 1} / {total}</span><Control label="Berikutnya" primary onClick={() => changePage('next')}><ChevronRight className="h-4 w-4" /></Control><Control label="Layar penuh" onClick={openFullscreen}><Maximize2 className="h-4 w-4" /></Control></div>
    <div ref={fullscreenRef} className={isFullscreen ? 'fixed inset-0 z-50 flex min-h-screen flex-col bg-[#120d09] p-3 text-white sm:p-6' : 'pointer-events-none fixed inset-0 -z-10 flex min-h-screen flex-col bg-[#120d09] p-3 text-white opacity-0 sm:p-6'} aria-hidden={!isFullscreen}><div className="flex items-center justify-between pb-3"><p className="text-sm font-semibold text-orange-400">{title} · {currentPage + 1} / {total}</p><button type="button" onClick={() => void closeFullscreen()} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold"><Minimize2 className="h-4 w-4" /><span className="hidden sm:inline">Keluar dari layar penuh</span><X className="h-4 w-4 sm:hidden" /></button></div>{renderedPages[currentPage] ? <img src={renderedPages[currentPage]} alt={`Halaman katalog ${currentPage + 1}`} className="min-h-0 flex-1 object-contain" /> : <div className="min-h-0 flex-1" />}<div className="flex justify-center gap-3 pt-3"><button type="button" onClick={() => changePage('previous')} className="rounded-full border border-white/25 p-3"><ChevronLeft /></button><button type="button" onClick={() => changePage('next')} className="rounded-full bg-orange-500 p-3"><ChevronRight /></button></div></div>
  </section>;
}

function Control({ label, primary = false, onClick, children }: { label: string; primary?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" aria-label={label} onClick={onClick} className={`flipbook-control inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${primary ? 'bg-orange-500 text-white hover:bg-orange-600' : 'border border-current/20 hover:border-orange-500 hover:text-orange-500'}`}><span className={label === 'Sebelumnya' ? 'order-2 flipbook-control__label' : 'flipbook-control__label'}>{label}</span>{children}</button>;
}
