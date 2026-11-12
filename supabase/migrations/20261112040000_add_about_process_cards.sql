alter table public.about_content
  drop constraint if exists about_content_locale_shape;

update public.about_content
set content_id = jsonb_set(
      content_id,
      '{process}',
      '[
        {"title":"KONSULTASI GRATIS","description":"Fokus diskusi kami adalah untuk memenuhi kebutuhan klien. Kami melayani setiap klien dengan solusi yang disesuaikan secara khusus (custom)."},
        {"title":"SOLUSI","description":"Kami menetapkan solusi yang jelas dan pasti untuk menjawab kebutuhan klien serta memberikan rekomendasi tepat dan efektif."},
        {"title":"PAKET","description":"Rekomendasi solusi rencana kami mencakup ilustrasi desain kreatif, perangkat keras (hardware), perangkat lunak (software), konstruksi, mekanikal elektrikal, dan anggaran biaya."},
        {"title":"IMPLEMENTASI","description":"Sesuai dengan perencanaan media yang telah disetujui, kami mewujudkan ide menjadi solusi media yang nyata."},
        {"title":"LAYANAN DAN PEMELIHARAAN","description":"Masa pakai perangkat yang optimal dapat dicapai melalui pengoperasian dan pemeliharaan perangkat yang baik dan benar, termasuk peningkatan sistem (up-grading)."}
      ]'::jsonb,
      true
    ),
    content_en = jsonb_set(
      content_en,
      '{process}',
      '[
        {"title":"FREE CONSULTANT","description":"Our discussion focuses on understanding and fulfilling each client’s needs through tailored custom solutions."},
        {"title":"SOLUTION","description":"We establish clear and certain solutions that answer the client’s needs with accurate and effective recommendations."},
        {"title":"PACKAGE","description":"Our solution plan includes creative design illustrations, hardware, software, construction, mechanical and electrical systems, and cost estimates."},
        {"title":"IMPLEMENTATION","description":"Based on the approved media plan, we turn ideas into real and effective media solutions."},
        {"title":"SERVICE AND MAINTENANCE","description":"Optimal equipment lifetime is achieved through proper operation and maintenance, including system upgrades."}
      ]'::jsonb,
      true
    )
where id = 1
  and (
    jsonb_typeof(content_id->'process') is distinct from 'array'
    or (jsonb_typeof(content_id->'process') = 'array' and jsonb_array_length(content_id->'process') <> 5)
    or jsonb_typeof(content_en->'process') is distinct from 'array'
    or (jsonb_typeof(content_en->'process') = 'array' and jsonb_array_length(content_en->'process') <> 5)
  );

alter table public.about_content
  add constraint about_content_locale_shape check (
    jsonb_typeof(content_id) = 'object'
    and jsonb_typeof(content_en) = 'object'
    and content_id ?& array['eyebrow', 'title', 'items', 'process']
    and content_en ?& array['eyebrow', 'title', 'items', 'process']
    and jsonb_typeof(content_id->'items') = 'array'
    and jsonb_typeof(content_en->'items') = 'array'
    and jsonb_array_length(content_id->'items') = 4
    and jsonb_array_length(content_en->'items') = 4
    and jsonb_typeof(content_id->'process') = 'array'
    and jsonb_typeof(content_en->'process') = 'array'
    and jsonb_array_length(content_id->'process') = 5
    and jsonb_array_length(content_en->'process') = 5
  );
