import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateTicketHTML(data: {
  orderId: string;
  name: string;
  phone: string;
  email: string;
  route: string;
  date: string;
  passengers: string;
  amount: string;
  paymentType: string;
  pickup: string;
  dropoff: string;
}) {
  const { orderId, name, phone, route, date, passengers, amount, pickup, dropoff } = data;

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tiket Travel Bengkulu - ${orderId}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f766e,#0d9488);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:14px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
        <span style="color:white;font-size:28px;font-weight:900;">T</span>
      </div>
      <h1 style="color:white;font-size:24px;font-weight:800;margin:0 0 4px;">Travel Bengkulu</h1>
      <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">Tiket Perjalanan Resmi</p>
    </div>

    <!-- Ticket Body -->
    <div style="background:white;padding:32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">

      <!-- Status -->
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
        <p style="color:#16a34a;font-size:16px;font-weight:700;margin:0;">✅ Pembayaran Berhasil!</p>
        <p style="color:#4ade80;font-size:13px;margin:4px 0 0;">Tiket Anda sudah dikonfirmasi</p>
      </div>

      <!-- Order ID -->
      <div style="background:#f8fafc;border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="color:#64748b;font-size:12px;font-weight:600;letter-spacing:1px;margin:0 0 4px;">NOMOR PESANAN</p>
        <p style="color:#0f172a;font-size:20px;font-weight:800;margin:0;font-family:monospace;">${orderId}</p>
      </div>

      <!-- Rute -->
      <div style="margin-bottom:24px;">
        <p style="color:#64748b;font-size:12px;font-weight:600;letter-spacing:1px;margin:0 0 12px;">DETAIL PERJALANAN</p>
        <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:12px;padding:20px;">
          <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:16px;">
            <span style="color:#0f766e;font-size:18px;font-weight:800;">${route.split(' ke ')[0] || route.split('→')[0]?.trim()}</span>
            <span style="color:#0d9488;font-size:20px;">✈</span>
            <span style="color:#0f766e;font-size:18px;font-weight:800;">${route.split(' ke ')[1] || route.split('→')[1]?.trim()}</span>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;width:40%;">Tanggal</td>
              <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${date}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;">Penumpang</td>
              <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${passengers} orang</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;">Jemput di</td>
              <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${pickup || '-'}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;">Antar ke</td>
              <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${dropoff || '-'}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Data Penumpang -->
      <div style="margin-bottom:24px;">
        <p style="color:#64748b;font-size:12px;font-weight:600;letter-spacing:1px;margin:0 0 12px;">DATA PENUMPANG</p>
        <div style="background:#f8fafc;border-radius:12px;padding:16px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;width:40%;">Nama</td>
              <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#64748b;font-size:13px;">No. HP</td>
              <td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${phone}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Total -->
      <div style="background:#0f766e;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <p style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:600;margin:0 0 4px;">TOTAL PEMBAYARAN</p>
        <p style="color:white;font-size:28px;font-weight:800;margin:0;">${amount}</p>
      </div>

      <!-- Instruksi -->
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="color:#92400e;font-size:13px;font-weight:700;margin:0 0 8px;">📋 Instruksi Penting</p>
        <ul style="color:#78350f;font-size:13px;margin:0;padding-left:20px;line-height:1.8;">
          <li>Tunjukkan email ini atau nomor pesanan kepada driver</li>
          <li>Siapkan diri <strong>15 menit sebelum</strong> waktu penjemputan</li>
          <li>Driver akan menghubungi Anda sebelum tiba</li>
          <li>Bawa identitas diri (KTP/SIM)</li>
        </ul>
      </div>

      <!-- Kontak -->
      <div style="text-align:center;">
        <p style="color:#64748b;font-size:13px;margin:0 0 12px;">Ada pertanyaan? Hubungi kami:</p>
        <a href="https://wa.me/6285268645461" style="display:inline-block;background:#22c55e;color:white;font-size:14px;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;">
          💬 WhatsApp: 0852-6864-5461
        </a>
        <p style="color:#94a3b8;font-size:12px;margin:12px 0 0;">
          Email CS: <a href="mailto:cs@bengkulutravel.com" style="color:#0d9488;">cs@bengkulutravel.com</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:20px;text-align:center;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        © ${new Date().getFullYear()} Travel Bengkulu — BTN Air Bang Curup, Bengkulu<br>
        <a href="https://bengkulutravel.com" style="color:#0d9488;">bengkulutravel.com</a>
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      name,
      phone,
      email,
      route,
      date,
      passengers,
      amount,
      paymentType,
      pickup,
      dropoff,
    } = body;

    const adminEmail = process.env.EMAIL_ADMIN || 'cs@bengkulutravel.com';
    const fromEmail = process.env.EMAIL_FROM || 'noreply@bengkulutravel.com';

    const ticketHTML = generateTicketHTML({
      orderId,
      name,
      phone,
      email,
      route,
      date,
      passengers,
      amount,
      paymentType,
      pickup,
      dropoff,
    });

    const emailPromises = [];

    // 1. Kirim tiket ke pelanggan (jika ada email)
    if (email) {
      emailPromises.push(
        resend.emails.send({
          from: `Travel Bengkulu <${fromEmail}>`,
          to: email,
          subject: `✅ Tiket Perjalanan ${route} — ${orderId}`,
          html: ticketHTML,
        })
      );
    }

    // 2. Kirim notifikasi ke admin
    emailPromises.push(
      resend.emails.send({
        from: `Travel Bengkulu <${fromEmail}>`,
        to: adminEmail,
        subject: `🚗 Pesanan Baru: ${orderId} — ${route}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px;">
            <h2 style="color:#0f766e;">🚗 Pesanan Baru Masuk!</h2>
            <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;padding:16px;">
              <tr><td style="padding:8px;color:#64748b;width:40%;">No. Pesanan</td><td style="padding:8px;font-weight:700;font-family:monospace;">${orderId}</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Nama</td><td style="padding:8px;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px;color:#64748b;">No. HP</td><td style="padding:8px;font-weight:600;">${phone}</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Rute</td><td style="padding:8px;font-weight:600;">${route}</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Tanggal</td><td style="padding:8px;font-weight:600;">${date}</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Penumpang</td><td style="padding:8px;font-weight:600;">${passengers} orang</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Jemput</td><td style="padding:8px;font-weight:600;">${pickup}</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Tujuan</td><td style="padding:8px;font-weight:600;">${dropoff || '-'}</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Total</td><td style="padding:8px;font-weight:800;color:#0f766e;font-size:18px;">${amount}</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Pembayaran</td><td style="padding:8px;font-weight:600;">${paymentType}</td></tr>
            </table>
            <div style="margin-top:16px;padding:12px;background:#f0fdf4;border-radius:8px;text-align:center;">
              <a href="https://wa.me/${phone.replace(/\D/g, '')}" style="color:#16a34a;font-weight:700;text-decoration:none;">
                💬 Hubungi Penumpang via WhatsApp
              </a>
            </div>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Send ticket error:', error);
    return NextResponse.json({ error: 'Gagal mengirim tiket' }, { status: 500 });
  }
}
