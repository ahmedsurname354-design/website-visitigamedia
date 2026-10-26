alter table public.portfolios
  alter column project_date type text using project_date::text,
  alter column project_date drop not null;

alter table public.portfolios
  add constraint portfolios_project_date_format
  check (project_date is null or project_date ~ '^\d{4}(-\d{2})?(-\d{2})?$');
