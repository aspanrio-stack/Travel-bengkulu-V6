// Server-only: baca override tarif dari Redis (dipakai API publik & halaman server).
import { getRedis } from './orders';
import { toOverrides, type RateOverrides } from './rates';

export const RATES_REDIS_KEY = 'bengkulu:rates';

/** Selalu aman: bila Redis lambat/error → {} (harga default dari kode). Batas tunggu 2 detik. */
export async function getRateOverrides(): Promise<RateOverrides> {
  try {
    const raw = await Promise.race([
      getRedis().get(RATES_REDIS_KEY),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
    ]);
    return raw ? toOverrides(JSON.parse(raw)) : {};
  } catch {
    return {};
  }
}
