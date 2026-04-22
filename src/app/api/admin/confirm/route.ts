/**
 * API: POST /api/admin/confirm
 * Konfirmasi pembayaran:
 * 1. Update status → 'success'
 * 2. Kirim email tiket ke pelanggan jika ada email
 * 3. Kirim notifikasi ke admin
 */
import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus, formatRp } from '@/lib/orders';
import { getSession } from '@/lib/auth';
import { Resend } from 'resend';

// ─────────────────────────────────────────────
// Template Email Tiket HTML
// ─────────────────────────────────────────────
function generateTicketHTML(order: {
  id: string; name: string; phone: string; email?: string;
  route: string; date: string; passengers: number;
  total: number; pickup: string; dropoff?: string;
  paymentMethod?: string;
}) {
  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>Tiket Travel Bengkulu</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:24px 16px;">

  <div style="background:linear-gradient(135deg,#0f766e,#0d9488);border-radius:16px 16px 0 0;padding:28px;text-align:center;">
    <div style="background:rgba(255,255,255,0.2);width:48px;height:48px;border-radius:12px;margin:0 auto 12px;line-height:48px;">
      <span style="color:white;font-size:24px;font-weight:900;">T</span>
    </div>
    <h1 style="color:white;font-size:22px;font-weight:800;margin:0 0 4px;">Travel Bengkulu</h1>
    <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:0;">Tiket Perjalanan Resmi</p>
  </div>

  <div style="background:white;padding:28px;border:1px solid #e2e8f0;border-top:none;">
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px;text-align:center;margin-bottom:20px;">
      <p style="color:#16a34a;font-size:15px;font-weight:700;margin:0;">✅ Pembayaran Dikonfirmasi!</p>
      <p style="color:#4ade80;font-size:12px;margin:4px 0 0;">Tiket Anda sudah diverifikasi admin</p>
    </div>

    <div style="background:#f8fafc;border-radius:10px;padding:14px;text-align:center;margin-bottom:18px;">
      <p style="color:#64748b;font-size:11px;font-weight:700;letter-spacing:1px;margin:0 0 4px;">NOMOR PESANAN</p>
      <p style="color:#0f172a;font-size:18px;font-weight:800;margin:0;font-family:monospace;">${order.id}</p>
    </div>

    <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:10px;padding:16px;margin-bottom:18px;">
      <p style="color:#0f766e;font-size:11px;font-weight:700;letter-spacing:1px;margin:0 0 10px;">DETAIL PERJALANAN</p>
      <p style="color:#0f766e;font-size:16px;font-weight:800;text-align:center;margin:0 0 12px;">${order.route}</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr><td style="color:#64748b;padding:4px 0;width:40%;">Tanggal</td><td style="color:#0f172a;font-weight:600;">${order.date}</td></tr>
        <tr><td style="color:#64748b;padding:4px 0;">Penumpang</td><td style="color:#0f172a;font-weight:600;">${order.passengers} orang</td></tr>
        <tr><td style="color:#64748b;padding:4px 0;">Jemput di</td><td style="color:#0f172a;font-weight:600;">${order.pickup}</td></tr>
        ${order.dropoff ? `<tr><td style="color:#64748b;padding:4px 0;">Antar ke</td><td style="color:#0f172a;font-weight:600;">${order.dropoff}</td></tr>` : ''}
        <tr><td style="color:#64748b;padding:4px 0;">Nama</td><td style="color:#0f172a;font-weight:600;">${order.name}</td></tr>
        <tr><td style="color:#64748b;padding:4px 0;">No. HP</td><td style="color:#0f172a;font-weight:600;">${order.phone}</td></tr>
      </table>
    </div>

    <div style="background:#0f766e;border-radius:10px;padding:16px;text-align:center;margin-bottom:18px;">
      <p style="color:rgba(255,255,255,0.7);font-size:11px;font-weight:700;margin:0 0 4px;">TOTAL PEMBAYARAN</p>
      <p style="color:white;font-size:26px;font-weight:800;margin:0;">${formatRp(order.total)}</p>
      <p style="color:rgba(255,255,255,0.6);font-size:11px;margin:4px 0 0;">${order.paymentMethod || 'Lunas'}</p>
    </div>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px;margin-bottom:18px;">
      <p style="color:#92400e;font-size:13px;font-weight:700;margin:0 0 8px;">📋 Instruksi Penting</p>
      <ul style="color:#78350f;font-size:12px;margin:0;padding-left:18px;line-height:1.9;">
        <li>Tunjukkan email ini atau nomor pesanan kepada driver</li>
        <li>Siapkan diri <strong>15 menit sebelum</strong> waktu penjemputan</li>
        <li>Driver akan menghubungi Anda sebelum tiba</li>
      </ul>
    </div>

    <div style="text-align:center;">
      <a href="https://wa.me/6285268645461" style="display:inline-block;background:#22c55e;color:white;font-size:13px;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;">
        💬 WhatsApp: 0852-6864-5461
      </a>
      <p style="color:#94a3b8;font-size:11px;margin:10px 0 0;">cs@bengkulutravel.com · bengkulutravel.com</p>
    </div>
  </div>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:16px;text-align:center;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">© ${new Date().getFullYear()} Travel Bengkulu</p>
  </div>
</div>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// POST: Konfirmasi Pembayaran
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID diperlukan' }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }
    if (order.status === 'success') {
      return NextResponse.json({ error: 'Pesanan sudah dikonfirmasi sebelumnya' }, { status: 400 });
    }

    // Update status → success
    const updated = await updateOrderStatus(orderId, 'success');
    if (!updated) {
      return NextResponse.json({ error: 'Gagal update status' }, { status: 500 });
    }

    const fromEmail = process.env.EMAIL_FROM || 'noreply@bengkulutravel.com';
    const adminEmail = process.env.EMAIL_ADMIN || 'cs@bengkulutravel.com';

    // Inisialisasi Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailPromises = [];

    // ── 1. Kirim tiket ke pelanggan jika ada email ──
    const pelangganEmail = (updated.email || '').trim();
    if (pelangganEmail) {
      console.log(`Mengirim tiket ke: ${pelangganEmail}`);
      emailPromises.push(
        resend.emails.send({
          from: `Travel Bengkulu <${fromEmail}>`,
          to: pelangganEmail,
          subject: `✅ Tiket Perjalanan ${updated.route} — ${updated.id}`,
          html: generateTicketHTML(updated),
        }).then(result => {
          console.log('Email tiket terkirim:', result);
          return result;
        }).catch(err => {
          console.error('Gagal kirim email tiket:', err);
          throw err;
        })
      );
    } else {
      console.log('Pelanggan tidak memiliki email, skip kirim tiket');
    }

    // ── 2. Notifikasi admin ──
    emailPromises.push(
      resend.emails.send({
        from: `Travel Bengkulu <${fromEmail}>`,
        to: adminEmail,
        subject: `✅ Dikonfirmasi: ${updated.id} — ${updated.route}`,
        html: `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
  <h2 style="color:#0f766e;">✅ Pesanan Berhasil Dikonfirmasi</h2>
  <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
    <tr style="background:#f8fafc;"><td style="padding:10px 12px;color:#64748b;width:35%;">No. Pesanan</td><td style="padding:10px 12px;font-weight:700;font-family:monospace;">${updated.id}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Nama</td><td style="padding:10px 12px;font-weight:600;">${updated.name}</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:10px 12px;color:#64748b;">No. HP</td><td style="padding:10px 12px;font-weight:600;">${updated.phone}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Email</td><td style="padding:10px 12px;font-weight:600;">${updated.email || '—'}</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:10px 12px;color:#64748b;">Rute</td><td style="padding:10px 12px;font-weight:600;">${updated.route}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Tanggal</td><td style="padding:10px 12px;font-weight:600;">${updated.date}</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:10px 12px;color:#64748b;">Penumpang</td><td style="padding:10px 12px;font-weight:600;">${updated.passengers} orang</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Jemput di</td><td style="padding:10px 12px;font-weight:600;">${updated.pickup}</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:10px 12px;color:#64748b;">Metode</td><td style="padding:10px 12px;font-weight:600;">${updated.paymentMethod || 'QRIS'}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Total</td><td style="padding:10px 12px;font-weight:800;color:#0f766e;font-size:16px;">${formatRp(updated.total)}</td></tr>
  </table>
  <div style="margin-top:16px;text-align:center;">
    <a href="https://wa.me/${updated.phone.replace(/\D/g,'')}" style="display:inline-block;background:#22c55e;color:white;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:13px;">
      💬 Hubungi ${updated.name} via WhatsApp
    </a>
  </div>
  ${pelangganEmail ? `<p style="color:#64748b;font-size:12px;text-align:center;margin-top:12px;">📧 Tiket sudah dikirim ke: ${pelangganEmail}</p>` : '<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:12px;">Pelanggan tidak memiliki email</p>'}
</div>`,
      })
    );

    // Jalankan semua email
    const results = await Promise.allSettled(emailPromises);
    const emailGagal = results.filter(r => r.status === 'rejected');

    if (emailGagal.length > 0) {
      console.error('Beberapa email gagal:', emailGagal);
    }

    return NextResponse.json({
      success: true,
      message: pelangganEmail
        ? `Pesanan dikonfirmasi & tiket dikirim ke ${pelangganEmail}`
        : 'Pesanan dikonfirmasi (pelanggan tidak ada email)',
      emailSent: pelangganEmail ? true : false,
    });

  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.json({
      error: 'Terjadi kesalahan: ' + (error instanceof Error ? error.message : 'Unknown'),
    }, { status: 500 });
  }
}
