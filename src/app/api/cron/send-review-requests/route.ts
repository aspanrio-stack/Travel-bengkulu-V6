/**
 * GET /api/cron/send-review-requests
 *
 * Dijalankan Vercel Cron (vercel.json: "0 1 * * *" = 01:00 UTC = 08:00 WIB).
 * Vercel otomatis mengirim header `Authorization: Bearer <CRON_SECRET>` jika env CRON_SECRET di-set.
 *
 * Aturan pesanan yang dikirimi email permintaan ulasan:
 *   1. status 'success' (lunas/terkonfirmasi) dan punya email
 *   2. reviewEmailSent bukan true
 *   3. waktu keberangkatan (WIB) sudah lewat ≥ 12 jam
 *   4. keberangkatan tidak lebih tua dari 7 hari
 *
 * Anti-duplikasi (berlapis):
 *   a. Lock Redis `review_email_lock:{id}` (SET NX, TTL 8 hari) — mencegah 2 eksekusi cron
 *      yang tumpang-tindih mengirim ke pesanan yang sama, dan tetap menahan kirim ulang
 *      walau penulisan flag gagal setelah email terkirim.
 *   b. Flag `reviewEmailSent = true` di data pesanan (dibaca ulang tepat sebelum kirim).
 *   c. Jika Resend GAGAL, lock & token dihapus → dicoba lagi di cron berikutnya (selama masih ≤ 7 hari).
 */
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { Resend } from 'resend';
import { getOrdersCreatedSince, getOrderById, markReviewEmailSent, getRedis, type Order } from '@/lib/orders';
import {
  createReviewToken,
  getDepartureAt,
  REVIEW_MIN_HOURS_EMAIL,
  REVIEW_MAX_DAYS_EMAIL,
  SITE_URL,
} from '@/lib/reviews';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const DAY = 86_400_000;
const HOUR = 3_600_000;
const LOCK_TTL_SEC = 8 * 24 * 3600;
const SCAN_WINDOW_DAYS = 60;   // pesanan dibuat ≤ 60 hari lalu dipindai
const MAX_PER_RUN = 40;        // batas kirim per eksekusi (Resend ±2 req/detik, maxDuration 60 dtk)
const SEND_GAP_MS = 600;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed
  const got = Buffer.from(req.headers.get('authorization') ?? '');
  const want = Buffer.from(`Bearer ${secret}`);
  return got.length === want.length && timingSafeEqual(got, want);
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const plainRoute = (r: string) => r.replace(/→|->/g, '-').replace(/\s+/g, ' ').trim();
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function emailHtml(order: Order, token: string): string {
  const base = `${SITE_URL}/review?token=${encodeURIComponent(token)}`;
  const stars = [1, 2, 3, 4, 5]
    .map(
      n =>
        `<a href="${base}&amp;rating=${n}" title="${n} bintang" style="text-decoration:none;color:#f59e0b;font-size:40px;line-height:1;padding:0 3px;">&#9733;</a>`
    )
    .join('');
  const firstName = esc((order.name || 'Pelanggan').trim().split(/\s+/)[0]);

  return `<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <div style="background:linear-gradient(135deg,#0f766e,#0d9488);padding:28px 24px;text-align:center;">
    <h1 style="color:#ffffff;font-size:20px;font-weight:800;margin:0 0 4px;">Bagaimana perjalanan Anda?</h1>
    <p style="color:rgba(255,255,255,0.9);font-size:13px;margin:0;">Travel Bengkulu</p>
  </div>
  <div style="padding:28px 24px;text-align:center;">
    <p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 6px;text-align:left;">Halo <strong>${firstName}</strong>,</p>
    <p style="color:#334155;font-size:14px;line-height:1.6;margin:0 0 20px;text-align:left;">
      Terima kasih telah bepergian bersama kami di rute <strong>${esc(plainRoute(order.route))}</strong>
      (${esc(order.date)}). Pendapat Anda sangat membantu kami meningkatkan layanan dan membantu calon penumpang lain.
    </p>
    <p style="color:#64748b;font-size:12px;font-weight:700;letter-spacing:1px;margin:0 0 8px;">KETUK BINTANG UNTUK MEMBERI NILAI</p>
    <div style="margin:0 0 24px;">${stars}</div>
    <a href="${base}" style="display:inline-block;background:#0f766e;color:#ffffff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;">Tulis Ulasan</a>
    <p style="color:#64748b;font-size:12px;line-height:1.6;margin:20px 0 0;">Hanya butuh 1 menit. Tautan ini berlaku 60 hari dan tidak perlu login. Anda juga bisa mengubah ulasan lewat tautan yang sama.</p>
  </div>
  <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px;text-align:center;">
    <p style="color:#64748b;font-size:11px;margin:0;">No. Pesanan ${esc(order.id)} &middot; cs@bengkulutravel.com &middot; ${esc(SITE_URL.replace(/^https?:\/\//, ''))}</p>
  </div>
</div></body></html>`;
}

function emailText(order: Order, token: string): string {
  return [
    `Halo ${(order.name || 'Pelanggan').trim().split(/\s+/)[0]},`,
    '',
    `Terima kasih telah bepergian bersama Travel Bengkulu (${plainRoute(order.route)}, ${order.date}).`,
    'Bagikan pengalaman Anda (1 menit, tanpa login, berlaku 60 hari):',
    `${SITE_URL}/review?token=${token}`,
    '',
    `No. Pesanan ${order.id}`,
  ].join('\n');
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY belum di-set' }, { status: 500 });
  }

  const now = Date.now();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.EMAIL_FROM || 'noreply@bengkulutravel.com';
  const redis = getRedis();

  const stats = { scanned: 0, eligible: 0, sent: 0, failed: 0, skippedLocked: 0 };

  try {
    const orders = await getOrdersCreatedSince(now - SCAN_WINDOW_DAYS * DAY, 500);
    stats.scanned = orders.length;

    const due = orders.filter(o => {
      if (o.status !== 'success' || o.reviewEmailSent === true) return false;
      if (!EMAIL_RE.test((o.email || '').trim())) return false;
      const dep = getDepartureAt(o);
      if (!dep) return false;
      const t = dep.getTime();
      return now >= t + REVIEW_MIN_HOURS_EMAIL * HOUR && t >= now - REVIEW_MAX_DAYS_EMAIL * DAY;
    });
    stats.eligible = due.length;

    for (const candidate of due.slice(0, MAX_PER_RUN)) {
      const lockKey = `review_email_lock:${candidate.id}`;
      // (a) Lock atomik — hanya satu eksekusi yang lolos
      const locked = await redis.set(lockKey, String(now), 'EX', LOCK_TTL_SEC, 'NX');
      if (locked !== 'OK') { stats.skippedLocked++; continue; }

      let token: string | null = null;
      try {
        // (b) Baca ulang data terbaru tepat sebelum kirim
        const fresh = await getOrderById(candidate.id);
        if (!fresh || fresh.status !== 'success' || fresh.reviewEmailSent === true) continue;

        token = await createReviewToken(fresh.id);
        const to = (fresh.email || '').trim();
        const { error } = await resend.emails.send({
          from: `Travel Bengkulu <${fromEmail}>`,
          to,
          subject: `Bagaimana perjalanan Anda? Beri ulasan - ${plainRoute(fresh.route)}`,
          html: emailHtml(fresh, token),
          text: emailText(fresh, token),
        });
        if (error) throw new Error(error.message || 'Resend error');

        stats.sent++;
        // Tandai terkirim. Bila gagal menulis, lock (8 hari) tetap mencegah kirim ulang.
        await markReviewEmailSent(fresh.id).catch(e =>
          console.error('[REVIEW-CRON] email terkirim tapi gagal set flag:', fresh.id, e)
        );
      } catch (e) {
        // (c) Gagal kirim → lepas lock & token supaya bisa dicoba lagi besok
        stats.failed++;
        console.error('[REVIEW-CRON] gagal kirim:', candidate.id, e);
        await redis.del(lockKey).catch(() => undefined);
        if (token) await redis.del(`review_token:${token}`).catch(() => undefined);
      }
      await sleep(SEND_GAP_MS);
    }

    console.log('[REVIEW-CRON]', JSON.stringify(stats));
    return NextResponse.json({ ok: true, ...stats });
  } catch (e) {
    console.error('[REVIEW-CRON] error:', e);
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : 'Unknown', ...stats }, { status: 500 });
  }
}
