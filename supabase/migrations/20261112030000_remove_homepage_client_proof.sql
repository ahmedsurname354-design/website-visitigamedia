update public.homepage_content
set content_id = content_id #- '{about,clientProofLabel}',
    content_en = content_en #- '{about,clientProofLabel}'
where id = 1;
