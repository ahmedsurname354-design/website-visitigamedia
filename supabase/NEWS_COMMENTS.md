# News comments rollout

Apply `migrations/20260907000000_add_news_comments.sql` to the existing Supabase
project before deploying the new frontend. Use the project's migration workflow
or run the complete file once in Supabase SQL Editor. Existing news and admin
authentication migrations must already be installed. This migration does not
change existing articles or contact leads.

The local environment only has frontend public credentials, which cannot apply
DDL. Production migration and live end-to-end verification remain required.

After applying, submit a comment on a published article without signing in,
refresh to confirm persistence, then sign in as an admin and open Berita →
Komentar to delete it. Confirm disappearance on the public page after refresh.
If deployment must be rolled back, the previous frontend can run with this
additive table and function left in place.

## Local regression checks

`scripts/test-news-comments.mjs` runs the migration in an isolated PGlite
Postgres instance with minimal news/auth fixtures. Install `@electric-sql/pglite`
in a temporary directory and set `PGLITE_MODULE` to that installation's
`dist/index.js`, then run `node scripts/test-news-comments.mjs`.
The test covers anonymous submission, validation, rate limits, column privacy,
draft access, non-admin restrictions, admin deletion, and cascading deletion.
It does not verify the deployed Auth configuration.

Also run `npm run typecheck`, `npm run build`, and ESLint on changed TS/TSX files.
Browser checks with simulated API responses covered 20-item pagination,
duplicate-submit prevention, successful form reset, preserved input on errors,
plain-text HTML rendering, and the admin modal's confirm/cancel deletion flow.
