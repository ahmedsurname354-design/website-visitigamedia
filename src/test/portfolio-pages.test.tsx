import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n';
import PortfolioSection from '@/components/PortfolioSection';
import { listPublicPortfolios } from '@/lib/adminApi';
import { isSlidePosition } from '@/lib/portfolioSlides';
import type { Portfolio } from '@/types/admin';

const projects = [
  { id: '1', slug: 'outdoor-project', title: 'Outdoor Project', category: 'Outdoor Media', hero_position: 1 },
  { id: '2', slug: 'indoor-project', title: 'Indoor Project', category: 'Indoor Media', hero_position: 2 },
  { id: '3', slug: 'other-project', title: 'Other Project', category: 'Indoor Media', hero_position: null },
].map((item) => ({
  image_url: '/image.jpg', hero_image_url: '', description: 'Project photo',
  client: 'Client', overview: '', challenge: '', solution: '', seo_title: '', seo_description: '',
  created_at: '2026-09-22T00:00:00Z', updated_at: '2026-09-22T00:00:00Z',
  ...item,
})) as Portfolio[];

vi.mock('@/lib/adminApi', () => ({ listPublicPortfolios: vi.fn(async () => projects) }));

describe('portfolio gallery and slideshow', () => {
  it('only accepts six numbered slide positions', () => {
    expect([null, undefined, 0, 1, 6, 7, 1.5].filter(isSlidePosition)).toEqual([1, 6]);
  });

  it('does not turn 49 legacy gallery projects into slides', async () => {
    const legacyProjects = Array.from({ length: 49 }, (_, index) => ({
      ...projects[0], id: `legacy-${index}`, slug: `legacy-${index}`, title: `Legacy ${index}`, hero_position: undefined,
    })) as unknown as Portfolio[];
    vi.mocked(listPublicPortfolios).mockResolvedValueOnce(legacyProjects);
    render(<LanguageProvider><MemoryRouter><PortfolioSection /></MemoryRouter></LanguageProvider>);
    await waitFor(() => expect(screen.getAllByRole('link', { name: /Legacy \d+/ })).toHaveLength(49));
    expect(screen.queryByRole('region', { name: 'Proyek pilihan' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Slide berikutnya' })).not.toBeInTheDocument();
  });

  it('links cards to detail URLs and filters without removing slides', async () => {
    render(<LanguageProvider><MemoryRouter><PortfolioSection /></MemoryRouter></LanguageProvider>);
    expect(await screen.findByRole('link', { name: /Outdoor Project/i })).toHaveAttribute('href', '/portfolio/outdoor-project/');
    fireEvent.click(screen.getByRole('button', { name: 'Indoor Media' }));
    expect(screen.queryByRole('link', { name: /Outdoor Project/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Indoor Project/i })).toHaveAttribute('href', '/portfolio/indoor-project/');
    expect(screen.getByRole('link', { name: 'Lihat proyek' })).toHaveAttribute('href', '/portfolio/outdoor-project/');
    fireEvent.click(screen.getByRole('button', { name: 'Slide berikutnya' }));
    await waitFor(() => expect(screen.getByRole('link', { name: 'Lihat proyek' })).toHaveAttribute('href', '/portfolio/indoor-project/'));
  });
});
