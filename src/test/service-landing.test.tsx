import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n';
import ServiceLandingPage from '@/pages/ServiceLandingPage';
import { defaultServiceLandings } from '@/lib/serviceLanding';
import { getPrerenderData } from '@/lib/prerenderData';
import type { Portfolio } from '@/types/admin';

vi.mock('@/lib/adminApi', () => ({
  getServiceLanding: vi.fn(async () => null),
  listPublicPortfolios: vi.fn(async () => []),
}));
vi.mock('@/lib/prerenderData', () => ({ getPrerenderData: vi.fn() }));

const projects: Portfolio[] = ['first', 'second', 'third'].map((id) => ({
  id, slug: id, title: `Project ${id}`, image_url: `/portfolio/${id}.jpg`, client: 'Visitiga', category: 'Outdoor Media', description: '', overview: '', challenge: '', solution: '', seo_title: '', seo_description: '', created_at: '', updated_at: '',
}));

describe('service landing content', () => {
  beforeEach(() => {
    localStorage.clear();
    const landing = { ...defaultServiceLandings['videotron-outdoor'], hero_image_url: '', related_portfolio_ids: ['second', 'first', 'third'] };
    vi.mocked(getPrerenderData).mockReturnValue({ route: '/services/videotron-outdoor', serviceLanding: landing, portfolios: projects });
  });

  it('renders selected portfolios in admin order and uses the first image as hero fallback', async () => {
    const { container } = render(<LanguageProvider><MemoryRouter initialEntries={['/services/videotron-outdoor/']}><Routes><Route path="/services/:serviceSlug" element={<ServiceLandingPage />} /></Routes></MemoryRouter></LanguageProvider>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Videotron Outdoor');
    const projectHeadings = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);
    expect(projectHeadings).toEqual(['Project second', 'Project first', 'Project third']);
    expect(container.querySelector('header img')).toHaveAttribute('src', expect.stringContaining('/portfolio/second.webp'));
    await waitFor(() => expect(document.title).toBe(defaultServiceLandings['videotron-outdoor'].seo_title_id));
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', expect.stringMatching(/\/services\/videotron-outdoor\/$/));
  });
});
