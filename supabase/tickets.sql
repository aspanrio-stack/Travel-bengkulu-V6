-- ============================================================
-- Verifikasi Tiket (QR) — jalankan sekali di Supabase → SQL Editor.
-- Aman dijalankan ulang (idempotent).
--
-- Akses:
--   • SEMUA baca/tulis lewat server Next.js memakai SUPABASE_SERVICE_ROLE_KEY.
--   • RLS aktif TANPA policy → anon/authenticated tidak bisa membaca apa pun
--     (token & data penumpang tidak bisa di-query langsung dari browser).
--
-- Retensi: baris dihapus otomatis setelah expires_at (default 90 hari / 3 bulan)
--   oleh cron Vercel /api/cron/purge-expired-tickets (harian).
--   Alternatif tanpa cron: lihat blok pg_cron di bagian bawah.
-- ============================================================

create table if not exists public.tickets (
  id              uuid primary key default gen_random_uuid(),
  -- ID pesanan di Redis. UNIQUE = 1 pesanan hanya 1 tiket/QR (cetak ulang memakai token yang sama).
  order_id        text not null unique,
  -- Token acak 192-bit (base64url, 32 karakter) yang ada di QR. JANGAN bisa ditebak.
  unique_token    text not null unique check (char_length(unique_token) between 20 and 64),
  passenger_name  text not null,
  route           text not null,
  travel_date     text not null,
  departure_time  text,
  passengers      integer not null default 1,
  -- TRUE = sudah divalidasi petugas saat naik (tidak bisa dipakai lagi)
  is_verified     boolean not null default false,
  verified_at     timestamptz,
  verified_by     text,
  created_at      timestamptz not null default now(),
  expires_at      timestamptz not null default (now() + interval '90 days')
);

create index if not exists tickets_expires_idx on public.tickets (expires_at);

alter table public.tickets enable row level security;
revoke all on public.tickets from anon, authenticated;
-- (sengaja tidak ada policy: hanya service role yang bisa akses)

-- ── Opsional: hapus otomatis langsung dari database (butuh ekstensi pg_cron aktif) ──
-- create extension if not exists pg_cron;
-- select cron.schedule('purge-expired-tickets', '0 19 * * *',
--   $$ delete from public.tickets where expires_at < now() $$);
