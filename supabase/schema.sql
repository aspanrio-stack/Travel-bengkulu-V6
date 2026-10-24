-- Jalankan sekali di Supabase → SQL Editor.
-- Alamat tersimpan per user. RLS memastikan user hanya bisa melihat/mengubah miliknya sendiri.

create table if not exists public.saved_addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  label      text not null check (char_length(label) between 1 and 40),
  address    text not null check (char_length(address) between 5 and 500),
  phone      text check (phone is null or char_length(phone) <= 20),
  created_at timestamptz not null default now()
);

create index if not exists saved_addresses_user_idx on public.saved_addresses (user_id, created_at desc);

alter table public.saved_addresses enable row level security;

create policy "baca alamat sendiri"   on public.saved_addresses for select to authenticated using (auth.uid() = user_id);
create policy "tambah alamat sendiri" on public.saved_addresses for insert to authenticated with check (auth.uid() = user_id);
create policy "ubah alamat sendiri"   on public.saved_addresses for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "hapus alamat sendiri"  on public.saved_addresses for delete to authenticated using (auth.uid() = user_id);
