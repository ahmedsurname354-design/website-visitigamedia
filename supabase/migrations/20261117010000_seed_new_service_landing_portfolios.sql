-- Give the two newly added service landing pages initial project relations.
insert into public.service_landing_portfolios (service_slug, portfolio_id, position)
select service.slug, project.id, project.position
from (values
  ('digital-signage', 'audio visual'),
  ('event-production', 'event production')
) as service(slug, category_term)
cross join lateral (
  select id, row_number() over (order by created_at desc, id)::smallint as position
  from public.portfolios
  where lower(category || ' ' || title) like '%' || service.category_term || '%'
  order by created_at desc, id
  limit 3
) project
on conflict do nothing;
