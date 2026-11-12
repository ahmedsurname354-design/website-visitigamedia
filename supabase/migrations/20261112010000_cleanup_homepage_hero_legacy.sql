update public.homepage_content
set content_id = jsonb_set(
  content_id,
  '{hero}',
  jsonb_build_object(
    'title', 'PERIKLANAN',
    'subtitle', 'Dengan berpartner bersama klien untuk menciptakan hal yang berarti, kami meningkatkan pengalaman manusia.',
    'ctaLabel', 'HUBUNGI KAMI'
  )
),
content_en = jsonb_set(
  content_en,
  '{hero}',
  jsonb_build_object(
    'title', 'ADVERTISING',
    'subtitle', 'By partnering with our clients to create what matters, we improve the human experience.',
    'ctaLabel', 'CONTACT US'
  )
)
where id = 1;

alter table public.homepage_content
  drop column if exists hero_image_url;
