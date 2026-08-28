-- Turn contact messages into manageable sales leads without widening public access.
alter table public.contact_messages add column if not exists status text not null default 'new';
alter table public.contact_messages add column if not exists notes text not null default '';
alter table public.contact_messages add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'contact_messages_status_valid') then
    alter table public.contact_messages add constraint contact_messages_status_valid
    check (status in ('new', 'contacted', 'completed', 'spam')) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'contact_messages_notes_length') then
    alter table public.contact_messages add constraint contact_messages_notes_length
    check (char_length(notes) <= 5000) not valid;
  end if;
end $$;

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at before update on public.contact_messages
for each row execute function public.set_updated_at();

create index if not exists contact_messages_status_created_at_idx
on public.contact_messages (status, created_at desc);

-- Public submissions may only create untouched leads. This prevents callers
-- from assigning their own status or injecting internal admin notes.
drop policy if exists "Visitors submit validated contact messages" on public.contact_messages;
create policy "Visitors submit validated contact messages"
on public.contact_messages for insert to anon, authenticated
with check (
  char_length(trim(name)) between 2 and 120
  and char_length(email) between 5 and 254
  and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  and (nullif(trim(phone), '') is null or char_length(trim(phone)) between 7 and 30)
  and char_length(trim(message)) between 10 and 5000
  and status = 'new'
  and notes = ''
  and created_at between now() - interval '5 minutes' and now() + interval '5 minutes'
  and updated_at between now() - interval '5 minutes' and now() + interval '5 minutes'
);

drop policy if exists "Admins update contact leads" on public.contact_messages;
create policy "Admins update contact leads" on public.contact_messages
for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins delete contact leads" on public.contact_messages;
create policy "Admins delete contact leads" on public.contact_messages
for delete to authenticated using (public.is_admin());
