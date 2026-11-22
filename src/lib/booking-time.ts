/**
 * lib/booking-time.ts
 *
 * Helper waktu pemesanan (zona WIB, UTC+7, tanpa DST). Dipakai di form /pesan (client)
 * DAN validasi server (/api/admin/orders) agar aturan "jam yang sudah lewat tidak bisa
 * dipesan" konsisten.
 *
 * Murni (tanpa dependensi server) sehingga aman diimpor dari komponen client.
 */
const WIB_OFFSET_MS = 7 * 3_600_000;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Tanggal hari ini di WIB (YYYY-MM-DD) — bukan tanggal UTC. */
export function todayWib(now: number = Date.now()): string {
  return new Date(now + WIB_OFFSET_MS).toISOString().slice(0, 10);
}

/** Menit sejak 00:00 WIB. */
function minutesOfDayWib(now: number): number {
  const d = new Date(now + WIB_OFFSET_MS);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

/** Ambil jam pertama (HH:MM atau HH.MM) dari teks — pola sama dengan penjadwal tiket. */
export function extractTime(text?: string): { hh: number; mm: number } | null {
  const m = /(\d{1,2})[:.](\d{2})/.exec((text || '').trim());
  if (!m) return null;
  const hh = +m[1];
  const mm = +m[2];
  return hh > 23 || mm > 59 ? null : { hh, mm };
}

/**
 * true jika keberangkatan sudah lewat:
 *  - tanggal sebelum hari ini (WIB), atau
 *  - hari ini dan jam (bila ada) ≤ jam sekarang.
 * Tanpa jam (timeText kosong / tanpa pola jam) hanya tanggal yang dicek.
 */
export function isDeparturePast(date: string, timeText: string | undefined, now: number = Date.now()): boolean {
  if (!DATE_RE.test(date)) return false;
  const today = todayWib(now);
  if (date < today) return true;
  if (date > today) return false;
  const t = extractTime(timeText);
  return t ? t.hh * 60 + t.mm <= minutesOfDayWib(now) : false;
}
