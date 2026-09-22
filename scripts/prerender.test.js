import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildRedirects, buildSitemap, CASE_STUDIES, CASE_STUDY_ROUTES, escapeXml, STATIC_ROUTES } from './seo-build-lib.mjs';

describe('SEO build generator', () => {
  it('generates static and published article URLs using the configured domain', () => {
    const sitemap = buildSitemap(
      ['/', '/news'],
      [{ slug: 'published-article', published_at: '2026-09-01T00:00:00.000Z', updated_at: '2026-09-02T00:00:00.000Z' }],
      'https://example.com',
    );
    expect(sitemap).toContain('<loc>https://example.com/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/news/published-article/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/news/</loc>');
    expect(sitemap).toContain('<loc>https://example.com/portfolio/videotron-outdoor-mandalika/</loc>');
    expect(sitemap).toContain('<lastmod>2026-09-02T00:00:00.000Z</lastmod>');
    expect(sitemap).not.toContain('/admin');
  });

  it('keeps the route inventory limited to public pages and escapes XML', () => {
    expect(STATIC_ROUTES).not.toContain('/admin');
    expect(escapeXml('A&B<"C"')).toBe('A&amp;B&lt;&quot;C&quot;');
  });

  it('serves prerendered news before falling back to the SPA for new slugs', () => {
    const redirects = buildRedirects([{ slug: 'existing-article' }]);
    expect(redirects).toContain('/news/existing-article /news/existing-article/index.html 200');
    expect(redirects).toContain('/portfolio/videotron-outdoor-mandalika /portfolio/videotron-outdoor-mandalika/index.html 200');
    expect(redirects).toContain('/portfolio/* /index.html 200');
    expect(redirects).toContain('/news/* /index.html 200');
  });

  it('has unique case-study slugs and complete editorial fields', () => {
    expect(new Set(CASE_STUDY_ROUTES).size).toBe(CASE_STUDIES.length);
    expect(CASE_STUDY_ROUTES).toContain('/portfolio/totem-minitron-sampoerna-palembang');
    for (const study of CASE_STUDIES) {
      expect(study.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(study.title).toBeTruthy();
      expect(study.context).toBeTruthy();
      expect(study.decision).toBeTruthy();
      expect(study.outcome).toBeTruthy();
      expect(study.specs.length).toBeGreaterThan(0);
      expect(study.audience).toBeTruthy();
      expect(existsSync(join(process.cwd(), 'public', study.image))).toBe(true);
    }
  });

  it('keeps English case-study content aligned with the Indonesian routes', () => {
    const english = JSON.parse(readFileSync(join(process.cwd(), 'src/data/case-studies-en.json'), 'utf8'));
    expect(english.map(({ slug }) => slug)).toEqual(CASE_STUDIES.map(({ slug }) => slug));
    for (const study of english) {
      for (const field of ['title', 'summary', 'audience', 'context', 'decision', 'outcome']) expect(study[field]).toBeTruthy();
      expect(study.specs.length).toBeGreaterThan(0);
    }
  });
});
