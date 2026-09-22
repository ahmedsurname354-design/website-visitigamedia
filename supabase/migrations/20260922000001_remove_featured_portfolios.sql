-- Run only after the gallery-only application version has been deployed.
-- Existing portfolio rows and original case-detail fields are preserved.
drop trigger if exists portfolios_record_slug_alias on public.portfolios;
drop trigger if exists portfolios_validate_featured on public.portfolios;
drop function if exists public.record_portfolio_slug_alias();
drop function if exists public.validate_featured_portfolio();
drop table if exists public.portfolio_slug_aliases;

alter table public.portfolios
  drop column if exists slug,
  drop column if exists is_featured,
  drop column if exists featured_at,
  drop column if exists location,
  drop column if exists audience,
  drop column if exists specs,
  drop column if exists work_process,
  drop column if exists title_en,
  drop column if exists description_en,
  drop column if exists audience_en,
  drop column if exists overview_en,
  drop column if exists challenge_en,
  drop column if exists process_en,
  drop column if exists solution_en,
  drop column if exists specs_en;
