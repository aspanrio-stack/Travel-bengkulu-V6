/**
 * API: POST /api/send-ticket
 * Kirim tiket ke email pelanggan dengan lampiran PDF.
 *
 * Perlu tambahkan ke package.json:
 *   "pdf-lib": "^1.17.1"
 * lalu jalankan: npm install
 */
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─────────────────────────────────────────────
// Generate PDF Tiket (binary Buffer)
// ─────────────────────────────────────────────
async function generateTicketPDF(data: {
  orderId: string;
  name: string;
  phone: string;
  route: string;
  date: string;
  passengers: string;
  amount: string;
  pickup: string;
  dropoff: string;
  departureTime?: string;
}): Promise<Uint8Array> {
  const { orderId, name, phone, route, date, passengers, amount, pickup, dropoff, departureTime } = data;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const margin = 48;
  const contentW = width - margin * 2;

  // ── Warna utama ──
  const teal    = rgb(0.059, 0.463, 0.431); // #0f766e
  const tealLt  = rgb(0.082, 0.596, 0.565); // #14988f
  const white   = rgb(1, 1, 1);
  const dark    = rgb(0.059, 0.090, 0.161); // #0f1729
  const gray    = rgb(0.392, 0.455, 0.545); // #647487
  const green   = rgb(0.086, 0.643, 0.361); // #16a35c
  const bgLight = rgb(0.976, 0.980, 0.988); // #f9fafb
  const yellow  = rgb(1.000, 0.980, 0.878); // #fffbeb
  const yBorder = rgb(0.992, 0.906, 0.533); // #fde68a

  // ── Header hijau ──
  page.drawRectangle({ x: 0, y: height - 130, width, height: 130, color: teal });

  // Logo box
  page.drawRectangle({ x: margin, y: height - 100, width: 44, height: 44, color: tealLt });
  page.drawText('T', { x: margin + 14, y: height - 84, size: 22, font: fontBold, color: white });

  // Judul header
  page.drawText('Travel Bengkulu', { x: margin + 56, y: height - 72, size: 18, font: fontBold, color: white });
  page.drawText('Tiket Perjalanan Resmi', { x: margin + 56, y: height - 90, size: 10, font: fontReg, color: rgb(0.8, 0.95, 0.93) });

  // Nomor order di kanan atas
  page.drawText('TIKET', { x: width - margin - 80, y: height - 62, size: 11, font: fontBold, color: rgb(0.8, 0.95, 0.93) });
  page.drawText(orderId, { x: width - margin - 80, y: height - 78, size: 9, font: fontBold, color: white });

  let y = height - 155;

  // ── Status box hijau ──
  page.drawRectangle({ x: margin, y: y - 14, width: contentW, height: 34, color: rgb(0.94, 0.99, 0.96), borderColor: rgb(0.53, 0.94, 0.65), borderWidth: 1 });
  page.drawText('✓  Pembayaran Berhasil — Tiket Dikonfirmasi', { x: margin + 16, y: y - 2, size: 11, font: fontBold, color: green });
  y -= 46;

  // ── Nomor Pesanan ──
  page.drawRectangle({ x: margin, y: y - 28, width: contentW, height: 48, color: bgLight });
  page.drawText('NOMOR PESANAN', { x: margin + 16, y: y - 4, size: 8, font: fontBold, color: gray });
  page.drawText(orderId, { x: margin + 16, y: y - 20, size: 16, font: fontBold, color: dark });
  y -= 60;

  // ── DETAIL PERJALANAN ──
  page.drawText('DETAIL PERJALANAN', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  page.drawRectangle({ x: margin, y: y - 110, width: contentW, height: 120, color: rgb(0.94, 0.99, 0.97), borderColor: rgb(0.60, 0.96, 0.89), borderWidth: 1 });

  // Rute besar tengah
  const [fromCity, toCity] = route.includes('→')
    ? route.split('→').map(s => s.trim())
    : route.split(' ke ').map(s => s.trim());

  const fromW = fontBold.widthOfTextAtSize(fromCity || '', 15);
  const arrowX = margin + 16 + fromW + 8;
  page.drawText(fromCity || route, { x: margin + 16, y: y - 22, size: 15, font: fontBold, color: teal });
  page.drawText('→', { x: arrowX, y: y - 22, size: 15, font: fontBold, color: tealLt });
  page.drawText(toCity || '', { x: arrowX + 20, y: y - 22, size: 15, font: fontBold, color: teal });

  // Grid info
  const col2 = margin + contentW / 2;
  const rows: [string, string][] = [
    ['Tanggal', date],
    ['Penumpang', `${passengers} orang`],
    ['Jemput di', pickup || '-'],
    ['Antar ke', dropoff || '-'],
  ];
  if (departureTime) rows.splice(1, 0, ['Jam Berangkat', departureTime]);

  rows.forEach(([label, val], i) => {
    const ry = y - 44 - i * 18;
    page.drawText(label, { x: margin + 16, y: ry, size: 9, font: fontReg, color: gray });
    page.drawText(val.length > 36 ? val.slice(0, 36) + '…' : val, { x: col2, y: ry, size: 9, font: fontBold, color: dark });
  });
  y -= 130;

  // ── DATA PENUMPANG ──
  page.drawText('DATA PENUMPANG', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  page.drawRectangle({ x: margin, y: y - 50, width: contentW, height: 60, color: bgLight });
  page.drawText('Nama', { x: margin + 16, y: y - 16, size: 9, font: fontReg, color: gray });
  page.drawText(name, { x: col2, y: y - 16, size: 9, font: fontBold, color: dark });
  page.drawText('No. HP', { x: margin + 16, y: y - 34, size: 9, font: fontReg, color: gray });
  page.drawText(phone, { x: col2, y: y - 34, size: 9, font: fontBold, color: dark });
  y -= 72;

  // ── TOTAL ──
  page.drawRectangle({ x: margin, y: y - 46, width: contentW, height: 56, color: teal });
  page.drawText('TOTAL PEMBAYARAN', { x: margin + 16, y: y - 14, size: 8, font: fontBold, color: rgb(0.8, 0.95, 0.93) });
  page.drawText(amount, { x: margin + 16, y: y - 34, size: 22, font: fontBold, color: white });
  y -= 68;

  // ── INSTRUKSI ──
  page.drawRectangle({ x: margin, y: y - 78, width: contentW, height: 88, color: yellow, borderColor: yBorder, borderWidth: 1 });
  page.drawText('INSTRUKSI PENTING', { x: margin + 16, y: y - 14, size: 8, font: fontBold, color: rgb(0.57, 0.25, 0.055) });

  const instruksi = [
    `• Tunjukkan tiket ini atau nomor pesanan ${orderId} kepada driver`,
    '• Siapkan diri 15 menit sebelum waktu penjemputan',
    '• Driver akan menghubungi Anda sebelum tiba',
    '• Bawa identitas diri (KTP/SIM)',
  ];
  instruksi.forEach((line, i) => {
    page.drawText(line, { x: margin + 16, y: y - 30 - i * 14, size: 8.5, font: fontReg, color: rgb(0.47, 0.21, 0.043) });
  });
  y -= 100;

  // ── FOOTER ──
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.88, 0.91, 0.94) });
  y -= 16;
  page.drawText('Travel Bengkulu  ·  BTN Air Bang Curup, Bengkulu', { x: margin, y, size: 8, font: fontReg, color: gray });
  page.drawText('bengkulutravel.com  ·  cs@bengkulutravel.com  ·  0852-6864-5461', { x: margin, y: y - 14, size: 8, font: fontReg, color: gray });

  return pdfDoc.save();
}

// ─────────────────────────────────────────────
// Template HTML Tiket Email
// ─────────────────────────────────────────────
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
  departureTime?: string;
}) {
  const { orderId, name, phone, route, date, passengers, amount, pickup, dropoff, departureTime } = data;

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

    <div style="background:linear-gradient(135deg,#0f766e,#0d9488);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:14px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
        <span style="color:white;font-size:28px;font-weight:900;">T</span>
      </div>
      <h1 style="color:white;font-size:24px;font-weight:800;margin:0 0 4px;">Travel Bengkulu</h1>
      <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">Tiket Perjalanan Resmi</p>
    </div>

    <div style="background:white;padding:32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">

      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
        <p style="color:#16a34a;font-size:16px;font-weight:700;margin:0;">✅ Pembayaran Berhasil!</p>
        <p style="color:#4ade80;font-size:13px;margin:4px 0 0;">Tiket Anda sudah dikonfirmasi</p>
      </div>

      <div style="background:#f8fafc;border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="color:#64748b;font-size:12px;font-weight:600;letter-spacing:1px;margin:0 0 4px;">NOMOR PESANAN</p>
        <p style="color:#0f172a;font-size:20px;font-weight:800;margin:0;font-family:monospace;">${orderId}</p>
      </div>

      <div style="margin-bottom:24px;">
        <p style="color:#64748b;font-size:12px;font-weight:600;letter-spacing:1px;margin:0 0 12px;">DETAIL PERJALANAN</p>
        <div style="background:#f0fdf9;border:1px solid #99f6e4;border-radius:12px;padding:20px;">
          <div style="text-align:center;margin-bottom:16px;">
            <span style="color:#0f766e;font-size:18px;font-weight:800;">${route.split('→')[0]?.trim() || route.split(' ke ')[0]}</span>
            <span style="color:#0d9488;font-size:20px;margin:0 8px;">→</span>
            <span style="color:#0f766e;font-size:18px;font-weight:800;">${route.split('→')[1]?.trim() || route.split(' ke ')[1]}</span>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px;width:40%;">Tanggal</td><td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${date}</td></tr>
            ${departureTime ? `<tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Jam Berangkat</td><td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${departureTime}</td></tr>` : ''}
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Penumpang</td><td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${passengers} orang</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Jemput di</td><td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${pickup || '-'}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">Antar ke</td><td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${dropoff || '-'}</td></tr>
          </table>
        </div>
      </div>

      <div style="margin-bottom:24px;">
        <p style="color:#64748b;font-size:12px;font-weight:600;letter-spacing:1px;margin:0 0 12px;">DATA PENUMPANG</p>
        <div style="background:#f8fafc;border-radius:12px;padding:16px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px;width:40%;">Nama</td><td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;font-size:13px;">No. HP</td><td style="padding:6px 0;color:#0f172a;font-size:13px;font-weight:600;">${phone}</td></tr>
          </table>
        </div>
      </div>

      <div style="background:#0f766e;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <p style="color:rgba(255,255,255,0.7);font-size:12px;font-weight:600;margin:0 0 4px;">TOTAL PEMBAYARAN</p>
        <p style="color:white;font-size:28px;font-weight:800;margin:0;">${amount}</p>
      </div>

      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="color:#92400e;font-size:13px;font-weight:700;margin:0 0 8px;">📋 Instruksi Penting</p>
        <ul style="color:#78350f;font-size:13px;margin:0;padding-left:20px;line-height:1.8;">
          <li>Tunjukkan email ini atau nomor pesanan kepada driver</li>
          <li>Siapkan diri <strong>15 menit sebelum</strong> waktu penjemputan</li>
          <li>Driver akan menghubungi Anda sebelum tiba</li>
          <li>Bawa identitas diri (KTP/SIM)</li>
        </ul>
      </div>

      <p style="color:#64748b;font-size:12px;text-align:center;margin:0 0 8px;">
        📎 <strong>Tiket PDF</strong> terlampir di email ini — simpan sebagai bukti perjalanan.
      </p>

      <div style="text-align:center;">
        <a href="https://wa.me/6285268645461" style="display:inline-block;background:#22c55e;color:white;font-size:14px;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;">
          💬 WhatsApp: 0852-6864-5461
        </a>
        <p style="color:#94a3b8;font-size:12px;margin:12px 0 0;">
          Email CS: <a href="mailto:cs@bengkulutravel.com" style="color:#0d9488;">cs@bengkulutravel.com</a>
        </p>
      </div>
    </div>

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

// ─────────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────────
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
      departureTime,
    } = body;

    const adminEmail = process.env.EMAIL_ADMIN || 'cs@bengkulutravel.com';
    const fromEmail  = process.env.EMAIL_FROM  || 'noreply@bengkulutravel.com';

    const ticketHTML = generateTicketHTML({
      orderId, name, phone, email, route, date,
      passengers, amount, paymentType, pickup, dropoff, departureTime,
    });

    const emailPromises = [];

    // 1. Kirim tiket ke pelanggan (jika ada email) — dengan PDF attachment
    if (email) {
      // Generate PDF
      const pdfBytes = await generateTicketPDF({
        orderId, name, phone, route, date,
        passengers, amount, pickup, dropoff, departureTime,
      });

      const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

      emailPromises.push(
        resend.emails.send({
          from: `Travel Bengkulu <${fromEmail}>`,
          to: email,
          subject: `✅ Tiket Perjalanan ${route} — ${orderId}`,
          html: ticketHTML,
          attachments: [
            {
              filename: `Tiket-${orderId}.pdf`,
              content: pdfBase64,
            },
          ],
        })
      );
    }

    // 2. Notifikasi ke admin (tanpa PDF untuk hemat kuota)
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
              ${departureTime ? `<tr><td style="padding:8px;color:#64748b;">Jam Berangkat</td><td style="padding:8px;font-weight:600;">${departureTime}</td></tr>` : ''}
              <tr><td style="padding:8px;color:#64748b;">Penumpang</td><td style="padding:8px;font-weight:600;">${passengers} orang</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Jemput</td><td style="padding:8px;font-weight:600;">${pickup}</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Tujuan</td><td style="padding:8px;font-weight:600;">${dropoff || '-'}</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Total</td><td style="padding:8px;font-weight:800;color:#0f766e;font-size:18px;">${amount}</td></tr>
              <tr><td style="padding:8px;color:#64748b;">Pembayaran</td><td style="padding:8px;font-weight:600;">${paymentType}</td></tr>
            </table>
            <div style="margin-top:16px;padding:12px;background:#f0fdf4;border-radius:8px;text-align:center;">
              <a href="https://wa.me/${(phone || '').replace(/\D/g, '')}" style="color:#16a34a;font-weight:700;text-decoration:none;">
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
