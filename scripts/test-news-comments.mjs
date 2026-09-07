// Run with PGLITE_MODULE pointing to an installed @electric-sql/pglite dist/index.js.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const { PGlite } = await import(process.env.PGLITE_MODULE ? pathToFileURL(process.env.PGLITE_MODULE).href : '@electric-sql/pglite');
const db = new PGlite();
const article = '00000000-0000-4000-8000-000000000001';
const draft = '00000000-0000-4000-8000-000000000002';
const key = '00000000-0000-4000-8000-000000000003';
const submit = (name, body, browser = key, news = article, honey = '') => db.query(
  'select public.submit_news_comment($1,$2,$3,$4,$5) as id', [news, name, body, browser, honey]);
try {
  // Minimal fixtures isolate this migration; the production is_admin function uses Auth claims.
  await db.exec(`create role anon; create role authenticated;
    create table public.news(id uuid primary key, published_at timestamptz);
    alter table public.news enable row level security;
    grant select on public.news to anon, authenticated;
    create function public.is_admin() returns boolean language sql stable as
      $$ select coalesce(current_setting('test.admin', true), 'false') = 'true' $$;
    create policy published on public.news for select using(published_at is not null or public.is_admin());
    insert into public.news values('${article}', now()), ('${draft}', null);`);
  await db.exec(await readFile(new URL('../supabase/migrations/20260907000000_add_news_comments.sql', import.meta.url), 'utf8'));
  await db.exec('set role anon');
  const result = await submit('  Ani  ', '  <script>alert(1)</script>  ');
  const id = result.rows[0].id;
  const visible = await db.query('select id,name,body from public.news_comments');
  assert.equal(visible.rows[0].name, 'Ani');
  assert.equal(visible.rows[0].body, '<script>alert(1)</script>');
  await assert.rejects(db.query('select submission_key from public.news_comments'), /permission denied/);
  await assert.rejects(db.query('select * from public.news_comments'), /permission denied/);
  await assert.rejects(db.query('delete from public.news_comments'), /permission denied/);
  await assert.rejects(db.query("update public.news_comments set name='Other'"), /permission denied/);
  await assert.rejects(db.query(`insert into public.news_comments(news_id,name,body,submission_key) values('${article}','Ani','test','${key}')`), /permission denied/);
  for (const [name, body] of [['A','ok'], ['a'.repeat(81),'ok'], ['Ani',' \n\t '], ['Ani','a'.repeat(2001)], [null,'ok']]) {
    await assert.rejects(submit(name, body), /Invalid comment data/);
  }
  await assert.rejects(submit('Ani', 'ok', key, draft), /Article unavailable/);
  await assert.rejects(submit('Ani', 'ok', key, article, 'bot'), /Submission rejected/);
  await assert.rejects(submit('Ani', 'ok', null), /Invalid comment data/);
  await submit('a'.repeat(80), 'a'.repeat(2000));
  await submit('Ani', 'x');
  await assert.rejects(submit('Ani', 'fourth'), /Rate limit/);
  await db.exec('reset role');
  await db.query('update public.news set published_at=null where id=$1', [article]);
  await db.exec('set role anon');
  assert.equal((await db.query('select id from public.news_comments')).rows.length, 0);
  await db.exec('reset role; set role authenticated');
  assert.equal((await db.query('delete from public.news_comments returning id')).rows.length, 0);
  await assert.rejects(db.query("update public.news_comments set name='Other'"), /permission denied/);
  await db.exec("set test.admin='true'");
  assert.equal((await db.query('select id from public.news_comments')).rows.length, 3);
  assert.equal((await db.query('delete from public.news_comments where id=$1 returning id', [id])).rows.length, 1);
  await db.exec('reset role');
  await db.query('delete from public.news where id=$1', [article]);
  assert.equal((await db.query('select count(*)::int as n from public.news_comments')).rows[0].n, 0);
  console.log('PASS: migration, anonymous submission, limits, validation, private key, draft visibility, role permissions, admin deletion, cascade.');
} finally { await db.close(); }
