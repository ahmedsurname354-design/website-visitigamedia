-- Keep seeded product records aligned with the optimized assets shipped by
-- the website. Admin-uploaded absolute URLs are intentionally left untouched.
update public.products
set image_url = regexp_replace(image_url, '\.(png|jpe?g)$', '.webp', 'i')
where image_url ~* '^/products/.+\.(png|jpe?g)$';
