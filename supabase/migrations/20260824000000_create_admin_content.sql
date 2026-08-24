-- Assign the `admin` role through Supabase Auth app_metadata, never user_metadata.
-- Example (run with the service-role key in a trusted environment only):
-- update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb where email = 'admin@example.com';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  image_url text not null,
  client text not null check (char_length(client) between 1 and 120),
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 160),
  price numeric(12, 2) not null default 0 check (price >= 0),
  image_url text not null,
  category text not null check (char_length(category) between 1 and 80),
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 200),
  cover_image text not null,
  content text not null default '',
  author text not null check (char_length(author) between 1 and 120),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger portfolios_set_updated_at before update on public.portfolios for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger news_set_updated_at before update on public.news for each row execute function public.set_updated_at();

alter table public.portfolios enable row level security;
alter table public.products enable row level security;
alter table public.news enable row level security;

create policy "Admins manage portfolios" on public.portfolios for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage news" on public.news for all to authenticated using (public.is_admin()) with check (public.is_admin());
