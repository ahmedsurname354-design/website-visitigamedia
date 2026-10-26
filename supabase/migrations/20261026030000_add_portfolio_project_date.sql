alter table public.portfolios
  add column project_date date;

update public.portfolios
set project_date = created_at::date
where project_date is null;

alter table public.portfolios
  alter column project_date set not null;
