/** @type {import('next').NextConfig} */
const nextConfig = {
  // Solusi utama: Mematikan swcMinify jika error persist saat build
  swcMinify: true, 

  // Optimasi gambar
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    deviceSizes: [390, 640, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 128, 256],
  },

  // Compress response
  compress: true,

  // Cache header untuk gambar saja
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
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/p/bengkulutravelcom-layanan-travel-antar.html', destination: '/', permanent: true },
      { source: '/2026/02/travel-bengkulu-jambi.html', destination: '/travel-bengkulu-jambi', permanent: true },
      { source: '/search/label/Bengkulu Palembang', destination: '/travel-bengkulu-palembang', permanent: true },
      { source: '/search/label/Bengkulu%20Palembang', destination: '/travel-bengkulu-palembang', permanent: true },
      { source: '/bengkulu-ke-palembang', destination: '/travel-bengkulu-palembang', permanent: true },
      
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
      
      /* PERBAIKAN: Menggunakan wildcard catch-all (.*) di dalam kurung 
         untuk menggantikan :rest* agar tidak terjadi duplikasi nama parameter.
      */
      { source: '/:year(\\d{4})/:month(\\d{2})/travel-palembang-bengkulu(.*).html', destination: '/travel-palembang-bengkulu', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/travel-bengkulu-palembang(.*).html', destination: '/travel-bengkulu-palembang', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/travel-jambi-bengkulu(.*).html', destination: '/travel-jambi-bengkulu', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/travel-bengkulu-jambi(.*).html', destination: '/travel-bengkulu-jambi', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/travel-bengkulu-ke-kota-jambi(.*).html', destination: '/travel-bengkulu-jambi', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/bengkulu-ke-jambi(.*).html', destination: '/jarak-jambi-bengkulu', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/jarak-jambi(.*).html', destination: '/jarak-jambi-bengkulu', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/travel-bengkulu-ke-curup(.*).html', destination: '/travel-bengkulu-curup', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/travel-bengkulu-curup(.*).html', destination: '/travel-bengkulu-curup', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/rental-mobil(.*).html', destination: '/rental-mobil-curup', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/antar-jemput(.*).html', destination: '/antar-jemput-bandara-curup', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/kirim-paket(.*).html', destination: '/kirim-paket-bengkulu-palembang', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/tempat-wisata(.*).html', destination: '/tempat-wisata-bengkulu', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/wisata-pantai(.*).html', destination: '/wisata-pantai-panjang-bengkulu', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/pantai-panjang(.*).html', destination: '/wisata-pantai-panjang-bengkulu', permanent: true },
      { source: '/:year(\\d{4})/:month(\\d{2})/:slug.html', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
