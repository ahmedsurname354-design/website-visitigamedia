-- Centralize public contact submission so rate limits cannot be bypassed by
-- calling the table REST endpoint directly.
alter table public.contact_messages add column if not exists submission_key uuid;
create index if not exists contact_messages_submission_rate_idx
on public.contact_messages (submission_key, created_at desc);
create index if not exists contact_messages_email_rate_idx
on public.contact_messages (lower(email), created_at desc);

drop policy if exists "Anyone can submit contact messages" on public.contact_messages;
drop policy if exists "Visitors submit validated contact messages" on public.contact_messages;
revoke insert on public.contact_messages from anon, authenticated;

create or replace function public.submit_contact_message(
  p_name text,
  p_email text,
  p_phone text,
  p_message text,
  p_submission_key uuid,
  p_honeypot text default ''
)
returns bigint
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  inserted_id bigint;
  normalized_email text := lower(trim(p_email));
begin
  if nullif(trim(coalesce(p_honeypot, '')), '') is not null then
    raise exception using errcode = 'P0001', message = 'Submission rejected.';
  end if;
  if p_submission_key is null then
    raise exception using errcode = 'P0001', message = 'Submission identifier is required.';
  end if;
  if char_length(trim(p_name)) not between 2 and 120
    or char_length(normalized_email) not between 5 and 254
    or normalized_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or (nullif(trim(p_phone), '') is not null and char_length(trim(p_phone)) not between 7 and 30)
    or char_length(trim(p_message)) not between 10 and 5000 then
    raise exception using errcode = 'P0001', message = 'Invalid contact form data.';
  end if;

  -- Serialize matching submissions so concurrent requests cannot race past
  -- the count checks.
  perform pg_advisory_xact_lock(hashtextextended('email:' || normalized_email, 0));
  perform pg_advisory_xact_lock(hashtextextended('submission:' || p_submission_key::text, 0));
  if (select count(*) from public.contact_messages
      where created_at >= now() - interval '15 minutes'
      and (submission_key = p_submission_key or lower(email) = normalized_email)) >= 3 then
    raise exception using errcode = 'P0001', message = 'Rate limit exceeded. Try again later.';
  end if;

  insert into public.contact_messages (name, email, phone, message, submission_key)
  values (trim(p_name), normalized_email, nullif(trim(p_phone), ''), trim(p_message), p_submission_key)
  returning id into inserted_id;
  return inserted_id;
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text, uuid, text) from public;
grant execute on function public.submit_contact_message(text, text, text, text, uuid, text) to anon, authenticated;

-- Media URLs must be either safe same-origin paths or HTTPS URLs. NOT VALID
-- preserves legacy rows while enforcing the rule for new writes.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'portfolios_image_url_safe') then
    alter table public.portfolios add constraint portfolios_image_url_safe check (
      char_length(image_url) <= 2048 and ((left(image_url, 1) = '/' and left(image_url, 2) <> '//') or image_url ~ '^https://[^[:space:]]+$')
    ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'products_image_url_safe') then
    alter table public.products add constraint products_image_url_safe check (
      char_length(image_url) <= 2048 and ((left(image_url, 1) = '/' and left(image_url, 2) <> '//') or image_url ~ '^https://[^[:space:]]+$')
    ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'news_cover_image_safe') then
    alter table public.news add constraint news_cover_image_safe check (
      char_length(cover_image) <= 2048 and ((left(cover_image, 1) = '/' and left(cover_image, 2) <> '//') or cover_image ~ '^https://[^[:space:]]+$')
    ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'product_catalogue_file_url_safe') then
    alter table public.product_catalogue add constraint product_catalogue_file_url_safe check (
      char_length(file_url) <= 2048 and ((left(file_url, 1) = '/' and left(file_url, 2) <> '//') or file_url ~ '^https://[^[:space:]]+$')
    ) not valid;
  end if;
end $$;

-- Explicit privilege audit: public content is read-only, administration is
-- authenticated and still constrained by is_admin() RLS policies.
revoke insert, update, delete on public.portfolios, public.products, public.news, public.product_catalogue from anon;
grant select on public.portfolios, public.products, public.news, public.product_catalogue to anon;
grant select, insert, update, delete on public.portfolios, public.products, public.news, public.product_catalogue to authenticated;
revoke select, insert, update, delete on public.contact_messages from anon;
revoke insert on public.contact_messages from authenticated;
grant select, update, delete on public.contact_messages to authenticated;
revoke select, update, delete on public.website_events from anon;
grant insert on public.website_events to anon, authenticated;
grant select on public.website_events to authenticated;
