import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutSection from '@/components/AboutSection';
import { LanguageProvider } from '@/i18n';

const valueContent = {
  eyebrow: 'Nilai kami',
  title: 'MENGAPA MEMILIH KAMI',
  items: [
    { title: 'Ketekunan', description: 'Terus tekun.' },
    { title: 'Tanggung Jawab', description: 'Bertanggung jawab.' },
    { title: 'Pelayanan', description: 'Memberikan pelayanan.' },
    { title: 'Integritas', description: 'Bersikap jujur.' },
  ],
  process: Array.from({ length: 5 }, (_, index) => ({ title: `Proses ${index + 1}`, description: `Deskripsi proses ${index + 1}.` })),
};

describe('client logo section', () => {
  it('does not render the removed client logo wall', () => {
    render(<LanguageProvider><AboutSection valueContent={valueContent} /></LanguageProvider>);
    expect(screen.queryByText('Our Clients')).not.toBeInTheDocument();
    expect(screen.queryByText('Klien Kami')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Visit website|Kunjungi website/i })).not.toBeInTheDocument();
  });
});
