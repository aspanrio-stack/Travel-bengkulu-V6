# Travel Bengkulu — bengkulutravel.com

Website resmi **Travel Bengkulu**: layanan travel antar-jemput door to door (Bengkulu, Curup, Lebong, Jambi, Palembang, Lampung, Padang, Bandung), rental mobil, dan kirim paket — lengkap dengan **sistem pemesanan, e-ticketing ber-QR, dashboard admin, dan sistem ulasan**.

Dikembangkan oleh Rio Mardiansyah.

## Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router, `src/proxy.ts` sebagai pengganti middleware), React 18, TypeScript |
| Styling | Tailwind CSS 3 (font: Playfair Display + Plus Jakarta Sans via `next/font`) |
| Data pesanan | Redis (`ioredis`) |
| Auth pelanggan, ulasan, tiket | Supabase (Auth Google & email, Postgres + RLS) |
| Auth admin | JWT (`jose`) di cookie httpOnly `admin_session` |
| Email | Resend |
| WhatsApp | Fonnte |
| PDF & QR | `pdf-lib`, `qrcode` |
| Peta | Leaflet / react-leaflet |
| Hosting | Vercel (termasuk Cron Jobs) |

---

## Fitur Utama

### 1. Pemesanan Travel (`/pesan`)
- Form satu halaman (`BookingForm.tsx`): Dari & Tujuan, jam keberangkatan, tanggal, jumlah penumpang, alamat jemput/antar (opsional GPS), nama, HP, email.
- Tarif dan jadwal bersumber dari `src/lib/routes.ts` (`ROUTES`). Satu rute bisa punya beberapa jam berangkat, armada berbeda per jam (`timeInfo`, mis. Hiace vs mobil random dengan tarif lebih murah), dan hari berangkat tetap (`departureDays`).
- Tamu tetap bisa memesan tanpa login. Set `NEXT_PUBLIC_REQUIRE_LOGIN_TO_BOOK=true` untuk mewajibkan login.
- Metode bayar: **tunai** (default, bayar ke driver saat dijemput) dan **QRIS**. Tombol QRIS saat ini dimatikan lewat konstanta `QRIS_ENABLED = false` di `BookingForm.tsx` (QRIS dinamis dibuat dari QRIS statis oleh `lib/qrisGenerator.ts`, env `NEXT_PUBLIC_QRIS_STATIC`).
- Tombol **Konfirmasi Pesanan** menyimpan pesanan ke Redis lalu mengirim notifikasi WhatsApp.

### 2. Alur Pesanan & Status

```
Pelanggan isi form  →  POST /api/admin/orders
                         ├─ simpan order:{id} di Redis (status: pending)
                         ├─ WA ke pemesan (konfirmasi diterima)  ┐ via Fonnte
                         └─ WA ke admin (pesanan baru)           ┘
Admin klik Konfirmasi di dashboard  →  POST /api/admin/confirm
                         ├─ status → success
                         ├─ terbitkan tiket (Supabase) + buat PDF ber-QR
                         ├─ email tiket PDF ke pelanggan + email notifikasi ke admin (Resend)
                         └─ WA konfirmasi ke pemesan
```

- ID pesanan: 8 hex acak + 4 digit waktu (mis. `A1B2C3D41234`).
- Status: `pending` → `success` | `cancelled`.
- **Auto-konfirmasi tunai** (`lib/auto-confirm.ts`): pesanan tunai `pending` otomatis menjadi `success` **2 jam setelah jadwal keberangkatan (WIB)**, dianggap sudah berangkat dan lunas. Hanya mengubah status (tanpa kirim tiket/WA). QRIS tetap harus diverifikasi admin. Dijalankan saat daftar pesanan admin dimuat.

### 3. E-Ticketing (tiket PDF + QR verifikasi)
- Tiket PDF dibuat oleh `lib/ticket-pdf.ts` (logo perusahaan + QR di kotak "Validasi Keaslian"), dipakai oleh `/api/admin/confirm` (kirim email) dan `/api/admin/print-ticket` (unduh manual oleh admin).
- Setiap pesanan punya **1 tiket / 1 token** (192-bit acak, tabel Supabase `tickets`, `order_id` UNIQUE). Cetak ulang atau kirim ulang memakai token yang sama, sehingga QR pada PDF lama tetap valid.
- QR mengarah ke `https://bengkulutravel.com/verify?token=...`.
- Halaman **`/verify`**: publik, tanpa login, **read-only** (tidak mengubah data apa pun, tidak ada status "terpakai", boleh di-scan berkali-kali oleh penumpang atau untuk audit). Menampilkan nama penumpang, rute, tanggal, kursi, harga, dan status VALID. `noindex`, dibatasi 30 permintaan/menit per IP.
- **Retensi 3 bulan (90 hari)**: baris `tickets` dihapus otomatis oleh cron `/api/cron/purge-expired-tickets`; cache Redis (`ticket:{token}`, 5 menit) kedaluwarsa via TTL. Informasi retensi dicetak di tiket.
- Tabel `tickets` memakai RLS tanpa policy: hanya server (service role) yang bisa membaca/menulis.

### 4. Rental Mobil
- Form `RentalForm.tsx` → `POST /api/rental` (WA ke pemesan dan admin). Pesanan rental disimpan sebagai order biasa (`routeId: 'rental'`), jadi muncul di tab Pesanan dan dikonfirmasi lewat alur yang sama dengan travel.
- Jenis: dengan sopir atau lepas kunci, area dalam/luar kota, armada Avanza / Innova / Hiace. Harga di `lib/rental-config.ts`.

### 5. Dashboard Admin (`/admin`)
Login di `/admin/login` (`ADMIN_USERNAME` default `admin`, `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET`). Seluruh `/admin/*` dan `/api/admin/*` dilindungi `src/proxy.ts` + `getSession()`.

| Tab | Fungsi |
|---|---|
| **Pesanan** | Statistik (total, menunggu, terkonfirmasi, pendapatan, QRIS vs tunai, klik WA), daftar pesanan travel & rental, tombol Konfirmasi, cetak/unduh tiket PDF |
| **Kwitansi** | Buat kwitansi PDF manual (perusahaan `bengkulutravel` / `kgtransport`) dan kirim lewat email |
| **Tarif** | Kelola tarif rute & rental (`lib/rates.ts`, disimpan di Redis key `bengkulu:rates`). Catatan: form pemesanan publik masih membaca harga statis dari `routes.ts` / `rental-config.ts` |

### 6. Akun Pelanggan
- Login/daftar Google & email lewat Supabase Auth (`/masuk`, `/auth/callback`).
- **`/profil`** (dilindungi `proxy.ts`): riwayat "Pesanan Saya", tombol Beri Ulasan/Edit, alamat tersimpan (tabel `saved_addresses`). Foto profil Google tampil di pill akun beranda dan tab Profil bottom nav.

### 7. Sistem Ulasan
- Tabel Supabase `reviews` (`supabase/reviews.sql`), 1 pesanan = 1 ulasan, moderasi lewat kolom `is_published`.
- Cron harian `/api/cron/send-review-requests` mengirim email permintaan ulasan (Resend) untuk pesanan `success` yang punya email, ≥ 12 jam setelah keberangkatan dan maksimal 7 hari. Anti-duplikasi berlapis (lock Redis + flag `reviewEmailSent`).
- Halaman `/review` (`noindex`): lewat token email tanpa login, bisa diedit. Dari `/profil`, tombol muncul 8 jam setelah keberangkatan.
- Beranda menampilkan 6 ulasan terbaru (`CustomerReviewsCard`, cache 5 menit; hilang jika kosong).
- Panduan pemasangan lengkap: [`docs/ULASAN-SETUP.md`](docs/ULASAN-SETUP.md).

### 8. Navigasi Mobile-First
`BottomNav.tsx` (HP): Jelajah, Pesan, Beranda (tengah, logo), Profil, dan **Chat WhatsApp** (pesan otomatis menyesuaikan halaman yang dibuka, lihat `lib/whatsapp.ts`). Navbar atas hanya tampil di desktop. Navbar dan Footer disembunyikan di `/credits` dan `/masuk`; bottom nav disembunyikan di `/admin`, `/credits`, dan `/masuk`.

### 9. Konten SEO
- Halaman rute per kota asal (satu halaman per asal agar tidak kanibal), dikelompokkan dalam silo: **Bandung** (`lib/bandung-routes.ts`, `bandung-silo.ts`, `BandungRoutePage.tsx`) dan **Padang** (`lib/padang-silo.ts`), plus artikel jadwal, ongkos, dan "berapa jam".
- Halaman hotel, kuliner, destinasi wisata (`lib/destinations.ts`, `/destinasi`).
- Metadata & OG image (`public/og-image.png`), `sitemap.ts` (termasuk image sitemap untuk halaman Hiace), `robots.ts`, JSON-LD (BreadcrumbList), thumbnail Hiace via `scripts/gen-hiace-og.mjs`.

---

## Struktur Project

```
Travel-bengkulu-V6/
├── src/
│   ├── proxy.ts                      # Proteksi /admin & /profil + redirect 301 sisa URL Blogger
│   ├── app/
│   │   ├── layout.tsx, page.tsx, globals.css
│   │   ├── sitemap.ts, robots.ts, not-found.tsx
│   │   ├── pesan/  pembayaran/       # Pemesanan & pembayaran
│   │   ├── verify/                   # Verifikasi keaslian tiket (publik, read-only)
│   │   ├── review/                   # Form ulasan via token email
│   │   ├── masuk/  auth/callback/    # Login Supabase
│   │   ├── profil/                   # Pesanan Saya, ulasan, alamat tersimpan
│   │   ├── admin/                    # Dashboard (Pesanan, Kwitansi, Tarif) + login
│   │   ├── destinasi/                # Jelajah destinasi & hotel
│   │   ├── travel-*/                 # Halaman rute (Bengkulu, Curup, Jambi, Palembang, Padang, Bandung, Lampung, Lebong, bandara)
│   │   ├── ongkos-* jadwal-* *-berapa-jam/  # Artikel silo SEO
│   │   ├── hotel-* makanan-khas-* tempat-wisata-*  # Konten hotel, kuliner, wisata
│   │   ├── rental-mobil-curup/ antar-jemput-bandara-curup/ kirim-paket-*/
│   │   ├── kebijakan-privasi/ syarat-ketentuan/ credits/
│   │   └── api/
│   │       ├── admin/                # orders, confirm, confirm-rental, rentals, print-ticket,
│   │       │                         # send-invoice, kwitansi, rates, reset, login, logout
│   │       ├── cron/                 # send-review-requests, purge-expired-tickets
│   │       ├── rental/ reviews/ send-ticket/ send-invoice/ track/
│   ├── components/                   # BookingForm, RentalForm, BottomNav, Navbar, Footer, FleetGallery,
│   │                                 # ETicketSection, CustomerReviewsCard, ReviewForm, AuthForm, dll.
│   └── lib/
│       ├── routes.ts                 # Rute, tarif, jadwal (sumber utama)
│       ├── orders.ts                 # Model & akses data pesanan (Redis)
│       ├── tickets.ts, ticket-pdf.ts, ticket-assets.ts   # E-ticket
│       ├── auto-confirm.ts           # Auto-konfirmasi tunai
│       ├── reviews.ts                # Logika ulasan, token, rate limit
│       ├── fonnte.ts, whatsapp.ts    # WhatsApp
│       ├── auth.ts                   # Auth admin (JWT)
│       ├── supabase/                 # client, server, admin (service role)
│       ├── qrisGenerator.ts, rates.ts, rental-config.ts
│       └── bandung-*.ts, padang-silo.ts, destinations.ts, hiace-images.ts, nav-links.ts
├── supabase/                         # schema.sql (alamat), reviews.sql, tickets.sql
├── docs/ULASAN-SETUP.md
├── scripts/gen-hiace-og.mjs
├── public/images/                    # Foto hero, armada Hiace, destinasi, hotel, kuliner
├── next.config.js                    # Redirect 301 Blogger, cache header gambar
├── vercel.json                       # Redirect www → non-www + cron
└── .env.example
```

---

## Environment Variables

Salin `.env.example` menjadi `.env.local` untuk development. Untuk produksi, isi di **Vercel → Settings → Environment Variables**, lalu redeploy.

| Variable | Fungsi |
|---|---|
| `REDIS_URL` | Penyimpanan pesanan |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Auth & baca publik |
| `SUPABASE_SERVICE_ROLE_KEY` | **Rahasia.** Tulis ulasan & tiket dari server |
| `ADMIN_USERNAME` (opsional, default `admin`), `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET` | Login dashboard admin |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_ADMIN` | Email tiket, invoice, ulasan |
| `FONNTE_TOKEN` | Notifikasi WhatsApp |
| `CRON_SECRET` | Otorisasi cron Vercel (`Authorization: Bearer ...`) |
| `NEXT_PUBLIC_SITE_URL` | Dasar URL di email & QR (default `https://bengkulutravel.com`) |
| `NEXT_PUBLIC_REQUIRE_LOGIN_TO_BOOK` | `true` = wajib login sebelum memesan |
| `NEXT_PUBLIC_QRIS_STATIC` | String QRIS statis untuk QRIS dinamis |

---

## Setup & Deploy

### Development lokal

```bash
npm install
cp .env.example .env.local   # lalu isi nilainya
npm run dev                  # http://localhost:3000
```

Skrip lain: `npm run build`, `npm start`, `npm run lint`.

### Database Supabase
Jalankan di **Supabase → SQL Editor** (aman diulang):
1. `supabase/schema.sql` — alamat tersimpan
2. `supabase/reviews.sql` — ulasan
3. `supabase/tickets.sql` — tiket & verifikasi QR

### Deploy ke Vercel
1. Import repo di https://vercel.com/new, framework Next.js terdeteksi otomatis.
2. Isi environment variables di atas, lalu deploy.
3. Domain: Project → Settings → Domains → tambahkan `bengkulutravel.com`, atur DNS (`A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`). `vercel.json` mengalihkan `www` ke non-www (301).

### Cron Jobs (`vercel.json`, hanya di Production)

| Path | Jadwal (UTC) | Fungsi |
|---|---|---|
| `/api/cron/send-review-requests` | `0 1 * * *` (08:00 WIB) | Email permintaan ulasan |
| `/api/cron/purge-expired-tickets` | `0 2 * * *` (09:00 WIB) | Hapus tiket > 3 bulan |

Tes manual: `curl -H "Authorization: Bearer $CRON_SECRET" https://bengkulutravel.com/api/cron/purge-expired-tickets`

---

## Redirect dari Blogger

Situs ini sebelumnya di Blogger. URL lama dialihkan dengan 301 lewat dua tempat:
- `next.config.js` → pemetaan URL `.html` lama ke halaman baru.
- `src/proxy.ts` → pola Blogger (`?m=1`, `/feeds/`, `sitemap.html`, `search/label`).

`robots.ts` **sengaja tidak memblokir** pola Blogger lama supaya Google bisa melihat redirect-nya. Halaman privat (`/admin`, `/api`, `/profil`, `/masuk`, `/auth`) di-disallow di robots, dan `/pesan`, `/pembayaran`, `/credits`, `/verify`, `/review` bersifat `noindex`.

## Setelah Deploy — Google Search Console
1. Submit `https://bengkulutravel.com/sitemap.xml`.
2. Gunakan **URL Inspection → Request Indexing** untuk halaman baru.
3. Pantau laporan Pengindeksan Halaman (pengalihan, noindex, kanonis) dan validasi perbaikan.

## Catatan Pengembangan
- Endpoint admin `send-invoice`, `reset`, `confirm-rental`, `rentals` dan endpoint `send-ticket`, `send-invoice` (publik) sudah tersedia di `src/app/api`, tetapi belum dipanggil dari UI dashboard saat ini.
- Dependensi `midtrans-client` masih terdaftar di `package.json` namun tidak dipakai di kode.
- Alur kerja: buat branch fitur/perbaikan → buka PR → cek Preview Vercel → merge ke `main`.
- Menambah rute: tambahkan ke `src/lib/routes.ts`, buat/ubah halaman konten, daftarkan di `sitemap.ts` dan `nav-links.ts` bila perlu.
- Perubahan tarif harus konsisten di `routes.ts` dan seluruh halaman konten yang menyebut harga.
- Skrip `scripts/gen-hiace-og.mjs` membutuhkan `sharp` (`npm i --no-save sharp`).
