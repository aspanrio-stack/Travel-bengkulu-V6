/**
 * API: POST /api/admin/confirm
 * Konfirmasi pembayaran:
 * 1. Update status → 'success'
 * 2. Kirim email tiket + PDF ke pelanggan jika ada email
 * 3. Kirim notifikasi ke admin dengan link WA template pesan
 */
import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus, formatRp } from '@/lib/orders';
import { getSession } from '@/lib/auth';
import { Resend } from 'resend';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// ─────────────────────────────────────────────
// Normalize nomor HP → format 62xxx
// ─────────────────────────────────────────────
function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  if (!digits.startsWith('62')) digits = '62' + digits;
  return digits;
}

// ─────────────────────────────────────────────
// Generate WhatsApp link dengan template pesan
// ─────────────────────────────────────────────
function generateWALink(order: {
  id: string; name: string; phone: string; route: string;
  date: string; passengers: number; total: number;
  pickup: string; dropoff?: string;
  departureTime?: string; email?: string;
}): string {
  const lines = [
    `Assalamualaikum / Halo *${order.name}*,`,
    '',
    `Pembayaran Anda telah kami *konfirmasi* ✅`,
    '',
    `*Detail Perjalanan:*`,
    `🚗 Rute    : ${order.route}`,
    `📅 Tanggal : ${order.date}`,
    order.departureTime ? `🕐 Jam     : ${order.departureTime}` : '',
    `👥 Penumpang: ${order.passengers} orang`,
    `📍 Jemput  : ${order.pickup}`,
    order.dropoff ? `🏁 Tujuan  : ${order.dropoff}` : '',
    `💰 Total   : ${formatRp(order.total)}`,
    '',
    `No. Pesanan: *${order.id}*`,
    '',
    order.email
      ? `Tiket perjalanan sudah dikirim ke email *${order.email}* 📧`
      : `Mohon simpan nomor pesanan ini sebagai bukti.`,
    '',
    `Harap siap *15 menit* sebelum penjemputan. Driver kami akan menghubungi Anda.`,
    '',
    `Terima kasih telah mempercayai *Travel Bengkulu* 🙏`,
  ].filter(l => l !== null && l !== undefined);

  const text = lines.join('\n');
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${normalizePhone(order.phone)}?text=${encoded}`;
}

// ─────────────────────────────────────────────
// Generate PDF Tiket
// ─────────────────────────────────────────────
async function generateTicketPDF(order: {
  id: string; name: string; phone: string; route: string;
  date: string; passengers: number; total: number;
  pickup: string; dropoff?: string; departureTime?: string;
}): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage([595, 842]); // A4

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const margin   = 48;
  const contentW = width - margin * 2;
  const col2     = margin + contentW / 2;

  const teal   = rgb(0.059, 0.463, 0.431);
  const tealLt = rgb(0.082, 0.596, 0.565);
  const white  = rgb(1, 1, 1);
  const dark   = rgb(0.059, 0.090, 0.161);
  const gray   = rgb(0.392, 0.455, 0.545);
  const green  = rgb(0.086, 0.643, 0.361);
  const bgLight= rgb(0.976, 0.980, 0.988);
  const yellow = rgb(1.000, 0.980, 0.878);
  const yBorder= rgb(0.992, 0.906, 0.533);

  // Header
  page.drawRectangle({ x: 0, y: height - 130, width, height: 130, color: teal });
  page.drawRectangle({ x: margin, y: height - 100, width: 44, height: 44, color: tealLt });
  page.drawText('T', { x: margin + 14, y: height - 84, size: 22, font: fontBold, color: white });
  page.drawText('Travel Bengkulu', { x: margin + 56, y: height - 72, size: 18, font: fontBold, color: white });
  page.drawText('Tiket Perjalanan Resmi', { x: margin + 56, y: height - 90, size: 10, font: fontReg, color: rgb(0.8, 0.95, 0.93) });
  page.drawText('TIKET', { x: width - margin - 80, y: height - 62, size: 11, font: fontBold, color: rgb(0.8, 0.95, 0.93) });
  page.drawText(order.id, { x: width - margin - 80, y: height - 78, size: 9, font: fontBold, color: white });

  let y = height - 155;

  // Status box
  page.drawRectangle({ x: margin, y: y - 14, width: contentW, height: 34, color: rgb(0.94, 0.99, 0.96), borderColor: rgb(0.53, 0.94, 0.65), borderWidth: 1 });
  page.drawText('Pembayaran Dikonfirmasi - Tiket Resmi', { x: margin + 16, y: y - 2, size: 11, font: fontBold, color: green });
  y -= 46;

  // Nomor pesanan
  page.drawRectangle({ x: margin, y: y - 28, width: contentW, height: 48, color: bgLight });
  page.drawText('NOMOR PESANAN', { x: margin + 16, y: y - 4, size: 8, font: fontBold, color: gray });
  page.drawText(order.id, { x: margin + 16, y: y - 20, size: 16, font: fontBold, color: dark });
  y -= 60;

  // Detail perjalanan
  page.drawText('DETAIL PERJALANAN', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  // Pisah rute: support ' -> ', ' ke ', spasi biasa
  const routeParts = order.route.includes('->')
    ? order.route.split('->').map(s => s.trim())
    : order.route.includes(' ke ')
    ? order.route.split(' ke ').map(s => s.trim())
    : [order.route, ''];

  const detailRows: [string, string][] = [
    ['Rute', `${routeParts[0]} -> ${routeParts[1] || ''}`],
    ['Tanggal', order.date],
    ...(order.departureTime ? [['Jam Berangkat', order.departureTime] as [string, string]] : []),
    ['Penumpang', `${order.passengers} orang`],
    ['Jemput di', order.pickup],
    ['Antar ke', order.dropoff || '-'],
  ];

  const detailH = detailRows.length * 18 + 20;
  page.drawRectangle({ x: margin, y: y - detailH, width: contentW, height: detailH, color: rgb(0.94, 0.99, 0.97), borderColor: rgb(0.60, 0.96, 0.89), borderWidth: 1 });
  detailRows.forEach(([label, val], i) => {
    const ry = y - 14 - i * 18;
    page.drawText(label, { x: margin + 16, y: ry, size: 9, font: fontReg, color: gray });
    const display = val.length > 38 ? val.slice(0, 38) + '...' : val;
    page.drawText(display, { x: col2, y: ry, size: 9, font: fontBold, color: dark });
  });
  y -= detailH + 16;

  // Data penumpang
  page.drawText('DATA PENUMPANG', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;
  page.drawRectangle({ x: margin, y: y - 50, width: contentW, height: 60, color: bgLight });
  page.drawText('Nama', { x: margin + 16, y: y - 16, size: 9, font: fontReg, color: gray });
  page.drawText(order.name, { x: col2, y: y - 16, size: 9, font: fontBold, color: dark });
  page.drawText('No. HP', { x: margin + 16, y: y - 34, size: 9, font: fontReg, color: gray });
  page.drawText(order.phone, { x: col2, y: y - 34, size: 9, font: fontBold, color: dark });
  y -= 72;

  // Total
  page.drawRectangle({ x: margin, y: y - 46, width: contentW, height: 56, color: teal });
  page.drawText('TOTAL PEMBAYARAN', { x: margin + 16, y: y - 14, size: 8, font: fontBold, color: rgb(0.8, 0.95, 0.93) });
  page.drawText(formatRp(order.total), { x: margin + 16, y: y - 34, size: 22, font: fontBold, color: white });
  y -= 68;

  // Instruksi
  page.drawRectangle({ x: margin, y: y - 78, width: contentW, height: 88, color: yellow, borderColor: yBorder, borderWidth: 1 });
  page.drawText('INSTRUKSI PENTING', { x: margin + 16, y: y - 14, size: 8, font: fontBold, color: rgb(0.57, 0.25, 0.055) });
  [
    `- Tunjukkan tiket ini / nomor pesanan ${order.id} kepada driver`,
    '-  Siapkan diri 15 menit sebelum penjemputan',
    '-  Driver akan menghubungi Anda sebelum tiba',
    '-  Bawa identitas diri (KTP/SIM)',
  ].forEach((line, i) => {
    page.drawText(line, { x: margin + 16, y: y - 30 - i * 14, size: 8.5, font: fontReg, color: rgb(0.47, 0.21, 0.043) });
  });
  y -= 100;

  // Footer
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.88, 0.91, 0.94) });
  y -= 16;
  page.drawText('Travel Bengkulu  |  BTN Air Bang Curup, Bengkulu', { x: margin, y, size: 8, font: fontReg, color: gray });
  page.drawText('bengkulutravel.com  |  cs@bengkulutravel.com  |  0852-6864-5461', { x: margin, y: y - 14, size: 8, font: fontReg, color: gray });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// ─────────────────────────────────────────────
// Template HTML Email Tiket
// ─────────────────────────────────────────────
function generateTicketHTML(order: {
  id: string; name: string; phone: string; email?: string;
  route: string; date: string; passengers: number;
  total: number; pickup: string; dropoff?: string;
  paymentMethod?: string; departureTime?: string;
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
        ${order.departureTime ? `<tr><td style="color:#64748b;padding:4px 0;">Jam Berangkat</td><td style="color:#0f172a;font-weight:600;">${order.departureTime}</td></tr>` : ''}
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
    </div>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px;margin-bottom:18px;">
      <p style="color:#92400e;font-size:13px;font-weight:700;margin:0 0 8px;">📋 Instruksi Penting</p>
      <ul style="color:#78350f;font-size:12px;margin:0;padding-left:18px;line-height:1.9;">
        <li>Tunjukkan email ini atau nomor pesanan kepada driver</li>
        <li>Tiket PDF terlampir di email ini 📎</li>
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

    const fromEmail  = process.env.EMAIL_FROM  || 'noreply@bengkulutravel.com';
    const adminEmail = process.env.EMAIL_ADMIN || 'cs@bengkulutravel.com';
    const resend     = new Resend(process.env.RESEND_API_KEY);

    // Ambil departureTime jika tersimpan di order (field tambahan)
    const departureTime = (updated as typeof updated & { departureTime?: string }).departureTime;

    const emailPromises = [];
    const pelangganEmail = (updated.email || '').trim();

    // ── 1. Kirim tiket + PDF ke pelanggan ──
    if (pelangganEmail) {
      // Generate PDF — gagal → tetap kirim email tanpa lampiran
      let pdfBuffer: Buffer | null = null;
      try {
        console.log('[PDF] Starting generation for order:', updated.id);
        pdfBuffer = await generateTicketPDF({
          id: updated.id,
          name: updated.name,
          phone: updated.phone,
          route: updated.route,
          date: updated.date,
          passengers: updated.passengers,
          total: updated.total,
          pickup: updated.pickup,
          dropoff: updated.dropoff,
          departureTime,
        });
        console.log('[PDF] Generated successfully, size:', pdfBuffer.length, 'bytes');
      } catch (pdfErr) {
        console.error('[PDF] Generation FAILED:', pdfErr);
        pdfBuffer = null;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emailPayload: any = {
        from: `Travel Bengkulu <${fromEmail}>`,
        to: pelangganEmail,
        subject: `✅ Tiket Perjalanan ${updated.route} — ${updated.id}`,
        html: generateTicketHTML({ ...updated, departureTime }),
      };

      // ✅ PERBAIKAN: konversi Buffer ke base64 string agar Resend bisa membaca attachment
      if (pdfBuffer) {
        emailPayload.attachments = [
          {
            filename: `Tiket-${updated.id}.pdf`,
            content: pdfBuffer.toString('base64'),
          },
        ];
      }

      emailPromises.push(
        resend.emails.send(emailPayload)
          .then(r => { console.log('Tiket terkirim:', r); return r; })
          .catch(e => { console.error('Gagal kirim tiket:', e); throw e; })
      );
    }

    // ── 2. Link WA dengan template pesan konfirmasi ──
    const waLink = generateWALink({
      id: updated.id,
      name: updated.name,
      phone: updated.phone,
      route: updated.route,
      date: updated.date,
      passengers: updated.passengers,
      total: updated.total,
      pickup: updated.pickup,
      dropoff: updated.dropoff,
      departureTime,
      email: pelangganEmail || undefined,
    });

    // ── 3. Notifikasi admin dengan tombol WA template ──
    emailPromises.push(
      resend.emails.send({
        from: `Travel Bengkulu <${fromEmail}>`,
        to: adminEmail,
        subject: `✅ Dikonfirmasi: ${updated.id} — ${updated.route}`,
        html: `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
  <h2 style="color:#0f766e;">✅ Pesanan Berhasil Dikonfirmasi</h2>
  <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e2e8f0;overflow:hidden;">
    <tr style="background:#f8fafc;"><td style="padding:10px 12px;color:#64748b;width:35%;">No. Pesanan</td><td style="padding:10px 12px;font-weight:700;font-family:monospace;">${updated.id}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Nama</td><td style="padding:10px 12px;font-weight:600;">${updated.name}</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:10px 12px;color:#64748b;">No. HP</td><td style="padding:10px 12px;font-weight:600;">${updated.phone}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Rute</td><td style="padding:10px 12px;font-weight:600;">${updated.route}</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:10px 12px;color:#64748b;">Tanggal</td><td style="padding:10px 12px;font-weight:600;">${updated.date}</td></tr>
    ${departureTime ? `<tr><td style="padding:10px 12px;color:#64748b;">Jam Berangkat</td><td style="padding:10px 12px;font-weight:600;">${departureTime}</td></tr>` : ''}
    <tr><td style="padding:10px 12px;color:#64748b;">Penumpang</td><td style="padding:10px 12px;font-weight:600;">${updated.passengers} orang</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:10px 12px;color:#64748b;">Total</td><td style="padding:10px 12px;font-weight:800;color:#0f766e;font-size:16px;">${formatRp(updated.total)}</td></tr>
  </table>

  <div style="margin-top:20px;text-align:center;">
    <a href="${waLink}"
       style="display:inline-block;background:#22c55e;color:white;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:14px;">
      💬 Kirim Konfirmasi ke ${updated.name} via WA
    </a>
    <p style="color:#64748b;font-size:11px;margin-top:8px;">
      Klik tombol di atas → WhatsApp terbuka dengan pesan konfirmasi otomatis
    </p>
  </div>

  ${pelangganEmail
    ? `<p style="color:#16a34a;font-size:12px;text-align:center;margin-top:12px;">📧 Tiket PDF sudah dikirim ke: <strong>${pelangganEmail}</strong></p>`
    : `<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:12px;">Pelanggan tidak memiliki email — sampaikan konfirmasi via WhatsApp</p>`
  }
</div>`,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const gagal = results.filter(r => r.status === 'rejected');
    if (gagal.length > 0) console.error('Beberapa email gagal:', gagal);

    return NextResponse.json({
      success: true,
      message: pelangganEmail
        ? `Pesanan dikonfirmasi & tiket dikirim ke ${pelangganEmail}`
        : 'Pesanan dikonfirmasi (pelanggan tidak ada email)',
      emailSent: !!pelangganEmail,
      // Kembalikan waLink agar dashboard bisa buka WA langsung
      waLink,
    });
  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.json({
      error: 'Terjadi kesalahan: ' + (error instanceof Error ? error.message : 'Unknown'),
    }, { status: 500 });
  }
}
