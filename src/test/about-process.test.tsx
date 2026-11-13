import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AboutSection from '@/components/AboutSection';
import ProcessSection from '@/components/ProcessSection';
import { LanguageProvider } from '@/i18n';
import { defaultAboutContent, normalizeAboutContent } from '@/lib/aboutContent';

const values = {
  eyebrow: 'Our values',
  title: 'WHY CHOOSE US',
  items: [
    { title: 'Persistence', description: 'Persistence description' },
    { title: 'Stewardship', description: 'Stewardship description' },
    { title: 'Service', description: 'Service description' },
    { title: 'Integrity', description: 'Integrity description' },
  ],
  process: defaultAboutContent.content_en.process,
};

describe('process section placement', () => {
  it('renders five numbered process cards in the reusable process section', () => {
    render(<LanguageProvider><MemoryRouter><ProcessSection eyebrow="Our process" title="From needs to real solutions" process={values.process} /></MemoryRouter></LanguageProvider>);
    expect(screen.getByRole('heading', { name: 'From needs to real solutions' })).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
    const process = screen.getByRole('heading', { name: 'From needs to real solutions' }).closest('section');
    expect(process?.querySelectorAll('article')).toHaveLength(5);
  });

  it('does not render process cards on About anymore', () => {
    render(<LanguageProvider><MemoryRouter><AboutSection valueContent={values} /></MemoryRouter></LanguageProvider>);
    expect(screen.queryByRole('heading', { name: 'From needs to real solutions' })).not.toBeInTheDocument();
    expect(screen.queryByText('01')).not.toBeInTheDocument();
  });

  it('fills process content from the fallback when legacy data has no process', () => {
    const normalized = normalizeAboutContent({ content_en: { ...defaultAboutContent.content_en, process: [] }, content_id: { ...defaultAboutContent.content_id, process: [] } });
    expect(normalized.content_en.process).toHaveLength(5);
    expect(normalized.content_id.process).toHaveLength(5);
    expect(normalized.content_en.process[0].title).toBe('FREE CONSULTANT');
  });
});
