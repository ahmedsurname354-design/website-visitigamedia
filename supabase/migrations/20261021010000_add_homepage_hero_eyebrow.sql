update public.homepage_content
set content_id = jsonb_set(content_id, '{hero,eyebrow}', to_jsonb('VISUAL TECHNOLOGY · INDONESIA'::text), true),
    content_en = jsonb_set(content_en, '{hero,eyebrow}', to_jsonb('VISUAL TECHNOLOGY · INDONESIA'::text), true)
where id = 1;
