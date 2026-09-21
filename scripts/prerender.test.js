import { describe, expect, it } from 'vitest';
import { buildRedirects, buildSitemap, escapeXml, STATIC_ROUTES } from './seo-build-lib.mjs';

describe('SEO build generator', () => {
  it('generates static and published article URLs using the configured domain', () => {
    const sitemap = buildSitemap(
      ['/', '/news'],
      [{ slug: 'published-article', published_at: '2026-09-01T00:00:00.000Z', updated_at: '2026-09-02T00:00:00.000Z' }],
      'https://example.com',
    );
    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/news/published-article</loc>');
    expect(sitemap).toContain('<lastmod>2026-09-02T00:00:00.000Z</lastmod>');
    expect(sitemap).not.toContain('/admin');
  });

  it('keeps the route inventory limited to public pages and escapes XML', () => {
    expect(STATIC_ROUTES).not.toContain('/admin');
    expect(escapeXml('A&B<"C"')).toBe('A&amp;B&lt;&quot;C&quot;');
  });

  it('serves prerendered news before falling back to the SPA for new slugs', () => {
    expect(buildRedirects([{ slug: 'existing-article' }])).toBe('/admin/* /admin/index.html 200\n/news/existing-article /news/existing-article/index.html 200\n/news/* /index.html 200\n');
  });
});
