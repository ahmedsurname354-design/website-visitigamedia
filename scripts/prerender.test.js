import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildRedirects, buildSitemap, escapeXml, STATIC_ROUTES } from './seo-build-lib.mjs';

const retired = JSON.parse(readFileSync(join(process.cwd(), 'scripts/retired-portfolio-slugs.json'), 'utf8'));

describe('SEO build generator', () => {
  it('includes portfolio details and news in the sitemap', () => {
    const sitemap = buildSitemap(STATIC_ROUTES, [{ slug: 'published-article', updated_at: '2026-09-02T00:00:00.000Z' }], 'https://example.com', [{ slug: 'totem-minitron-sampoerna-palembang', updated_at: '2026-09-22T00:00:00.000Z' }]);
    expect(sitemap).toContain('<loc>https://example.com/portfolio/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/news/published-article/</loc>');
    expect(sitemap).toContain('/portfolio/totem-minitron-sampoerna-palembang/');
    expect(sitemap).not.toContain('/admin');
  });

  it('lets the portfolio Function resolve current and archived slugs', () => {
    const redirects = buildRedirects([{ slug: 'existing-article' }]);
    expect(retired).toHaveLength(49);
    expect(new Set(retired).size).toBe(49);
    expect(redirects).not.toContain('/portfolio/:slug');
    expect(redirects).not.toContain('/portfolio/*');
    expect(redirects).toContain('/news/existing-article /news/existing-article/index.html 200');
  });

  it('rejects redirects beyond the Cloudflare static limit', () => {
    expect(() => buildRedirects(Array.from({ length: 1998 }, (_, index) => ({ slug: `article-${index}` })), retired)).toThrow('melebihi batas');
  });

  it('keeps admin out of public routes and escapes XML', () => {
    expect(STATIC_ROUTES).not.toContain('/admin');
    expect(escapeXml('A&B<"C"')).toBe('A&amp;B&lt;&quot;C&quot;');
  });
});
