begin;

create table public.news_comments (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references public.news(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 80),
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  submission_key uuid not null
);
create index news_comments_article_idx on public.news_comments(news_id, created_at desc, id desc);
create index news_comments_rate_idx on public.news_comments(submission_key, created_at desc);
alter table public.news_comments enable row level security;
revoke all on public.news_comments from anon, authenticated;
grant select (id, news_id, name, body, created_at) on public.news_comments to anon, authenticated;
grant delete on public.news_comments to authenticated;
create policy "Read published article comments" on public.news_comments for select to anon, authenticated
  using (exists (select 1 from public.news where news.id = news_id and published_at is not null));
create policy "Admins read all comments" on public.news_comments for select to authenticated using (public.is_admin());
create policy "Admins delete comments" on public.news_comments for delete to authenticated using (public.is_admin());

create function public.submit_news_comment(p_news_id uuid, p_name text, p_body text, p_submission_key uuid, p_honeypot text default '')
returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare
  inserted_id uuid;
  normalized_name text := regexp_replace(coalesce(p_name, ''), '^[[:space:]]+|[[:space:]]+$', '', 'g');
  normalized_body text := regexp_replace(coalesce(p_body, ''), '^[[:space:]]+|[[:space:]]+$', '', 'g');
begin
  if nullif(trim(coalesce(p_honeypot, '')), '') is not null then
    raise exception 'Submission rejected.';
  end if;
  if p_submission_key is null or char_length(normalized_name) not between 2 and 80
     or char_length(normalized_body) not between 1 and 2000 then
    raise exception 'Invalid comment data.';
  end if;
  perform 1 from public.news where id = p_news_id and published_at is not null for share;
  if not found then raise exception 'Article unavailable.'; end if;
  perform pg_advisory_xact_lock(hashtextextended('news-comment:' || p_submission_key::text, 0));
  if (select count(*) from public.news_comments where submission_key = p_submission_key
      and created_at >= now() - interval '15 minutes') >= 3 then
    raise exception 'Rate limit exceeded.';
  end if;
  insert into public.news_comments(news_id, name, body, submission_key)
  values (p_news_id, normalized_name, normalized_body, p_submission_key) returning id into inserted_id;
  return inserted_id;
end;
$$;
revoke all on function public.submit_news_comment(uuid, text, text, uuid, text) from public;
grant execute on function public.submit_news_comment(uuid, text, text, uuid, text) to anon, authenticated;
commit;
