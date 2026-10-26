update public.portfolios
set content_id = coalesce(content_id, '{}'::jsonb) - 'challenge' - 'solution',
    content_en = coalesce(content_en, '{}'::jsonb) - 'challenge' - 'solution';

alter table public.portfolios
  drop column if exists challenge,
  drop column if exists solution;
