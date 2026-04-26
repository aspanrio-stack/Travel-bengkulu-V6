/**
 * API: POST /api/admin/send-invoice
 * Kirim invoice manual ke email pelanggan.
 * Dipanggil oleh admin dari dashboard — terpisah dari tiket otomatis.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, formatRp } from '@/lib/orders';
import { getSession } from '@/lib/auth';
import { Resend } from 'resend';

// ─────────────────────────────────────────────
// Template HTML Invoice
// ─────────────────────────────────────────────
function generateInvoiceHTML(order: {
  id: string;
  name: string;
  phone: string;
  email?: string;
  route: string;
  date: string;
  passengers: number;
  pickup: string;
  dropoff?: string;
  harga: number;
  kodeUnik: number;
  total: number;
  paymentMethod: string;
  confirmedAt?: string;
}) {
  const tglInvoice = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const metodeBayar = order.paymentMethod === 'tunai'
    ? 'Tunai (Bayar ke Driver)'
    : 'QRIS';

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Travel Bengkulu — ${order.id}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">

  <!-- Header Invoice -->
  <div style="background:white;border-radius:16px 16px 0 0;border:1px solid #e2e8f0;border-bottom:none;padding:32px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px;">

      <!-- Logo & Nama Perusahaan -->
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:48px;height:48px;background:#0f766e;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <span style="color:white;font-size:22px;font-weight:900;line-height:1;">T</span>
        </div>
        <div>
          <p style="font-size:18px;font-weight:800;color:#0f172a;margin:0;">Travel Bengkulu</p>
          <p style="font-size:12px;color:#64748b;margin:2px 0 0;">bengkulutravel.com</p>
        </div>
      </div>

      <!-- Info Invoice -->
      <div style="text-align:right;">
        <p style="font-size:22px;font-weight:800;color:#0f766e;margin:0;">INVOICE</p>
        <p style="font-size:12px;color:#64748b;margin:4px 0 0;">No: <strong style="color:#0f172a;font-family:monospace;">${order.id}</strong></p>
        <p style="font-size:12px;color:#64748b;margin:2px 0 0;">Tanggal: ${tglInvoice}</p>
      </div>
    </div>
  </div>

  <!-- Garis pemisah warna -->
  <div style="height:4px;background:linear-gradient(90deg,#0f766e,#14b8a6);"></div>

  <!-- Body Invoice -->
  <div style="background:white;border:1px solid #e2e8f0;border-top:none;border-bottom:none;padding:32px;">

    <!-- Info Penagihan -->
    <div style="display:flex;gap:32px;flex-wrap:wrap;margin-bottom:28px;">
      <div style="flex:1;min-width:200px;">
        <p style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Ditagihkan Kepada</p>
        <p style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 4px;">${order.name}</p>
        <p style="font-size:13px;color:#475569;margin:0 0 2px;">📱 ${order.phone}</p>
        ${order.email ? `<p style="font-size:13px;color:#475569;margin:0;">✉️ ${order.email}</p>` : ''}
      </div>
      <div style="flex:1;min-width:200px;">
        <p style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Detail Perjalanan</p>
        <p style="font-size:15px;font-weight:700;color:#0f766e;margin:0 0 4px;">${order.route}</p>
        <p style="font-size:13px;color:#475569;margin:0 0 2px;">📅 ${order.date}</p>
        <p style="font-size:13px;color:#475569;margin:0;">👥 ${order.passengers} penumpang</p>
      </div>
    </div>

    <!-- Tabel Item -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <thead>
        <tr style="background:#f1f5f9;">
          <th style="padding:10px 14px;text-align:left;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;border-radius:6px 0 0 6px;">Deskripsi</th>
          <th style="padding:10px 14px;text-align:center;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Qty</th>
          <th style="padding:10px 14px;text-align:right;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Harga Satuan</th>
          <th style="padding:10px 14px;text-align:right;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;border-radius:0 6px 6px 0;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:14px;font-size:14px;color:#0f172a;">
            <strong>Tiket Travel ${order.route}</strong>
            <br>
            <span style="font-size:12px;color:#64748b;">Jemput: ${order.pickup}</span>
            ${order.dropoff ? `<br><span style="font-size:12px;color:#64748b;">Antar: ${order.dropoff}</span>` : ''}
          </td>
          <td style="padding:14px;text-align:center;font-size:14px;color:#0f172a;">${order.passengers}</td>
          <td style="padding:14px;text-align:right;font-size:14px;color:#0f172a;">${formatRp(order.harga)}</td>
          <td style="padding:14px;text-align:right;font-size:14px;font-weight:600;color:#0f172a;">${formatRp(order.harga * order.passengers)}</td>
        </tr>
        ${order.kodeUnik > 0 ? `
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:14px;font-size:13px;color:#64748b;" colspan="3">Kode Unik Verifikasi</td>
          <td style="padding:14px;text-align:right;font-size:13px;color:#64748b;">+${formatRp(order.kodeUnik)}</td>
        </tr>` : ''}
      </tbody>
    </table>

    <!-- Total -->
    <div style="background:#f8fafc;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:13px;color:#64748b;">Metode Pembayaran</span>
        <span style="font-size:13px;font-weight:600;color:#0f172a;">${metodeBayar}</span>
      </div>
      <div style="border-top:1px dashed #e2e8f0;padding-top:12px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:15px;font-weight:700;color:#0f172a;">TOTAL</span>
        <span style="font-size:22px;font-weight:800;color:#0f766e;">${formatRp(order.total)}</span>
      </div>
      <div style="margin-top:8px;text-align:right;">
        <span style="display:inline-block;background:#dcfce7;color:#16a34a;font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;">✅ LUNAS</span>
      </div>
    </div>

    <!-- Catatan -->
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:700;color:#92400e;margin:0 0 6px;">📋 Catatan</p>
      <p style="font-size:12px;color:#78350f;margin:0;line-height:1.7;">
        Invoice ini adalah bukti pembayaran resmi. Simpan email ini sebagai referensi perjalanan Anda.
        Tunjukkan nomor pesanan <strong>${order.id}</strong> kepada driver saat penjemputan.
      </p>
    </div>

    <!-- Kontak -->
    <div style="text-align:center;padding-top:16px;border-top:1px solid #f1f5f9;">
      <p style="font-size:13px;color:#64748b;margin:0 0 12px;">Ada pertanyaan? Hubungi kami</p>
      <a href="https://wa.me/6285268645461" style="display:inline-block;background:#22c55e;color:white;font-size:13px;font-weight:700;padding:10px 24px;border-radius:10px;text-decoration:none;margin-right:8px;">
        💬 WhatsApp
      </a>
      <a href="mailto:cs@bengkulutravel.com" style="display:inline-block;background:#0f766e;color:white;font-size:13px;font-weight:700;padding:10px 24px;border-radius:10px;text-decoration:none;">
        ✉️ Email CS
      </a>
    </div>
  </div>

  <!-- Footer -->
  <div style="background:#f1f5f9;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:20px;text-align:center;">
    <p style="font-size:12px;color:#94a3b8;margin:0;">
      © ${new Date().getFullYear()} Travel Bengkulu · BTN Air Bang Curup, Bengkulu
      <br>
      <a href="https://bengkulutravel.com" style="color:#0d9488;">bengkulutravel.com</a>
       · cs@bengkulutravel.com · 0852-6864-5461
    </p>
  </div>

</div>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// POST: Kirim Invoice ke Email Pelanggan
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
      return NextResponse.json({ error: 'Order ID diperlukan' }, { status: 400 });
    }

    // Ambil data pesanan
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    // Cek apakah ada email pelanggan
    const emailPelanggan = (order.email || '').trim();
    if (!emailPelanggan) {
      return NextResponse.json({
        error: 'Pelanggan tidak memiliki alamat email. Invoice tidak bisa dikirim.',
      }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.EMAIL_FROM || 'noreply@bengkulutravel.com';

    // Kirim invoice ke pelanggan
    const result = await resend.emails.send({
      from: `Travel Bengkulu <${fromEmail}>`,
      to: emailPelanggan,
      subject: `🧾 Invoice Perjalanan ${order.route} — ${order.id}`,
      html: generateInvoiceHTML(order),
    });

    console.log('Invoice terkirim:', result);

    // Kirim notifikasi ke admin
    const adminEmail = process.env.EMAIL_ADMIN || 'cs@bengkulutravel.com';
    await resend.emails.send({
      from: `Travel Bengkulu <${fromEmail}>`,
      to: adminEmail,
      subject: `📤 Invoice Dikirim: ${order.id} → ${emailPelanggan}`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;max-width:480px;">
          <h3 style="color:#0f766e;">✅ Invoice Berhasil Dikirim</h3>
          <p>Invoice untuk pesanan <strong>${order.id}</strong> telah dikirim ke:</p>
          <p style="background:#f0fdf4;padding:12px;border-radius:8px;font-weight:700;color:#16a34a;">${emailPelanggan}</p>
          <table style="width:100%;font-size:13px;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#64748b;">Nama</td><td style="padding:6px 0;font-weight:600;">${order.name}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Rute</td><td style="padding:6px 0;font-weight:600;">${order.route}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Total</td><td style="padding:6px 0;font-weight:700;color:#0f766e;">${formatRp(order.total)}</td></tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `Invoice berhasil dikirim ke ${emailPelanggan}`,
    });

  } catch (error) {
    console.error('Send invoice error:', error);
    return NextResponse.json({
      error: 'Gagal mengirim invoice: ' + (error instanceof Error ? error.message : 'Unknown'),
    }, { status: 500 });
  }
}
