import { describe, expect, it } from 'vitest';
import { normalizeArticleHeadings } from '@/lib/articleSeo';

describe('article SEO normalization', () => {
  it('keeps the page title as the only h1', () => {
    const html = normalizeArticleHeadings('<h1 class="lead">Topik</h1><h2>Bagian</h2><p>Isi</p>');
    expect(html).not.toContain('<h1');
    expect(html).toContain('<h2 class="lead">Topik</h2>');
    expect(html).toContain('<h2>Bagian</h2>');
  });
});
