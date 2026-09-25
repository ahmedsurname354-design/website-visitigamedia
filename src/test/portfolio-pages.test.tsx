import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n';
import PortfolioSection from '@/components/PortfolioSection';
import { listPublicPortfolios } from '@/lib/adminApi';
import type { Portfolio } from '@/types/admin';

const projects = [
  { id: '1', slug: 'outdoor-project', title: 'Outdoor Project', category: 'Outdoor Media' },
  { id: '2', slug: 'indoor-project', title: 'Indoor Project', category: 'Indoor Media' },
  { id: '3', slug: 'other-project', title: 'Other Project', category: 'Indoor Media' },
].map((item) => ({
  image_url: '/image.jpg', description: 'Project photo',
  client: 'Client', overview: '', challenge: '', solution: '', seo_title: '', seo_description: '',
  created_at: '2026-09-22T00:00:00Z', updated_at: '2026-09-22T00:00:00Z',
  ...item,
})) as Portfolio[];

vi.mock('@/lib/adminApi', () => ({ listPublicPortfolios: vi.fn(async () => projects) }));

describe('portfolio gallery', () => {
  it('shows all 49 projects in the gallery', async () => {
    const legacyProjects = Array.from({ length: 49 }, (_, index) => ({
      ...projects[0], id: `legacy-${index}`, slug: `legacy-${index}`, title: `Legacy ${index}`,
    })) as unknown as Portfolio[];
    vi.mocked(listPublicPortfolios).mockResolvedValueOnce(legacyProjects);
    render(<LanguageProvider><MemoryRouter><PortfolioSection /></MemoryRouter></LanguageProvider>);
    await waitFor(() => expect(screen.getAllByRole('link', { name: /Legacy \d+/ })).toHaveLength(49));
    expect(screen.queryByRole('region', { name: 'Proyek pilihan' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Slide berikutnya' })).not.toBeInTheDocument();
  });

  it('links cards to SEO detail URLs and filters the gallery', async () => {
    render(<LanguageProvider><MemoryRouter><PortfolioSection /></MemoryRouter></LanguageProvider>);
    expect(await screen.findByRole('link', { name: /Outdoor Project/i })).toHaveAttribute('href', '/id/portfolio/outdoor-project/');
    fireEvent.click(screen.getByRole('button', { name: 'Indoor Media' }));
    expect(screen.queryByRole('link', { name: /Outdoor Project/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Indoor Project/i })).toHaveAttribute('href', '/id/portfolio/indoor-project/');
    expect(screen.queryByRole('region', { name: 'Proyek pilihan' })).not.toBeInTheDocument();
  });
});
