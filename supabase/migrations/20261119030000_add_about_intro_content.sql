-- Make the public About introduction editable from the admin dashboard.
alter table public.about_content
  drop constraint if exists about_content_locale_shape;

update public.about_content
set content_id = jsonb_set(
      content_id,
      '{intro}',
      '{"sectionLabel":"Tentang Visitiga","headingPrefix":"Mitra Tepercaya untuk ","headingAccent":"Inovasi LED","subtitle":"Sejak 2013, Visitiga telah menjadi pelopor dalam penyediaan solusi LED display di Indonesia. Dengan tim ahli yang berpengalaman, kami menghadirkan kualitas premium, desain kreatif, dan pelayanan terbaik untuk setiap klien.","features":["Panel LED berkualitas premium","Tim instalasi bersertifikat","Desain sesuai kebutuhan","Dukungan purnajual"],"contactButton":"Hubungi Kami"}'::jsonb,
      true
    ),
    content_en = jsonb_set(
      content_en,
      '{intro}',
      '{"sectionLabel":"About Visitiga","headingPrefix":"Trusted Partner for ","headingAccent":"LED Innovation","subtitle":"Since 2013, Visitiga has been a pioneer in providing LED display solutions in Indonesia. With an experienced expert team, we deliver premium quality, creative design, and excellent service for every client.","features":["Premium quality LED panels","Certified installation team","Custom design solutions","Post-sale support"],"contactButton":"Contact Us"}'::jsonb,
      true
    )
where id = 1;

alter table public.about_content
  add constraint about_content_locale_shape check (
    jsonb_typeof(content_id) = 'object'
    and jsonb_typeof(content_en) = 'object'
    and content_id ?& array['intro', 'eyebrow', 'title', 'items', 'process']
    and content_en ?& array['intro', 'eyebrow', 'title', 'items', 'process']
    and jsonb_typeof(content_id->'intro') = 'object'
    and jsonb_typeof(content_en->'intro') = 'object'
    and jsonb_typeof(content_id->'intro'->'features') = 'array' 
    and jsonb_typeof(content_en->'intro'->'features') = 'array'
    and jsonb_array_length(content_id->'intro'->'features') = 4
    and jsonb_array_length(content_en->'intro'->'features') = 4
    and jsonb_typeof(content_id->'items') = 'array'
    and jsonb_typeof(content_en->'items') = 'array'
    and jsonb_array_length(content_id->'items') = 4
    and jsonb_array_length(content_en->'items') = 4
    and jsonb_typeof(content_id->'process') = 'array'
    and jsonb_typeof(content_en->'process') = 'array'
    and jsonb_array_length(content_id->'process') = 5
    and jsonb_array_length(content_en->'process') = 5
  );
