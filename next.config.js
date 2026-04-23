/** @type {import('next').NextConfig} */
const nextConfig = {

  // ─────────────────────────────────────────────
  // 1. Target browser modern — kurangi polyfill
  // Fix: "JavaScript Versi Lama" di PageSpeed
  // ─────────────────────────────────────────────
  experimental: {
    browsersListForSwc: true,
  },

  // ─────────────────────────────────────────────
  // 2. Optimasi gambar — prioritaskan AVIF
  // ─────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000, // 30 hari cache
    deviceSizes: [390, 640, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 128, 256],
  },

  // ─────────────────────────────────────────────
  // 3. Header cache untuk aset statis
  // Kurangi request berulang ke server
  // ─────────────────────────────────────────────
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
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ─────────────────────────────────────────────
  // 4. Compress response
  // ─────────────────────────────────────────────
  compress: true,

  // ─────────────────────────────────────────────
  // 5. Redirects dari Blogger lama
  // ─────────────────────────────────────────────
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/p/bengkulutravelcom-layanan-travel-antar.html', destination: '/', permanent: true },
      { source: '/2026/02/travel-bengkulu-jambi.html', destination: '/travel-bengkulu-jambi', permanent: true },
      { source: '/search/label/Bengkulu Palembang', destination: '/travel-bengkulu-palembang', permanent: true },
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
      { source: '/search/label/:label*', destination: '/', permanent: true },
      { source: '/search/:path*', destination: '/', permanent: true },
      { source: '/p/:slug.html', destination: '/', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-palembang-bengkulu:r*.html', destination: '/travel-palembang-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-bengkulu-palembang:r*.html', destination: '/travel-bengkulu-palembang', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-jambi-bengkulu:r*.html', destination: '/travel-jambi-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-bengkulu-jambi:r*.html', destination: '/travel-bengkulu-jambi', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-bengkulu-ke-kota-jambi:r*.html', destination: '/travel-bengkulu-jambi', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/bengkulu-ke-jambi:r*.html', destination: '/jarak-jambi-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/jarak-jambi:r*.html', destination: '/jarak-jambi-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-bengkulu-ke-curup:r*.html', destination: '/travel-bengkulu-curup', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/travel-bengkulu-curup:r*.html', destination: '/travel-bengkulu-curup', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/rental-mobil:r*.html', destination: '/rental-mobil-curup', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/antar-jemput:r*.html', destination: '/antar-jemput-bandara-curup', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/kirim-paket:r*.html', destination: '/kirim-paket-bengkulu-palembang', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/tempat-wisata:r*.html', destination: '/tempat-wisata-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/wisata-pantai:r*.html', destination: '/wisata-pantai-panjang-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/pantai-panjang:r*.html', destination: '/wisata-pantai-panjang-bengkulu', permanent: true },
      { source: '/:y(\\d{4})/:m(\\d{2})/:slug.html', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
