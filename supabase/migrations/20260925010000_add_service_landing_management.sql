create table public.service_landings (
  slug text primary key check (slug in ('led-indoor', 'videotron-outdoor', 'rental-led', 'media-konvensional')),
  hero_image_url text not null default '',
  content_id jsonb not null check (
    jsonb_typeof(content_id) = 'object'
    and content_id ?& array['eyebrow','title','description','intro_eyebrow','intro_title','intro','considerations_title','considerations','process_eyebrow','process_title','process','portfolio_eyebrow','portfolio_title','portfolio_link_text','cta_title','cta_description','cta_button_text','back_text']
    and jsonb_typeof(content_id->'considerations') = 'array'
    and jsonb_array_length(content_id->'considerations') > 0
    and jsonb_typeof(content_id->'process') = 'array'
    and jsonb_array_length(content_id->'process') > 0
  ),
  content_en jsonb not null check (
    jsonb_typeof(content_en) = 'object'
    and content_en ?& array['eyebrow','title','description','intro_eyebrow','intro_title','intro','considerations_title','considerations','process_eyebrow','process_title','process','portfolio_eyebrow','portfolio_title','portfolio_link_text','cta_title','cta_description','cta_button_text','back_text']
    and jsonb_typeof(content_en->'considerations') = 'array'
    and jsonb_array_length(content_en->'considerations') > 0
    and jsonb_typeof(content_en->'process') = 'array'
    and jsonb_array_length(content_en->'process') > 0
  ),
  seo_title_id text not null,
  seo_description_id text not null,
  seo_title_en text not null,
  seo_description_en text not null,
  updated_at timestamptz not null default now(),
  constraint service_landings_hero_url check (
    hero_image_url = '' or
    (hero_image_url like '/%' and hero_image_url not like '//%') or
    hero_image_url ~ '^https://'
  )
);

create trigger service_landings_set_updated_at before update on public.service_landings
for each row execute function public.set_updated_at();

create table public.service_landing_portfolios (
  service_slug text not null references public.service_landings(slug) on delete cascade,
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  position smallint not null check (position between 1 and 3),
  primary key (service_slug, position),
  unique (service_slug, portfolio_id)
);

alter table public.service_landings enable row level security;
alter table public.service_landing_portfolios enable row level security;

create policy "Public read service landings" on public.service_landings
for select to anon, authenticated using (true);
create policy "Admins manage service landings" on public.service_landings
for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Public read service landing portfolios" on public.service_landing_portfolios
for select to anon, authenticated using (true);
create policy "Admins manage service landing portfolios" on public.service_landing_portfolios
for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.service_landings, public.service_landing_portfolios to anon;
grant select, insert, update, delete on public.service_landings, public.service_landing_portfolios to authenticated;

insert into public.service_landings (
  slug, content_id, content_en, seo_title_id, seo_description_id, seo_title_en, seo_description_en
) values
(
  'led-indoor',
  '{"eyebrow":"Layanan LED indoor","title":"LED Indoor untuk Ruang Presentasi dan Komersial","description":"Perencanaan LED indoor Visitiga untuk ruang rapat, kampus, retail, dan area presentasi berdasarkan jarak pandang dan kebutuhan ruang.","intro_eyebrow":"Dasar perencanaan","intro_title":"Solusi mengikuti kebutuhan lokasi.","intro":"LED indoor perlu direncanakan dari jarak pandang, ukuran bidang, sumber konten, pencahayaan ruang, jalur listrik, dan akses perawatan. Spesifikasi disesuaikan dengan kondisi penggunaan.","considerations_title":"Yang perlu dipastikan","considerations":["Jarak penonton dan ukuran bidang tayang","Pixel pitch dan resolusi materi","Sumber konten, jalur listrik, dan akses servis","Pencahayaan di sekitar layar"],"process_eyebrow":"Alur kerja","process_title":"Tahapan yang disesuaikan dengan proyek.","process":["Survei dan pengukuran ruang","Penentuan konfigurasi layar","Persiapan struktur dan jalur kabel","Pemasangan serta pengujian konten"],"portfolio_eyebrow":"Portofolio terkait","portfolio_title":"Lihat penerapannya pada proyek.","portfolio_link_text":"Semua proyek","cta_title":"Diskusikan kebutuhan media Anda.","cta_description":"Sampaikan lokasi, ukuran area, jarak pandang, dan cara media akan digunakan agar konfigurasi dapat dibahas berdasarkan kebutuhan proyek.","cta_button_text":"Hubungi Visitiga","back_text":"Semua layanan"}'::jsonb,
  '{"eyebrow":"Indoor LED service","title":"Indoor LED for Presentation and Commercial Spaces","description":"Visitiga plans indoor LED displays for meeting rooms, campuses, retail spaces, and presentation areas based on viewing distance and room requirements.","intro_eyebrow":"Planning basis","intro_title":"A solution shaped by the space.","intro":"Indoor LED displays need to account for viewing distance, display size, content sources, ambient lighting, power routes, and maintenance access. Specifications are adapted to actual use.","considerations_title":"What to confirm","considerations":["Viewing distance and display size","Pixel pitch and content resolution","Content source, power routes, and service access","Lighting around the display"],"process_eyebrow":"Workflow","process_title":"Stages adapted to the project.","process":["Room survey and measurement","Display configuration","Structure and cable preparation","Installation and content testing"],"portfolio_eyebrow":"Related portfolio","portfolio_title":"See how it works in real projects.","portfolio_link_text":"All projects","cta_title":"Discuss your media requirements.","cta_description":"Share the location, available area, viewing distance, and intended use so the configuration can be discussed around your project.","cta_button_text":"Contact Visitiga","back_text":"All services"}'::jsonb,
  'LED Indoor untuk Ruang Komersial | Visitiga', 'Perencanaan LED indoor untuk ruang rapat, kampus, retail, dan area presentasi berdasarkan jarak pandang serta kebutuhan ruang.',
  'Indoor LED for Commercial Spaces | Visitiga', 'Indoor LED planning for meeting rooms, campuses, retail, and presentation areas based on viewing distance and room requirements.'
),
(
  'videotron-outdoor',
  '{"eyebrow":"Layanan LED outdoor","title":"Videotron Outdoor untuk Berbagai Kondisi Lokasi","description":"Perencanaan videotron outdoor Visitiga dengan mempertimbangkan struktur, cuaca, tingkat kecerahan, jarak pandang, dan akses perawatan.","intro_eyebrow":"Dasar perencanaan","intro_title":"Solusi mengikuti kebutuhan lokasi.","intro":"Setiap lokasi outdoor memiliki kondisi struktur, paparan cuaca, arah pandang, dan kebutuhan kecerahan yang berbeda. Pemeriksaan lokasi dilakukan sebelum ukuran, pixel pitch, struktur, dan jalur perawatan ditentukan.","considerations_title":"Yang perlu dipastikan","considerations":["Kondisi struktur dan paparan cuaca","Jarak serta sudut pandang audiens","Kecerahan dan kebutuhan daya","Perizinan serta akses perawatan"],"process_eyebrow":"Alur kerja","process_title":"Tahapan yang disesuaikan dengan proyek.","process":["Pemeriksaan lokasi dan struktur","Penentuan ukuran serta pixel pitch","Perencanaan pemasangan","Pengujian dari sudut pandang aktual"],"portfolio_eyebrow":"Portofolio terkait","portfolio_title":"Lihat penerapannya pada proyek.","portfolio_link_text":"Semua proyek","cta_title":"Diskusikan kebutuhan media Anda.","cta_description":"Sampaikan lokasi, ukuran area, jarak pandang, dan cara media akan digunakan agar konfigurasi dapat dibahas berdasarkan kebutuhan proyek.","cta_button_text":"Hubungi Visitiga","back_text":"Semua layanan"}'::jsonb,
  '{"eyebrow":"Outdoor LED service","title":"Outdoor Videotron for Different Site Conditions","description":"Visitiga plans outdoor videotrons with careful consideration of structure, weather, brightness, viewing distance, and maintenance access.","intro_eyebrow":"Planning basis","intro_title":"A solution shaped by the site.","intro":"Every outdoor site has different structural conditions, weather exposure, viewing directions, and brightness needs. The site is inspected before size, pixel pitch, structure, and maintenance routes are determined.","considerations_title":"What to confirm","considerations":["Structure and weather exposure","Audience distance and viewing angle","Brightness and power requirements","Permits and maintenance access"],"process_eyebrow":"Workflow","process_title":"Stages adapted to the project.","process":["Site and structure inspection","Size and pixel pitch selection","Installation planning","Testing from the actual viewing angle"],"portfolio_eyebrow":"Related portfolio","portfolio_title":"See how it works in real projects.","portfolio_link_text":"All projects","cta_title":"Discuss your media requirements.","cta_description":"Share the location, available area, viewing distance, and intended use so the configuration can be discussed around your project.","cta_button_text":"Contact Visitiga","back_text":"All services"}'::jsonb,
  'Videotron Outdoor untuk Berbagai Lokasi | Visitiga', 'Perencanaan videotron outdoor dengan mempertimbangkan struktur, cuaca, kecerahan, jarak pandang, daya, dan akses perawatan.',
  'Outdoor Videotron for Different Sites | Visitiga', 'Outdoor videotron planning based on structure, weather exposure, brightness, viewing distance, power, and maintenance access.'
),
(
  'rental-led',
  '{"eyebrow":"Layanan rental LED","title":"Rental LED untuk Acara dan Panggung","description":"Rental LED Visitiga untuk acara, konferensi, pertunjukan, dan nonton bersama dengan konfigurasi sesuai venue dan jarak penonton.","intro_eyebrow":"Dasar perencanaan","intro_title":"Solusi mengikuti kebutuhan lokasi.","intro":"Konfigurasi rental LED mengikuti tata letak venue, ukuran panggung, jarak penonton, sumber video, jadwal pemasangan, dan kebutuhan operasional acara. Ukuran layar ditentukan setelah kondisi tersebut diketahui.","considerations_title":"Yang perlu dipastikan","considerations":["Tata letak venue dan jarak penonton","Ukuran panggung atau area tayang","Sumber video, listrik, dan jalur sinyal","Jadwal pemasangan dan pembongkaran"],"process_eyebrow":"Alur kerja","process_title":"Tahapan yang disesuaikan dengan proyek.","process":["Pemeriksaan rundown dan input","Survei venue","Pemasangan serta uji sinyal","Pendampingan sesuai lingkup kerja dan pembongkaran"],"portfolio_eyebrow":"Portofolio terkait","portfolio_title":"Lihat penerapannya pada proyek.","portfolio_link_text":"Semua proyek","cta_title":"Diskusikan kebutuhan media Anda.","cta_description":"Sampaikan lokasi, ukuran area, jarak pandang, dan cara media akan digunakan agar konfigurasi dapat dibahas berdasarkan kebutuhan proyek.","cta_button_text":"Hubungi Visitiga","back_text":"Semua layanan"}'::jsonb,
  '{"eyebrow":"LED rental service","title":"LED Rental for Events and Stages","description":"Visitiga provides LED rental for events, conferences, performances, and public screenings, configured for the venue and audience distance.","intro_eyebrow":"Planning basis","intro_title":"A solution shaped by the venue.","intro":"The rental LED configuration follows the venue layout, stage dimensions, audience distance, video sources, installation schedule, and event operations. Screen size is determined after these conditions are known.","considerations_title":"What to confirm","considerations":["Venue layout and audience distance","Stage or display area size","Video source, power, and signal routes","Installation and dismantling schedule"],"process_eyebrow":"Workflow","process_title":"Stages adapted to the project.","process":["Rundown and input review","Venue survey","Installation and signal testing","Operation within scope and dismantling"],"portfolio_eyebrow":"Related portfolio","portfolio_title":"See how it works in real projects.","portfolio_link_text":"All projects","cta_title":"Discuss your media requirements.","cta_description":"Share the location, available area, viewing distance, and intended use so the configuration can be discussed around your project.","cta_button_text":"Contact Visitiga","back_text":"All services"}'::jsonb,
  'Rental LED untuk Acara dan Panggung | Visitiga', 'Rental LED untuk acara, konferensi, pertunjukan, dan nonton bersama dengan konfigurasi sesuai venue serta jarak penonton.',
  'LED Rental for Events and Stages | Visitiga', 'LED rental for events, conferences, performances, and public screenings, configured for the venue and viewing distance.'
),
(
  'media-konvensional',
  '{"eyebrow":"Layanan media konvensional","title":"Media Konvensional untuk Komunikasi Luar Ruang","description":"Perencanaan billboard, lightbox, dan media konvensional Visitiga berdasarkan lokasi, ukuran bidang, materi visual, struktur, dan pencahayaan.","intro_eyebrow":"Dasar perencanaan","intro_title":"Solusi mengikuti kebutuhan lokasi.","intro":"Billboard, lightbox, dan media fisik lain perlu disesuaikan terhadap lokasi, arah pandang, struktur, ukuran materi, serta pencahayaan. Setiap bidang direncanakan agar materi sesuai dengan format media yang dipasang.","considerations_title":"Yang perlu dipastikan","considerations":["Lokasi serta arah pandang","Ukuran dan rasio materi visual","Struktur media","Pencahayaan dan kondisi sekitar"],"process_eyebrow":"Alur kerja","process_title":"Tahapan yang disesuaikan dengan proyek.","process":["Pemeriksaan lokasi","Penentuan format dan ukuran","Persiapan materi serta struktur","Pemasangan dan pemeriksaan hasil"],"portfolio_eyebrow":"Portofolio terkait","portfolio_title":"Lihat penerapannya pada proyek.","portfolio_link_text":"Semua proyek","cta_title":"Diskusikan kebutuhan media Anda.","cta_description":"Sampaikan lokasi, ukuran area, jarak pandang, dan cara media akan digunakan agar konfigurasi dapat dibahas berdasarkan kebutuhan proyek.","cta_button_text":"Hubungi Visitiga","back_text":"Semua layanan"}'::jsonb,
  '{"eyebrow":"Conventional media service","title":"Conventional Media for Outdoor Communication","description":"Visitiga plans billboards, lightboxes, and conventional media around the location, display size, visual material, structure, and lighting.","intro_eyebrow":"Planning basis","intro_title":"A solution shaped by the site.","intro":"Billboards, lightboxes, and other physical media need to suit their location, viewing direction, structure, artwork dimensions, and lighting. Each display is planned around the installed media format.","considerations_title":"What to confirm","considerations":["Location and viewing direction","Artwork size and ratio","Media structure","Lighting and surroundings"],"process_eyebrow":"Workflow","process_title":"Stages adapted to the project.","process":["Site inspection","Format and size selection","Artwork and structure preparation","Installation and final inspection"],"portfolio_eyebrow":"Related portfolio","portfolio_title":"See how it works in real projects.","portfolio_link_text":"All projects","cta_title":"Discuss your media requirements.","cta_description":"Share the location, available area, viewing distance, and intended use so the configuration can be discussed around your project.","cta_button_text":"Contact Visitiga","back_text":"All services"}'::jsonb,
  'Billboard dan Media Konvensional | Visitiga', 'Perencanaan billboard, lightbox, dan media konvensional berdasarkan lokasi, bidang visual, struktur, serta pencahayaan.',
  'Billboards and Conventional Media | Visitiga', 'Billboard, lightbox, and conventional media planning based on location, display area, structure, and lighting.'
);

-- Preserve the two related projects previously inferred by category until an
-- administrator explicitly changes the selection.
insert into public.service_landing_portfolios(service_slug, portfolio_id, position)
select service.slug, project.id, project.position
from (values
  ('led-indoor', 'indoor'),
  ('videotron-outdoor', 'outdoor'),
  ('rental-led', 'rental'),
  ('media-konvensional', 'conventional')
) as service(slug, category_term)
cross join lateral (
  select id, row_number() over (order by created_at desc, id)::smallint as position
  from public.portfolios
  where lower(category || ' ' || title) like '%' || service.category_term || '%'
  order by created_at desc, id
  limit 2
) project
on conflict do nothing;

create or replace function public.save_service_landing(
  p_slug text,
  p_hero_image_url text,
  p_content_id jsonb,
  p_content_en jsonb,
  p_seo_title_id text,
  p_seo_description_id text,
  p_seo_title_en text,
  p_seo_description_en text,
  p_portfolio_ids uuid[]
) returns void
language plpgsql
set search_path = public, pg_temp
as $$
declare
  portfolio_id uuid;
  item_position integer := 0;
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if coalesce(array_length(p_portfolio_ids, 1), 0) > 3 then
    raise exception 'Maksimal 3 portofolio terkait.' using errcode = '23514';
  end if;
  if cardinality(p_portfolio_ids) <> cardinality(array(select distinct value from unnest(p_portfolio_ids) value)) then
    raise exception 'Portofolio terkait tidak boleh duplikat.' using errcode = '23505';
  end if;

  insert into public.service_landings (
    slug, hero_image_url, content_id, content_en, seo_title_id,
    seo_description_id, seo_title_en, seo_description_en
  ) values (
    p_slug, coalesce(p_hero_image_url, ''), p_content_id, p_content_en, p_seo_title_id,
    p_seo_description_id, p_seo_title_en, p_seo_description_en
  ) on conflict (slug) do update set
    hero_image_url = excluded.hero_image_url,
    content_id = excluded.content_id,
    content_en = excluded.content_en,
    seo_title_id = excluded.seo_title_id,
    seo_description_id = excluded.seo_description_id,
    seo_title_en = excluded.seo_title_en,
    seo_description_en = excluded.seo_description_en;

  delete from public.service_landing_portfolios where service_slug = p_slug;
  foreach portfolio_id in array coalesce(p_portfolio_ids, '{}'::uuid[]) loop
    item_position := item_position + 1;
    insert into public.service_landing_portfolios(service_slug, portfolio_id, position)
    values (p_slug, portfolio_id, item_position);
  end loop;
end;
$$;

revoke all on function public.save_service_landing(text, text, jsonb, jsonb, text, text, text, text, uuid[]) from public;
grant execute on function public.save_service_landing(text, text, jsonb, jsonb, text, text, text, text, uuid[]) to authenticated;
