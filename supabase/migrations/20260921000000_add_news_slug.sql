alter table public.news add column slug text;

do $$
declare
  article record;
  base_slug text;
  candidate text;
  suffix integer;
begin
  for article in select id, title from public.news order by created_at, id loop
    base_slug := trim(both '-' from regexp_replace(
      lower(translate(article.title, 'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïñòóôõöùúûüý',
        'AAAAAACEEEEIIIINOOOOOUUUUYaaaaaaceeeeiiiinooooouuuuy')),
      '[^a-z0-9]+', '-', 'g'));
    base_slug := trim(trailing '-' from left(coalesce(nullif(base_slug, ''), 'berita'), 100));
    candidate := base_slug;
    suffix := 2;
    while exists (select 1 from public.news where slug = candidate) loop
      candidate := left(base_slug, 100 - length(suffix::text) - 1) || '-' || suffix;
      suffix := suffix + 1;
    end loop;
    update public.news set slug = candidate where id = article.id;
  end loop;
end $$;

alter table public.news alter column slug set not null;
alter table public.news add constraint news_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 100);
alter table public.news add constraint news_slug_key unique (slug);
