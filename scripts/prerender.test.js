import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildRedirects, buildSitemap, escapeXml, STATIC_ROUTES } from './seo-build-lib.mjs';

const retired = JSON.parse(readFileSync(join(process.cwd(), 'scripts/retired-portfolio-slugs.json'), 'utf8'));

describe('SEO build generator', () => {
  it('includes portfolio details and news in the sitemap', () => {
    const sitemap = buildSitemap(STATIC_ROUTES, [{ slug: 'published-article', updated_at: '2026-09-02T00:00:00.000Z' }], 'https://example.com', [{ slug: 'totem-minitron-sampoerna-palembang', updated_at: '2026-09-22T00:00:00.000Z' }]);
    expect(sitemap).toContain('<loc>https://example.com/id/portfolio/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/en/services/led-indoor/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/id/news/published-article/</loc>');
    expect(sitemap).toContain('hreflang="en" href="https://example.com/en/news/published-article/"');
    expect(sitemap).toContain('/id/portfolio/totem-minitron-sampoerna-palembang/');
    expect(sitemap).not.toContain('/admin');
  });

  it('lets the portfolio Function resolve current and archived slugs', () => {
    const redirects = buildRedirects([{ slug: 'existing-article' }]);
    expect(retired).toHaveLength(49);
    expect(new Set(retired).size).toBe(49);
    expect(redirects).toContain('/portfolio/:slug/ /id/portfolio/:slug/ 301');
    expect(redirects).toContain('/news/existing-article/ /id/news/existing-article/ 301');
    expect(redirects).toContain('/en/* /index.html 200');
  });

  it('rejects redirects beyond the Cloudflare static limit', () => {
    expect(() => buildRedirects(Array.from({ length: 1998 }, (_, index) => ({ slug: `article-${index}` })), retired)).toThrow('melebihi batas');
  });

  it('keeps admin out of public routes and escapes XML', () => {
    expect(STATIC_ROUTES).not.toContain('/admin');
    expect(escapeXml('A&B<"C"')).toBe('A&amp;B&lt;&quot;C&quot;');
  });
});
