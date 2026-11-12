import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AboutSection from '@/components/AboutSection';
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

describe('about process section', () => {
  it('renders five numbered process cards before Why Choose Us', () => {
    render(<LanguageProvider><MemoryRouter><AboutSection valueContent={values} /></MemoryRouter></LanguageProvider>);
    expect(screen.getByRole('heading', { name: 'From needs to real solutions' })).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
    const process = screen.getByRole('heading', { name: 'From needs to real solutions' }).closest('section');
    expect(process?.querySelectorAll('article')).toHaveLength(5);
    const valuesSection = screen.getByRole('heading', { name: 'WHY CHOOSE US' }).closest('section');
    expect(process?.compareDocumentPosition(valuesSection as Node) ?? 0).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('fills process content from the fallback when legacy data has no process', () => {
    const normalized = normalizeAboutContent({ content_en: { ...defaultAboutContent.content_en, process: [] }, content_id: { ...defaultAboutContent.content_id, process: [] } });
    expect(normalized.content_en.process).toHaveLength(5);
    expect(normalized.content_id.process).toHaveLength(5);
    expect(normalized.content_en.process[0].title).toBe('FREE CONSULTANT');
  });
});
