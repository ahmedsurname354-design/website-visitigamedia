alter table public.homepage_content
  add column if not exists hero_slides jsonb not null default '[]'::jsonb;

update public.homepage_content
set hero_slides = jsonb_build_array(
  jsonb_build_object('image_url', '/hero-1600.webp', 'alt', 'Tampilan LED Visitiga di malam hari'),
  jsonb_build_object('image_url', '/portfolio/indoor/indoor-9.webp', 'alt', 'Proyek LED indoor Visitiga'),
  jsonb_build_object('image_url', '/portfolio/rental/rental-8.webp', 'alt', 'Proyek rental LED Visitiga'),
  jsonb_build_object('image_url', '/portfolio/audiovisual/IMG_9584-scaled.webp', 'alt', 'Proyek audiovisual Visitiga')
)
where hero_slides = '[]'::jsonb or jsonb_array_length(hero_slides) <> 4;

update public.homepage_content
set hero_slides = (
  select jsonb_agg(
    slide || jsonb_build_object(
      'content_en', content_en->'hero',
      'content_id', content_id->'hero'
    ) order by position
  )
  from jsonb_array_elements(hero_slides) with ordinality as items(slide, position)
)
where id = 1
  and jsonb_array_length(hero_slides) = 4;
