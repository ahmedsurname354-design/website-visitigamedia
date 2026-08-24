alter table public.portfolios add column if not exists overview text not null default '';
alter table public.portfolios add column if not exists challenge text not null default '';
alter table public.portfolios add column if not exists solution text not null default '';
