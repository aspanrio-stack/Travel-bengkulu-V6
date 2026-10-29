/**
 * lib/tickets.ts
 * Tiket ber-QR untuk verifikasi keaslian (server-side). Verifikasi READ-ONLY: tidak ada status
 * 'terpakai' — tiket bisa di-scan berkali-kali oleh penumpang maupun pihak audit.
 *
 *   Supabase : tabel `tickets` (supabase/tickets.sql) — sumber kebenaran token & status
 *   Redis    : cache baca 5 menit (`ticket:{token}`) — hanya mempercepat, bukan sumber data
 *
 * Retensi: data tiket dihapus 90 hari (3 bulan) setelah terbit — baris Supabase oleh cron
 * /api/cron/purge-expired-tickets, kunci Redis lewat TTL.
 */
import { randomBytes } from 'crypto';
import { getRedis, type Order } from './orders';
import { getSupabaseAdmin } from './supabase/admin';

export const TICKET_RETENTION_DAYS = 90;
const DAY_MS = 86_400_000;
const CACHE_TTL_SEC = 300;
const TOKEN_RE = /^[A-Za-z0-9_-]{20,64}$/;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bengkulutravel.com').replace(/\/$/, '');

export interface TicketRecord {
  order_id: string;
  unique_token: string;
  passenger_name: string;
  route: string;
  travel_date: string;
  departure_time: string | null;
  passengers: number;
  total_price: number;
  created_at: string;
  expires_at: string;
}

const COLUMNS =
  'order_id, unique_token, passenger_name, route, travel_date, departure_time, passengers, total_price, created_at, expires_at';

export const buildVerifyUrl = (token: string) => `${SITE_URL}/verify?token=${encodeURIComponent(token)}`;
export const isValidTokenFormat = (t: unknown): t is string => typeof t === 'string' && TOKEN_RE.test(t);

async function cacheTicket(t: TicketRecord): Promise<void> {
  try {
    await getRedis().set(`ticket:${t.unique_token}`, JSON.stringify(t), 'EX', CACHE_TTL_SEC);
  } catch { /* cache gagal ≠ gagal fungsi */ }
}

// ─────────────────────────────────────────────
// Terbitkan tiket (idempoten per pesanan)
// ─────────────────────────────────────────────
export interface IssuedTicket {
  token: string;
  verifyUrl: string;
  expiresAt: Date;
}

/**
 * Buat (atau ambil yang sudah ada) tiket untuk satu pesanan. Cetak ulang / kirim ulang
 * memakai token yang sama, jadi QR di PDF lama tetap valid.
 * Mengembalikan null jika Supabase belum dikonfigurasi / error → PDF tetap bisa dibuat tanpa QR.
 */
export async function issueTicket(order: Order): Promise<IssuedTicket | null> {
  const sb = getSupabaseAdmin();
  if (!sb) {
    console.error('[TICKET] Supabase service role belum dikonfigurasi — tiket diterbitkan tanpa QR');
    return null;
  }
  try {
    const existing = await sb.from('tickets').select(COLUMNS).eq('order_id', order.id).maybeSingle();
    if (existing.error) throw existing.error;
    let row = existing.data as TicketRecord | null;

    if (!row) {
      const now = Date.now();
      const ins = await sb
        .from('tickets')
        .insert({
          order_id: order.id,
          unique_token: randomBytes(24).toString('base64url'), // 32 karakter, 192 bit
          passenger_name: order.name,
          route: order.route,
          travel_date: order.date,
          departure_time: order.departureTime ?? null,
          passengers: order.passengers,
          total_price: order.total,
          created_at: new Date(now).toISOString(),
          expires_at: new Date(now + TICKET_RETENTION_DAYS * DAY_MS).toISOString(),
        })
        .select(COLUMNS)
        .single();

      if (ins.error?.code === '23505') {
        // Balapan: tiket sudah dibuat proses lain → ambil yang itu
        const again = await sb.from('tickets').select(COLUMNS).eq('order_id', order.id).single();
        if (again.error) throw again.error;
        row = again.data as TicketRecord;
      } else if (ins.error) {
        throw ins.error;
      } else {
        row = ins.data as TicketRecord;
      }
    }

    await cacheTicket(row);
    return { token: row.unique_token, verifyUrl: buildVerifyUrl(row.unique_token), expiresAt: new Date(row.expires_at) };
  } catch (e) {
    console.error('[TICKET] Gagal menerbitkan tiket:', order.id, e);
    return null;
  }
}

// ─────────────────────────────────────────────
// Baca tiket via token (halaman /verify)
// ─────────────────────────────────────────────
export type TicketLookup =
  | { status: 'ok'; ticket: TicketRecord }
  | { status: 'not-found' }
  | { status: 'unavailable' };

export async function getTicketByToken(token: string): Promise<TicketLookup> {
  if (!isValidTokenFormat(token)) return { status: 'not-found' };

  try {
    const cached = await getRedis().get(`ticket:${token}`);
    if (cached) {
      const t = JSON.parse(cached) as TicketRecord;
      if (new Date(t.expires_at).getTime() > Date.now()) return { status: 'ok', ticket: t };
    }
  } catch { /* lanjut ke DB */ }

  const sb = getSupabaseAdmin();
  if (!sb) return { status: 'unavailable' };

  const { data, error } = await sb.from('tickets').select(COLUMNS).eq('unique_token', token).maybeSingle();
  if (error) {
    console.error('[TICKET] Gagal baca tiket:', error);
    return { status: 'unavailable' };
  }
  const t = data as TicketRecord | null;
  if (!t || new Date(t.expires_at).getTime() <= Date.now()) return { status: 'not-found' };

  await cacheTicket(t);
  return { status: 'ok', ticket: t };
}

// ─────────────────────────────────────────────
// Retensi 3 bulan
// ─────────────────────────────────────────────
export async function purgeExpiredTickets(): Promise<number> {
  const sb = getSupabaseAdmin();
  if (!sb) return 0;
  const { data, error } = await sb
    .from('tickets')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .select('unique_token');
  if (error) throw error;
  return data?.length ?? 0;
}
