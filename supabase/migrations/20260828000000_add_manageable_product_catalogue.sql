-- One active PDF catalogue, publicly readable and editable only by admins.
create table if not exists public.product_catalogue (
  id smallint primary key default 1 check (id = 1),
  title text not null default 'Product Catalogue' check (char_length(trim(title)) between 1 and 120),
  file_url text not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists product_catalogue_set_updated_at on public.product_catalogue;
create trigger product_catalogue_set_updated_at before update on public.product_catalogue
for each row execute function public.set_updated_at();

alter table public.product_catalogue enable row level security;
drop policy if exists "Public read product catalogue" on public.product_catalogue;
create policy "Public read product catalogue" on public.product_catalogue for select to anon, authenticated using (true);
drop policy if exists "Admins manage product catalogue" on public.product_catalogue;
create policy "Admins manage product catalogue" on public.product_catalogue for all to authenticated
using (public.is_admin()) with check (public.is_admin());

insert into public.product_catalogue (id, title, file_url)
values (1, 'Product Catalogue 2026', '/products/product-catalogue-2026.pdf')
on conflict (id) do nothing;

-- Raise the media limit for catalogues and allow PDF alongside existing images.
update storage.buckets
set file_size_limit = 31457280,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
where id = 'website-media';
