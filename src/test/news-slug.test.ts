import { describe, expect, it } from 'vitest';
import { NEWS_SLUG_PATTERN, slugifyNewsTitle } from '@/lib/newsSlug';

describe('news slug', () => {
  it('turns an Indonesian article title into a URL segment', () => {
    expect(slugifyNewsTitle('LED Indoor vs Outdoor: Apa Bedanya?')).toBe('led-indoor-vs-outdoor-apa-bedanya');
    expect(slugifyNewsTitle('Élan & Café')).toBe('elan-cafe');
  });

  it('keeps generated slugs within the database limit', () => {
    const slug = slugifyNewsTitle('Artikel '.repeat(30));
    expect(slug.length).toBeLessThanOrEqual(100);
    expect(slug).toMatch(NEWS_SLUG_PATTERN);
    expect(slugifyNewsTitle('!!!')).toBe('berita');
  });

  it('rejects malformed manual slugs', () => {
    expect('artikel-baru').toMatch(NEWS_SLUG_PATTERN);
    for (const slug of ['Artikel-Baru', 'artikel baru', '-artikel', 'artikel-', 'artikel--baru', '']) {
      expect(slug).not.toMatch(NEWS_SLUG_PATTERN);
    }
  });
});
