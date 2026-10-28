import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n';
import PortfolioDetailPage from '@/pages/PortfolioDetailPage';
import type { Portfolio } from '@/types/admin';

const project: Portfolio = {
  id: 'project-1', slug: 'test-project', title: 'Test Project', image_url: '/image.jpg', client: 'Test Client', project_date: '2026-10-12', category: 'Outdoor Media', description: 'A test project.', overview: 'Project overview.', seo_title: '', seo_description: '', created_at: '2026-10-12T00:00:00Z', updated_at: '2026-10-12T00:00:00Z',
};

const relatedProject: Portfolio = {
  ...project,
  id: 'project-2',
  slug: 'related-project',
  title: 'Related Project',
  image_url: 'https://example.supabase.co/storage/v1/object/public/website-media/portfolios/related.webp',
};

vi.mock('@/lib/adminApi', () => ({
  getPortfolioAlias: vi.fn(async () => null),
  getPublicPortfolioById: vi.fn(async () => null),
  getPublicPortfolioBySlug: vi.fn(async () => project),
  listPublicPortfolios: vi.fn(async () => [project]),
}));

vi.mock('@/lib/prerenderData', () => ({ getPrerenderData: vi.fn(() => undefined) }));
vi.mock('@/hooks/usePageMeta', () => ({ usePageMeta: vi.fn() }));

function renderPage(path: string) {
  window.history.replaceState({}, '', path);
  return render(<LanguageProvider><MemoryRouter initialEntries={[path]}><Routes><Route path="/:locale/portfolio/:slug" element={<PortfolioDetailPage />} /></Routes></MemoryRouter></LanguageProvider>);
}

describe('portfolio detail date', () => {
  it('shows the project date below the client in Indonesian', async () => {
    renderPage('/id/portfolio/test-project/');
    expect(await screen.findByText('Klien:')).toBeInTheDocument();
    expect(screen.getByText('Tanggal:')).toBeInTheDocument();
    expect(screen.getByText('12/10/2026')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('12/10/2026')).toHaveAttribute('dateTime', '2026-10-12'));
  });

  it('uses the English date label', async () => {
    renderPage('/en/portfolio/test-project/');
    expect(await screen.findByText('Client:')).toBeInTheDocument();
    expect(screen.getByText('Date:')).toBeInTheDocument();
  });

  it('falls back to the original related image when the optimized image fails', async () => {
    vi.mocked((await import('@/lib/adminApi')).listPublicPortfolios).mockResolvedValueOnce([project, relatedProject]);
    renderPage('/en/portfolio/test-project/');

    const relatedImage = await waitFor(() => {
      const images = [...document.querySelectorAll('img')];
      const image = images.find((item) => item.alt === '' && item.src.includes('related.webp'));
      if (!image) throw new Error('Related image was not rendered.');
      return image as HTMLImageElement;
    });

    expect(relatedImage.src).toContain('/storage/v1/render/image/public/');
    fireEvent.error(relatedImage);
    expect(relatedImage.src).toBe(relatedProject.image_url);
  });
});
