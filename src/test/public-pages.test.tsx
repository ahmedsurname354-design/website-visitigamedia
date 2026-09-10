import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { LanguageProvider } from '@/i18n';
import PageMeta from '@/components/PageMeta';
import NotFoundPage from '@/pages/NotFoundPage';
import CTASection from '@/components/CTASection';

function providers(children: React.ReactNode, route = '/') {
  return <LanguageProvider><MemoryRouter initialEntries={[route]}>{children}</MemoryRouter></LanguageProvider>;
}

describe('public page essentials', () => {
  it('updates title, canonical, and description for a public route', async () => {
    render(providers(<PageMeta />, '/faq'));
    await waitFor(() => expect(document.title).toContain('FAQ'));
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute('href', expect.stringMatching(/\/faq$/));
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', expect.stringContaining('LED'));
  });

  it('marks unknown routes as noindex and renders recovery links', async () => {
    render(providers(<><PageMeta /><NotFoundPage /></>, '/missing-page'));
    expect(await screen.findByRole('heading', { name: 'Halaman tidak ditemukan.' })).toBeInTheDocument();
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    expect(screen.getByRole('link', { name: /Kembali ke Beranda/ })).toHaveAttribute('href', '/');
  });

  it('requires privacy consent on the contact form', () => {
    render(providers(<CTASection />));
    expect(screen.getByRole('checkbox')).toBeRequired();
    expect(screen.getByRole('link', { name: 'Kebijakan Privasi' })).toHaveAttribute('href', '/privacy');
  });
});
