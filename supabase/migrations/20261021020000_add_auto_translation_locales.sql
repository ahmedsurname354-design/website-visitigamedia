-- Store generated locale payloads without removing legacy columns used by older clients.
alter table public.service_content
  add column if not exists content_id jsonb not null default '{}'::jsonb,
  add column if not exists content_en jsonb not null default '{}'::jsonb;

update public.service_content
set content_id = jsonb_build_object(
      'eyebrow', eyebrow, 'heading', heading, 'heading_accent', heading_accent,
      'cards', cards, 'showreel_eyebrow', showreel_eyebrow, 'showreel_heading', showreel_heading,
      'showreel_accent', showreel_accent, 'showreel_description', showreel_description,
      'primary_button_text', primary_button_text, 'secondary_button_text', secondary_button_text
    )
where content_id = '{}'::jsonb;

alter table public.news
  add column if not exists content_id jsonb not null default '{}'::jsonb,
  add column if not exists content_en jsonb not null default '{}'::jsonb;

update public.news
set content_id = jsonb_build_object(
      'title', title, 'content', content, 'author', author, 'category', category,
      'excerpt', excerpt, 'seo_title', coalesce(seo_title, ''), 'seo_description', coalesce(seo_description, ''),
      'cover_alt', coalesce(cover_alt, ''), 'target_keyword', coalesce(target_keyword, '')
    )
where content_id = '{}'::jsonb;

alter table public.portfolios
  add column if not exists content_id jsonb not null default '{}'::jsonb,
  add column if not exists content_en jsonb not null default '{}'::jsonb;

update public.portfolios
set content_id = jsonb_build_object(
      'title', title, 'client', client, 'category', category, 'description', description,
      'overview', overview, 'challenge', challenge, 'solution', solution,
      'seo_title', coalesce(seo_title, ''), 'seo_description', coalesce(seo_description, '')
    )
where content_id = '{}'::jsonb;

alter table public.products
  add column if not exists content_id jsonb not null default '{}'::jsonb,
  add column if not exists content_en jsonb not null default '{}'::jsonb;

update public.products
set content_id = jsonb_build_object('name', name, 'category', category, 'description', description, 'label', label)
where content_id = '{}'::jsonb;

alter table public.product_catalogue
  add column if not exists title_id text not null default '',
  add column if not exists title_en text not null default '';

update public.product_catalogue
set title_id = coalesce(nullif(title_id, ''), title),
    title_en = coalesce(nullif(title_en, ''), title)
where id = 1;
