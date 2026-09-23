import { describe, expect, it } from 'vitest';
import { PORTFOLIO_SLUG_PATTERN, slugifyPortfolioTitle } from '@/lib/portfolioSlug';

describe('portfolio slugs', () => {
  it('generates a lowercase URL segment from a title', () => {
    expect(slugifyPortfolioTitle('Videotron Indoor Al-Azhar!')).toBe('videotron-indoor-al-azhar');
    expect(slugifyPortfolioTitle('  LED   Outdoor  ')).toBe('led-outdoor');
  });

  it('accepts manual slugs but rejects invalid URL segments', () => {
    expect(PORTFOLIO_SLUG_PATTERN.test('led-indoor-2026')).toBe(true);
    expect(PORTFOLIO_SLUG_PATTERN.test('LED Indoor')).toBe(false);
    expect(PORTFOLIO_SLUG_PATTERN.test('-led-')).toBe(false);
  });
});
