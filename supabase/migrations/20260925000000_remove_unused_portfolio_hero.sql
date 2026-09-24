-- The portfolio slideshow was cancelled. Keep project slugs and SEO fields,
-- but remove the unused selection API and columns.
drop function if exists public.set_portfolio_hero_slides(uuid[]);

alter table public.portfolios
  drop column if exists hero_image_url,
  drop column if exists hero_position;
