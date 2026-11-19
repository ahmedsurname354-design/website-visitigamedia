create table if not exists public.contact_settings (
  id smallint primary key default 1 check (id = 1),
  marketing_phone text not null check (char_length(trim(marketing_phone)) between 7 and 30),
  marketing_email text not null check (char_length(trim(marketing_email)) between 5 and 254 and marketing_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  procurement_phone text not null check (char_length(trim(procurement_phone)) between 7 and 30),
  procurement_email text not null check (char_length(trim(procurement_email)) between 5 and 254 and procurement_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  updated_at timestamptz not null default now()
);

drop trigger if exists contact_settings_set_updated_at on public.contact_settings;
create trigger contact_settings_set_updated_at before update on public.contact_settings
for each row execute function public.set_updated_at();

alter table public.contact_settings enable row level security;
drop policy if exists "Public read contact settings" on public.contact_settings;
create policy "Public read contact settings" on public.contact_settings for select to anon, authenticated using (true);
drop policy if exists "Admins manage contact settings" on public.contact_settings;
create policy "Admins manage contact settings" on public.contact_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.contact_settings to anon;
grant select, insert, update, delete on public.contact_settings to authenticated;

insert into public.contact_settings (id, marketing_phone, marketing_email, procurement_phone, procurement_email)
values (1, '+62 822 5878 8780', 'marcomm@visitiga.com', '+62 822 5878 8780', 'marcomm@visitiga.com')
on conflict (id) do nothing;
