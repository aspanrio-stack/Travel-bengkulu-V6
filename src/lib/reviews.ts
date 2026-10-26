/**
 * lib/reviews.ts
 * Logika bersama sistem ulasan (server-side).
 *
 *   Redis    : pesanan (order:{id}), token ulasan (review_token:{token}), lock email, rate-limit
 *   Supabase : tabel `reviews` (lihat supabase/reviews.sql)
 */
import { randomBytes } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { getRedis, getOrderById, type Order } from './orders';
import { getSupabaseAdmin } from './supabase/admin';
import { getCurrentUser } from './supabase/server';

// ─────────────────────────────────────────────
// Konstanta aturan bisnis
// ─────────────────────────────────────────────
export const REVIEW_TOKEN_TTL_SEC = 60 * 24 * 60 * 60; // 60 hari
export const REVIEW_MIN_HOURS_MANUAL = 8;               // tombol "Beri Ulasan" di /profil & akses /review
export const REVIEW_MIN_HOURS_EMAIL = 12;               // email otomatis dikirim setelah 12 jam
export const REVIEW_MAX_DAYS_EMAIL = 7;                 // jangan kirim email untuk perjalanan > 7 hari lalu
export const COMMENT_MIN = 10;
export const COMMENT_MAX = 600;
export const HOME_REVIEWS_REVALIDATE = 300;             // detik (5 menit)

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bengkulutravel.com').replace(/\/$/, '');

const HOUR = 3_600_000;

// ─────────────────────────────────────────────
// Tipe
// ─────────────────────────────────────────────
export interface PublicReview {
  id: string;
  rating: number;
  comment: string;
  display_name: string;
  avatar_url: string | null;
  is_anonymous: boolean;
  route: string | null;
  created_at: string;
}

export interface OwnReview extends PublicReview {
  order_id: string;
  is_published: boolean;
  updated_at: string;
}

// ─────────────────────────────────────────────
// Waktu keberangkatan (WIB, UTC+7)
// ─────────────────────────────────────────────
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function toWib(date: string, hh: number, mm: number): Date | null {
  if (!DATE_RE.test(date) || hh > 23 || mm > 59) return null;
  const d = new Date(`${date}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00+07:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Perkiraan waktu perjalanan SELESAI/BERANGKAT (acuan hitung 8 jam / 12 jam).
 *  - Travel biasa : `date` + `departureTime` ("HH:MM"). Jika berisi teks bebas (mis. info
 *    penerbangan "Citilink 14.30"), jam pertama yang ditemukan dipakai.
 *  - Rental       : TANGGAL AKHIR sewa + jam ambil (format dari /api/rental), karena sewa multi-hari.
 *  - Tanpa jam    : dianggap 23:59 WIB pada tanggalnya (konservatif — tidak minta ulasan sebelum waktunya).
 * Mengembalikan null jika tanggal tidak valid.
 */
export function getDepartureAt(order: Pick<Order, 'id' | 'routeId' | 'date' | 'departureTime'>): Date | null {
  const dep = (order.departureTime || '').trim();
  const isRental = order.routeId === 'rental' || order.id.startsWith('RNT-');

  if (isRental) {
    const end = /s\/d\s+(\d{4}-\d{2}-\d{2})/.exec(dep)?.[1] ?? order.date;
    const t = /Ambil pukul\s+(\d{1,2})[:.](\d{2})/.exec(dep);
    return t ? toWib(end, +t[1], +t[2]) : toWib(end, 23, 59);
  }

  const t = /(\d{1,2})[:.](\d{2})/.exec(dep);
  return t ? toWib(order.date, +t[1], +t[2]) : toWib(order.date, 23, 59);
}

/** Pesanan lunas (status 'success') dan sudah lewat `minHours` dari waktu keberangkatan. */
export function isReviewable(order: Order, minHours: number, now = Date.now()): boolean {
  if (order.status !== 'success') return false;
  const dep = getDepartureAt(order);
  return !!dep && now >= dep.getTime() + minHours * HOUR;
}

/** Kapan pesanan mulai bisa diulas (untuk pesan "coba lagi nanti"). */
export function reviewableFrom(order: Order, minHours: number): Date | null {
  const dep = getDepartureAt(order);
  return dep ? new Date(dep.getTime() + minHours * HOUR) : null;
}

// ─────────────────────────────────────────────
// Token ulasan (Redis) — acak, berlaku 60 hari
// ─────────────────────────────────────────────
const TOKEN_RE = /^[A-Za-z0-9_-]{20,64}$/;

export async function createReviewToken(orderId: string): Promise<string> {
  const token = randomBytes(24).toString('base64url'); // 32 karakter, 192 bit
  await getRedis().set(`review_token:${token}`, orderId, 'EX', REVIEW_TOKEN_TTL_SEC);
  return token;
}

export async function resolveReviewToken(token: string | undefined | null): Promise<string | null> {
  if (!token || !TOKEN_RE.test(token)) return null;
  return getRedis().get(`review_token:${token}`);
}

// ─────────────────────────────────────────────
// Rate limit sederhana (Redis)
// ─────────────────────────────────────────────
export async function rateLimited(key: string, max: number, windowSec: number): Promise<boolean> {
  try {
    const r = getRedis();
    const k = `rl:${key}`;
    const n = await r.incr(k);
    if (n === 1) await r.expire(k, windowSec);
    return n > max;
  } catch {
    return false; // Redis bermasalah ≠ blokir pelanggan
  }
}

// ─────────────────────────────────────────────
// Nama tampilan
// ─────────────────────────────────────────────
export function publicName(fullName: string, anonymous: boolean): string {
  if (anonymous) return 'Pelanggan Anonim';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Pelanggan';
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  if (parts.length === 1) return cap(parts[0]);
  return `${cap(parts[0])} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

// ─────────────────────────────────────────────
// Akses ke /review & POST /api/reviews
// ─────────────────────────────────────────────
export type AccessFail =
  | 'invalid-link'    // token salah / kedaluwarsa (>60 hari)
  | 'login-required'  // buka dari /profil tapi belum login
  | 'no-access'       // pesanan bukan milik user ini
  | 'not-found'
  | 'not-eligible'    // belum lunas / belum lewat 8 jam
  | 'unavailable';    // Supabase/Redis belum dikonfigurasi

export type ReviewAccess =
  | { ok: true; order: Order; via: 'token' | 'session'; userId: string | null; avatarUrl: string | null }
  | { ok: false; reason: AccessFail; availableAt?: Date };

/**
 * Tentukan apakah pemanggil boleh mengulas pesanan tertentu:
 *   • `token`   → dari email, TANPA login.
 *   • `orderId` → dari /profil, wajib login & pemilik pesanan (order.userId).
 */
export async function resolveReviewAccess(input: { token?: string | null; orderId?: string | null }): Promise<ReviewAccess> {
  if (!getSupabaseAdmin()) return { ok: false, reason: 'unavailable' };

  let orderId: string | null = null;
  let via: 'token' | 'session' = 'token';

  try {
    if (input.token) {
      orderId = await resolveReviewToken(input.token);
      if (!orderId) return { ok: false, reason: 'invalid-link' };
    } else if (input.orderId) {
      via = 'session';
      orderId = input.orderId;
    } else {
      return { ok: false, reason: 'invalid-link' };
    }

    const user = await getCurrentUser().catch(() => null);
    if (via === 'session' && !user) return { ok: false, reason: 'login-required' };

    const order = await getOrderById(orderId);
    if (!order) return { ok: false, reason: 'not-found' };
    if (via === 'session' && order.userId !== user!.id) return { ok: false, reason: 'no-access' };

    if (!isReviewable(order, REVIEW_MIN_HOURS_MANUAL)) {
      return { ok: false, reason: 'not-eligible', availableAt: reviewableFrom(order, REVIEW_MIN_HOURS_MANUAL) ?? undefined };
    }

    const owner = user && order.userId === user.id ? user : null;
    return {
      ok: true,
      order,
      via,
      userId: order.userId ?? null,
      avatarUrl: (owner?.user_metadata?.avatar_url as string | undefined) ?? null,
    };
  } catch (e) {
    console.error('[REVIEW] resolveReviewAccess error:', e);
    return { ok: false, reason: 'unavailable' };
  }
}

// ─────────────────────────────────────────────
// Query Supabase
// ─────────────────────────────────────────────
const OWN_COLUMNS =
  'id, order_id, rating, comment, display_name, avatar_url, is_anonymous, is_published, route, created_at, updated_at';

/** Ulasan milik satu pesanan (service role — termasuk yang is_published = false). */
export async function getReviewByOrderId(orderId: string): Promise<OwnReview | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db.from('reviews').select(OWN_COLUMNS).eq('order_id', orderId).maybeSingle();
  if (error) { console.error('[REVIEW] getReviewByOrderId:', error.message); return null; }
  return (data as OwnReview | null) ?? null;
}

/** Ulasan untuk banyak pesanan sekaligus → map order_id → ulasan. Dipakai /profil. */
export async function getReviewsByOrderIds(orderIds: string[]): Promise<Record<string, OwnReview>> {
  const db = getSupabaseAdmin();
  if (!db || orderIds.length === 0) return {};
  const { data, error } = await db.from('reviews').select(OWN_COLUMNS).in('order_id', orderIds);
  if (error) { console.error('[REVIEW] getReviewsByOrderIds:', error.message); return {}; }
  return Object.fromEntries((data as OwnReview[]).map(r => [r.order_id, r]));
}

/**
 * N ulasan terbaru yang dipublikasikan — untuk beranda.
 * Memakai ANON key (RLS: hanya is_published = true & kolom aman) dan tanpa cookie,
 * dengan fetch ber-cache 5 menit supaya beranda tetap statis (ISR).
 * Mengembalikan [] jika gagal/belum dikonfigurasi → section otomatis tersembunyi.
 */
export async function getPublishedReviews(limit = 6): Promise<PublicReview[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const db = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, next: { revalidate: HOME_REVIEWS_REVALIDATE, tags: ['reviews'] } } as RequestInit),
      },
    });
    const { data, error } = await db
      .from('reviews')
      .select('id, rating, comment, display_name, avatar_url, is_anonymous, route, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) { console.error('[REVIEW] getPublishedReviews:', error.message); return []; }
    return (data as PublicReview[]) ?? [];
  } catch (e) {
    console.error('[REVIEW] getPublishedReviews error:', e);
    return [];
  }
}
