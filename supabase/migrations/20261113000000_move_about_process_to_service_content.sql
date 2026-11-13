-- Move the public process cards to the Services locale payloads while keeping
-- the legacy About process data intact for backwards compatibility.
update public.service_content as service
set content_id = coalesce(service.content_id, '{}'::jsonb) || jsonb_build_object(
      'process_eyebrow', coalesce(service.content_id->>'process_eyebrow', 'Proses kerja'),
      'process_title', coalesce(service.content_id->>'process_title', 'Dari kebutuhan menjadi solusi nyata'),
      'process', coalesce(
        service.content_id->'process',
        (select about.content_id->'process' from public.about_content as about where about.id = 1),
        $$[
          {"title":"KONSULTASI GRATIS","description":"Fokus diskusi kami adalah untuk memahami dan memenuhi kebutuhan setiap klien melalui solusi khusus yang disesuaikan."},
          {"title":"SOLUSI","description":"Kami menetapkan solusi yang jelas dan tepat untuk menjawab kebutuhan klien melalui rekomendasi yang akurat dan efektif."},
          {"title":"PAKET","description":"Rencana solusi kami mencakup ilustrasi desain kreatif, hardware, software, konstruksi, sistem mekanikal dan elektrikal, serta estimasi biaya."},
          {"title":"IMPLEMENTASI","description":"Berdasarkan rencana media yang telah disetujui, kami mengubah ide menjadi solusi media yang nyata dan efektif."},
          {"title":"LAYANAN DAN PEMELIHARAAN","description":"Masa pakai peralatan yang optimal dicapai melalui pengoperasian dan pemeliharaan yang tepat, termasuk peningkatan sistem."}
        ]$$::jsonb
      )
    ),
    content_en = coalesce(service.content_en, '{}'::jsonb) || jsonb_build_object(
      'process_eyebrow', coalesce(service.content_en->>'process_eyebrow', 'Our process'),
      'process_title', coalesce(service.content_en->>'process_title', 'From needs to real solutions'),
      'process', coalesce(
        service.content_en->'process',
        (select about.content_en->'process' from public.about_content as about where about.id = 1),
        $$[
          {"title":"FREE CONSULTANT","description":"Our discussion focuses on understanding and fulfilling each client's needs through tailored custom solutions."},
          {"title":"SOLUTION","description":"We establish clear and certain solutions that answer the client's needs with accurate and effective recommendations."},
          {"title":"PACKAGE","description":"Our solution plan includes creative design illustrations, hardware, software, construction, mechanical and electrical systems, and cost estimates."},
          {"title":"IMPLEMENTATION","description":"Based on the approved media plan, we turn ideas into real and effective media solutions."},
          {"title":"SERVICE AND MAINTENANCE","description":"Optimal equipment lifetime is achieved through proper operation and maintenance, including system upgrades."}
        ]$$::jsonb
      )
    )
where service.id = 1;
