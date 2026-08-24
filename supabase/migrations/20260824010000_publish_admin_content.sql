-- Fields required for content authored through the admin dashboard.
alter table public.portfolios add column if not exists category text not null default 'Project';
alter table public.news add column if not exists category text not null default 'Berita';
alter table public.news add column if not exists excerpt text not null default '';

-- Content may be read by visitors. Insert, update, and delete remain admin-only.
drop policy if exists "Public read portfolios" on public.portfolios;
create policy "Public read portfolios" on public.portfolios for select to anon, authenticated using (true);
drop policy if exists "Public read published news" on public.news;
create policy "Public read published news" on public.news for select to anon, authenticated using (published_at is not null);
