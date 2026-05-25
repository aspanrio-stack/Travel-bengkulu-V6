import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/feeds/',
        '/*?m=1',
        '/*?alt=rss',
        '/site.webmanifest',
        '/search',
        // '/orang' → dihapus, sudah ditangani redirect 301
      ],
    },
    sitemap: 'https://bengkulutravel.com/sitemap.xml',
  };
}
