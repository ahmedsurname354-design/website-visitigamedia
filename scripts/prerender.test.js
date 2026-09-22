import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildRedirects, buildSitemap, escapeXml, STATIC_ROUTES } from './seo-build-lib.mjs';

const portfolios = [
  { id: 'one', slug: 'totem-palembang', is_featured: true, updated_at: '2026-09-20T00:00:00.000Z' },
  { id: 'two', slug: 'proyek-biasa', is_featured: false, updated_at: '2026-09-21T00:00:00.000Z' },
];

describe('SEO build generator', () => {
  it('includes only featured portfolio pages and published news in the sitemap', () => {
    const sitemap = buildSitemap(
      ['/', '/news'],
      [{ slug: 'published-article', published_at: '2026-09-01T00:00:00.000Z', updated_at: '2026-09-02T00:00:00.000Z' }],
      portfolios,
      'https://example.com',
    );
    expect(sitemap).toContain('<loc>https://example.com/portfolio/totem-palembang/</loc>');
    expect(sitemap).not.toContain('proyek-biasa');
    expect(sitemap).toContain('<loc>https://example.com/news/published-article/</loc>');
    expect(sitemap).toContain('<lastmod>2026-09-20T00:00:00.000Z</lastmod>');
    expect(sitemap).not.toContain('/admin');
  });

  it('places old-slug redirects before detail rewrites and the SPA fallback', () => {
    const redirects = buildRedirects([{ slug: 'existing-article' }], portfolios, [
      { old_slug: 'totem-lama', portfolio_id: 'one' },
      { old_slug: 'proyek-lama', portfolio_id: 'two' },
    ]);
    expect(redirects).toContain('/portfolio/totem-lama /portfolio/totem-palembang/ 301');
    expect(redirects).toContain('/portfolio/totem-lama/ /portfolio/totem-palembang/ 301');
    expect(redirects).not.toContain('proyek-lama');
    expect(redirects).not.toContain('proyek-biasa');
    expect(redirects.indexOf('/portfolio/totem-lama ')).toBeLessThan(redirects.indexOf('/portfolio/totem-palembang '));
    expect(redirects.indexOf('/portfolio/totem-palembang ')).toBeLessThan(redirects.indexOf('/portfolio/* '));
    expect(redirects).toContain('/news/existing-article /news/existing-article/index.html 200');
  });

  it('rejects redirects beyond the Cloudflare static limit', () => {
    const articles = Array.from({ length: 1998 }, (_, index) => ({ slug: `article-${index}` }));
    expect(() => buildRedirects(articles, portfolios)).toThrow('melebihi batas');
  });

  it('keeps admin out of public routes and escapes XML', () => {
    expect(STATIC_ROUTES).not.toContain('/admin');
    expect(escapeXml('A&B<"C"')).toBe('A&amp;B&lt;&quot;C&quot;');
  });

  it('migrates the same six published studies with their established slugs', () => {
    const sql = readFileSync(join(process.cwd(), 'supabase/migrations/20260922000000_featured_portfolios.sql'), 'utf8');
    const literal = sql.match(/content jsonb := '(.+)'::jsonb;/)?.[1];
    expect(literal).toBeTruthy();
    const seed = JSON.parse(literal.replaceAll("''", "'"));
    expect(seed).toHaveLength(6);
    expect(new Set(seed.map(({ slug }) => slug)).size).toBe(6);
    expect(seed.map(({ slug }) => slug)).toContain('totem-minitron-sampoerna-palembang');
    for (const study of seed) {
      for (const field of ['image', 'title', 'summary', 'context', 'decision', 'outcome', 'audience', 'title_en', 'summary_en']) expect(study[field]).toBeTruthy();
      expect(study.specs.length).toBeGreaterThan(0);
    }
  });
});
