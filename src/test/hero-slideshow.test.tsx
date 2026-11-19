import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HeroSection from '@/components/HeroSection';
import { LanguageProvider } from '@/i18n';
import { defaultHomepageContent } from '@/lib/homepageContent';

function renderHero() {
  const content = {
    id: 1,
    ...defaultHomepageContent,
    hero_slides: defaultHomepageContent.hero_slides.map((slide, index) => ({ ...slide, image_url: `/test-slide-${index + 1}.jpg` })).map((slide, index) => index === 0 ? {
      ...slide,
      content_en: { title: 'Custom campaign', subtitle: 'Editable hero description', ctaLabel: 'Start a project' },
    } : slide),
    updated_at: '',
  };
  return render(<LanguageProvider><MemoryRouter><HeroSection content={content} /></MemoryRouter></LanguageProvider>);
}

function renderHeroWithSlides(hero_slides: typeof defaultHomepageContent.hero_slides) {
  return render(<LanguageProvider><MemoryRouter><HeroSection content={{ id: 1, ...defaultHomepageContent, hero_slides, updated_at: '' }} /></MemoryRouter></LanguageProvider>);
}

describe('hero slideshow', () => {
  it('renders dashboard-provided copy and the default product slides without the legacy eyebrow', () => {
    renderHero();
    expect(screen.getByRole('heading', { name: 'Custom campaign' })).toBeInTheDocument();
    expect(screen.getByText('Editable hero description')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Start a project/i })).toHaveAttribute('href', '/en/contact/');
    expect(screen.getAllByRole('tab')).toHaveLength(6);
    expect(document.querySelector('.hero-editorial__eyebrow')).toBeNull();
  });

  it('includes purchase and rental videotron messaging in the default slides', () => {
    renderHero();
    fireEvent.click(screen.getByRole('tab', { name: 'Slide 5' }));
    expect(screen.getByRole('heading', { name: 'BUY YOUR VIDEOTRON' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Slide 4' }));
    expect(screen.getByRole('heading', { name: 'VIDEOTRON RENTAL' })).toBeInTheDocument();
  });

  it('changes the active slide through the line indicator', () => {
    renderHero();
    const next = screen.getByRole('tab', { name: 'Slide 2' });
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(next);
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: 'OUTDOOR LED' })).toBeInTheDocument();
  });

  it('does not render legacy images when the configured slideshow is empty or incomplete', () => {
    renderHeroWithSlides(defaultHomepageContent.hero_slides.map((slide, index) => ({ ...slide, image_url: index === 3 ? '/test-slide-4.jpg' : '' })));
    expect(screen.getAllByRole('tab')).toHaveLength(1);
    expect(document.querySelectorAll('.hero-carousel__slide img')).toHaveLength(1);

    cleanup();
    renderHeroWithSlides(defaultHomepageContent.hero_slides.map((slide) => ({ ...slide, image_url: '' })));
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(document.querySelectorAll('.hero-carousel__slide img')).toHaveLength(0);
    expect(screen.getByRole('heading', { name: 'ADVERTISING' })).toBeInTheDocument();
  });
});
