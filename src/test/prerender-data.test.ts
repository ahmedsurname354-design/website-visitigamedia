import { afterEach, describe, expect, it } from 'vitest';
import { getPrerenderData, isPrerenderedDocument } from '@/lib/prerenderData';

afterEach(() => {
  delete window.__VISITIGA_PRERENDER_DATA__;
  document.getElementById('visitiga-prerender-data')?.remove();
  delete document.documentElement.dataset.prerendered;
  window.history.replaceState({}, '', '/');
});

describe('prerender bootstrap', () => {
  it('parses safe JSON data for the current route', () => {
    window.history.replaceState({}, '', '/news');
    const script = document.createElement('script');
    script.id = 'visitiga-prerender-data';
    script.type = 'application/json';
    script.textContent = JSON.stringify({ route: '/news', news: [] });
    document.head.appendChild(script);
    expect(getPrerenderData()).toEqual({ route: '/news', news: [] });
  });

  it('uses prerendered data after the host adds a trailing slash', () => {
    window.history.replaceState({}, '', '/portfolio/');
    window.__VISITIGA_PRERENDER_DATA__ = { route: '/portfolio', portfolios: [] };
    expect(getPrerenderData()).toEqual({ route: '/portfolio', portfolios: [] });
  });

  it('ignores data belonging to another route and detects prerendered HTML', () => {
    window.__VISITIGA_PRERENDER_DATA__ = { route: '/about' };
    document.documentElement.dataset.prerendered = 'true';
    expect(getPrerenderData()).toBeUndefined();
    expect(isPrerenderedDocument()).toBe(true);
  });
});
