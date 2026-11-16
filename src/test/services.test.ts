import { describe, expect, it } from 'vitest';
import { serviceIcons, servicePaths } from '@/lib/serviceConfig';
import { defaultServiceContent } from '@/lib/serviceContent';
import { isServiceLandingSlug, serviceLandingSlugs } from '@/lib/serviceLanding';

describe('services configuration', () => {
  it('keeps exactly six default service cards', () => {
    expect(defaultServiceContent.cards).toHaveLength(6);
    expect(defaultServiceContent.cards.slice(-2).map(({ title }) => title)).toEqual(['Digital Signage', 'Event Production']);
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
});
