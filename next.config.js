/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 hari cache untuk gambar
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Cache header untuk performa lebih baik
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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

  async redirects() {
    return [

      // ================================================================
      // BAGIAN 1: URL EKSAK DARI GOOGLE SEARCH CONSOLE
      // ================================================================

      // Homepage & index.html
      { source: '/index.html', destination: '/', permanent: true },

      // [GSC-1] Landing page utama Blogger
      { source: '/p/bengkulutravelcom-layanan-travel-antar.html', destination: '/', permanent: true },

      // [GSC-2] Travel Bengkulu Jambi
      { source: '/2026/02/travel-bengkulu-jambi.html', destination: '/travel-bengkulu-jambi', permanent: true },

      // [GSC-3] Label Bengkulu Palembang
      { source: '/search/label/Bengkulu Palembang', destination: '/travel-bengkulu-palembang', permanent: true },
      { source: '/bengkulu-ke-palembang', destination: '/travel-bengkulu-palembang', permanent: true },
      { source: '/search/label/Bengkulu%20Palembang', destination: '/travel-bengkulu-palembang', permanent: true },

      // [GSC-4] Travel Bengkulu ke Curup
      { source: '/2026/02/travel-bengkulu-ke-curup-door-to-door.html', destination: '/travel-bengkulu-curup', permanent: true },

      // [GSC-5] Bengkulu ke Jambi berapa jam
      { source: '/2026/02/bengkulu-ke-jambi-berapa-jam.html', destination: '/jarak-jambi-bengkulu', permanent: true },

      // [GSC-6] Travel Bengkulu Palembang setiap hari
      { source: '/2026/02/travel-bengkulu-palembang-setiap-hari.html', destination: '/travel-bengkulu-palembang', permanent: true },

      // ================================================================
      // BAGIAN 2: URL BARU DARI "KESALAHAN PENGALIHAN" DI GSC
      // ================================================================

      // Rental mobil Curup (dari Blogger)
      { source: '/2026/02/rental-mobil-curup.html', destination: '/rental-mobil-curup', permanent: true },

      // Kirim paket — dua versi slug yang berbeda di Blogger
      { source: '/2026/02/kirim-paket-palembang-ke-bengkulu.html', destination: '/kirim-paket-bengkulu-palembang', permanent: true },
      { source: '/2026/02/kirim-paket-bengkulu-ke-palembang.html', destination: '/kirim-paket-bengkulu-palembang', permanent: true },

      // Transportasi/Travel Bengkulu ke Padang → Homepage (belum ada halaman Padang)
      { source: '/2026/02/transportasi-bengkulu-ke-padang.html', destination: '/', permanent: true },
      { source: '/2026/02/travel-bengkulu-padang.html', destination: '/', permanent: true },

      // Travel Palembang ke Bengkulu (variasi slug)
      { source: '/2026/02/travel-palembang-ke-bengkulu-door-to-door-tanpa-transit.html', destination: '/travel-palembang-bengkulu', permanent: true },

      // Travel Bengkulu ke Jambi (variasi slug)
      { source: '/2026/02/travel-bengkulu-ke-kota-jambi-door-to-door.html', destination: '/travel-bengkulu-jambi', permanent: true },

      // ================================================================
      // ================================================================
      // BAGIAN 2.5: REDIRECT RUTE BARU — variasi slug Lebong & Lampung
      // ================================================================

      // Lebong variasi
      { source: '/travel-bengkulu-ke-lebong', destination: '/travel-bengkulu-lebong', permanent: true },
      { source: '/travel-lebong-ke-bengkulu', destination: '/travel-lebong-bengkulu', permanent: true },

      // Lampung variasi
      { source: '/travel-bengkulu-ke-lampung', destination: '/travel-bengkulu-lampung', permanent: true },
      { source: '/travel-lampung-ke-bengkulu', destination: '/travel-lampung-bengkulu', permanent: true },

      // BAGIAN 2.5: REDIRECT URL DUPLIKAT (tanpa kata 'ke' → canonical)
      // ================================================================

      // Variasi tanpa 'ke' redirect ke URL canonical yang ada di sitemap
      { source: '/bengkulu-palembang-berapa-jam', destination: '/bengkulu-ke-palembang-berapa-jam', permanent: true },
      { source: '/bengkulu-jambi-berapa-jam', destination: '/bengkulu-ke-jambi-berapa-jam', permanent: true },

      // ================================================================
      // BAGIAN 3: POLA FALLBACK
      // ================================================================

      // Semua label/kategori & search Blogger → Homepage
      { source: '/search/label/:label*', destination: '/', permanent: true },
      { source: '/search/:path*', destination: '/', permanent: true },

      // Semua /p/ lainnya → Homepage
      { source: '/p/:slug.html', destination: '/', permanent: true },

      // Pola artikel berdasarkan kata kunci slug
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

      // Semua URL Blogger lain → Homepage
      { source: '/:y(\\d{4})/:m(\\d{2})/:slug.html', destination: '/', permanent: true },

    ];
  },
};

module.exports = nextConfig;
