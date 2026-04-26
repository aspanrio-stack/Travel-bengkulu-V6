import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Tambahkan disallow di bawah ini untuk memblokir URL penyebab error di GSC
      disallow: [
        '/feeds/',      // Memblokir folder feed
        '/*?m=1',       // Memblokir parameter feed/mobile sisa sistem lama
        '/*?alt=rss',   // Memblokir parameter RSS
      ],
    },
    sitemap: 'https://bengkulutravel.com/sitemap.xml',
  };
}
