import type { ServiceLandingContent, ServiceLandingLocaleContent, ServiceLandingSlug } from '@/types/admin';

export const serviceLandingSlugs: ServiceLandingSlug[] = ['videotron-outdoor', 'led-indoor', 'rental-led', 'media-konvensional', 'digital-signage', 'event-production'];

const commonId = {
  intro_eyebrow: 'Dasar perencanaan', considerations_title: 'Yang perlu dipastikan', process_eyebrow: 'Alur kerja',
  portfolio_eyebrow: 'Portofolio terkait', portfolio_title: 'Lihat penerapannya pada proyek.', portfolio_link_text: 'Semua proyek',
  cta_button_text: 'Hubungi Visitiga', back_text: 'Semua layanan',
};
const commonEn = {
  intro_eyebrow: 'Planning basis', considerations_title: 'What to confirm', process_eyebrow: 'Workflow',
  portfolio_eyebrow: 'Related portfolio', portfolio_title: 'See how it works in real projects.', portfolio_link_text: 'All projects',
  cta_button_text: 'Contact Visitiga', back_text: 'All services',
};

function landing(slug: ServiceLandingSlug, content_id: ServiceLandingLocaleContent, content_en: ServiceLandingLocaleContent, seo: [string, string, string, string]): ServiceLandingContent {
  return { slug, hero_image_url: '', content_id, content_en, seo_title_id: seo[0], seo_description_id: seo[1], seo_title_en: seo[2], seo_description_en: seo[3], related_portfolio_ids: [], updated_at: '' };
}

export const defaultServiceLandings: Record<ServiceLandingSlug, ServiceLandingContent> = {
  'videotron-outdoor': landing('videotron-outdoor', {
    ...commonId, eyebrow: 'Solusi digital media', title: 'Digital Media Solution', description: 'Solusi layar LED indoor dan outdoor untuk menghadirkan visual yang jelas, konsisten, dan mudah diandalkan di berbagai ruang dan lokasi.',
    intro_title: 'Media digital dirancang dari kebutuhan ruang dan audiens.', intro: 'Digital media solution perlu disesuaikan dengan ukuran bidang, pixel pitch, brightness, jarak pandang, sumber konten, struktur, daya, dan akses perawatan agar hasil tampil optimal.',
    considerations: ['Ukuran bidang, pixel pitch, dan jarak pandang', 'Brightness sesuai kondisi indoor atau outdoor', 'Sumber konten, jalur listrik, dan sistem kontrol', 'Struktur pemasangan serta akses perawatan'], process_title: 'Tahapan dari kebutuhan hingga layar siap digunakan.', process: ['Survei lokasi dan kebutuhan audiens', 'Menentukan spesifikasi layar dan konfigurasi', 'Menyiapkan struktur, daya, dan sistem kontrol', 'Pemasangan, pengujian visual, dan serah terima'],
    cta_title: 'Bangun solusi media digital Anda.', cta_description: 'Sampaikan lokasi, ukuran bidang, jarak pandang, dan kebutuhan konten agar konfigurasi LED dapat dirancang secara tepat.',
  }, {
    ...commonEn, eyebrow: 'Digital media solution', title: 'Digital Media Solution', description: 'Indoor and outdoor LED display solutions that deliver clear, consistent, and dependable visuals across different spaces and locations.',
    intro_title: 'Digital media shaped by the space and audience.', intro: 'A digital media solution should account for display size, pixel pitch, brightness, viewing distance, content sources, structure, power, and maintenance access so the result performs as intended.',
    considerations: ['Display size, pixel pitch, and viewing distance', 'Brightness for indoor or outdoor conditions', 'Content source, power routes, and control system', 'Mounting structure and maintenance access'], process_title: 'From requirements to a ready-to-use display.', process: ['Surveying the site and audience needs', 'Selecting display specifications and configuration', 'Preparing structure, power, and control systems', 'Installation, visual testing, and handover'],
    cta_title: 'Build your digital media solution.', cta_description: 'Share the location, display area, viewing distance, and content needs so the LED configuration can be designed around your project.',
  }, ['Digital Media Solution | Visitiga', 'Solusi layar LED indoor dan outdoor dengan perencanaan pixel pitch, brightness, jarak pandang, struktur, dan sistem kontrol.', 'Digital Media Solution | Visitiga', 'Indoor and outdoor LED display solutions planned around pixel pitch, brightness, viewing distance, structure, and control systems.']),
  'led-indoor': landing('led-indoor', {
    ...commonId, eyebrow: 'Layanan media konvensional', title: 'Conventional Media', description: 'Media konvensional seperti billboard, lightbox, dan signage untuk menyampaikan pesan brand secara jelas di lokasi yang tepat.',
    intro_title: 'Media fisik yang mengikuti lokasi dan arah pandang.', intro: 'Conventional media perlu direncanakan dari lokasi, arah lalu lintas, ukuran bidang, material visual, struktur, pencahayaan, dan kebutuhan perawatan agar pesan mudah terlihat dan tahan digunakan.',
    considerations: ['Lokasi, arah pandang, dan profil audiens', 'Ukuran bidang serta rasio material visual', 'Struktur, material, dan ketahanan terhadap cuaca', 'Pencahayaan, daya, dan akses perawatan'], process_title: 'Tahapan membentuk media yang siap dipasang.', process: ['Menganalisis lokasi dan peluang visibilitas', 'Menentukan format, ukuran, dan material', 'Menyiapkan desain, struktur, dan pencahayaan', 'Produksi, pemasangan, dan pemeriksaan akhir'],
    cta_title: 'Rencanakan media konvensional Anda.', cta_description: 'Kirimkan lokasi, ukuran bidang, dan tujuan komunikasi agar format billboard, lightbox, atau signage dapat ditentukan dengan tepat.',
  }, {
    ...commonEn, eyebrow: 'Conventional media', title: 'Conventional Media', description: 'Billboards, lightboxes, and signage that communicate your brand clearly in the right location and format.',
    intro_title: 'Physical media shaped by location and visibility.', intro: 'Conventional media should account for location, traffic direction, display size, artwork, structure, lighting, and maintenance so the message stays visible and durable.',
    considerations: ['Location, viewing direction, and audience profile', 'Display size and artwork ratio', 'Structure, materials, and weather exposure', 'Lighting, power, and maintenance access'], process_title: 'From format selection to a finished display.', process: ['Analyzing the site and visibility opportunity', 'Selecting the format, size, and materials', 'Preparing artwork, structure, and lighting', 'Production, installation, and final inspection'],
    cta_title: 'Plan your conventional media.', cta_description: 'Share the location, display area, and communication objective so the right billboard, lightbox, or signage format can be planned.',
  }, ['Conventional Media | Visitiga', 'Billboard, lightbox, dan signage yang dirancang berdasarkan lokasi, ukuran bidang, material, struktur, dan pencahayaan.', 'Conventional Media | Visitiga', 'Billboards, lightboxes, and signage planned around location, display size, materials, structure, and lighting.']),
  'rental-led': landing('rental-led', {
    ...commonId, eyebrow: 'Layanan architectural & media construction', title: 'Architectural & Media Construction', description: 'Solusi struktur sipil, interior, baja, facade, ballroom, dan media structure untuk membangun ruang serta media yang aman dan terintegrasi.',
    intro_title: 'Konstruksi media yang menyatu dengan arsitektur.', intro: 'Pekerjaan architectural and media construction perlu menyatukan fungsi ruang, struktur, beban, material, jalur instalasi, keselamatan, dan hasil akhir agar elemen media dapat terpasang dengan rapi dan aman.',
    considerations: ['Kondisi bangunan, dimensi, dan kebutuhan beban', 'Material facade, interior, baja, atau ballroom', 'Jalur listrik, kabel, akses kerja, dan keselamatan', 'Finishing, perawatan, serta integrasi dengan media'], process_title: 'Tahapan dari struktur hingga finishing.', process: ['Meninjau gambar, lokasi, dan kebutuhan fungsi', 'Mengembangkan detail struktur dan material', 'Mengerjakan konstruksi, instalasi, dan koordinasi site', 'Pemeriksaan beban, finishing, dan serah terima'],
    cta_title: 'Wujudkan ruang dan struktur media Anda.', cta_description: 'Sampaikan gambar, kondisi lokasi, ukuran, dan kebutuhan media agar solusi konstruksi dapat dibahas bersama tim teknis.',
  }, {
    ...commonEn, eyebrow: 'Architectural & media construction', title: 'Architectural & Media Construction', description: 'Civil, interior, steel, facade, ballroom, and media structure solutions that integrate safely with commercial spaces and advertising media.',
    intro_title: 'Media construction integrated with architecture.', intro: 'Architectural and media construction brings together room function, structure, loading, materials, installation routes, safety, and finishing so media elements are installed cleanly and safely.',
    considerations: ['Building condition, dimensions, and load requirements', 'Facade, interior, steel, or ballroom materials', 'Power, cable routes, access, and site safety', 'Finishing, maintenance, and media integration'], process_title: 'From structure planning to final finishing.', process: ['Reviewing drawings, site conditions, and functions', 'Developing structural and material details', 'Executing construction, installation, and site coordination', 'Inspecting load, finishing, and handover'],
    cta_title: 'Build your architectural media solution.', cta_description: 'Share the drawings, site conditions, dimensions, and media requirements so the construction solution can be reviewed with our technical team.',
  }, ['Architectural & Media Construction | Visitiga', 'Solusi konstruksi sipil, interior, baja, facade, ballroom, dan media structure yang aman serta terintegrasi.', 'Architectural & Media Construction | Visitiga', 'Civil, interior, steel, facade, ballroom, and media structure solutions integrated safely with commercial spaces.']),
  'media-konvensional': landing('media-konvensional', {
    ...commonId, eyebrow: 'Layanan media placement & creative content', title: 'Media Placement & Creative Content', description: 'Strategi penempatan OOH dan DOOH yang dipadukan dengan konsep kreatif, produksi konten, dan campaign rollout untuk menjangkau audiens yang tepat.',
    intro_title: 'Strategi media yang bertemu dengan ide kreatif.', intro: 'Media placement and creative content perlu dimulai dari tujuan campaign, karakter audiens, lokasi, durasi, format media, pesan, dan kebutuhan produksi agar komunikasi brand terasa relevan.',
    considerations: ['Tujuan campaign dan profil audiens', 'Pilihan OOH, DOOH, lokasi, serta durasi tayang', 'Creative concept, format, dan kebutuhan produksi', 'Jadwal rollout, approval, dan pengukuran hasil'], process_title: 'Dari strategi hingga campaign berjalan.', process: ['Memahami tujuan, audiens, dan media opportunity', 'Menyusun strategi placement dan creative concept', 'Memproduksi serta menyesuaikan aset konten', 'Menjalankan rollout dan mengevaluasi hasil'],
    cta_title: 'Hubungkan placement dengan konten yang kuat.', cta_description: 'Ceritakan tujuan campaign, audiens, lokasi, dan pesan utama agar strategi media serta konten kreatif dapat dirancang dalam satu alur.',
  }, {
    ...commonEn, eyebrow: 'Media placement & creative content', title: 'Media Placement & Creative Content', description: 'OOH and DOOH placement strategy combined with creative concepts, content production, and campaign rollout to reach the right audience.',
    intro_title: 'Where media strategy meets creative thinking.', intro: 'Media placement and creative content should begin with the campaign objective, audience, location, duration, media format, message, and production needs so brand communication stays relevant.',
    considerations: ['Campaign objective and audience profile', 'OOH, DOOH, location, and flighting duration', 'Creative concept, format, and production needs', 'Rollout schedule, approval, and measurement'], process_title: 'From strategy to a live campaign.', process: ['Understanding objectives, audience, and opportunities', 'Building the placement strategy and creative concept', 'Producing and adapting content assets', 'Launching the rollout and reviewing results'],
    cta_title: 'Connect placement with stronger content.', cta_description: 'Share your campaign objective, audience, locations, and key message so media strategy and creative content can be planned as one process.',
  }, ['Media Placement & Creative Content | Visitiga', 'Strategi OOH dan DOOH yang dipadukan dengan creative concept, produksi konten, dan campaign rollout.', 'Media Placement & Creative Content | Visitiga', 'OOH and DOOH placement strategy combined with creative concepts, content production, and campaign rollout.']),
  'digital-signage': landing('digital-signage', {
    ...commonId, eyebrow: 'Layanan audio visual', title: 'Audio Visual', description: 'Sistem audio visual terintegrasi untuk meeting room, ruang presentasi, venue, dan event dengan alur sinyal yang jelas dan mudah digunakan.',
    intro_title: 'Sistem visual dan audio yang bekerja sebagai satu kesatuan.', intro: 'Audio visual perlu disusun dari kebutuhan ruang, jumlah pengguna, akustik, display, audio, control system, signal flow, konektivitas, dan kebutuhan operasional harian.',
    considerations: ['Ukuran ruang, jumlah pengguna, dan akustik', 'Display, audio, microphone, dan control system', 'Signal flow, konektivitas, dan kompatibilitas perangkat', 'Kemudahan penggunaan, training, dan maintenance'], process_title: 'Tahapan membangun sistem yang mudah digunakan.', process: ['Memahami fungsi ruang dan alur pengguna', 'Menentukan perangkat, signal flow, dan sistem kontrol', 'Melakukan instalasi, konfigurasi, dan integrasi', 'Testing, training, dan serah terima sistem'],
    cta_title: 'Buat ruang Anda lebih terhubung.', cta_description: 'Sampaikan jenis ruang, jumlah pengguna, perangkat yang tersedia, dan kebutuhan meeting atau event agar sistem audio visual dapat diintegrasikan secara tepat.',
  }, {
    ...commonEn, eyebrow: 'Audio visual', title: 'Audio Visual', description: 'Integrated audio visual systems for meeting rooms, presentation spaces, venues, and events with clear signal flow and simple operation.',
    intro_title: 'Visual and audio systems working as one.', intro: 'Audio visual planning should account for room function, users, acoustics, displays, audio, control systems, signal flow, connectivity, and daily operation.',
    considerations: ['Room size, user count, and acoustics', 'Displays, audio, microphones, and control systems', 'Signal flow, connectivity, and device compatibility', 'Ease of use, training, and maintenance'], process_title: 'Building a system that is easy to operate.', process: ['Understanding room functions and user flow', 'Selecting devices, signal flow, and control systems', 'Installing, configuring, and integrating the system', 'Testing, training, and system handover'],
    cta_title: 'Connect your space with better AV.', cta_description: 'Share the room type, user count, existing equipment, and meeting or event needs so the audio visual system can be integrated properly.',
  }, ['Audio Visual | Visitiga', 'Sistem audio visual terintegrasi untuk meeting room, ruang presentasi, venue, dan event.', 'Audio Visual | Visitiga', 'Integrated audio visual systems for meeting rooms, presentation spaces, venues, and events.']),
  'event-production': landing('event-production', {
    ...commonId, eyebrow: 'Layanan event production', title: 'Event Production', description: 'Dukungan produksi visual dan teknis untuk event, stage, conference, dan live experience dari setup hingga acara selesai.',
    intro_title: 'Produksi yang mengikuti ritme acara.', intro: 'Event production perlu menyatukan kebutuhan stage, screen, visual, signal, listrik, jadwal setup, rehearsal, rundown, dan technical operation agar acara berjalan lancar.',
    considerations: ['Format conference, stage, dan kebutuhan audiens', 'Screen, visual content, signal, audio, dan lighting', 'Jadwal setup, rehearsal, loading, dan safety', 'Pembagian peran serta dukungan technical operation'], process_title: 'Dari rundown hingga show day.', process: ['Meninjau rundown, venue, dan kebutuhan teknis', 'Menyusun stage, screen, signal, dan production plan', 'Setup perangkat, routing signal, dan rehearsal', 'Technical operation saat live event dan breakdown'],
    cta_title: 'Siapkan event dengan tim yang terkoordinasi.', cta_description: 'Kirimkan rundown, venue, jadwal, dan kebutuhan visual agar dukungan produksi dapat disusun secara aman dan terukur.',
  }, {
    ...commonEn, eyebrow: 'Event production', title: 'Event Production', description: 'Visual and technical production support for events, stages, conferences, and live experiences from setup through show day.',
    intro_title: 'Production that follows the rhythm of the event.', intro: 'Event production brings together stage, screen, visual, signal, power, setup schedules, rehearsals, rundowns, and technical operation so the event runs smoothly.',
    considerations: ['Conference format, stage, and audience needs', 'Screens, visual content, signal, audio, and lighting', 'Setup, rehearsal, loading, and safety schedules', 'Team roles and technical operation support'], process_title: 'From rundown to show day.', process: ['Reviewing the rundown, venue, and technical needs', 'Building the stage, screen, signal, and production plan', 'Setting up equipment, routing signals, and rehearsing', 'Operating the live event and completing breakdown'],
    cta_title: 'Prepare your event with a coordinated team.', cta_description: 'Share the rundown, venue, schedule, and visual requirements so production support can be planned safely and measurably.',
  }, ['Event Production | Visitiga', 'Dukungan produksi visual dan teknis untuk event, stage, conference, dan live experience.', 'Event Production | Visitiga', 'Visual and technical production support for events, stages, conferences, and live experiences.']),
};

export const serviceLandings = defaultServiceLandings;

export function isServiceLandingSlug(value?: string): value is ServiceLandingSlug {
  return Boolean(value && serviceLandingSlugs.includes(value as ServiceLandingSlug));
}
