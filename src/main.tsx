import { StrictMode, useLayoutEffect, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './i18n.tsx';
import './index.css';

// Entry-only lifecycle wrapper; it is intentionally not exported.
// eslint-disable-next-line react-refresh/only-export-components
function RevealClientApp({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const snapshot = document.getElementById('prerender-content');
    if (snapshot) snapshot.replaceWith(root);
    document.getElementById('prerender-swap-style')?.remove();
    document.documentElement.dataset.appReady = 'true';
    delete document.documentElement.dataset.prerendered;

    const cleanup = window.setTimeout(() => {
      delete window.__VISITIGA_PRERENDER_DATA__;
      document.getElementById('visitiga-prerender-data')?.remove();
    }, 5_000);
    return () => window.clearTimeout(cleanup);
  }, []);
  return children;
}

const root = document.getElementById('root')!;
createRoot(root).render(
  <StrictMode>
    <RevealClientApp>
      <LanguageProvider><App /></LanguageProvider>
    </RevealClientApp>
  </StrictMode>,
);
