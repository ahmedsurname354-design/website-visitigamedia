alter table public.portfolios
  add column slug text,
  add column is_featured boolean not null default false,
  add column featured_at timestamptz,
  add column location text not null default '',
  add column audience text not null default '',
  add column specs text[] not null default '{}',
  add column work_process text not null default '',
  add column title_en text not null default '',
  add column description_en text not null default '',
  add column audience_en text not null default '',
  add column overview_en text not null default '',
  add column challenge_en text not null default '',
  add column process_en text not null default '',
  add column solution_en text not null default '',
  add column specs_en text[] not null default '{}';

-- The six existing editorial projects are populated below before generating
-- slugs for the rest of the gallery, so their published URLs stay unchanged.
do $seed$
declare
  item record;
  project_id uuid;
  specs_value text[];
  specs_en_value text[];
  content jsonb := '[{"slug":"totem-minitron-sampoerna-palembang","title":"Totem Minitron Sampoerna Palembang","category":"Outdoor Media","image":"/portfolio/outdoor/outdoor-5.jpg","location":"Jl. Sumpah Pemuda, Palembang","audience":"Orang yang melintas di kawasan Jl. Sumpah Pemuda","summary":"Totem LED outdoor P8 berukuran 1 x 2 meter untuk media visual di tepi Jl. Sumpah Pemuda, Palembang.","context":"Media berdiri sendiri ini berada di sisi jalan, bukan menempel pada fasad bangunan. Foto proyek memperlihatkan bidang layar vertikal di dalam kabinet merah; rincian brief dari pemilik media belum tercatat.","decision":"Format totem menggabungkan bidang LED P8 berukuran 1 x 2 meter dengan badan penyangga mandiri. Orientasi vertikal membatasi komposisi materi visual, sementara lokasi dekat jalan dan kabel udara menjadi kondisi setempat yang tampak pada dokumentasi.","outcome":"Foto lokasi menunjukkan satu unit totem merah dengan layar vertikal telah berdiri di tepi jalan. Durasi tayang dan hasil kampanye tidak tercatat.","specs":["LED outdoor P8","Bidang layar 1 x 2 meter","Kabinet totem berdiri sendiri"],"gallery":["/portfolio/outdoor/outdoor-5.jpg"],"title_en":"Sampoerna Minitron Totem, Palembang","summary_en":"A 1 x 2 metre P8 outdoor LED totem beside Jl. Sumpah Pemuda, Palembang.","audience_en":"People passing through the Jl. Sumpah Pemuda area","context_en":"This freestanding display sits beside the road rather than on a building facade. The project photo shows a vertical screen inside a red cabinet; the media owner''s original brief has not been recorded.","decision_en":"The totem combines a 1 x 2 metre P8 LED display with a self-supporting cabinet. Its vertical format shapes the content layout, while the roadside position and overhead cables are visible site conditions.","outcome_en":"The location photo shows one red totem with a vertical screen standing beside the road. Display duration and campaign results have not been recorded.","specs_en":["P8 outdoor LED","1 x 2 metre display area","Freestanding totem cabinet"]},{"slug":"videotron-outdoor-mandalika","title":"Videotron Outdoor Sirkuit Mandalika","category":"Outdoor Media","image":"/portfolio/outdoor/outdoor-13.jpg","location":"Sirkuit Mandalika, Lombok, NTB","audience":"Pengguna jalur North Tunnel Sirkuit Mandalika","summary":"Layar LED outdoor P5 berukuran 10 x 2 meter membentang di atas jalur menuju North Tunnel Sirkuit Mandalika.","context":"Foto proyek memperlihatkan layar memanjang di atas jalur kendaraan pada gerbang North Tunnel, dengan tribun sirkuit di belakangnya. Bentang horizontal ini berbeda dari papan LED yang dipasang pada fasad atau panggung.","decision":"Konfigurasi yang tercatat adalah LED outdoor P5 dengan bidang 10 x 2 meter. Rasio bidang 5:1 berarti materi visual perlu disusun khusus untuk format sangat lebar agar tidak terpotong pada layar.","outcome":"Pada foto dokumentasi, layar sudah menayangkan gambar di atas jalur masuk. Tidak tersedia pengukuran jangkauan audiens atau hasil kampanye.","specs":["LED outdoor P5","10 x 2 meter"],"gallery":["/portfolio/outdoor/outdoor-13.jpg"],"title_en":"Outdoor Videotron at Mandalika Circuit","summary_en":"A 10 x 2 metre P5 outdoor LED screen spans the road toward Mandalika Circuit''s North Tunnel.","audience_en":"People using the circuit''s North Tunnel route","context_en":"The project photo shows a long screen above the road at the North Tunnel entrance, with circuit stands behind it. This horizontal span differs from a facade or stage-mounted display.","decision_en":"The recorded configuration is a 10 x 2 metre P5 outdoor LED display. Its 5:1 ratio calls for content composed for an unusually wide canvas to avoid cropping.","outcome_en":"The documentation photo shows the screen displaying imagery above the access road. Audience reach and campaign results have not been measured in the available records.","specs_en":["P5 outdoor LED","10 x 2 metres"]},{"slug":"videotron-indoor-universitas-al-azhar","title":"Videotron Indoor Universitas Al-Azhar Indonesia","category":"Indoor Media","image":"/portfolio/indoor-10.jpg","location":"Jakarta Selatan","audience":"Pengguna ruang Universitas Al-Azhar Indonesia","summary":"Layar LED indoor P2.5 berukuran 6 x 3 meter menjadi bidang tayang di bagian depan ruang Universitas Al-Azhar Indonesia.","context":"Foto proyek memperlihatkan layar horizontal terpasang di bagian depan ruang kampus, diapit foto pada dinding. Bidang tayang berada di atas lantai ruang, bukan pada struktur panggung sementara.","decision":"Dokumentasi mencatat pixel pitch P2.5 dan dimensi 6 x 3 meter. Rasio bidang 2:1 perlu dicocokkan dengan materi tayang agar gambar tidak terpotong; jenis pengendali dan sumber konten belum tercatat.","outcome":"Foto menunjukkan layar indoor telah terpasang dan menayangkan konten visual. Data penggunaan setelah pemasangan belum tersedia.","specs":["LED indoor P2.5","6 x 3 meter"],"gallery":["/portfolio/indoor-10.jpg"],"title_en":"Indoor Videotron at Al-Azhar Indonesia University","summary_en":"A 6 x 3 metre P2.5 indoor LED screen forms the display area at the front of a university room.","audience_en":"Users of the Al-Azhar Indonesia University room","context_en":"The project photo shows a horizontal screen installed at the front of a campus room, between two framed portraits. It is positioned above the floor rather than on a temporary stage.","decision_en":"The recorded pitch is P2.5 across a 6 x 3 metre area. Content needs to match the 2:1 canvas to avoid cropping; controller and source details are not recorded.","outcome_en":"The photo shows the indoor screen installed and displaying visual content. Post-installation usage data is unavailable.","specs_en":["P2.5 indoor LED","6 x 3 metres"]},{"slug":"rental-led-nobar-madiun","title":"Rental LED Nobar Timnas di Madiun","category":"Rental LED","image":"/portfolio/rental/rental-2.jpg","location":"Madiun, Jawa Timur","audience":"Peserta nobar pertandingan Indonesia vs Australia","summary":"Layar rental LED P3.9 berukuran 6 x 4 meter menayangkan pertandingan Indonesia vs Australia kepada peserta nobar di Madiun.","context":"Dokumentasi memperlihatkan penonton duduk dan berdiri menghadap layar di ujung area terbuka. Acara berlangsung saat cahaya langit masih terlihat; informasi jumlah penonton tidak tersedia.","decision":"Bidang layar 6 x 4 meter dan pitch P3.9 tercatat untuk acara ini. Penempatan layar di ujung area penonton membentuk satu arah pandang utama; konfigurasi audio dan jalur sinyal tidak tercatat.","outcome":"Foto menunjukkan pertandingan sedang tayang dan disaksikan peserta nobar. Tidak ada data evaluasi acara atau jumlah audiens terverifikasi.","specs":["LED P3.9","6 x 4 meter","Acara sementara"],"gallery":["/portfolio/rental/rental-2.jpg"],"title_en":"LED Rental for a Public Screening in Madiun","summary_en":"A 6 x 4 metre P3.9 rental LED screen shows Indonesia versus Australia to people attending a public screening in Madiun.","audience_en":"Attendees of the Indonesia versus Australia public screening","context_en":"The photo shows people sitting and standing toward a screen at the end of an open area. Daylight is still visible; the number of attendees is not recorded.","decision_en":"A 6 x 4 metre area and P3.9 pitch are recorded for this event. The screen''s position creates a main viewing direction; audio and signal routing are not documented.","outcome_en":"The photograph shows the match playing as attendees watch. No verified audience count or event evaluation is available.","specs_en":["P3.9 LED","6 x 4 metres","Temporary event"]},{"slug":"meeting-room-sarinah","title":"Meeting Room Sarinah","category":"Audio Visual","image":"/portfolio/audiovisual/IMG_9584-scaled.jpg","location":"Sarinah, Jakarta","audience":"Peserta rapat di Meeting Room Sarinah","summary":"Layar presentasi dan mikrofon meja tersusun untuk peserta rapat di ruang Meeting Room Sarinah.","context":"Foto proyek memperlihatkan ruang rapat dengan layar di ujung meja dan mikrofon untuk peserta. Kebutuhan komunikasi presentasi dan percakapan di ruang rapat menjadi konteks penggunaan perangkat tersebut.","decision":"Layar ditempatkan pada bidang pandang peserta yang duduk memanjang di meja rapat; mikrofon tersebar di posisi duduk. Spesifikasi layar dan perangkat audio tidak tercatat dalam data proyek.","outcome":"Foto memperlihatkan layar di depan meja rapat, mikrofon di beberapa tempat duduk, dan perangkat kendali kecil pada meja. Hasil uji sistem tidak tersedia.","specs":["Layar ruang rapat","Mikrofon meja"],"gallery":["/portfolio/audiovisual/IMG_9584-scaled.jpg"],"title_en":"Sarinah Meeting Room","summary_en":"A presentation display and table microphones are arranged for participants in the Sarinah meeting room.","audience_en":"Participants in the Sarinah meeting room","context_en":"The project photo shows a meeting room with a screen at the end of the table and microphones for participants. Presentations and conversation are the visible use context.","decision_en":"The screen faces people seated along the table, while microphones are distributed among the seats. The display and audio equipment specifications are not recorded.","outcome_en":"The photo shows the front display, microphones at several seats, and small control devices on the table. System test results are unavailable.","specs_en":["Meeting-room display","Table microphones"]},{"slug":"billboard-paramount-petals","title":"Billboard Paramount Petals","category":"Conventional Media","image":"/portfolio/conventional/Billboard-Paramount-Petals.jpeg","location":"Tangerang","audience":"Orang yang melewati area jalan Paramount Petals","summary":"Billboard outdoor berukuran 6 x 12 meter menampilkan materi kawasan Paramount Petals di sisi jalan Tangerang.","context":"Foto proyek memperlihatkan bidang billboard memanjang di tepi jalan, di atas deretan parkir kendaraan. Materi yang terlihat memuat visual bangunan dan tahapan pengembangan kawasan.","decision":"Ukuran 6 x 12 meter tercatat untuk media ini. Foto memperlihatkan deret lampu sorot di bagian atas bidang, sehingga pencahayaan eksternal menjadi bagian dari tampilan fisiknya; spesifikasi lampu belum tersedia.","outcome":"Media dan materi visualnya terlihat terpasang pada dokumentasi lokasi. Tidak ada laporan impresi atau hasil kampanye yang tercatat.","specs":["Billboard outdoor","6 x 12 meter"],"gallery":["/portfolio/conventional/Billboard-Paramount-Petals.jpeg"],"title_en":"Paramount Petals Billboard","summary_en":"A 6 x 12 metre outdoor billboard displays Paramount Petals development imagery beside a road in Tangerang.","audience_en":"People passing the Paramount Petals roadside area","context_en":"The project photo shows a long billboard beside the road above parked vehicles. Visible artwork includes building imagery and stages of the development.","decision_en":"A 6 x 12 metre size is recorded for this medium. A row of floodlights appears above the display, making external lighting part of the physical presentation; lamp specifications are unavailable.","outcome_en":"The medium and its visual content are installed in the location photo. Impression figures and campaign results have not been recorded.","specs_en":["Outdoor billboard","6 x 12 metres"]}]'::jsonb;
begin
  for item in select value, ordinality from jsonb_array_elements(content) with ordinality loop
    select array_agg(value) into specs_value from jsonb_array_elements_text(item.value->'specs');
    select array_agg(value) into specs_en_value from jsonb_array_elements_text(item.value->'specs_en');
    select id into project_id from public.portfolios
      where image_url = item.value->>'image' order by created_at, id limit 1;
    if project_id is null then
      insert into public.portfolios (title, image_url, client, category)
      values (item.value->>'title', item.value->>'image', 'Belum tercatat', item.value->>'category')
      returning id into project_id;
    end if;
    update public.portfolios set
      title = item.value->>'title', slug = item.value->>'slug',
      category = item.value->>'category', description = item.value->>'summary',
      overview = item.value->>'context', challenge = item.value->>'decision',
      solution = item.value->>'outcome', location = item.value->>'location',
      audience = item.value->>'audience', specs = specs_value,
      work_process = 'Arsip yang tersedia menunjukkan spesifikasi dan kondisi akhir di lokasi. Tahapan survei, pemasangan, serta pengujian proyek ini belum terdokumentasi untuk publik.',
      title_en = item.value->>'title_en', description_en = item.value->>'summary_en',
      audience_en = item.value->>'audience_en', overview_en = item.value->>'context_en',
      challenge_en = item.value->>'decision_en', solution_en = item.value->>'outcome_en',
      process_en = 'The available archive shows specifications and the final on-site condition. Survey, installation, and testing steps for this project have not been publicly documented.',
      specs_en = specs_en_value, is_featured = true,
      featured_at = now() - interval '10 minutes' + item.ordinality * interval '1 minute'
    where id = project_id;
  end loop;
end $seed$;

do $$
declare
  project record;
  base_slug text;
  candidate text;
  suffix integer;
begin
  for project in select id, title from public.portfolios where slug is null order by created_at, id loop
    base_slug := trim(both '-' from regexp_replace(
      lower(translate(project.title, 'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüý',
        'AAAAAACEEEEIIIINOOOOOUUUUYaaaaaaceeeeiiiinooooouuuuy')),
      '[^a-z0-9]+', '-', 'g'));
    base_slug := trim(trailing '-' from left(coalesce(nullif(base_slug, ''), 'proyek'), 100));
    candidate := base_slug;
    suffix := 2;
    while exists (select 1 from public.portfolios where slug = candidate) loop
      candidate := left(base_slug, 100 - length(suffix::text) - 1) || '-' || suffix;
      suffix := suffix + 1;
    end loop;
    update public.portfolios set slug = candidate where id = project.id;
  end loop;
end $$;

alter table public.portfolios alter column slug set not null;
alter table public.portfolios add constraint portfolios_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 100);
alter table public.portfolios add constraint portfolios_slug_key unique (slug);
alter table public.portfolios add constraint portfolios_featured_content check (
  not is_featured or (
    featured_at is not null and btrim(description) <> '' and btrim(location) <> ''
    and btrim(audience) <> '' and cardinality(specs) > 0
    and array_to_string(specs, '') ~ '[^[:space:]]'
    and btrim(overview) <> '' and btrim(challenge) <> ''
    and btrim(work_process) <> '' and btrim(solution) <> ''
  )
);
alter table public.portfolios add constraint portfolios_unfeatured_at check (is_featured or featured_at is null);

create table public.portfolio_slug_aliases (
  old_slug text primary key check (old_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index portfolio_slug_aliases_portfolio_id_idx on public.portfolio_slug_aliases(portfolio_id);
alter table public.portfolio_slug_aliases enable row level security;
create policy "Public read portfolio aliases" on public.portfolio_slug_aliases
  for select to anon, authenticated using (true);
grant select on public.portfolio_slug_aliases to anon, authenticated;

create or replace function public.validate_featured_portfolio()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform pg_advisory_xact_lock(72022026);
  if exists (select 1 from public.portfolio_slug_aliases
             where old_slug = new.slug and portfolio_id <> new.id) then
    raise exception 'Slug proyek sudah dipakai oleh URL lama.' using errcode = '23505';
  end if;
  if new.is_featured then
    if tg_op = 'INSERT' then
      new.featured_at := now();
    elsif not old.is_featured then
      new.featured_at := now();
    end if;
    if (select count(*) from public.portfolios where is_featured and id <> new.id) >= 6 then
      raise exception 'Maksimal 6 proyek unggulan.' using errcode = '23514';
    end if;
  else
    new.featured_at := null;
  end if;
  if tg_op = 'UPDATE' then
    if new.slug <> old.slug then
      delete from public.portfolio_slug_aliases
        where old_slug = new.slug and portfolio_id = new.id;
    end if;
  end if;
  return new;
end $$;

create or replace function public.record_portfolio_slug_alias()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.portfolio_slug_aliases(old_slug, portfolio_id)
  values (old.slug, new.id);
  return new;
end $$;

create trigger portfolios_validate_featured
  before insert or update on public.portfolios
  for each row execute function public.validate_featured_portfolio();
create trigger portfolios_record_slug_alias
  after update of slug on public.portfolios
  for each row when (old.slug is distinct from new.slug)
  execute function public.record_portfolio_slug_alias();
