-- Add the product purchase and videotron rental campaigns to existing homepages.
-- New installations receive the same six slides from the application defaults.
update public.homepage_content
set hero_slides = hero_slides || jsonb_build_array(
  jsonb_build_object(
    'image_url', '',
    'alt', 'Slide hero 5',
    'content_en', jsonb_build_object('title', 'BUY YOUR VIDEOTRON', 'subtitle', 'Build a lasting visual presence with a premium videotron display tailored to your space, audience, and business goals.', 'ctaLabel', 'BUY A VIDEOTRON'),
    'content_id', jsonb_build_object('title', 'PEMBELIAN PRODUK VIDEOTRON', 'subtitle', 'Bangun tampilan visual jangka panjang dengan produk videotron premium yang disesuaikan dengan ruang, audiens, dan target bisnis Anda.', 'ctaLabel', 'BELI VIDEOTRON')
  ),
  jsonb_build_object(
    'image_url', '',
    'alt', 'Slide hero 6',
    'content_en', jsonb_build_object('title', 'VIDEOTRON RENTAL', 'subtitle', 'Flexible LED videotron rental for events, exhibitions, weddings, and corporate productions with professional technical support.', 'ctaLabel', 'RENT A VIDEOTRON'),
    'content_id', jsonb_build_object('title', 'RENTAL VIDEOTRON', 'subtitle', 'Sewa videotron LED fleksibel untuk event, pameran, pernikahan, dan acara korporat dengan dukungan teknis profesional.', 'ctaLabel', 'SEWA VIDEOTRON')
  )
)
where id = 1
  and jsonb_typeof(hero_slides) = 'array'
  and jsonb_array_length(hero_slides) = 4;
