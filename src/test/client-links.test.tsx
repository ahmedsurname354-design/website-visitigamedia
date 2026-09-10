import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutSection from '@/components/AboutSection';
import { LanguageProvider } from '@/i18n';

const clients = [
  ['Wonderful Indonesia', 'https://wonderfulindonesia.co.id/'],
  ['Pertamina', 'https://www.pertamina.com/en/'],
  ['Dynamix', 'https://dynamixgroup.com/'],
  ['MotoGP', 'https://www.motogp.com/en'],
  ['EMC Healthcare', 'https://www.emc.id/id'],
  ['Mandalika International Street Circuit', 'https://www.themandalikagp.com/'],
  ['Indonesia International Motor Show', 'https://indonesianmotorshow.com/'],
  ['Sarinah', 'https://www.sarinah.co.id/'],
] as const;

describe('client logo links', () => {
  it('links every logo to its official website', () => {
    render(<LanguageProvider><AboutSection /></LanguageProvider>);
    for (const [brand, href] of clients) {
      const link = screen.getByRole('link', { name: `Kunjungi website ${brand}` });
      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});
