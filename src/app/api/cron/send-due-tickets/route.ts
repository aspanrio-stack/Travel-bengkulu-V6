/**
 * GET /api/cron/send-due-tickets
 *
 * Mengirim tiket (email + PDF ber-QR) yang sudah waktunya: 2 jam setelah jadwal keberangkatan,
 * atau 2 jam setelah pesanan masuk untuk rute tanpa jam keberangkatan. Aturan lengkap:
 * lib/ticket-scheduler.ts.
 *
 * Otorisasi: header `Authorization: Bearer <CRON_SECRET>` (sama seperti cron lain).
 * Dipanggil tiap 15 menit oleh GitHub Actions (.github/workflows/send-due-tickets.yml) dan
 * sekali sehari oleh Vercel Cron (vercel.json) sebagai cadangan — Vercel Hobby hanya mengizinkan
 * cron harian, sehingga tidak bisa dipakai sendirian untuk presisi 1–2 jam.
 */
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { sendDueTickets } from '@/lib/ticket-scheduler';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed
  const got = Buffer.from(req.headers.get('authorization') ?? '');
  const want = Buffer.from(`Bearer ${secret}`);
  return got.length === want.length && timingSafeEqual(got, want);
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY belum di-set' }, { status: 500 });
  }

  try {
    const stats = await sendDueTickets();
    console.log('[TICKET-CRON]', JSON.stringify(stats));
    return NextResponse.json({ ok: true, ...stats });
  } catch (e) {
    console.error('[TICKET-CRON] error:', e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'Unknown' },
      { status: 500 }
    );
  }
}
