update public.homepage_content
set content_id = jsonb_set(
  content_id,
  '{stats,3,value}',
  to_jsonb('24/7'::text),
  true
)
where content_id->'stats'->3->>'value' = '24 jam sehari, 7 hari seminggu';
