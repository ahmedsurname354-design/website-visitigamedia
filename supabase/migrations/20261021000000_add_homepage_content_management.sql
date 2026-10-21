create table if not exists public.homepage_content (
  id smallint primary key default 1 check (id = 1),
  hero_image_url text not null default '/hero-1600.webp',
  about_image_url text not null default '',
  content_id jsonb not null,
  content_en jsonb not null,
  featured_portfolio_ids uuid[] not null default '{}',
  updated_at timestamptz not null default now()
);

drop trigger if exists homepage_content_set_updated_at on public.homepage_content;
create trigger homepage_content_set_updated_at before update on public.homepage_content
for each row execute function public.set_updated_at();

alter table public.homepage_content enable row level security;
drop policy if exists "Public read homepage content" on public.homepage_content;
create policy "Public read homepage content" on public.homepage_content for select to anon, authenticated using (true);
drop policy if exists "Admins manage homepage content" on public.homepage_content;
create policy "Admins manage homepage content" on public.homepage_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.homepage_content to anon;
grant select, insert, update, delete on public.homepage_content to authenticated;

insert into public.homepage_content (id, hero_image_url, about_image_url, content_id, content_en, featured_portfolio_ids)
values (
  1,
  '/hero-1600.webp',
  '',
  '{"hero":{"trustNotice":"Dipercaya lebih dari 500 bisnis di Indonesia","titleLine1":"Wujudkan","titleLine2":"Merek Anda","titleLine3":"Lebih Bersinar dengan LED Premium","subtitle":"Solusi layar LED profesional untuk bisnis Anda. Kami menyediakan, memasang, dan merawat layar LED berkualitas tinggi yang membuat merek Anda tampil menonjol, siang dan malam.","viewServices":"Lihat Layanan","viewPortfolio":"Lihat Portofolio"},"stats":[{"value":"500+","label":"Proyek Diselesaikan"},{"value":"12","label":"Tahun Pengalaman"},{"value":"98%","label":"Kepuasan Klien"},{"value":"24/7","label":"Layanan Dukungan"}],"services":{"sectionLabel":"Layanan Kami","heading":"Solusi visual untuk setiap ruang.","linkLabel":"Lihat semua layanan","cards":[{"title":"LED Videotron Outdoor","description":"Display LED berkualitas tinggi untuk jalan raya, gedung, dan area publik.","tags":["P6 / P8 / P10","Tahan Air","Kecerahan Tinggi","Kendali Jarak Jauh"],"action":"Konsultasi Outdoor"},{"title":"LED Display Indoor","description":"Tampilan tajam untuk lobi, mal, bank, kampus, dan ruang konferensi.","tags":["P1.5 / P2.5 / P3.9","Ultra HD","Kipas Senyap","Ukuran Kustom"],"action":"Konsultasi Indoor"},{"title":"Sewa / Rental LED","description":"Solusi sewa LED videotron untuk event, konser, pameran, pernikahan, dan acara korporat.","tags":["Event & Pameran","Pernikahan","Konser","Pemasangan Cepat"],"action":"Cek Ketersediaan"},{"title":"Media Konvensional","description":"Lightbox, billboard, signage toko, totem, dan neon sign untuk membangun kesadaran brand.","tags":["Billboard","Lightbox","Totem Sign","Signage Toko"],"action":"Konsultasi Signage"}]},"about":{"sectionLabel":"Tentang Visitiga","heading":"Partner yang memahami dampak sebuah tampilan.","subtitle":"Sejak 2013, Visitiga telah menjadi pelopor dalam penyediaan solusi LED display di Indonesia.","features":["Panel LED berkualitas premium","Tim instalasi bersertifikat","Desain sesuai kebutuhan","Dukungan purnajual"],"buttonLabel":"Tentang Visitiga","clientProofLabel":"Dipercaya oleh brand dan institusi terkemuka"},"cta":{"title":"Siap Membuat Merek Anda Lebih Bersinar?","subtitle":"Dapatkan konsultasi dan penawaran gratis. Tim kami siap mewujudkan kebutuhan visual Anda.","callNow":"Hubungi Kami","emailUs":"Kirim Email","phoneInfo":"+62 822 5878 8780","emailInfo":"marcomm@visitiga.com","locationInfo":"Jl. Setra Dago Barat No.9 Antapani, Bandung"}}'::jsonb,
  '{"hero":{"trustNotice":"Trusted by over 500 businesses in Indonesia","titleLine1":"Bring Your","titleLine2":"Brand","titleLine3":"to Shine with Premium LED","subtitle":"Professional LED display solutions for your business. We provide, install, and maintain high-quality LED screens that make your brand stand out, day and night.","viewServices":"View Services","viewPortfolio":"View Portfolio"},"stats":[{"value":"500+","label":"Projects Completed"},{"value":"12","label":"Years Experience"},{"value":"98%","label":"Client Satisfaction"},{"value":"24/7","label":"Support Service"}],"services":{"sectionLabel":"Our Services","heading":"Visual solutions for every space.","linkLabel":"Explore all services","cards":[{"title":"Outdoor LED Videotron","description":"High-quality LED displays for roads, buildings, and public areas.","tags":["P6 / P8 / P10","Water Resistant","High Brightness","Remote Control"],"action":"Outdoor Consultation"},{"title":"Indoor LED Display","description":"Sharp visuals for lobbies, malls, banks, campuses, and conference rooms.","tags":["P1.5 / P2.5 / P3.9","Ultra HD","Quiet Fans","Custom Size"],"action":"Indoor Consultation"},{"title":"LED Rental / Lease","description":"LED videotron rental solutions for events, concerts, exhibitions, weddings, and corporate shows.","tags":["Events & Exhibitions","Weddings","Concerts","Fast Installation"],"action":"Check Availability"},{"title":"Conventional Media","description":"Lightbox, billboards, store signage, totems, and neon signs for lasting brand awareness.","tags":["Billboard","Lightbox","Totem Sign","Store Signage"],"action":"Signage Consultation"}]},"about":{"sectionLabel":"About Visitiga","heading":"A partner who understands the impact of every display.","subtitle":"Since 2013, Visitiga has been a pioneer in providing LED display solutions in Indonesia.","features":["Premium quality LED panels","Certified installation team","Custom design solutions","Post-sale support"],"buttonLabel":"About Visitiga","clientProofLabel":"Trusted by leading brands and institutions"},"cta":{"title":"Ready to Light Up Your Brand?","subtitle":"Get a free consultation and quote today. Our team is ready to bring your vision to life.","callNow":"Call Us Now","emailUs":"Email Us","phoneInfo":"+62 822 5878 8780","emailInfo":"marcomm@visitiga.com","locationInfo":"Jl. Setra Dago Barat No.9 Antapani, Bandung"}}'::jsonb,
  array(
    select id from public.portfolios
    where image_url in ('/portfolio/outdoor/outdoor-13.jpg', '/portfolio/indoor/indoor-9.jpg', '/portfolio/rental/rental-8.jpg')
    order by case image_url when '/portfolio/outdoor/outdoor-13.jpg' then 1 when '/portfolio/indoor/indoor-9.jpg' then 2 else 3 end
  )
)
on conflict (id) do nothing;
