-- ============================================================
-- Sistem Ulasan — jalankan sekali di Supabase → SQL Editor.
-- Aman dijalankan ulang (idempotent).
--
-- Alur akses:
--   • TULIS (kirim/edit ulasan): hanya lewat server Next.js memakai
--     SUPABASE_SERVICE_ROLE_KEY (melewati RLS). Pelanggan tamu (tanpa login)
--     divalidasi lewat token email di sisi server, bukan lewat RLS.
--   • BACA publik (beranda): anon key, hanya baris is_published = true
--     dan hanya kolom aman (order_id & user_id TIDAK bisa dibaca publik).
--
-- MODERASI: Table Editor → reviews → ubah is_published ke FALSE
--           → ulasan hilang dari beranda (maks. ±5 menit karena cache).
-- ============================================================

create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  -- ID pesanan di Redis (mis. "A1B2C3D41234" atau "RNT-..."). UNIQUE = 1 pesanan hanya 1 ulasan.
  order_id      text not null unique,
  -- Diisi jika pemesan login saat memesan (opsional; tamu = NULL)
  user_id       uuid references auth.users(id) on delete set null,
  rating        smallint not null check (rating between 1 and 5),
  comment       text not null check (char_length(comment) between 10 and 600),
  -- Nama yang ditampilkan ke publik. Jika is_anonymous = true, server menyimpan "Pelanggan Anonim".
  display_name  text not null check (char_length(display_name) between 1 and 80),
  avatar_url    text,
  is_anonymous  boolean not null default false,
  -- TRUE = tampil di website. Ubah ke FALSE untuk menyembunyikan.
  is_published  boolean not null default true,
  -- Rute untuk ditampilkan di kartu ulasan (opsional), mis. "Bengkulu → Curup"
  route         text check (route is null or char_length(route) <= 120),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists reviews_published_created_idx
  on public.reviews (created_at desc) where is_published;

create index if not exists reviews_user_idx
  on public.reviews (user_id) where user_id is not null;

alter table public.reviews enable row level security;

-- Publik (anon + user login) hanya boleh MEMBACA ulasan yang dipublikasikan.
drop policy if exists "baca ulasan terpublikasi" on public.reviews;
create policy "baca ulasan terpublikasi"
  on public.reviews for select
  to anon, authenticated
  using (is_published = true);

-- Tidak ada policy insert/update/delete untuk anon/authenticated:
-- semua penulisan lewat service role di server.

-- Batasi kolom yang bisa dibaca publik (sembunyikan order_id, user_id, is_published).
revoke all on public.reviews from anon, authenticated;
grant select (id, rating, comment, display_name, avatar_url, is_anonymous, route, created_at)
  on public.reviews to anon, authenticated;

-- Verifikasi cepat (opsional), jalankan setelah ada 1 ulasan:
--   select id, rating, display_name, is_published from public.reviews order by created_at desc limit 6;
