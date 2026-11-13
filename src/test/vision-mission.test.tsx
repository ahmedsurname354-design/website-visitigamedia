import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import VisionMissionSection from '@/components/VisionMissionSection';

describe('vision and mission section', () => {
  it('renders both purpose cards with accessible section structure', () => {
    render(<VisionMissionSection vision="Vision body" mission="Mission body" />);

    expect(screen.getByRole('region', { name: 'Purpose behind every solution.' })).toBeInTheDocument();
    expect(screen.getByText('Our vision')).toBeInTheDocument();
    expect(screen.getByText('Our mission')).toBeInTheDocument();
    expect(screen.getByText('Vision body')).toBeInTheDocument();
    expect(screen.getByText('Mission body')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
});
