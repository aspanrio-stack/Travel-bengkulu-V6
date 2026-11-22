/**
 * app/api/admin/confirm/route.ts
 *
 * POST /api/admin/confirm
 * Dipanggil saat admin klik "✅ Konfirmasi" di dashboard.
 *
 * Yang terjadi setelah konfirmasi:
 *   1. Update status pesanan → 'success' + tandai `ticketScheduled`
 *   2. Kirim notifikasi email ke admin
 *   3. Kirim WA notifikasi ke-2 ke pemesan via Fonnte
 *   4. Return waLink agar dashboard bisa buka WA admin
 *
 * TIKET TIDAK dikirim di sini. Tiket (email + PDF ber-QR) dikirim otomatis oleh
 * lib/ticket-scheduler.ts (cron /api/cron/send-due-tickets): 2 jam setelah jadwal keberangkatan,
 * atau 2 jam setelah pesanan masuk untuk rute tanpa jam keberangkatan.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus, formatRp, Order } from '@/lib/orders';
import { getSession } from '@/lib/auth';
import { sendWA, msgPemesanKonfirmasi } from '@/lib/fonnte';
import { Resend } from 'resend';
import { sanitize, markTicketScheduled } from '@/lib/ticket-scheduler';

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  if (!digits.startsWith('62')) digits = '62' + digits;
  return digits;
}

// ─────────────────────────────────────────────
// Generate WA link konfirmasi ke pelanggan (untuk admin)
// ─────────────────────────────────────────────
function generateWALink(order: Order & { departureTime?: string }): string {
  const lines = [
    `Assalamualaikum / Halo *${order.name}*,`,
    '',
    `Pembayaran Anda telah kami *konfirmasi* ✅`,
    '',
    `*Detail Perjalanan:*`,
    `🚗 Rute     : ${order.route}`,
    `📅 Tanggal  : ${order.date}`,
    order.departureTime ? `🕐 Jam      : ${order.departureTime}` : '',
    `👥 Penumpang: ${order.passengers} orang`,
    `📍 Jemput   : ${order.pickup}`,
    order.dropoff ? `🏁 Tujuan   : ${order.dropoff}` : '',
    `💰 Total    : ${formatRp(order.total)}`,
    `No. Pesanan : *${order.id}*`,
    '',
    order.email
      ? `Tiket akan dikirim otomatis ke email *${order.email}* 📧 (sekitar 2 jam setelah jadwal keberangkatan)`
      : `Simpan pesan ini sebagai bukti pesanan.`,
    '',
    `Terima kasih telah mempercayai *Travel Bengkulu* 🙏`,
  ].filter(Boolean).join('\n');

  return `https://wa.me/${normalizePhone(order.phone)}?text=${encodeURIComponent(lines)}`;
}

// ─────────────────────────────────────────────
// POST: Konfirmasi Pembayaran Travel
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Cek session admin
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'orderId diperlukan' }, { status: 400 });
    }

    // Ambil data pesanan
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }
    if (order.status === 'success') {
      return NextResponse.json({ error: 'Pesanan sudah dikonfirmasi sebelumnya' }, { status: 400 });
    }
    if (order.status === 'cancelled') {
      return NextResponse.json({ error: 'Pesanan sudah dibatalkan' }, { status: 400 });
    }

    // 1. Update status → 'success'
    const updated = await updateOrderStatus(orderId, 'success');
    if (!updated) {
      return NextResponse.json({ error: 'Gagal update status pesanan' }, { status: 500 });
    }

    const orderWithDep = updated as Order & { departureTime?: string };
    const pelangganEmail = (updated.email || '').trim();

    const resend     = new Resend(process.env.RESEND_API_KEY);
    const fromEmail  = process.env.EMAIL_FROM  || 'noreply@bengkulutravel.com';
    const adminEmail = process.env.EMAIL_ADMIN || 'cs@bengkulutravel.com';
    const waLink     = generateWALink(orderWithDep);

    // Tiket TIDAK dikirim di sini — dikirim terjadwal oleh lib/ticket-scheduler.ts.
    // Tandai agar pesanan ini ikut jadwal kirim tiket (gagal menandai tidak menggagalkan konfirmasi).
    await markTicketScheduled(orderId).catch(e =>
      console.error('[CONFIRM] Gagal menandai ticketScheduled:', orderId, e)
    );

    const emailPromises: Promise<unknown>[] = [];

    // 2. Notifikasi email ke admin
    emailPromises.push(
      resend.emails.send({
        from:    `Travel Bengkulu <${fromEmail}>`,
        to:      adminEmail,
        subject: `Pesanan Dikonfirmasi: ${updated.id} - ${sanitize(updated.route)}`,
        html: `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
  <h2 style="color:#0f766e;">Pesanan Berhasil Dikonfirmasi</h2>
  <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e2e8f0;">
    <tr style="background:#f0fdf9;"><td style="padding:10px 12px;color:#64748b;width:35%;">No. Pesanan</td><td style="padding:10px 12px;font-weight:700;font-family:monospace;">${updated.id}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Nama</td><td style="padding:10px 12px;font-weight:600;">${updated.name}</td></tr>
    <tr style="background:#f0fdf9;"><td style="padding:10px 12px;color:#64748b;">No. HP</td><td style="padding:10px 12px;font-weight:600;">${updated.phone}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Rute</td><td style="padding:10px 12px;font-weight:600;">${updated.route}</td></tr>
    <tr style="background:#f0fdf9;"><td style="padding:10px 12px;color:#64748b;">Tanggal</td><td style="padding:10px 12px;font-weight:600;">${updated.date}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Penumpang</td><td style="padding:10px 12px;font-weight:600;">${updated.passengers} orang</td></tr>
    <tr style="background:#f0fdf9;"><td style="padding:10px 12px;color:#64748b;">Total</td><td style="padding:10px 12px;font-weight:800;color:#0f766e;font-size:16px;">${formatRp(updated.total)}</td></tr>
  </table>
  <div style="margin-top:20px;text-align:center;">
    <a href="${waLink}" style="display:inline-block;background:#22c55e;color:white;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:14px;">
      Kirim Konfirmasi ke ${updated.name} via WA
    </a>
  </div>
  ${pelangganEmail
    ? `<p style="color:#16a34a;font-size:12px;text-align:center;margin-top:12px;">Tiket PDF akan dikirim otomatis ke: <strong>${pelangganEmail}</strong> (sekitar 2 jam setelah jadwal keberangkatan)</p>`
    : `<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:12px;">Pelanggan tidak punya email &mdash; sampaikan konfirmasi via WhatsApp</p>`
  }
</div>`,
      })
        .then(r => console.log('[CONFIRM] Email notif admin terkirim:', r))
        .catch(e => console.error('[CONFIRM] GAGAL kirim email admin:', e))
    );

    // Jalankan semua email secara paralel
    await Promise.allSettled(emailPromises);

    // 3. Kirim WA notifikasi ke-2 ke pemesan (fire-and-forget)
    const bookingData = {
      id:            updated.id,
      name:          updated.name,
      phone:         updated.phone,
      email:         updated.email || undefined,
      route:         updated.route,
      date:          updated.date,
      departureTime: orderWithDep.departureTime || undefined,
      passengers:    updated.passengers,
      pickup:        updated.pickup,
      dropoff:       updated.dropoff || undefined,
      total:         updated.total,
      paymentMethod: updated.paymentMethod,
    };
    sendWA(updated.phone, msgPemesanKonfirmasi(bookingData)).catch(err => {
      console.error('[CONFIRM] Gagal kirim WA konfirmasi ke pemesan:', err);
    });

    return NextResponse.json({
      success:   true,
      message:   pelangganEmail
        ? `Pesanan ${orderId} dikonfirmasi. Tiket akan dikirim otomatis ke ${pelangganEmail} sesuai jadwal`
        : `Pesanan ${orderId} dikonfirmasi (pelanggan tidak ada email)`,
      emailSent: !!pelangganEmail,
      waLink,
    });

  } catch (error) {
    console.error('[CONFIRM] Error:', error);
    return NextResponse.json({
      error: 'Gagal mengkonfirmasi pesanan: ' + (error instanceof Error ? error.message : 'Unknown'),
    }, { status: 500 });
  }
}
