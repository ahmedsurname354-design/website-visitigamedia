-- Product cards shown on the public Product page and managed in Admin.
alter table public.products add column if not exists label text not null default '';
alter table public.products add column if not exists color text not null default '#2a1a12';
alter table public.products add column if not exists accent text not null default '#fb923c';
alter table public.products add column if not exists sort_order integer not null default 0;

drop policy if exists "Public read products" on public.products;
create policy "Public read products" on public.products for select to anon, authenticated using (true);

insert into public.products (name, image_url, category, description, label, color, accent, sort_order)
select legacy.name, legacy.image_url, legacy.category, legacy.description, legacy.label, legacy.color, legacy.accent, legacy.sort_order
from (values
  ('LED OUTDOOR', '/products/outdoor.png', 'Outdoor', 'High definition LED display dengan fine pixel pitch, high refresh rate, dan desain slim/lightweight yang hemat energi. Menghasilkan visual tajam flicker-free serta mudah diinstal. Ideal untuk roadside billboard hingga commercial venue.', '01 / Experience', '#2a1a12', '#fb923c', 1),
  ('LED INDOOR', '/products/indoor.png', 'Indoor', 'Layar dengan piksel rapat dan refresh rate tinggi untuk visual mulus dan cerah dari jarak dekat. Berdesain tipis, ringan, dan efisien daya, memudahkan setup serta perawatan di conference room, lobi hotel, hingga storefront.', '02 / Campaign', '#3b2013', '#fed7aa', 2),
  ('LED RENTAL', '/products/rental.png', 'Rental', 'Display LED portabel untuk acara indoor/outdoor seperti konser, pameran, dan wedding. Menampilkan visual mulus flicker-free dengan modul slim dan hemat energi yang cepat dipasang maupun dibongkar.', '03 / Retail', '#1c1511', '#fdba74', 3),
  ('LED TRANSPARENT', '/products/transparent.png', 'Transparent', 'Layar transparan berteknologi tinggi yang menampilkan visual cerah tanpa menghalangi pandangan di baliknya. Ringan dan efisien energi, sangat cocok untuk storefront, fasad, dan arsitektur modern.', '04 / Impact', '#331b10', '#ffedd5', 4),
  ('LED CREATIVE', '/products/creative.png', 'Creative', 'Display fleksibel yang dapat dikustomisasi ke berbagai bentuk unik untuk pengalaman visual imersif. Pilihan tepat untuk retail dan pameran yang ingin tampil beda dan eye-catching.', '05 / Event', '#452516', '#fb923c', 5),
  ('LED ALL IN ONE', '/products/all%20in%20one.png', 'All in one', 'Solusi plug-and-play praktis yang menggabungkan layar dan sistem dalam satu unit slim dan portabel. Menghadirkan performa visual profesional tanpa instalasi rumit.', '06 / Motion', '#21150f', '#fed7aa', 6)
) as legacy(name, image_url, category, description, label, color, accent, sort_order)
where not exists (select 1 from public.products p where p.image_url = legacy.image_url);
