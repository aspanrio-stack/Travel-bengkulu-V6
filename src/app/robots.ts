import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Pola URL Blogger lama (/feeds/, ?m=1, ?alt=rss, /search) SENGAJA tidak diblokir:
      // semuanya sudah di-301 (next.config.js + src/proxy.ts). Jika diblokir, Google tidak
      // bisa melihat redirect-nya sehingga URL lama tetap "diindeks meski diblokir robots.txt".
      disallow: [
        '/site.webmanifest',
        '/masuk',
        '/profil',
        '/auth/',
        '/admin/',
        '/api/',
      ],
    },
    sitemap: 'https://bengkulutravel.com/sitemap.xml',
  };
}
