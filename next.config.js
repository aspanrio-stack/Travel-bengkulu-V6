/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: '/:path*', // ✅ AMAN (tanpa regex aneh)
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
