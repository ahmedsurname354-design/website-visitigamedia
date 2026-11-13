import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import VisionMissionSection from '@/components/VisionMissionSection';

describe('vision and mission section', () => {
  it('renders both purpose cards with accessible section structure', () => {
    render(<VisionMissionSection visionTitle="Vision title" missionTitle="Mission title" />);

    expect(screen.getByRole('region', { name: 'Purpose behind every solution.' })).toBeInTheDocument();
    expect(screen.getByText('Our vision')).toBeInTheDocument();
    expect(screen.getByText('Our mission')).toBeInTheDocument();
    expect(screen.getByText('Vision title')).toBeInTheDocument();
    expect(screen.getByText('Mission title')).toBeInTheDocument();
    expect(screen.queryByText('Vision body')).not.toBeInTheDocument();
    expect(screen.queryByText('Mission body')).not.toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
});
