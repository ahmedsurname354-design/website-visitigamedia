import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ValuePropositionSection from '@/components/ValuePropositionSection';

describe('value proposition section', () => {
  it('renders the configured heading and four values', () => {
    render(<ValuePropositionSection content={{
      eyebrow: 'Our values',
      title: 'WHY CHOOSE US',
      items: [
        { title: 'Persistence', description: 'Persistence description' },
        { title: 'Stewardship', description: 'Stewardship description' },
        { title: 'Service', description: 'Service description' },
        { title: 'Integrity', description: 'Integrity description' },
      ],
    }} />);
    expect(screen.getByRole('heading', { name: 'WHY CHOOSE US' })).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    expect(screen.getByText('Persistence description')).toBeInTheDocument();
    expect(screen.getByText('Integrity description')).toBeInTheDocument();
  });
});
