import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import FAQPage from '@/pages/FAQPage';
import { LanguageProvider } from '@/i18n';

function renderFaq() {
  return render(<LanguageProvider><MemoryRouter><FAQPage /></MemoryRouter></LanguageProvider>);
}

describe('FAQ page', () => {
  it('renders ten collapsed questions and opens only the selected answer', () => {
    renderFaq();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(10);
    expect(buttons.every((button) => button.getAttribute('aria-expanded') === 'false')).toBe(true);
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(buttons[1]);
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders English content when English is stored', () => {
    localStorage.setItem('lang', 'en');
    renderFaq();
    expect(screen.getByRole('heading', { level: 1, name: 'How Can We Help?' })).toBeInTheDocument();
    localStorage.removeItem('lang');
  });
});
