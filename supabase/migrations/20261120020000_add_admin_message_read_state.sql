alter table public.contact_messages add column if not exists read_at timestamptz;
alter table public.careers_submissions add column if not exists read_at timestamptz;

create index if not exists contact_messages_unread_idx
on public.contact_messages (read_at, created_at desc) where read_at is null;
create index if not exists careers_submissions_unread_idx
on public.careers_submissions (read_at, submission_type, created_at desc) where read_at is null;

create or replace function public.mark_contact_messages_read()
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.is_admin() then raise exception using errcode = '42501', message = 'Admin access required.'; end if;
  update public.contact_messages set read_at = now() where read_at is null;
end;
$$;

create or replace function public.mark_careers_submissions_read()
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if not public.is_admin() then raise exception using errcode = '42501', message = 'Admin access required.'; end if;
  update public.careers_submissions set read_at = now() where read_at is null;
end;
$$;

revoke all on function public.mark_contact_messages_read() from public;
revoke all on function public.mark_careers_submissions_read() from public;
grant execute on function public.mark_contact_messages_read() to authenticated;
grant execute on function public.mark_careers_submissions_read() to authenticated;

do $$ begin
  alter publication supabase_realtime add table public.careers_submissions;
exception when duplicate_object then null;
end $$;

notify pgrst, 'reload schema';
