import { describe, expect, it } from 'vitest';
import { featuredPortfolios, missingFeaturedFields, portfolioCopy, slugifyPortfolioTitle } from '@/lib/portfolio';
import type { Portfolio, PortfolioInput } from '@/types/admin';

const base: Portfolio = {
  id: 'one', title: 'Proyek A', slug: 'proyek-a', image_url: '/a.jpg', client: 'Klien', category: 'Outdoor Media',
  description: 'Ringkasan', overview: 'Konteks', challenge: 'Pertimbangan', solution: 'Hasil',
  is_featured: true, featured_at: '2026-09-20T00:00:00.000Z', location: 'Jakarta', audience: 'Pengguna jalan',
  specs: ['P8'], work_process: 'Proses tercatat', title_en: '', description_en: '', audience_en: '',
  overview_en: '', challenge_en: '', process_en: '', solution_en: '', specs_en: [],
  created_at: '2026-09-20T00:00:00.000Z', updated_at: '2026-09-20T00:00:00.000Z',
};

describe('featured portfolios', () => {
  it('generates a lowercase slug and separates duplicate titles for database validation', () => {
    expect(slugifyPortfolioTitle('LED P2.5 Al-Azhar!')).toBe('led-p2-5-al-azhar');
    expect(slugifyPortfolioTitle('')).toBe('proyek');
  });

  it('requires the full case-study story before featuring', () => {
    const input = { ...base, overview: '', specs: [] } satisfies PortfolioInput;
    expect(missingFeaturedFields(input)).toEqual(['Spesifikasi', 'Konteks']);
    expect(missingFeaturedFields(base)).toEqual([]);
  });

  it('orders selected projects without pulling ordinary projects into the section', () => {
    const later = { ...base, id: 'two', featured_at: '2026-09-21T00:00:00.000Z' };
    const ordinary = { ...base, id: 'three', is_featured: false, featured_at: null };
    expect(featuredPortfolios([later, ordinary, base]).map((item) => item.id)).toEqual(['one', 'two']);
  });

  it('uses Indonesian text when optional English content is blank', () => {
    expect(portfolioCopy(base, 'en').summary).toBe('Ringkasan');
    expect(portfolioCopy({ ...base, description_en: 'Summary', specs_en: ['P8 outdoor'] }, 'en').summary).toBe('Summary');
  });
});
