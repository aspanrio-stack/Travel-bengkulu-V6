import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bengkulutravel.com';
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/travel-bengkulu-palembang`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/travel-palembang-bengkulu`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/travel-bengkulu-jambi`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/travel-jambi-bengkulu`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/travel-bengkulu-curup`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/rental-mobil-curup`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/antar-jemput-bandara-curup`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/kirim-paket-bengkulu-palembang`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    // Halaman baru — optimasi kata kunci "berapa jam"
    { url: `${baseUrl}/bengkulu-ke-palembang-berapa-jam`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/bengkulu-ke-palembang`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    // Artikel
    { url: `${baseUrl}/tempat-wisata-bengkulu`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/jarak-jambi-bengkulu`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/wisata-pantai-panjang-bengkulu`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
