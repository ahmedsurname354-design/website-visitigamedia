alter table public.news
  add column seo_title text not null default '',
  add column seo_description text not null default '',
  add column cover_alt text not null default '',
  add column target_keyword text not null default '';

alter table public.news add constraint news_seo_title_length check (char_length(seo_title) <= 70);
alter table public.news add constraint news_seo_description_length check (char_length(seo_description) <= 180);
alter table public.news add constraint news_cover_alt_length check (char_length(cover_alt) <= 180);
alter table public.news add constraint news_target_keyword_length check (char_length(target_keyword) <= 100);
