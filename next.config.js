/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Matikan header X-Powered-By agar response size lebih hemat sedikit
  poweredByHeader: false,
  
  // 2. Aktifkan optimasi kompresi (sudah Anda lakukan, bagus!)
  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    deviceSizes: [390, 640, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 128, 256],
  },

  // 3. Tambahkan optimasi untuk import library (opsional jika pakai UI library seperti Lucide atau MUI)
  experimental: {
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
  },

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
      // ... (Redirect Anda sudah sangat rapi, tidak perlu diubah isinya)
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/p/bengkulutravelcom-layanan-travel-antar.html', destination: '/', permanent: true },
      { source: '/2026/02/travel-bengkulu-jambi.html', destination: '/travel-bengkulu-jambi', permanent: true },
      { source: '/2026/02/travel-bengkulu-ke-curup-door-to-door.html', destination: '/travel-bengkulu-curup', permanent: true },
      { source: '/2026/02/bengkulu-ke-jambi-berapa-jam.html', destination: '/jarak-jambi-bengkulu', permanent: true },
      { source: '/2026/02/travel-bengkulu-palembang-setiap-hari.html', destination: '/travel-bengkulu-palembang', permanent: true },
      { source: '/bengkulu-ke-palembang', destination: '/travel-bengkulu-palembang', permanent: true },
      { source: '/2026/02/rental-mobil-curup.html', destination: '/rental-mobil-curup', permanent: true },
      { source: '/2026/02/kirim-paket-palembang-ke-bengkulu.html', destination: '/kirim-paket-bengkulu-palembang', permanent: true },
      { source: '/2026/02/kirim-paket-bengkulu-ke-palembang.html', destination: '/kirim-paket-bengkulu-palembang', permanent: true },
      { source: '/2026/02/transportasi-bengkulu-ke-padang.html', destination: '/', permanent: true },
      { source: '/2026/02/travel-bengkulu-padang.html', destination: '/', permanent: true },
      { source: '/2026/02/travel-palembang-ke-bengkulu-door-to-door-tanpa-transit.html', destination: '/travel-palembang-bengkulu', permanent: true },
      { source: '/2026/02/travel-bengkulu-ke-kota-jambi-door-to-door.html', destination: '/travel-bengkulu-jambi', permanent: true },
      { source: '/search/label/:label*', destination: '/', permanent: true },
      { source: '/search/:path*', destination: '/', permanent: true },
      { source: '/p/:slug', destination: '/', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/:slug', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
