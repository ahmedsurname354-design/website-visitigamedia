import { describe, expect, it } from 'vitest';
import { serviceIcons, servicePaths } from '@/lib/serviceConfig';
import { defaultServiceContent } from '@/lib/serviceContent';
import { defaultServiceLandings, isServiceLandingSlug, serviceLandingSlugs } from '@/lib/serviceLanding';
import { portfolioCategoryLabel } from '@/lib/contentLocale';

describe('services configuration', () => {
  it('keeps exactly six default service cards', () => {
    expect(defaultServiceContent.cards).toHaveLength(6);
    expect(defaultServiceContent.cards.map(({ title }) => title)).toEqual(['Digital Media Solution', 'Conventional Media', 'Architectural & Media Construction', 'Media Placement & Creative Content', 'Audio Visual', 'Event Production']);
  });

  it('maps six cards to six detail routes and icons', () => {
    expect(servicePaths).toHaveLength(6);
    expect(serviceIcons).toHaveLength(6);
    expect(servicePaths.slice(-2)).toEqual(['/services/digital-signage/', '/services/event-production/']);
  });

  it('recognizes the two new service landing slugs', () => {
    expect(serviceLandingSlugs).toContain('digital-signage');
    expect(serviceLandingSlugs).toContain('event-production');
    expect(isServiceLandingSlug('digital-signage')).toBe(true);
    expect(isServiceLandingSlug('event-production')).toBe(true);
  });

  it('formats the hyphenated audio-visual portfolio category', () => {
    expect(portfolioCategoryLabel('audio-visual', 'id')).toBe('Audio Visual');
    expect(portfolioCategoryLabel('audio-visual', 'en')).toBe('Audio Visual');
  });

  it('keeps every card title aligned with a complete bilingual landing', () => {
    const expected = ['Digital Media Solution', 'Conventional Media', 'Architectural & Media Construction', 'Media Placement & Creative Content', 'Audio Visual', 'Event Production'];
    expect(serviceLandingSlugs.map((slug) => defaultServiceLandings[slug].content_en.title)).toEqual(expected);
    for (const slug of serviceLandingSlugs) {
      const landing = defaultServiceLandings[slug];
      for (const locale of [landing.content_id, landing.content_en]) {
        expect(locale.title).toBeTruthy();
        expect(locale.description).toBeTruthy();
        expect(locale.intro).toBeTruthy();
        expect(locale.considerations).toHaveLength(4);
        expect(locale.process).toHaveLength(4);
        expect(locale.cta_title).toBeTruthy();
      }
      expect(landing.seo_title_id).toContain(expected[serviceLandingSlugs.indexOf(slug)]);
      expect(landing.seo_title_en).toContain(expected[serviceLandingSlugs.indexOf(slug)]);
    }
  });
});
