-- Public media bucket. Only authenticated administrators may write files.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('website-media', 'website-media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set public = true, file_size_limit = 8388608, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins upload website media" on storage.objects;
create policy "Admins upload website media" on storage.objects for insert to authenticated with check (bucket_id = 'website-media' and public.is_admin());
drop policy if exists "Admins update website media" on storage.objects;
create policy "Admins update website media" on storage.objects for update to authenticated using (bucket_id = 'website-media' and public.is_admin()) with check (bucket_id = 'website-media' and public.is_admin());
drop policy if exists "Admins delete website media" on storage.objects;
create policy "Admins delete website media" on storage.objects for delete to authenticated using (bucket_id = 'website-media' and public.is_admin());
    