create table if not exists public.service_content (
  id integer primary key default 1 check (id = 1),
  eyebrow text not null,
  heading text not null,
  heading_accent text not null,
  cards jsonb not null default '[]'::jsonb check (jsonb_typeof(cards) = 'array'),
  showreel_eyebrow text not null,
  showreel_heading text not null,
  showreel_accent text not null,
  showreel_description text not null,
  primary_button_text text not null,
  primary_button_url text not null,
  secondary_button_text text not null,
  secondary_button_url text not null,
  video_webm_url text not null,
  video_mp4_url text not null,
  video_poster_url text not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists service_content_set_updated_at on public.service_content;
create trigger service_content_set_updated_at before update on public.service_content
for each row execute function public.set_updated_at();

alter table public.service_content enable row level security;
drop policy if exists "Public read service content" on public.service_content;
create policy "Public read service content" on public.service_content for select to anon, authenticated using (true);
drop policy if exists "Admins manage service content" on public.service_content;
create policy "Admins manage service content" on public.service_content for all to authenticated
using (public.is_admin()) with check (public.is_admin());

grant select on public.service_content to anon;
grant select, insert, update, delete on public.service_content to authenticated;

insert into public.service_content (
  id, eyebrow, heading, heading_accent, cards, showreel_eyebrow,
  showreel_heading, showreel_accent, showreel_description,
  primary_button_text, primary_button_url, secondary_button_text,
  secondary_button_url, video_webm_url, video_mp4_url, video_poster_url
) values (
  1, 'Layanan Kami', 'Solusi LED Terbaik', 'untuk Setiap Kebutuhan',
  '[{"title":"LED Display","description":"Solusi layar LED berkualitas untuk kebutuhan indoor maupun outdoor.","tags":["Indoor","Outdoor","Videotron"],"action":"Konsultasi sekarang"},{"title":"Media Placement","description":"Penempatan media strategis untuk menjangkau audiens yang tepat.","tags":["OOH","DOOH","Campaign"],"action":"Konsultasi sekarang"},{"title":"Audio Visual","description":"Sistem audio visual terintegrasi untuk ruang dan acara profesional.","tags":["Audio","Visual","Integration"],"action":"Konsultasi sekarang"},{"title":"Creative Content","description":"Konten visual kreatif yang dirancang untuk menarik perhatian audiens.","tags":["Design","Motion","Content"],"action":"Konsultasi sekarang"}]'::jsonb,
  'Layanan Kami', 'Visual Memukau,', 'Kesan Luar Biasa',
  'Menampilkan hasil pemasangan dan konten videotron kami kombinasi warna tajam, pencahayaan presisi, dan performa optimal untuk hasil visual maksimal.',
  'Konsultasi Sekarang', 'https://bit.ly/49NclAE', 'Email Marketing',
  'mailto:marcomm@visitiga.com?subject=Konsultasi%20Visitiga%20Media',
  '/videos/service-showreel.webm', '/videos/service-showreel.mp4', '/videos/service-showreel-poster.webp'
) on conflict (id) do nothing;

update storage.buckets
set file_size_limit = 31457280,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
where id = 'website-media';
