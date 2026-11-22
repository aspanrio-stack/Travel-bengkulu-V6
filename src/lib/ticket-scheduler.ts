/**
 * lib/ticket-scheduler.ts
 *
 * Pengiriman tiket (email + PDF ber-QR) TERJADWAL otomatis.
 *
 * Aturan:
 *   1. Tombol "Konfirmasi" admin TIDAK mengirim tiket — hanya mengubah status
 *      (+ menandai pesanan `ticketScheduled`).
 *   2. Tiket dikirim otomatis TICKET_SEND_DELAY_HOURS (2 jam) setelah jadwal keberangkatan (WIB).
 *      Rute tanpa jam keberangkatan: 2 jam setelah pesanan masuk (createdAt).
 *   3. Berlaku sama untuk pesanan yang dikonfirmasi manual maupun otomatis.
 *
 * Pesanan yang berhak dikirimi tiket (selain syarat: punya email valid, belum cancelled,
 * belum terkirim):
 *   - status 'success' yang dikonfirmasi lewat tombol admin versi baru (ticketScheduled) atau
 *     auto-konfirmasi tunai (autoConfirmed) — pesanan lama yang sudah dikonfirmasi manual
 *     dianggap SUDAH menerima tiket (perilaku lama) sehingga tidak dikirim ulang;
 *   - status 'pending' dengan pembayaran TUNAI (tunai dianggap lunas; lihat lib/auto-confirm.ts).
 *     QRIS yang belum dikonfirmasi admin TIDAK pernah dikirimi tiket.
 *
 * Anti-duplikasi berlapis (pola sama dengan cron ulasan):
 *   a. Lock Redis `ticket_email_lock:{id}` (SET NX, TTL 8 hari)
 *   b. Flag `ticketEmailSent` di data pesanan (dibaca ulang tepat sebelum kirim)
 *   c. Resend gagal → lock dilepas, dicoba lagi pada eksekusi berikutnya
 */
import { Resend } from 'resend';
import { getRedis, getOrdersCreatedSince, getOrderById, formatRp, type Order } from '@/lib/orders';
import { generateTicketPDF } from '@/lib/ticket-pdf';
import { issueTicket } from '@/lib/tickets';

export const TICKET_SEND_DELAY_HOURS = 2;   // ubah ke 1 jika ingin 1 jam setelah jadwal
export const TICKET_MAX_LATE_DAYS = 7;      // jangan kirim tiket untuk jadwal yang sudah > 7 hari lalu
const SCAN_WINDOW_DAYS = 60;                // pesanan dibuat ≤ 60 hari lalu dipindai
const MAX_PER_RUN = 25;                     // batas kirim per eksekusi (PDF + Resend ±2 req/detik)
const SEND_GAP_MS = 600;
const LOCK_TTL_SEC = 8 * 24 * 3600;
const HOUR = 3_600_000;
const DAY = 86_400_000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ─────────────────────────────────────────────
// Sanitasi teks subjek email
// ─────────────────────────────────────────────
export function sanitize(text: string): string {
  return (text || '')
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/\u2018/g, "'").replace(/\u2019/g, "'")
    .replace(/\u201C/g, '"').replace(/\u201D/g, '"')
    .replace(/…/g, '...')
    .replace(/[^\x00-\xFF]/g, '');
}


// ─────────────────────────────────────────────
// HTML Email Tiket ke Pelanggan (dipindah apa adanya dari /api/admin/confirm)
// ─────────────────────────────────────────────
export function generateTicketEmailHTML(order: Order & { departureTime?: string }): string {
  const dep = order.departureTime ?? '';
  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:560px;margin:32px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <div style="background:linear-gradient(135deg,#0f766e,#0d9488);padding:32px 24px;text-align:center;">
    <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:12px;">🎫</div>
    <h1 style="color:white;font-size:22px;font-weight:800;margin:0 0 4px;">Tiket Perjalanan Dikonfirmasi!</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:0;">Travel Bengkulu &middot; Tiket Resmi</p>
  </div>

  <div style="padding:28px 24px;">
    <p style="color:#334155;font-size:14px;margin:0 0 20px;">Halo <strong>${order.name}</strong>, pembayaran Anda telah kami konfirmasi ✅</p>

    <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:10px;padding:16px;margin-bottom:20px;">
      <p style="color:#134e4a;font-size:11px;font-weight:700;text-transform:uppercase;margin:0 0 4px;">No. Pesanan</p>
      <p style="color:#0f766e;font-size:20px;font-weight:800;letter-spacing:1px;margin:0;font-family:monospace;">${order.id}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:20px;">
      ${[
        ['🚗 Rute', order.route],
        ['📅 Tanggal', order.date],
        ...(dep ? [['🕐 Jam Berangkat', dep]] : []),
        ['👥 Penumpang', `${order.passengers} orang`],
        ['📍 Jemput di', order.pickup],
        ...(order.dropoff ? [['🏁 Antar ke', order.dropoff]] : []),
      ].map(([l, v], i) => `
      <tr style="background:${i % 2 === 0 ? '#f8fafc' : 'white'}">
        <td style="padding:10px 12px;color:#64748b;width:38%;">${l}</td>
        <td style="padding:10px 12px;font-weight:600;color:#1e293b;">${v}</td>
      </tr>`).join('')}
    </table>

    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
      <tr>
        <td style="padding:6px 0;color:#64748b;">Harga Tiket (${order.passengers} pax)</td>
        <td style="padding:6px 0;text-align:right;font-weight:600;">${formatRp(order.harga * order.passengers)}</td>
      </tr>
      ${order.kodeUnik > 0 ? `<tr>
        <td style="padding:6px 0;color:#64748b;">Kode Unik</td>
        <td style="padding:6px 0;text-align:right;font-weight:600;">+${formatRp(order.kodeUnik)}</td>
      </tr>` : ''}
      <tr style="border-top:2px solid #e2e8f0;">
        <td style="padding:12px 0;font-weight:700;color:#1e293b;">Total Pembayaran</td>
        <td style="padding:12px 0;text-align:right;font-size:20px;font-weight:800;color:#0f766e;">${formatRp(order.total)}</td>
      </tr>
    </table>

    <div style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="color:#92400e;font-size:13px;font-weight:700;margin:0 0 8px;">📋 Instruksi Penting:</p>
      <ul style="color:#78350f;font-size:12px;margin:0;padding-left:18px;line-height:1.8;">
        <li>Tunjukkan email ini atau nomor pesanan kepada driver</li>
        <li>Siapkan diri <strong>15 menit sebelum</strong> waktu penjemputan</li>
        <li>Driver akan menghubungi Anda sebelum tiba</li>
        <li>Bawa identitas diri (KTP/SIM)</li>
      </ul>
    </div>

    <p style="color:#64748b;font-size:12px;text-align:center;margin:0 0 16px;">
      📎 <strong>Tiket PDF</strong> terlampir &mdash; simpan sebagai bukti perjalanan.
    </p>

    <div style="text-align:center;">
      <a href="https://wa.me/6285268645461" style="display:inline-block;background:#22c55e;color:white;font-size:13px;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;">
        💬 WhatsApp: 0852-6864-5461
      </a>
      <p style="color:#94a3b8;font-size:11px;margin:10px 0 0;">cs@bengkulutravel.com &middot; bengkulutravel.com</p>
    </div>
  </div>

  <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px;text-align:center;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} Travel Bengkulu &middot; BTN Air Bang Curup, Bengkulu</p>
  </div>
</div>
</body>
</html>`;
}


// ─────────────────────────────────────────────
// Kapan tiket harus dikirim
// ─────────────────────────────────────────────
function toWib(date: string, hh: number, mm: number): Date | null {
  if (!DATE_RE.test(date) || hh > 23 || mm > 59) return null;
  const d = new Date(`${date}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00+07:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Jam keberangkatan (WIB) bila ada. Rental: tanggal & jam AMBIL (awal sewa). null = tidak ada jam. */
function getDepartureTime(order: Order): Date | null {
  const dep = (order.departureTime || '').trim();
  const isRental = order.routeId === 'rental' || order.id.startsWith('RNT-');
  const t = isRental
    ? /Ambil pukul\s+(\d{1,2})[:.](\d{2})/.exec(dep)
    : /(\d{1,2})[:.](\d{2})/.exec(dep);
  return t ? toWib(order.date, +t[1], +t[2]) : null;
}

/** Waktu tiket mulai boleh dikirim: jadwal + 2 jam; tanpa jam → waktu pesanan masuk + 2 jam. */
export function getTicketDueAt(order: Order): Date | null {
  const base = getDepartureTime(order) ?? new Date(order.createdAt);
  if (Number.isNaN(base.getTime())) return null;
  return new Date(base.getTime() + TICKET_SEND_DELAY_HOURS * HOUR);
}

export function isTicketDue(order: Order, now = Date.now()): boolean {
  if (order.status === 'cancelled' || order.ticketEmailSent === true) return false;
  if (!EMAIL_RE.test((order.email || '').trim())) return false;

  const eligibleStatus =
    (order.status === 'success' && (order.ticketScheduled === true || order.autoConfirmed === true)) ||
    (order.status === 'pending' && order.paymentMethod === 'tunai');
  if (!eligibleStatus) return false;

  const due = getTicketDueAt(order);
  if (!due) return false;
  const t = due.getTime();
  return now >= t && t >= now - TICKET_MAX_LATE_DAYS * DAY;
}

/** Tandai pesanan dikonfirmasi lewat tombol admin → ikut jadwal kirim tiket. */
export async function markTicketScheduled(id: string): Promise<void> {
  const redis = getRedis();
  const raw = await redis.get(`order:${id}`);
  if (!raw) return;
  const order = JSON.parse(raw) as Order;
  if (order.ticketScheduled === true) return;
  await redis.set(`order:${id}`, JSON.stringify({ ...order, ticketScheduled: true }));
}

async function markTicketEmailSent(id: string): Promise<void> {
  const redis = getRedis();
  const raw = await redis.get(`order:${id}`);
  if (!raw) return;
  const order = JSON.parse(raw) as Order;
  await redis.set(
    `order:${id}`,
    JSON.stringify({ ...order, ticketEmailSent: true, ticketEmailSentAt: new Date().toISOString() })
  );
}

// ─────────────────────────────────────────────
// Kirim tiket yang sudah waktunya
// ─────────────────────────────────────────────
export interface SendDueTicketsStats {
  scanned: number;
  eligible: number;
  sent: number;
  failed: number;
  skippedLocked: number;
}

export async function sendDueTickets(now = Date.now()): Promise<SendDueTicketsStats> {
  const stats: SendDueTicketsStats = { scanned: 0, eligible: 0, sent: 0, failed: 0, skippedLocked: 0 };
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.EMAIL_FROM || 'noreply@bengkulutravel.com';
  const redis = getRedis();

  const orders = await getOrdersCreatedSince(now - SCAN_WINDOW_DAYS * DAY, 500);
  stats.scanned = orders.length;
  const due = orders.filter(o => isTicketDue(o, now));
  stats.eligible = due.length;

  for (const candidate of due.slice(0, MAX_PER_RUN)) {
    const lockKey = `ticket_email_lock:${candidate.id}`;
    // (a) Lock atomik — hanya satu eksekusi yang lolos
    const locked = await redis.set(lockKey, String(now), 'EX', LOCK_TTL_SEC, 'NX');
    if (locked !== 'OK') { stats.skippedLocked++; continue; }

    try {
      // (b) Baca ulang data terbaru & cek ulang syarat tepat sebelum kirim
      const fresh = await getOrderById(candidate.id);
      if (!fresh || !isTicketDue(fresh, now)) {
        await redis.del(lockKey).catch(() => undefined); // belum/ tidak berhak → jangan tahan lock
        continue;
      }

      let pdfBuffer: Buffer | null = null;
      try {
        // Token verifikasi idempoten → QR di PDF. Gagal → PDF tetap dibuat tanpa QR.
        const ticket = await issueTicket(fresh);
        pdfBuffer = await generateTicketPDF(fresh as Order & { departureTime?: string }, ticket);
      } catch (pdfErr) {
        console.error('[TICKET-SCHEDULER] Gagal generate PDF:', fresh.id, pdfErr);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        from: `Travel Bengkulu <${fromEmail}>`,
        to: (fresh.email || '').trim(),
        subject: `Tiket Perjalanan ${sanitize(fresh.route)} - ${fresh.id}`,
        html: generateTicketEmailHTML(fresh as Order & { departureTime?: string }),
      };
      // Resend membutuhkan base64 string, BUKAN Buffer
      if (pdfBuffer) {
        payload.attachments = [{ filename: `Tiket-${fresh.id}.pdf`, content: pdfBuffer.toString('base64') }];
      }

      const { error } = await resend.emails.send(payload);
      if (error) throw new Error(error.message || 'Resend error');

      stats.sent++;
      // Tandai terkirim. Bila gagal menulis, lock (8 hari) tetap mencegah kirim ulang.
      await markTicketEmailSent(fresh.id).catch(e =>
        console.error('[TICKET-SCHEDULER] email terkirim tapi gagal set flag:', fresh.id, e)
      );
    } catch (e) {
      // (c) Gagal kirim → lepas lock agar dicoba lagi pada eksekusi berikutnya
      stats.failed++;
      console.error('[TICKET-SCHEDULER] gagal kirim:', candidate.id, e);
      await redis.del(lockKey).catch(() => undefined);
    }
    await sleep(SEND_GAP_MS);
  }

  return stats;
}
