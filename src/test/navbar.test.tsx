import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Navbar from '@/components/Navbar';
import { LanguageProvider } from '@/i18n';

function renderNavbar() {
  return render(<LanguageProvider><MemoryRouter initialEntries={['/id/']}><Navbar /></MemoryRouter></LanguageProvider>);
}

describe('contact dropdown', () => {
  it('offers marketing and procurement links with distinct email subjects', () => {
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: 'Contact' }));

    expect(screen.getByRole('menu')).toBeInTheDocument();
    const emailLinks = screen.getAllByRole('menuitem', { name: 'Email' });
    expect(emailLinks[0]).toHaveAttribute('href', expect.stringContaining('subject=Konsultasi%20Visitiga%20Media'));
    expect(emailLinks[1]).toHaveAttribute('href', expect.stringContaining('subject=Kerjasama%20Procurement'));
    expect(screen.getAllByRole('menuitem', { name: 'WhatsApp' })).toHaveLength(2);
  });

  it('closes on Escape and outside click', () => {
    renderNavbar();

    fireEvent.click(screen.getByRole('button', { name: 'Contact' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Contact' }));
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
