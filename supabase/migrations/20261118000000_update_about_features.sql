-- Update the homepage/about selling points to match the current consultation offer.
update public.homepage_content
set
  content_id = jsonb_set(
    content_id,
    '{about,features}',
    '["Solusi indoor dan outdoor", "Pembelian, sewa, & konstruksi", "Respons cepat via WhatsApp"]'::jsonb
  ),
  content_en = jsonb_set(
    content_en,
    '{about,features}',
    '["Indoor and outdoor solutions", "Purchase, rental, & construction", "Fast response via WhatsApp"]'::jsonb
  )
where id = 1;
