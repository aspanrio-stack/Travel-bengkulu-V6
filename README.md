# Travel Bengkulu – Website Next.js

Website resmi Travel Bengkulu (bengkulutravel.com) dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS.

## 🚀 Cara Deploy ke GitHub + Vercel

### 1. Setup GitHub Repository

```bash
# Di terminal/command prompt
cd bengkulutravel
git init
git add .
git commit -m "Initial commit: Travel Bengkulu website"
git branch -M main

# Buat repository baru di GitHub bernama "bengkulutravel"
# Lalu jalankan:
git remote add origin https://github.com/USERNAME/bengkulutravel.git
git push -u origin main
```

### 2. Deploy ke Vercel

1. Buka https://vercel.com dan login dengan akun GitHub
2. Klik **"New Project"**
3. Import repository `bengkulutravel` dari GitHub
4. Klik **"Deploy"** – Vercel otomatis detect Next.js
5. Tunggu deployment selesai (1-2 menit)

### 3. Custom Domain (bengkulutravel.com)

Di Vercel Dashboard:
1. Buka project → Settings → Domains
2. Tambahkan domain: `bengkulutravel.com`
3. Ikuti instruksi untuk mengubah DNS di registrar domain Anda:
   - **A Record**: `@` → `76.76.21.21`
   - **CNAME**: `www` → `cname.vercel-dns.com`

---

## 📁 Struktur Project

```
bengkulutravel/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + SEO
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Global styles
│   │   ├── sitemap.ts          # Sitemap otomatis
│   │   ├── robots.ts           # robots.txt
│   │   ├── not-found.tsx       # Halaman 404
│   │   ├── travel-bengkulu-palembang/page.tsx
│   │   ├── travel-palembang-bengkulu/page.tsx
│   │   ├── travel-bengkulu-jambi/page.tsx
│   │   ├── travel-jambi-bengkulu/page.tsx
│   │   ├── travel-bengkulu-curup/page.tsx
│   │   ├── rental-mobil-curup/page.tsx
│   │   ├── antar-jemput-bandara-curup/page.tsx
│   │   ├── kirim-paket-bengkulu-palembang/page.tsx
│   │   ├── tempat-wisata-bengkulu/page.tsx
│   │   ├── jarak-jambi-bengkulu/page.tsx
│   │   └── wisata-pantai-panjang-bengkulu/page.tsx
│   └── components/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── WhatsAppFloat.tsx
│       ├── ServiceCard.tsx
│       └── ArticleLayout.tsx
├── next.config.js              # Redirect 301 dari URL Blogger
├── tailwind.config.js
└── package.json
```

---

## 🔗 Redirect 301 dari Blogger

File `next.config.js` sudah berisi redirect dari URL Blogger lama ke URL baru.

### ⚠️ PENTING: Update URL Blogger

Buka `next.config.js` dan sesuaikan pola URL dengan URL asli dari Blogger Anda.

Format URL Blogger biasanya:
```
bengkulutravel.com/2023/01/travel-bengkulu-palembang.html
```

Atau bisa juga:
```
bengkulutravel.com/p/travel-bengkulu-palembang.html
```

**Cara cek URL lama Blogger:**
1. Buka Google Search Console
2. Cek halaman yang di-index dengan format `.html`
3. Salin format URL tersebut ke `next.config.js`

Redirect sudah dibuat untuk pola `/tahun/bulan/slug.html` dan `/slug.html`. 
Jika format Blogger Anda berbeda (misalnya `/p/slug.html`), tambahkan:

```js
{
  source: '/p/travel-bengkulu-palembang.html',
  destination: '/travel-bengkulu-palembang',
  permanent: true,
},
```

---

## 🔍 Daftar URL Baru (SEO-Friendly)

| Konten | URL Baru |
|--------|----------|
| Travel Bengkulu Palembang | `/travel-bengkulu-palembang` |
| Travel Palembang Bengkulu | `/travel-palembang-bengkulu` |
| Travel Bengkulu Jambi | `/travel-bengkulu-jambi` |
| Travel Jambi Bengkulu | `/travel-jambi-bengkulu` |
| Travel Bengkulu Curup | `/travel-bengkulu-curup` |
| Rental Mobil Curup | `/rental-mobil-curup` |
| Antar Jemput Bandara Curup | `/antar-jemput-bandara-curup` |
| Kirim Paket Bengkulu Palembang | `/kirim-paket-bengkulu-palembang` |
| Tempat Wisata Bengkulu | `/tempat-wisata-bengkulu` |
| Jarak Jambi Bengkulu | `/jarak-jambi-bengkulu` |
| Wisata Pantai Panjang Bengkulu | `/wisata-pantai-panjang-bengkulu` |

---

## 📊 Setelah Deploy – Langkah di Google Search Console

1. **Submit Sitemap Baru**: 
   - Buka GSC → Sitemaps → Tambahkan `https://bengkulutravel.com/sitemap.xml`
   
2. **Request Indexing**:
   - Untuk setiap URL baru, gunakan fitur "URL Inspection" → "Request Indexing"
   
3. **Monitor Redirect**:
   - Gunakan tool seperti https://www.redirect-checker.org/ untuk verifikasi redirect 301 berjalan

---

## 🛠️ Development Lokal

```bash
npm install
npm run dev
# Buka http://localhost:3000
```
