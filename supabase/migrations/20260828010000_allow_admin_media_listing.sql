-- Admin catalogue cleanup needs to list existing files before removing old PDFs.
drop policy if exists "Admins list website media" on storage.objects;
create policy "Admins list website media"
on storage.objects for select to authenticated
using (bucket_id = 'website-media' and public.is_admin());
