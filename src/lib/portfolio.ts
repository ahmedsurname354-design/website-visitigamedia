import type { Portfolio, PortfolioInput } from '@/types/admin';

export const PORTFOLIO_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugifyPortfolioTitle(title: string): string {
  return title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 100).replace(/-$/g, '') || 'proyek';
}

export function featuredPortfolios(portfolios: Portfolio[]): Portfolio[] {
  return portfolios.filter((item) => item.is_featured)
    .sort((a, b) => (a.featured_at ?? '').localeCompare(b.featured_at ?? '') || a.id.localeCompare(b.id));
}

export function missingFeaturedFields(input: PortfolioInput): string[] {
  const fields: Array<[string, string | string[]]> = [
    ['Ringkasan', input.description], ['Lokasi', input.location],
    ['Audiens', input.audience], ['Spesifikasi', input.specs],
    ['Konteks', input.overview], ['Pertimbangan teknis', input.challenge],
    ['Proses', input.work_process], ['Hasil', input.solution],
  ];
  return fields.filter(([, value]) => Array.isArray(value) ? !value.some((item) => item.trim()) : !value.trim())
    .map(([label]) => label);
}

export function portfolioCopy(project: Portfolio, lang: 'id' | 'en') {
  if (lang === 'id') return {
    title: project.title, summary: project.description, audience: project.audience,
    context: project.overview, decision: project.challenge, process: project.work_process,
    outcome: project.solution, specs: project.specs,
  };
  return {
    title: project.title_en || project.title,
    summary: project.description_en || project.description,
    audience: project.audience_en || project.audience,
    context: project.overview_en || project.overview,
    decision: project.challenge_en || project.challenge,
    process: project.process_en || project.work_process,
    outcome: project.solution_en || project.solution,
    specs: project.specs_en.length ? project.specs_en : project.specs,
  };
}
