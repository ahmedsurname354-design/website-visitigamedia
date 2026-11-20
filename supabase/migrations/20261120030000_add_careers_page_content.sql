create table if not exists public.careers_page_content (
  id integer primary key check (id = 1),
  careers_email text not null default 'marcomm@visitiga.com',
  content_id jsonb not null default '{}'::jsonb,
  content_en jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.careers_page_content add column if not exists careers_email text not null default 'marcomm@visitiga.com';
alter table public.careers_page_content add column if not exists content_id jsonb not null default '{}'::jsonb;
alter table public.careers_page_content add column if not exists content_en jsonb not null default '{}'::jsonb;
alter table public.careers_page_content add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_careers_page_content_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists careers_page_content_set_updated_at on public.careers_page_content;
create trigger careers_page_content_set_updated_at before update on public.careers_page_content
for each row execute function public.set_careers_page_content_updated_at();

alter table public.careers_page_content enable row level security;
drop policy if exists "Public read careers page content" on public.careers_page_content;
drop policy if exists "Admins manage careers page content" on public.careers_page_content;
create policy "Public read careers page content" on public.careers_page_content for select to anon, authenticated using (true);
create policy "Admins manage careers page content" on public.careers_page_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
revoke insert, update, delete on public.careers_page_content from anon;
grant select on public.careers_page_content to anon, authenticated;
grant insert, update, delete on public.careers_page_content to authenticated;

insert into public.careers_page_content (id, careers_email, content_id, content_en)
values (1, 'marcomm@visitiga.com',
  $$ {
    "eyebrow":"Careers & Kemitraan","title":"Bangun sesuatu yang berarti bersama Visitiga.","intro":"Kami terbuka untuk kolaborasi baru dan talenta yang ingin ikut membentuk pengalaman visual yang lebih baik.",
    "partner_title":"Mari bertumbuh bersama","partner_text":"Kami bekerja sama dengan brand, pemilik lokasi, agensi, vendor, dan individu yang membawa perspektif serta peluang baru.","partner_button":"Bahas kerja sama",
    "jobs_eyebrow":"Peluang bergabung","jobs_title":"Lowongan yang tersedia","jobs_empty":"Belum ada lowongan yang sedang dibuka. Silakan kirim pesan untuk memperkenalkan diri Anda.","open_positions_suffix":"posisi terbuka","apply_button":"Lamar posisi ini","apply_by":"Batas lamaran",
    "form_eyebrow":"Hubungi kami","form_title":"Ceritakan rencana Anda","name_label":"Nama lengkap","email_label":"Email","phone_label":"Nomor WhatsApp","type_label":"Saya tertarik dengan","partnership_option":"Kemitraan / kerja sama","application_option":"Lamaran pekerjaan","job_label":"Lowongan yang dipilih","job_placeholder":"Pilih lowongan","message_label":"Pesan","message_placeholder":"Ceritakan kebutuhan, ide, atau pengalaman Anda.","submit_button":"Kirim pengajuan","success_message":"Pengajuan berhasil dikirim. Tim Visitiga akan menghubungi Anda.","error_message":"Pengajuan belum dapat dikirim. Periksa koneksi atau hubungi administrator website.","privacy_text":"Saya menyetujui penggunaan informasi ini sesuai Kebijakan Privasi.","cv_note":"Untuk lamaran kerja, silakan kirim CV atau portfolio melalui email setelah mengisi form."
  } $$::jsonb,
  $$ {
    "eyebrow":"Careers & Partnerships","title":"Build something meaningful with Visitiga.","intro":"We are open to new collaborations and people who want to shape better visual experiences with us.",
    "partner_title":"Let’s grow together","partner_text":"We work with brands, property owners, agencies, vendors, and individuals who bring new perspectives and opportunities.","partner_button":"Discuss a partnership",
    "jobs_eyebrow":"Join the team","jobs_title":"Open positions","jobs_empty":"There are no open positions at the moment. Send us a message to introduce yourself.","open_positions_suffix":"open position(s)","apply_button":"Apply for this role","apply_by":"Apply by",
    "form_eyebrow":"Get in touch","form_title":"Tell us about your plans","name_label":"Full name","email_label":"Email","phone_label":"WhatsApp number","type_label":"I am interested in","partnership_option":"Partnership / collaboration","application_option":"Job application","job_label":"Selected position","job_placeholder":"Choose a position","message_label":"Message","message_placeholder":"Tell us about your needs, idea, or experience.","submit_button":"Send enquiry","success_message":"Your enquiry was sent successfully. The Visitiga team will be in touch.","error_message":"Your enquiry could not be sent. Check your connection or contact the website administrator.","privacy_text":"I agree that this information may be used as described in the Privacy Policy.","cv_note":"For job applications, please send your CV or portfolio by email after submitting this form."
  } $$::jsonb)
on conflict (id) do nothing;

notify pgrst, 'reload schema';
