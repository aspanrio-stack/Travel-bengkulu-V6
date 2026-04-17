import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.bengkulutravel.com';
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1 },
    // Halaman layanan utama
    { url: `${baseUrl}/travel-bengkulu`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/travel-bengkulu-palembang`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/travel-palembang-bengkulu`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/travel-bengkulu-jambi`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/travel-jambi-bengkulu`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/travel-bengkulu-curup`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/rental-mobil-curup`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/antar-jemput-bandara-curup`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/kirim-paket-bengkulu-palembang`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    // Halaman "berapa jam" — keyword volume tinggi
    { url: `${baseUrl}/bengkulu-ke-palembang-berapa-jam`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/bengkulu-palembang-berapa-jam`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/bengkulu-ke-jambi-berapa-jam`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/bengkulu-jambi-berapa-jam`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/jambi-bengkulu-berapa-jam`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/jambi-bengkulu-berapa-jam-naik-mobil`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/bengkulu-ke-palembang`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    // Artikel
    { url: `${baseUrl}/jarak-jambi-bengkulu`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/tempat-wisata-bengkulu`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/wisata-pantai-panjang-bengkulu`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    // ── Artikel Hotel ────────────────────────────────────────────────
    { url: \`\${baseUrl}/hotel-di-curup\`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: \`\${baseUrl}/hotel-syariah-di-curup\`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: \`\${baseUrl}/hotel-di-lebong\`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: \`\${baseUrl}/hotel-syariah-di-lebong\`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
