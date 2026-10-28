# Cleanup Audit

Tanggal audit: 2026-10-28

Audit ini bersifat konservatif. Tidak ada migration Supabase, row production,
atau file Storage yang dihapus.

## Perubahan aman yang dilakukan

- Menghapus dependency `pdf-lib` dari `package.json` dan `package-lock.json`.
- `pdf-lib` tidak direferensikan oleh source, script, function, atau test mana pun.
- Perubahan lokal pada `PortfolioDetailPage` dan regression test dipertahankan.

## Code dan dependency

- TypeScript `noUnusedLocals` dan `noUnusedParameters` tetap aktif.
- ESLint tidak menemukan import atau variable yang tidak dipakai.
- Dependency berikut tetap dipakai dan tidak dihapus:
  - `framer-motion`
  - `lucide-react`
  - `react-router-dom`
  - `@supabase/supabase-js`
  - `summernote` dan `jquery`
  - `dompurify`
  - `web-vitals`

## Asset lokal

- Tidak ada asset yang dihapus.
- File `.jpg/.jpeg/.png` dipertahankan sebagai fallback untuk `.webp`.
- Variant `-320`, `-640`, `-960`, dan `-1400` dipertahankan karena dipakai
  oleh responsive image helpers dan dapat dipakai pada prerender atau fallback.
- Asset portfolio yang namanya tidak muncul langsung di source tetap dipertahankan
  karena URL-nya dapat berasal dari data Supabase.

## Audit data publik Supabase

Read-only request production berhasil membaca:

- 48 portfolio
- 5 berita published
- 6 produk

Temuan yang perlu ditinjau manual, bukan dihapus:

- Keenam produk memiliki `content_id`, tetapi `content_en` masih kosong.
  Ini adalah kandidat perbaikan konten bahasa Inggris, bukan data lama yang aman
  untuk dihapus.
- Sebagian portfolio lama memiliki locale payload yang belum lengkap atau masih
  memakai asset lokal legacy. Data tersebut dipertahankan karena masih tampil di
  route portfolio dan dapat dibutuhkan oleh redirect lama.
- Duplicate asset URL dan orphan file Storage tidak dihapus. Pemeriksaan dan
  penghapusan file Storage memerlukan daftar bucket dari admin/service role serta
  verifikasi manual terhadap seluruh route.

## Migration dan cleanup terjadwal

- Seluruh file `supabase/migrations` dipertahankan sebagai riwayat schema.
- Workflow `cleanup-observations.yml` dipertahankan. Workflow tersebut memang
  menghapus observasi website yang lebih lama dari 30 hari sesuai kebijakan
  observability project.

## Validasi

- `npm run typecheck`: berhasil.
- `npm run lint`: berhasil.
- `npm run build`: berhasil; prerender menghasilkan dan memvalidasi 134 halaman.
- Vitest lokal sebelumnya gagal dimulai karena environment menolak akses ke
  `vitest.config.ts`; tidak ada assertion test yang dijalankan.
