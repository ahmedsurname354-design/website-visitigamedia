import { describe, expect, it } from 'vitest';
import { absoluteUrl, getStaticSeo } from '@/lib/seo';

describe('page SEO configuration', () => {
  it.each(['/about', '/services', '/product', '/portfolio', '/video', '/contact', '/news', '/faq', '/privacy'])('has unique Indonesian metadata for %s', (path) => {
    const page = getStaticSeo(path, 'id');
    const home = getStaticSeo('/', 'id');
    expect(page.title).not.toBe(home.title);
    expect(page.description.length).toBeGreaterThan(40);
  });

  it('builds canonical URLs without duplicate slashes', () => {
    expect(absoluteUrl('/faq')).toMatch(/^https:\/\/[^/]+\/faq$/);
  });
});
