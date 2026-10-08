-- Keep this asset out of the /portfolio/:slug/ page redirect pattern.
update public.portfolios
set image_url = '/portfolio/indoor/indoor-9.jpg'
where image_url = '/portfolio/indoor-9.jpg';
