alter table public.about_content
  drop constraint if exists about_content_locale_shape;

update public.about_content
set content_id = jsonb_build_object(
      'eyebrow', coalesce(nullif(content_id->>'eyebrow', ''), 'Nilai kami'),
      'title', coalesce(nullif(content_id->>'title', ''), 'MENGAPA MEMILIH KAMI'),
      'vision', coalesce(nullif(content_id->>'vision', ''), 'Menjadi mitra terpercaya dalam menciptakan solusi komunikasi visual yang bermakna dan menghubungkan brand dengan audiensnya.'),
      'mission', coalesce(nullif(content_id->>'mission', ''), 'Memberikan solusi media yang tepat melalui teknologi berkualitas, kolaborasi kreatif, pelaksanaan yang presisi, dan dukungan jangka panjang yang dapat diandalkan.'),
      'items', case when jsonb_typeof(content_id->'items') = 'array' and jsonb_array_length(content_id->'items') = 4 then content_id->'items' else '[{"title":"Ketekunan","description":"Terus tekun dengan semangat kewirausahaan."},{"title":"Tanggung Jawab","description":"Terus mencari cara untuk meningkatkan profitabilitas dan keberlanjutan."},{"title":"Pelayanan","description":"Memberikan pelayanan terbaik dan bekerja keras untuk membangun hubungan yang adil."},{"title":"Integritas","description":"Selalu berusaha melakukan hal yang benar dan bersikap jujur."}]'::jsonb end,
      'process', case when jsonb_typeof(content_id->'process') = 'array' and jsonb_array_length(content_id->'process') = 5 then content_id->'process' else '[{"title":"KONSULTASI GRATIS","description":"Fokus diskusi kami adalah untuk memenuhi kebutuhan klien. Kami melayani setiap klien dengan solusi yang disesuaikan secara khusus (custom)."},{"title":"SOLUSI","description":"Kami menetapkan solusi yang jelas dan pasti untuk menjawab kebutuhan klien serta memberikan rekomendasi tepat dan efektif."},{"title":"PAKET","description":"Rekomendasi solusi rencana kami mencakup ilustrasi desain kreatif, perangkat keras (hardware), perangkat lunak (software), konstruksi, mekanikal elektrikal, dan anggaran biaya."},{"title":"IMPLEMENTASI","description":"Sesuai dengan perencanaan media yang telah disetujui, kami mewujudkan ide menjadi solusi media yang nyata."},{"title":"LAYANAN DAN PEMELIHARAAN","description":"Masa pakai perangkat yang optimal dapat dicapai melalui pengoperasian dan pemeliharaan perangkat yang baik dan benar, termasuk peningkatan sistem (up-grading)."}]'::jsonb end
    ),
    content_en = jsonb_build_object(
      'eyebrow', coalesce(nullif(content_en->>'eyebrow', ''), 'Our values'),
      'title', coalesce(nullif(content_en->>'title', ''), 'WHY CHOOSE US'),
      'vision', coalesce(nullif(content_en->>'vision', ''), 'To become a trusted partner in creating meaningful visual communication solutions that connect brands with their audiences.'),
      'mission', coalesce(nullif(content_en->>'mission', ''), 'We deliver thoughtful media solutions through quality technology, creative collaboration, precise execution, and dependable long-term support.'),
      'items', case when jsonb_typeof(content_en->'items') = 'array' and jsonb_array_length(content_en->'items') = 4 then content_en->'items' else '[{"title":"Persistence","description":"Be persistent in keeping with an entrepreneurial attitude."},{"title":"Stewardship","description":"Continually look for ways to improve profitability and sustainability."},{"title":"Service","description":"Give our customers the best service and work hard to make a fair relationship."},{"title":"Integrity","description":"Strive to always do the right thing; be honest."}]'::jsonb end,
      'process', case when jsonb_typeof(content_en->'process') = 'array' and jsonb_array_length(content_en->'process') = 5 then content_en->'process' else '[{"title":"FREE CONSULTANT","description":"Our discussion focuses on understanding and fulfilling each client''s needs through tailored custom solutions."},{"title":"SOLUTION","description":"We establish clear and certain solutions that answer the client''s needs with accurate and effective recommendations."},{"title":"PACKAGE","description":"Our solution plan includes creative design illustrations, hardware, software, construction, mechanical and electrical systems, and cost estimates."},{"title":"IMPLEMENTATION","description":"Based on the approved media plan, we turn ideas into real and effective media solutions."},{"title":"SERVICE AND MAINTENANCE","description":"Optimal equipment lifetime is achieved through proper operation and maintenance, including system upgrades."}]'::jsonb end
    )
where id = 1;

alter table public.about_content
  add constraint about_content_locale_shape check (
    jsonb_typeof(content_id) = 'object'
    and jsonb_typeof(content_en) = 'object'
    and content_id ?& array['eyebrow', 'title', 'vision', 'mission', 'items', 'process']
    and content_en ?& array['eyebrow', 'title', 'vision', 'mission', 'items', 'process']
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
