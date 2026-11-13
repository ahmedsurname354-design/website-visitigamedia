alter table public.about_content
  drop constraint if exists about_content_locale_shape;

update public.about_content
set content_id = content_id || jsonb_build_object(
      'vision_title', coalesce(nullif(content_id->>'vision_title', ''), 'Masa depan komunikasi visual yang lebih jelas.'),
      'mission_title', coalesce(nullif(content_id->>'mission_title', ''), 'Mewujudkan ide dengan penuh perhatian.')
    ),
    content_en = content_en || jsonb_build_object(
      'vision_title', coalesce(nullif(content_en->>'vision_title', ''), 'A clearer future for visual communication.'),
      'mission_title', coalesce(nullif(content_en->>'mission_title', ''), 'Ideas made tangible, with care.')
    )
where id = 1;

alter table public.about_content
  add constraint about_content_locale_shape check (
    jsonb_typeof(content_id) = 'object'
    and jsonb_typeof(content_en) = 'object'
    and content_id ?& array['eyebrow', 'title', 'vision_title', 'mission_title', 'vision', 'mission', 'items', 'process']
    and content_en ?& array['eyebrow', 'title', 'vision_title', 'mission_title', 'vision', 'mission', 'items', 'process']
    and jsonb_typeof(content_id->'vision_title') = 'string'
    and jsonb_typeof(content_en->'vision_title') = 'string'
    and jsonb_typeof(content_id->'mission_title') = 'string'
    and jsonb_typeof(content_en->'mission_title') = 'string'
    and jsonb_typeof(content_id->'vision') = 'string'
    and jsonb_typeof(content_en->'vision') = 'string'
    and jsonb_typeof(content_id->'mission') = 'string'
    and jsonb_typeof(content_en->'mission') = 'string'
    and jsonb_typeof(content_id->'items') = 'array'
    and jsonb_typeof(content_en->'items') = 'array'
    and jsonb_array_length(content_id->'items') = 4
    and jsonb_array_length(content_en->'items') = 4
    and jsonb_typeof(content_id->'process') = 'array'
    and jsonb_typeof(content_en->'process') = 'array'
    and jsonb_array_length(content_id->'process') = 5
    and jsonb_array_length(content_en->'process') = 5
  );
