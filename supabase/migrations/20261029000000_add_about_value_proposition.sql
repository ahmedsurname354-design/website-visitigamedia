create table if not exists public.about_content (
  id smallint primary key default 1 check (id = 1),
  content_id jsonb not null,
  content_en jsonb not null,
  updated_at timestamptz not null default now(),
  constraint about_content_locale_shape check (
    jsonb_typeof(content_id) = 'object'
    and jsonb_typeof(content_en) = 'object'
    and content_id ?& array['eyebrow', 'title', 'items']
    and content_en ?& array['eyebrow', 'title', 'items']
    and jsonb_typeof(content_id->'items') = 'array'
    and jsonb_typeof(content_en->'items') = 'array'
    and jsonb_array_length(content_id->'items') = 4
    and jsonb_array_length(content_en->'items') = 4
  )
);

drop trigger if exists about_content_set_updated_at on public.about_content;
create trigger about_content_set_updated_at before update on public.about_content
for each row execute function public.set_updated_at();

alter table public.about_content enable row level security;
drop policy if exists "Public read about content" on public.about_content;
create policy "Public read about content" on public.about_content for select to anon, authenticated using (true);
drop policy if exists "Admins manage about content" on public.about_content;
create policy "Admins manage about content" on public.about_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.about_content to anon;
grant select, insert, update, delete on public.about_content to authenticated;

insert into public.about_content (id, content_id, content_en)
values (
  1,
  '{"eyebrow":"Nilai kami","title":"MENGAPA MEMILIH KAMI","items":[{"title":"Ketekunan","description":"Terus tekun dengan semangat kewirausahaan."},{"title":"Tanggung Jawab","description":"Terus mencari cara untuk meningkatkan profitabilitas dan keberlanjutan."},{"title":"Pelayanan","description":"Memberikan pelayanan terbaik dan bekerja keras untuk membangun hubungan yang adil."},{"title":"Integritas","description":"Selalu berusaha melakukan hal yang benar dan bersikap jujur."}]}'::jsonb,
  '{"eyebrow":"Our values","title":"WHY CHOOSE US","items":[{"title":"Persistence","description":"Be persistent in keeping with an entrepreneurial attitude."},{"title":"Stewardship","description":"Continually look for ways to improve profitability and sustainability."},{"title":"Service","description":"Give our customers the best service and work hard to make a fair relationship."},{"title":"Integrity","description":"strive to always do the right thing; be honest."}]}'::jsonb
)
on conflict (id) do nothing;
