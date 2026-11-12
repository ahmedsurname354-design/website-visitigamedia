import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HeroSection from '@/components/HeroSection';
import { LanguageProvider } from '@/i18n';
import { defaultHomepageContent } from '@/lib/homepageContent';

function renderHero() {
  const content = {
    id: 1,
    ...defaultHomepageContent,
    updated_at: '',
    content_en: {
      ...defaultHomepageContent.content_en,
      hero: { title: 'Custom campaign', subtitle: 'Editable hero description', ctaLabel: 'Start a project' },
    },
  };
  return render(<LanguageProvider><MemoryRouter><HeroSection content={content} /></MemoryRouter></LanguageProvider>);
}

describe('hero slideshow', () => {
  it('renders dashboard-provided copy and exactly four slides without the legacy eyebrow', () => {
    renderHero();
    expect(screen.getByRole('heading', { name: 'Custom campaign' })).toBeInTheDocument();
    expect(screen.getByText('Editable hero description')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Start a project/i })).toHaveAttribute('href', '/en/contact/');
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    expect(document.querySelector('.hero-editorial__eyebrow')).toBeNull();
  });

  it('changes the active slide through the next control', () => {
    renderHero();
    const next = screen.getByRole('button', { name: 'Next slide' });
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(next);
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
  });
});
