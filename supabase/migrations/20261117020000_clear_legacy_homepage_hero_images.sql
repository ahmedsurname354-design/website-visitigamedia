-- Stop the homepage hero from showing legacy photos while keeping slide copy.
update public.homepage_content
set hero_slides = coalesce((
  select jsonb_agg(
    slide || jsonb_build_object('image_url', '')
    order by position
  )
  from jsonb_array_elements(hero_slides) with ordinality as items(slide, position)
), '[]'::jsonb)
where jsonb_typeof(hero_slides) = 'array';
