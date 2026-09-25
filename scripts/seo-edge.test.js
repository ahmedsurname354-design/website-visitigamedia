import { describe, expect, it, vi } from 'vitest';
import { onRequestGet as renderArticle } from '../functions/[locale]/news/[slug].js';
import { onRequestGet as renderSitemap } from '../functions/sitemap.xml.js';

const config = { supabaseUrl: 'https://db.example', supabaseKey: 'sb_publishable_test', siteUrl: 'https://site.example' };
const shell = '<html><head><title>Old</title><meta name="description" content="Old" /><link rel="canonical" href="https://site.example/" /><meta property="og:title" content="Old" /><meta property="og:description" content="Old" /><meta property="og:type" content="website" /><meta property="og:url" content="https://site.example/" /><meta property="og:image" content="https://site.example/social-preview.png" /><meta property="og:image:width" content="2000" /><meta property="og:image:height" content="2000" /><meta name="twitter:title" content="Old" /><meta name="twitter:description" content="Old" /><meta name="twitter:image" content="https://site.example/social-preview.png" /></head><body><div id="root"></div></body></html>';

function assets() {
  return { fetch: vi.fn(async (url) => {
    const path = new URL(url).pathname;
    if (path === '/portfolio-edge-config.json') return Response.json(config);
    if (path === '/portfolio-fallback.html') return new Response(shell);
    return new Response('missing', { status: 404 });
  }) };
}

describe('dynamic SEO edge routes', () => {
  it('renders current article metadata, content, language alternates, and omits unknown image dimensions', async () => {
    const article = { id: '1', slug: 'new-article', title: 'New Article', excerpt: 'Current excerpt', content: '<p>Current body</p>', category: 'LED', cover_image: '/cover.webp', published_at: '2026-09-25T00:00:00Z', updated_at: '2026-09-25T01:00:00Z', seo_title: '', seo_description: '' };
    vi.stubGlobal('fetch', vi.fn(async () => Response.json([article])));
    const response = await renderArticle({ request: new Request('https://site.example/en/news/new-article/'), params: { locale: 'en', slug: 'new-article' }, env: { ASSETS: assets() } });
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain('<h1>New Article</h1>');
    expect(html).toContain('href="https://site.example/en/news/new-article/"');
    expect(html).toContain('hreflang="id" href="https://site.example/id/news/new-article/"');
    expect(html).not.toContain('og:image:width');
    expect(html).not.toContain('og:image:height');
  });

  it('includes newly published database records in the sitemap without a rebuild', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url) => {
      const path = new URL(url).pathname;
      if (path.includes('/news')) return Response.json([{ slug: 'just-published', published_at: '2026-09-25T00:00:00Z', updated_at: '2026-09-25T01:00:00Z' }]);
      return Response.json([{ slug: 'just-added-project', updated_at: '2026-09-25T02:00:00Z' }]);
    }));
    const response = await renderSitemap({ request: new Request('https://site.example/sitemap.xml'), env: { ASSETS: assets() } });
    const xml = await response.text();
    expect(response.status).toBe(200);
    expect(xml).toContain('https://site.example/id/news/just-published/');
    expect(xml).toContain('https://site.example/en/portfolio/just-added-project/');
    expect(xml).toContain('hreflang="x-default"');
  });
});
