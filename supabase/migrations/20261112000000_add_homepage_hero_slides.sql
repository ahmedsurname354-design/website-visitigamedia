alter table public.homepage_content
  add column if not exists hero_slides jsonb not null default '[]'::jsonb;

update public.homepage_content
set hero_slides = jsonb_build_array(
  jsonb_build_object('image_url', coalesce(nullif(hero_image_url, ''), '/hero-1600.webp'), 'alt', 'Tampilan LED Visitiga di malam hari'),
  jsonb_build_object('image_url', '/portfolio/indoor/indoor-9.webp', 'alt', 'Proyek LED indoor Visitiga'),
  jsonb_build_object('image_url', '/portfolio/rental/rental-8.webp', 'alt', 'Proyek rental LED Visitiga'),
  jsonb_build_object('image_url', '/portfolio/audiovisual/IMG_9584-scaled.webp', 'alt', 'Proyek audiovisual Visitiga')
)
where hero_slides = '[]'::jsonb or jsonb_array_length(hero_slides) <> 4;

update public.homepage_content
set content_id = jsonb_set(
  jsonb_set(
    jsonb_set(content_id, '{hero,titleLine1}', '"PERIKLANAN"'::jsonb),
    '{hero,titleLine2}', '""'::jsonb
  ),
  '{hero,titleLine3}', '""'::jsonb
),
content_en = jsonb_set(
  jsonb_set(
    jsonb_set(content_en, '{hero,titleLine1}', '"ADVERTISING"'::jsonb),
    '{hero,titleLine2}', '""'::jsonb
  ),
  '{hero,titleLine3}', '""'::jsonb
)
where id = 1;
