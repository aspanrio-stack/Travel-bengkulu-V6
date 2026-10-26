/**
 * POST /api/reviews
 * Kirim ATAU perbarui ulasan (1 pesanan = 1 ulasan; UNIQUE order_id di Supabase).
 *
 * Body JSON: { token?: string, orderId?: string, rating: 1-5, comment: string(10-600), anonymous: boolean }
 *   - token   → dari email (tanpa login)
 *   - orderId → dari /profil (wajib login & pemilik pesanan)
 *
 * Penulisan memakai SUPABASE_SERVICE_ROLE_KEY (server-only). Kolom is_published TIDAK pernah
 * diubah di sini, jadi ulasan yang disembunyikan admin tidak muncul lagi saat pelanggan mengedit.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import {
  resolveReviewAccess,
  getReviewByOrderId,
  publicName,
  rateLimited,
  COMMENT_MIN,
  COMMENT_MAX,
  type AccessFail,
} from '@/lib/reviews';

export const dynamic = 'force-dynamic';

const FAIL_STATUS: Record<AccessFail, { status: number; msg: string }> = {
  'invalid-link':   { status: 403, msg: 'Tautan ulasan tidak valid atau sudah kedaluwarsa.' },
  'login-required': { status: 401, msg: 'Silakan masuk terlebih dahulu.' },
  'no-access':      { status: 403, msg: 'Pesanan ini bukan milik akun Anda.' },
  'not-found':      { status: 404, msg: 'Pesanan tidak ditemukan.' },
  'not-eligible':   { status: 403, msg: 'Ulasan baru bisa diberikan setelah perjalanan selesai.' },
  'unavailable':    { status: 503, msg: 'Layanan ulasan sedang tidak tersedia. Coba lagi nanti.' },
};

function cleanComment(raw: unknown): string {
  return String(raw ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (await rateLimited(`review:${ip}`, 20, 3600)) {
    return NextResponse.json({ error: 'Terlalu banyak percobaan. Coba lagi nanti.' }, { status: 429 });
  }

  const rating = Number(body.rating);
  const comment = cleanComment(body.comment);
  const anonymous = body.anonymous === true;
  const token = typeof body.token === 'string' ? body.token : null;
  const orderId = typeof body.orderId === 'string' ? body.orderId.slice(0, 64) : null;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Pilih rating 1 sampai 5 bintang.' }, { status: 400 });
  }
  if (comment.length < COMMENT_MIN || comment.length > COMMENT_MAX) {
    return NextResponse.json({ error: `Komentar harus ${COMMENT_MIN}–${COMMENT_MAX} karakter.` }, { status: 400 });
  }

  const access = await resolveReviewAccess({ token, orderId });
  if (!access.ok) {
    const f = FAIL_STATUS[access.reason];
    return NextResponse.json({ error: f.msg }, { status: f.status });
  }

  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ error: FAIL_STATUS.unavailable.msg }, { status: 503 });

  const { order } = access;
  const fields = {
    user_id: access.userId,
    rating,
    comment,
    display_name: publicName(order.name, anonymous),
    avatar_url: anonymous ? null : access.avatarUrl,
    is_anonymous: anonymous,
    route: (order.route || '').slice(0, 120) || null,
    updated_at: new Date().toISOString(),
  };

  try {
    const existing = await getReviewByOrderId(order.id);

    if (!existing) {
      const { error } = await db.from('reviews').insert({ order_id: order.id, ...fields });
      if (!error) return NextResponse.json({ ok: true, updated: false });
      // 23505 = unique_violation → ulasan sempat dibuat request lain; lanjut sebagai edit
      if (error.code !== '23505') throw error;
    }

    const { error } = await db.from('reviews').update(fields).eq('order_id', order.id);
    if (error) throw error;
    return NextResponse.json({ ok: true, updated: true });
  } catch (e) {
    console.error('[REVIEW] simpan gagal:', e);
    return NextResponse.json({ error: 'Gagal menyimpan ulasan. Coba lagi.' }, { status: 500 });
  }
}
