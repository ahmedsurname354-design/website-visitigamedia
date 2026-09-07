# RLS access audit

All application tables have Row Level Security enabled. `authenticated` does
not mean admin by itself; write policies additionally require
`public.is_admin()`, which reads the trusted Auth `app_metadata.role` claim.

| Resource | Anonymous visitor | Authenticated non-admin | Admin |
| --- | --- | --- | --- |
| `portfolios` | Read | Read | Read/write/delete |
| `products` | Read | Read | Read/write/delete |
| `news` | Read published only | Read published only | Read/write/delete |
| `news_comments` | Read published comments; RPC submission | Read published comments; RPC submission | Read/delete; RPC submission |
| `product_catalogue` | Read | Read | Read/write/delete |
| `contact_messages` | RPC submission only | RPC submission only | Read/update/delete |
| `website_events` | Validated insert only | Validated insert only | Insert/read |
| `storage.objects` in `website-media` | Public object delivery only | Public object delivery only | List/upload/update/delete |

Public contact insertion is intentionally unavailable through the table API.
`submit_contact_message(...)` is the only public contact entry point and applies
input validation, a honeypot, and a per-email/browser rate limit.

News comments likewise use `submit_news_comment(...)` for validated submissions,
with a honeypot and a browser-key limit of three comments per fifteen minutes.
Column-level SELECT grants exclude `submission_key` for all frontend roles;
callers must select the public columns explicitly. Only admins may delete comments.

The Supabase `service_role` bypasses RLS by design and must never be exposed in
frontend environment variables. The frontend uses only the publishable key.
