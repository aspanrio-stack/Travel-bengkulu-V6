/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    deviceSizes: [390, 640, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 128, 256],
  },

  compress: true,

  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // ── Redirect spesifik dari Blogger lama ──
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/p/bengkulutravelcom-layanan-travel-antar.html', destination: '/', permanent: true },
      { source: '/2026/02/travel-bengkulu-jambi.html', destination: '/travel-bengkulu-jambi', permanent: true },
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

      // ── Redirect label & search Blogger (wildcard) ──
      { source: '/search/label/:label*', destination: '/', permanent: true },
      { source: '/search/:path*', destination: '/', permanent: true },
      { source: '/p/:slug', destination: '/', permanent: true },

      // ── Redirect semua URL Blogger format tahun/bulan/slug.html ──
      // Gunakan wildcard :path* yang valid di Next.js (tanpa regex repeat)
      { source: '/:year(\\d{4})/:month(\\d{2})/:slug', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
