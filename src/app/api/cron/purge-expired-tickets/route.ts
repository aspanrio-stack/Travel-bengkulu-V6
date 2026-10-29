/**
 * GET /api/cron/purge-expired-tickets
 * Vercel Cron harian (vercel.json). Menghapus baris `tickets` yang melewati expires_at (3 bulan).
 * Memakai CRON_SECRET yang sama dengan cron ulasan (header Authorization: Bearer <CRON_SECRET>).
 */
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { purgeExpiredTickets } from '@/lib/tickets';

export const dynamic = 'force-dynamic';

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed
  const got = Buffer.from(req.headers.get('authorization') ?? '');
  const want = Buffer.from(`Bearer ${secret}`);
  return got.length === want.length && timingSafeEqual(got, want);
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const deleted = await purgeExpiredTickets();
    return NextResponse.json({ ok: true, deleted });
  } catch (e) {
    console.error('[PURGE-TICKETS] gagal:', e);
    return NextResponse.json({ error: 'Gagal menghapus data kedaluwarsa' }, { status: 500 });
  }
}
