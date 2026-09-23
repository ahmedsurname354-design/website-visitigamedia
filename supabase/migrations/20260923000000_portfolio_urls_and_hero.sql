alter table public.portfolios
  add column slug text,
  add column seo_title text not null default '',
  add column seo_description text not null default '',
  add column hero_image_url text not null default '',
  add column hero_position integer;

-- Restore the exact public slugs used before the gallery-only release.
do $$
declare
  project record;
  base_slug text;
  candidate text;
  suffix integer;
begin
  for project in select id, title from public.portfolios order by created_at, id loop
    base_slug := case project.title
      when 'Videotron Outdoor Sirkuit Mandalika' then 'videotron-outdoor-mandalika'
      when 'Videotron Indoor Universitas Al-Azhar Indonesia' then 'videotron-indoor-universitas-al-azhar'
      when 'Rental LED Nobar Timnas di Madiun' then 'rental-led-nobar-madiun'
      else trim(both '-' from regexp_replace(lower(project.title), '[^a-z0-9]+', '-', 'g'))
    end;
    base_slug := trim(trailing '-' from left(coalesce(nullif(base_slug, ''), 'proyek'), 100));
    candidate := base_slug;
    suffix := 2;
    while exists (select 1 from public.portfolios where slug = candidate) loop
      candidate := left(base_slug, 100 - length(suffix::text) - 1) || '-' || suffix;
      suffix := suffix + 1;
    end loop;
    update public.portfolios set slug = candidate where id = project.id;
  end loop;
end $$;

-- Fail atomically if any of the 49 previously published URLs would be lost.
do $$
declare
  historical_slug text;
begin
  foreach historical_slug in array array[
    'event-dynamix',
    'gedung-dpr-mpr',
    'videotron-outdoor-mandalika',
    'videotron-indoor-universitas-al-azhar',
    'rental-led-nobar-madiun',
    'budhi-hartono-sanjaja-s-birthday',
    'meeting-room-sarinah',
    'billboard-paramount-petals',
    'event-pupuk-kujang',
    'led-videotron-p3-9-outdoor-lombok-mandalika',
    'led-videotron-p8-simpang-lima-semarang',
    'rental-led-event-1',
    'signature-park-pierre-tendean',
    'lightbox-outdoor',
    'marcell-rere-s-wedding',
    'plaza-indonesia',
    'menara-t-tower',
    'display-booth',
    'led-videotron-p3-9-outdoor-lombok-mandalika-2',
    'stasiun-railink-sudirman',
    'bank-bpd-diy',
    'moehi-sma-muhamadiyah-1-yogyakarta',
    'led-videotron-p6-outdoor-lombok-mandalika',
    'matahari-mall',
    'golo-convention-golomori-labuan-bajo-ntt',
    'pemerintahan-kabupaten-bojonegoro',
    'event-ynot-games-vol-2',
    'pascal-23',
    'jpo-depan-plaza-lawu-madiun',
    'indonesia-international-motor-show-surabaya',
    'letter-sign-kuta-mandalika',
    'led-videotron-p8-outdoor-sanur-bali',
    'main-gate-bandara-halim-perdana-kusuma',
    'mall-pesona-square',
    'led-videotron-indoor-2-5-jambore',
    'toko-taurus-braga',
    'simpang-lima-semarang',
    'metro-tanah-abang',
    'wisuda-ugm',
    'bandara-soekarno-hatta-terminal-2',
    'rs-emc-alam-sutera',
    'event-motogp-internasional-2025-sirkuit-mandalika',
    'jci-national-convention-padma-hotel',
    'bank-bpd-diy-senopati',
    'led-videotron-indoor-2-5-gedung-graha-dirgantara',
    'rs-emc-pekayon',
    'bank-bpd-diy-2',
    'indonesia-sport-summit-2025-gbk',
    'totem-minitron-sampoerna-palembang'
  ] loop
    if not exists (select 1 from public.portfolios where slug = historical_slug) then
      raise exception 'Historical portfolio slug missing: %', historical_slug;
    end if;
  end loop;
end $$;

alter table public.portfolios alter column slug set not null;
alter table public.portfolios add constraint portfolios_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 100);
alter table public.portfolios add constraint portfolios_slug_key unique (slug);
alter table public.portfolios add constraint portfolios_hero_position_range
  check (hero_position between 1 and 6);
alter table public.portfolios add constraint portfolios_hero_position_key unique (hero_position);

create table public.portfolio_slug_aliases (
  old_slug text primary key check (old_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index portfolio_slug_aliases_portfolio_id_idx on public.portfolio_slug_aliases(portfolio_id);
alter table public.portfolio_slug_aliases enable row level security;
create policy "Public read portfolio aliases" on public.portfolio_slug_aliases
  for select to anon, authenticated using (true);
grant select on public.portfolio_slug_aliases to anon, authenticated;

create or replace function public.prepare_portfolio_slug()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  base_slug text;
  candidate text;
  suffix integer := 2;
begin
  perform pg_advisory_xact_lock(72023026);
  if new.slug is null or btrim(new.slug) = '' then
    base_slug := trim(both '-' from regexp_replace(lower(new.title), '[^a-z0-9]+', '-', 'g'));
    base_slug := trim(trailing '-' from left(coalesce(nullif(base_slug, ''), 'proyek'), 100));
    candidate := base_slug;
    while exists (select 1 from public.portfolios where slug = candidate)
       or exists (select 1 from public.portfolio_slug_aliases where old_slug = candidate) loop
      candidate := left(base_slug, 100 - length(suffix::text) - 1) || '-' || suffix;
      suffix := suffix + 1;
    end loop;
    new.slug := candidate;
  end if;
  if exists (select 1 from public.portfolio_slug_aliases
             where old_slug = new.slug and portfolio_id <> new.id) then
    raise exception 'Slug proyek sudah dipakai oleh URL lama.' using errcode = '23505';
  end if;
  if tg_op = 'UPDATE' and new.slug <> old.slug then
    delete from public.portfolio_slug_aliases
      where old_slug = new.slug and portfolio_id = new.id;
  end if;
  return new;
end $$;

create or replace function public.record_portfolio_slug_alias()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.portfolio_slug_aliases(old_slug, portfolio_id)
  values (old.slug, new.id);
  return new;
end $$;

create trigger portfolios_prepare_slug before insert or update on public.portfolios
  for each row execute function public.prepare_portfolio_slug();
create trigger portfolios_record_slug_alias after update of slug on public.portfolios
  for each row when (old.slug is distinct from new.slug)
  execute function public.record_portfolio_slug_alias();

-- Six former case-study projects become the initial slideshow, in their old order.
update public.portfolios set hero_position = seed.position
from (values
  ('/portfolio/outdoor/outdoor-5.jpg', 1),
  ('/portfolio/outdoor/outdoor-13.jpg', 2),
  ('/portfolio/indoor-10.jpg', 3),
  ('/portfolio/rental/rental-2.jpg', 4),
  ('/portfolio/audiovisual/IMG_9584-scaled.jpg', 5),
  ('/portfolio/conventional/Billboard-Paramount-Petals.jpeg', 6)
) as seed(image_url, position)
where public.portfolios.image_url = seed.image_url;

create or replace function public.set_portfolio_hero_slides(project_ids uuid[])
returns void language plpgsql security definer set search_path = public as $$
declare
  project_id uuid;
  position integer := 0;
begin
  if not public.is_admin() then
    raise exception 'Hanya admin yang dapat mengubah slideshow.' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(72023027);
  if coalesce(cardinality(project_ids), 0) > 6
     or (select count(distinct selected.id) from unnest(coalesce(project_ids, '{}')) as selected(id))
        <> coalesce(cardinality(project_ids), 0)
     or (select count(*) from public.portfolios where id = any(coalesce(project_ids, '{}')))
        <> coalesce(cardinality(project_ids), 0) then
    raise exception 'Pilih maksimal 6 proyek unik yang tersedia.' using errcode = '23514';
  end if;
  update public.portfolios set hero_position = null where hero_position is not null;
  foreach project_id in array coalesce(project_ids, '{}') loop
    position := position + 1;
    update public.portfolios set hero_position = position where id = project_id;
  end loop;
end $$;
revoke all on function public.set_portfolio_hero_slides(uuid[]) from public;
grant execute on function public.set_portfolio_hero_slides(uuid[]) to authenticated;
