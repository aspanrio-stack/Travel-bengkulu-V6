// Gambar Hiace untuk thumbnail hasil pencarian, OG, dan JSON-LD.
// File dibuat oleh scripts/gen-hiace-og.mjs (4 rasio: og 1200x630, 1x1, 4x3, 16x9).
const BASE = 'https://bengkulutravel.com/images/og';

export type HiaceKey = 'bandung-kapal' | 'bandung-malam' | 'padang-samping' | 'padang-depan';

const SET: Record<HiaceKey, { file: string; alt: string }> = {
  'bandung-kapal': { file: 'travel-hiace-bandung-kapal', alt: 'Toyota Hiace hitam armada travel Bengkulu Bandung di atas kapal penyeberangan' },
  'bandung-malam': { file: 'travel-hiace-bandung-malam', alt: 'Toyota Hiace putih armada travel Bengkulu Bandung saat penyeberangan malam' },
  'padang-samping': { file: 'travel-hiace-padang-samping', alt: 'Toyota Hiace silver armada travel Bengkulu Padang tampak samping' },
  'padang-depan': { file: 'travel-hiace-padang-depan', alt: 'Toyota Hiace silver armada travel Bengkulu Padang tampak depan' },
};

export type Rasio = 'og' | '1x1' | '4x3' | '16x9';
export const hiaceUrl = (k: HiaceKey, r: Rasio) => `${BASE}/${SET[k].file}-${r}.jpg`;
export const hiaceAlt = (k: HiaceKey) => SET[k].alt;

/** Untuk metadata openGraph.images (1200x630) */
export const hiaceOg = (k: HiaceKey) => ({ url: hiaceUrl(k, 'og'), width: 1200, height: 630, alt: SET[k].alt });

/** Untuk JSON-LD image: tiga rasio sesuai saran Google (1:1, 4:3, 16:9) */
export const hiaceSchema = (k: HiaceKey) => (['1x1', '4x3', '16x9'] as Rasio[]).map((r) => hiaceUrl(k, r));

/** Pilih foto dari data rute (BandungRoute) */
export function hiaceKeyFor(r: { heroSrc: string; imgDir?: string }): HiaceKey {
  if (r.imgDir?.includes('hiace-padang')) return r.heroSrc.includes('samping') ? 'padang-samping' : 'padang-depan';
  return r.heroSrc.includes('malam') ? 'bandung-malam' : 'bandung-kapal';
}

/** Blok metadata siap pakai: openGraph.images + twitter */
export function hiaceMeta(k: HiaceKey, title: string, description: string) {
  return {
    images: [hiaceOg(k)],
    twitter: { card: 'summary_large_image' as const, title, description, images: [hiaceUrl(k, 'og')] },
  };
}
