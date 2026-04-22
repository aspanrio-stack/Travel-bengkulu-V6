/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  async redirects() {
    return [
      // 1. URL EKSAK
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/p/bengkulutravelcom-layanan-travel-antar.html', destination: '/', permanent: true },
      { source: '/2026/02/travel-bengkulu-jambi.html', destination: '/travel-bengkulu-jambi', permanent: true },
      { source: '/search/label/Bengkulu%20Palembang', destination: '/travel-bengkulu-palembang', permanent: true },
      { source: '/2026/02/travel-bengkulu-ke-curup-door-to-door.html', destination: '/travel-bengkulu-curup', permanent: true },
      { source: '/2026/02/bengkulu-ke-jambi-berapa-jam.html', destination: '/jarak-jambi-bengkulu', permanent: true },
      { source: '/2026/02/travel-bengkulu-palembang-setiap-hari.html', destination: '/travel-bengkulu-palembang', permanent: true },
      { source: '/2026/02/rental-mobil-curup.html', destination: '/rental-mobil-curup', permanent: true },
      { source: '/2026/02/kirim-paket-palembang-ke-bengkulu.html', destination: '/kirim-paket-bengkulu-palembang', permanent: true },
      { source: '/2026/02/kirim-paket-bengkulu-ke-palembang.html', destination: '/kirim-paket-bengkulu-palembang', permanent: true },
      { source: '/2026/02/transportasi-bengkulu-ke-padang.html', destination: '/', permanent: true },
      { source: '/2026/02/travel-bengkulu-padang.html', destination: '/', permanent: true },
      { source: '/2026/02/travel-palembang-ke-bengkulu-door-to-door-tanpa-transit.html', destination: '/travel-palembang-bengkulu', permanent: true },
      { source: '/2026/02/travel-bengkulu-ke-kota-jambi-door-to-door.html', destination: '/travel-bengkulu-jambi', permanent: true },

      // 2. SEARCH & LABEL
      { source: '/search/label/:label*', destination: '/', permanent: true },
      { source: '/search/:path*', destination: '/', permanent: true },
      { source: '/p/:slug.html', destination: '/', permanent: true },

      // 3. POLA DINAMIS (MENGGUNAKAN SUFFIX UNTUK MENGGANTIKAN R*)
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-palembang-bengkulu:suffix*.html', destination: '/travel-palembang-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-bengkulu-palembang:suffix*.html', destination: '/travel-bengkulu-palembang', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-jambi-bengkulu:suffix*.html', destination: '/travel-jambi-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-bengkulu-jambi:suffix*.html', destination: '/travel-bengkulu-jambi', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-bengkulu-ke-kota-jambi:suffix*.html', destination: '/travel-bengkulu-jambi', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/bengkulu-ke-jambi:suffix*.html', destination: '/jarak-jambi-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/jarak-jambi:suffix*.html', destination: '/jarak-jambi-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-bengkulu-ke-curup:suffix*.html', destination: '/travel-bengkulu-curup', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-bengkulu-curup:suffix*.html', destination: '/travel-bengkulu-curup', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/rental-mobil:suffix*.html', destination: '/rental-mobil-curup', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/antar-jemput:suffix*.html', destination: '/antar-jemput-bandara-curup', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/kirim-paket:suffix*.html', destination: '/kirim-paket-bengkulu-palembang', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/tempat-wisata:suffix*.html', destination: '/tempat-wisata-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/wisata-pantai:suffix*.html', destination: '/wisata-pantai-panjang-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/pantai-panjang:suffix*.html', destination: '/wisata-pantai-panjang-bengkulu', permanent: true },

      // 4. CATCH-ALL BLOGGER
      { source: '/:y(\\d{4})/:m(\\d{2})/:slug.html', destination: '/', permanent: true }
    ];
  }
};

module.exports = nextConfig;
