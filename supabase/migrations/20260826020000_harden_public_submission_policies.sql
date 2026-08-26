-- Validate public form/event payloads at the database boundary. These checks
-- replace permissive `with check (true)` policies without granting read access.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'contact_messages_name_length') then
    alter table public.contact_messages add constraint contact_messages_name_length check (char_length(trim(name)) between 2 and 120) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'contact_messages_email_format') then
    alter table public.contact_messages add constraint contact_messages_email_format check (char_length(email) between 5 and 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$') not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'contact_messages_phone_length') then
    alter table public.contact_messages add constraint contact_messages_phone_length check (nullif(trim(phone), '') is null or char_length(trim(phone)) between 7 and 30) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'contact_messages_message_length') then
    alter table public.contact_messages add constraint contact_messages_message_length check (char_length(trim(message)) between 10 and 5000) not valid;
  end if;
end $$;

drop policy if exists "Anyone can submit contact messages" on public.contact_messages;
create policy "Visitors submit validated contact messages"
on public.contact_messages for insert to anon
with check (
  char_length(trim(name)) between 2 and 120
  and char_length(email) between 5 and 254
  and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  and (nullif(trim(phone), '') is null or char_length(trim(phone)) between 7 and 30)
  and char_length(trim(message)) between 10 and 5000
  and created_at between now() - interval '5 minutes' and now() + interval '5 minutes'
);

drop policy if exists "Anyone can record page views" on public.website_events;
create policy "Visitors record validated page views"
on public.website_events for insert to anon, authenticated
with check (
  visitor_id is not null
  and path like '/%'
  and path not like '/admin%'
  and char_length(path) between 1 and 500
  and created_at between now() - interval '5 minutes' and now() + interval '5 minutes'
);

-- The function is used by authenticated admin RLS policies. Anonymous callers
-- never need direct access to it.
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
