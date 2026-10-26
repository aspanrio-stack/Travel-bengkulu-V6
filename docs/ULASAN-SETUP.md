# Sistem Ulasan — Petunjuk Pemasangan

Fitur: ulasan otomatis (email) + manual (/profil), moderasi lewat Supabase, ulasan terbaru di beranda.

## 0. Terapkan kode

```bash
cd Travel-bengkulu-V6
git checkout -b feat/reviews
git apply --check bengkulu-reviews.patch   # cek dulu, tidak mengubah apa pun
git am bengkulu-reviews.patch              # atau: git apply bengkulu-reviews.patch
git push -u origin feat/reviews            # buka PR → cek Preview → merge ke main
```
Tidak ada dependensi baru (memakai `@supabase/supabase-js`, `ioredis`, `resend` yang sudah ada).

## 1. Jalankan SQL di Supabase

1. Buka https://supabase.com/dashboard/project/_/sql/new (pilih project Bengkulu Travel jika diminta).
2. Buka file `supabase/reviews.sql`, salin **seluruh isinya**, tempel ke editor.
3. Klik **Run** (atau Ctrl/Cmd + Enter). Hasil yang benar: `Success. No rows returned`.
4. Cek di **Table Editor** → tabel `reviews` muncul, ikon RLS menyala (enabled).

Aman dijalankan ulang (idempotent).

## 2. Ambil SUPABASE_SERVICE_ROLE_KEY

1. Buka https://supabase.com/dashboard/project/_/settings/api-keys
2. Salin key **service_role** (tab *Legacy API Keys*) — atau **secret key** (`sb_secret_…`) di tab API Keys baru. Nama tab bisa berbeda tergantung versi dashboard.
3. **RAHASIA**: jangan di-commit, jangan diberi awalan `NEXT_PUBLIC_`, jangan ditempel di chat/screenshot. Key ini melewati semua aturan RLS.

## 3. Buat CRON_SECRET

Di terminal: `openssl rand -hex 32` → salin hasilnya (64 karakter). Atau pakai generator password acak ≥ 32 karakter.

## 4. Set Environment Variables di Vercel

1. Buka https://vercel.com/dashboard → pilih project → **Settings** → **Environment Variables**.
2. Tambahkan (centang **Production**, dan **Preview** bila ingin tes di preview):

| Name | Value | Catatan |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | key dari langkah 2 | Jangan centang "exposed"/NEXT_PUBLIC |
| `CRON_SECRET` | string dari langkah 3 | Vercel otomatis mengirimnya sebagai `Authorization: Bearer …` ke cron |
| `NEXT_PUBLIC_SITE_URL` | `https://bengkulutravel.com` | Opsional; dasar link di email (default sudah ini) |

3. Pastikan variabel lama sudah ada: `REDIS_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **Redeploy** (Deployments → ⋯ → Redeploy). Variabel baru baru terbaca setelah deploy ulang.

## 5. Cron

`vercel.json` sudah berisi jadwal `0 1 * * *` (01:00 UTC = **08:00 WIB**, sekali sehari — batas paket Hobby).
- Cron hanya berjalan di deployment **Production**.
- Cek di Vercel → Settings → **Cron Jobs** (tombol **Run** untuk menjalankan manual).
- Paket Hobby menjalankan cron "di dalam jam itu" (bisa terlambat sampai ±59 menit).
- Tes manual dari terminal:
  ```bash
  curl -s -H "Authorization: Bearer $CRON_SECRET" https://bengkulutravel.com/api/cron/send-review-requests
  # → {"ok":true,"scanned":12,"eligible":1,"sent":1,"failed":0,"skippedLocked":0}
  ```
  Tanpa header / secret salah → `401`.

## 6. Uji end-to-end

1. Siapkan 1 pesanan berstatus **Terkonfirmasi** dengan email Anda, tanggal/jam keberangkatan sudah lewat > 12 jam (≤ 7 hari).
2. Jalankan `curl` di atas → email "Bagaimana perjalanan Anda?" masuk (cek Spam). Jalankan lagi → `sent: 0` (tidak ada email ganda).
3. Klik bintang 4 di email → `/review` terbuka dengan 4 bintang terisi. Tulis komentar ≥ 10 karakter → **Kirim Ulasan**.
4. Supabase → Table Editor → `reviews`: baris baru, `is_published = true`.
5. Login → `/profil`: kartu pesanan menampilkan kotak **ULASAN ANDA** + tombol **Edit**. Klik Edit → ubah → simpan (baris yang sama ter-update, tidak jadi dua).
6. Beranda menampilkan ulasan paling lama **±5 menit** kemudian (cache).

## 7. Moderasi

Supabase → Table Editor → `reviews` → ubah `is_published` ke **FALSE** → ulasan hilang dari beranda (maks. 5 menit). Pelanggan tetap melihat ulasannya sendiri di `/profil`. Jika pelanggan mengedit, status `is_published` **tidak** diubah otomatis. Jika semua ulasan FALSE/kosong, section ulasan hilang dengan sendirinya.

## Penyesuaian terhadap kode yang sudah ada

- Halaman akun di repo ini adalah **`/profil`** (bukan `/akun`), daftarnya berjudul "Pesanan Saya", dan status lunas berlabel **"Terkonfirmasi"** (`status = 'success'`). Integrasi dipasang di sana.
- Beranda tidak punya section Peta, jadi `CustomerReviewsCard` diletakkan di akhir halaman, tepat sebelum Footer.
- Rental: acuan waktu adalah **tanggal akhir sewa** + jam ambil. Pesanan tanpa jam yang bisa dibaca dianggap 23:59 WIB di tanggalnya.
- Pesanan **tanpa email** tidak dikirimi email; pemesan login masih bisa mengulas dari `/profil`.
- Cron memindai pesanan yang dibuat ≤ 60 hari terakhir (maks. 500) dan mengirim maks. 40 email per eksekusi (batas kecepatan Resend). Sisanya dikirim pada eksekusi berikutnya selama masih ≤ 7 hari dari keberangkatan.
- Ulasan publik menampilkan "Nama Depan + inisial belakang" (mis. *Budi S.*), atau "Pelanggan Anonim" tanpa foto bila opsi Anonim dicentang.
