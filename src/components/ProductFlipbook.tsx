import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from 'lucide-react';

type PageFlipInstance = {
  loadFromHTML: (items: HTMLElement[]) => void;
  flipNext: () => void;
  flipPrev: () => void;
  destroy: () => void;
  on: (event: 'flip', handler: (event: { data: number }) => void) => void;
};

const PAGE_COUNT = 26;
const IMAGE_BASE_URL = '/products/catalogue-pages';

/** Renders pre-converted catalogue images as a realistic, responsive flipbook. */
export default function ProductFlipbook() {
  const hostRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlipInstance | null>(null);
  const pageNumberRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const changePage = (direction: 'next' | 'previous') => {
    if (direction === 'next') flipRef.current?.flipNext();
    else flipRef.current?.flipPrev();
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    void fullscreenRef.current?.requestFullscreen().catch(() => {
      // The fixed reader remains available when browser full-screen is blocked.
    });
  };

  const closeFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    setIsFullscreen(false);
  };

  useEffect(() => {
    const syncFullscreenState = () => setIsFullscreen(document.fullscreenElement === fullscreenRef.current);
    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let pageFlip: PageFlipInstance | null = null;

    async function initialiseFlipbook() {
      try {
        const { PageFlip } = await import('page-flip/dist/js/page-flip.module.js');
        const host = hostRef.current;
        if (cancelled || !host) return;

        const book = document.createElement('div');
        book.className = 'mx-auto w-full';
        host.replaceChildren(book);

        const pageElements = Array.from({ length: PAGE_COUNT }, (_, index) => {
          const page = document.createElement('div');
          page.className = 'pdf-flipbook-page';
          page.dataset.density = index === 0 || index === PAGE_COUNT - 1 ? 'hard' : 'soft';

          const img = document.createElement('img');
          const pageNum = String(index + 1).padStart(2, '0');
          img.src = `${IMAGE_BASE_URL}/page-${pageNum}.png`;
          img.alt = `Catalogue page ${index + 1}`;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          page.appendChild(img);
          book.appendChild(page);
          return page;
        });

        pageFlip = new PageFlip(book, {
          width: 420,
          height: 560,
          size: 'stretch',
          minWidth: 260,
          maxWidth: 500,
          minHeight: 380,
          maxHeight: 640,
          drawShadow: true,
          maxShadowOpacity: 0.45,
          flippingTime: 800,
          usePortrait: true,
          showCover: true,
          mobileScrollSupport: true,
        });

        pageFlip.on('flip', (event) => {
          setCurrentPage(event.data);
          if (pageNumberRef.current) pageNumberRef.current.textContent = `${event.data + 1} / ${PAGE_COUNT}`;
        });
        pageFlip.loadFromHTML(pageElements);
        flipRef.current = pageFlip;

        if (pageNumberRef.current) pageNumberRef.current.textContent = `1 / ${PAGE_COUNT}`;
        setCurrentPage(0);
        if (statusRef.current) statusRef.current.textContent = 'Swipe the book or use the controls to browse the catalogue.';
      } catch (error) {
        console.error('Unable to load the product catalogue flipbook.', error);
        if (statusRef.current) statusRef.current.textContent = 'The catalogue could not be loaded. Please refresh the page.';
      }
    }

    void initialiseFlipbook();

    return () => {
      cancelled = true;
      flipRef.current = null;
      pageFlip?.destroy();
    };
  }, []);

  return (
    <section className="mt-20 border-t border-current/10 pt-16 md:mt-24 md:pt-20" aria-labelledby="catalogue-title">
      {/* Flipbook heading */}
      <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">Interactive catalogue</p>
        <h2 id="catalogue-title" className="product-page__title mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Product <span className="text-orange-500">Catalogue 2026</span>
        </h2>
        <p ref={statusRef} className="product-page__description mt-3 max-w-xl leading-7">
          Loading the 26-page product catalogue…
        </p>
      </div>

      {/* Catalogue pages are injected here as pre-rendered images, then animated by StPageFlip. */}
      <div className="mx-auto w-full max-w-[1000px] rounded-2xl bg-black/20 p-2 shadow-[0_25px_65px_rgba(36,24,17,0.28)] sm:rounded-[2rem] sm:p-5">
        <div ref={hostRef} className="flex min-h-[360px] items-center justify-center sm:min-h-[380px]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" aria-label="Loading catalogue" />
        </div>
      </div>

      {/* Navigation controls */}
      <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
        <button type="button" aria-label="Previous page" onClick={() => changePage('previous')} className="flipbook-control inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-3 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:px-5">
          <ChevronLeft className="h-4 w-4" /> <span className="flipbook-control__label">Previous</span>
        </button>
        <span ref={pageNumberRef} className="min-w-12 text-center text-sm font-semibold text-orange-500">1 / 26</span>
        <button type="button" aria-label="Next page" onClick={() => changePage('next')} className="flipbook-control inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffaf3] sm:px-5">
          <span className="flipbook-control__label">Next</span> <ChevronRight className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Open catalogue full screen" onClick={openFullscreen} className="flipbook-control inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-3 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:px-5">
          <Maximize2 className="h-4 w-4" /> <span className="flipbook-control__label">Full screen</span>
        </button>
      </div>

      <div ref={fullscreenRef} className={isFullscreen ? 'fixed inset-0 z-50 flex min-h-screen flex-col bg-[#120d09] p-3 text-white sm:p-6' : 'pointer-events-none fixed inset-0 -z-10 flex min-h-screen flex-col bg-[#120d09] p-3 text-white opacity-0 sm:p-6'} aria-hidden={!isFullscreen}>
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 pb-3 sm:pb-5">
            <p className="text-sm font-semibold text-orange-400">Catalogue · {currentPage + 1} / {PAGE_COUNT}</p>
            <button type="button" onClick={() => void closeFullscreen()} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold transition hover:border-orange-400 hover:text-orange-400" aria-label="Close full screen catalogue">
              <Minimize2 className="h-4 w-4" /> <span className="hidden sm:inline">Exit full screen</span><X className="h-4 w-4 sm:hidden" />
            </button>
          </div>
          <img src={`${IMAGE_BASE_URL}/page-${String(currentPage + 1).padStart(2, '0')}.png`} alt={`Catalogue page ${currentPage + 1}`} className="min-h-0 flex-1 object-contain" />
          <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-3 pt-3 sm:pt-5">
            <button type="button" aria-label="Previous page" onClick={() => changePage('previous')} className="rounded-full border border-white/25 p-3 transition hover:border-orange-400 hover:text-orange-400"><ChevronLeft className="h-5 w-5" /></button>
            <span className="min-w-14 text-center text-sm font-semibold text-orange-400">{currentPage + 1} / {PAGE_COUNT}</span>
            <button type="button" aria-label="Next page" onClick={() => changePage('next')} className="rounded-full bg-orange-500 p-3 transition hover:bg-orange-600"><ChevronRight className="h-5 w-5" /></button>
          </div>
      </div>
    </section>
  );
}
