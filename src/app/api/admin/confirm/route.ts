/**
 * app/api/admin/confirm/route.ts
 *
 * POST /api/admin/confirm
 * Dipanggil saat admin klik "✅ Konfirmasi" di dashboard.
 *
 * Yang terjadi setelah konfirmasi:
 *   1. Update status pesanan → 'success'
 *   2. Generate PDF tiket menggunakan pdf-lib
 *   3. Kirim email tiket + lampiran PDF ke pelanggan (jika ada email)
 *   4. Kirim notifikasi email ke admin
 *   5. Kirim WA notifikasi ke-2 ke pemesan via Fonnte
 *   6. Return waLink agar dashboard bisa buka WA admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus, formatRp, Order } from '@/lib/orders';
import { getSession } from '@/lib/auth';
import { sendWA, msgPemesanKonfirmasi } from '@/lib/fonnte';
import { Resend } from 'resend';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// ─────────────────────────────────────────────
// Sanitasi teks untuk PDF (WinAnsi/Helvetica safe)
// Hapus/ganti semua karakter non-Latin1 agar tidak crash
// ─────────────────────────────────────────────
function sanitize(text: string): string {
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
      ? `Tiket sudah dikirim ke email *${order.email}* 📧`
      : `Simpan pesan ini sebagai bukti pesanan.`,
    '',
    `Terima kasih telah mempercayai *Travel Bengkulu* 🙏`,
  ].filter(Boolean).join('\n');

  return `https://wa.me/${normalizePhone(order.phone)}?text=${encodeURIComponent(lines)}`;
}

// ─────────────────────────────────────────────
// Generate PDF Tiket — desain teal/hijau
// Menggunakan data langsung dari Order object
// ─────────────────────────────────────────────
async function generateTicketPDF(
  order: Order & { departureTime?: string }
): Promise<Buffer> {
  const pdfDoc  = await PDFDocument.create();
  const page    = pdfDoc.addPage([595, 842]); // A4 portrait

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const margin   = 48;
  const contentW = width - margin * 2;
  const col2     = margin + contentW / 2;

  // ── Palet warna ──
  const teal    = rgb(0.059, 0.463, 0.431);
  const tealLt  = rgb(0.082, 0.596, 0.565);
  const white   = rgb(1, 1, 1);
  const dark    = rgb(0.059, 0.090, 0.161);
  const gray    = rgb(0.392, 0.455, 0.545);
  const green   = rgb(0.086, 0.643, 0.361);
  const bgLight = rgb(0.976, 0.980, 0.988);
  const yellow  = rgb(1.000, 0.980, 0.878);
  const yBorder = rgb(0.992, 0.906, 0.533);
  const lineClr = rgb(0.878, 0.910, 0.941);

  // ── Header ──
  page.drawRectangle({ x: 0, y: height - 130, width, height: 130, color: teal });
  page.drawRectangle({ x: margin, y: height - 100, width: 44, height: 44, color: tealLt });
  page.drawText('T', { x: margin + 14, y: height - 84, size: 22, font: fontBold, color: white });
  page.drawText('Travel Bengkulu', { x: margin + 56, y: height - 72, size: 18, font: fontBold, color: white });
  page.drawText('Tiket Perjalanan Resmi', { x: margin + 56, y: height - 90, size: 10, font: fontReg, color: rgb(0.8, 0.95, 0.93) });
  page.drawText('TIKET', { x: width - margin - 80, y: height - 62, size: 11, font: fontBold, color: rgb(0.8, 0.95, 0.93) });
  page.drawText(sanitize(order.id), { x: width - margin - 80, y: height - 78, size: 9, font: fontBold, color: white });

  let y = height - 155;

  // ── Status: Dikonfirmasi ──
  page.drawRectangle({ x: margin, y: y - 14, width: contentW, height: 34, color: rgb(0.94, 0.99, 0.96), borderColor: rgb(0.53, 0.94, 0.65), borderWidth: 1 });
  page.drawText('Pembayaran Berhasil - Tiket Dikonfirmasi', { x: margin + 16, y: y - 2, size: 10, font: fontBold, color: green });
  y -= 46;

  // ── Nomor Pesanan ──
  page.drawRectangle({ x: margin, y: y - 28, width: contentW, height: 48, color: bgLight });
  page.drawText('NOMOR PESANAN', { x: margin + 16, y: y - 4, size: 8, font: fontBold, color: gray });
  page.drawText(sanitize(order.id), { x: margin + 16, y: y - 20, size: 16, font: fontBold, color: dark });
  const tglKonfirmasi = order.confirmedAt
    ? new Date(order.confirmedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  page.drawText(`Dikonfirmasi: ${sanitize(tglKonfirmasi)}`, { x: width - margin - 160, y: y - 14, size: 8, font: fontReg, color: gray });
  y -= 60;

  // ── Detail Perjalanan ──
  page.drawText('DETAIL PERJALANAN', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  // Parse rute
  const rawRoute = order.route || '';
  const routeParts = rawRoute.includes('→')
    ? rawRoute.split('→').map(s => s.trim())
    : rawRoute.includes('->')
    ? rawRoute.split('->').map(s => s.trim())
    : rawRoute.includes(' ke ')
    ? rawRoute.split(' ke ').map(s => s.trim())
    : [rawRoute, ''];
  const fromCity = sanitize(routeParts[0] || rawRoute);
  const toCity   = sanitize(routeParts[1] || '');

  const tripRows: [string, string][] = [
    ['Tanggal', sanitize(order.date)],
    ['Penumpang', `${order.passengers} orang`],
    ['Jemput di', sanitize(order.pickup || '-')],
    ['Antar ke', sanitize(order.dropoff || '-')],
  ];
  if (order.departureTime) tripRows.splice(1, 0, ['Jam Berangkat', sanitize(order.departureTime)]);

  const tripH = tripRows.length * 18 + 46;
  page.drawRectangle({ x: margin, y: y - tripH, width: contentW, height: tripH, color: rgb(0.94, 0.99, 0.97), borderColor: rgb(0.60, 0.96, 0.89), borderWidth: 1 });

  // Rute besar
  const fromW  = fontBold.widthOfTextAtSize(fromCity, 15);
  const arrowX = margin + 16 + fromW + 8;
  page.drawText(fromCity, { x: margin + 16, y: y - 22, size: 15, font: fontBold, color: teal });
  page.drawText('->', { x: arrowX, y: y - 22, size: 15, font: fontBold, color: tealLt });
  if (toCity) page.drawText(toCity, { x: arrowX + 22, y: y - 22, size: 15, font: fontBold, color: teal });

  tripRows.forEach(([label, val], i) => {
    const ry      = y - 44 - i * 18;
    const display = val.length > 36 ? val.slice(0, 36) + '...' : val;
    page.drawText(label,   { x: margin + 16, y: ry, size: 9, font: fontReg,  color: gray });
    page.drawText(display, { x: col2,        y: ry, size: 9, font: fontBold, color: dark });
  });
  y -= tripH + 16;

  // ── Data Penumpang ──
  page.drawText('DATA PENUMPANG', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;
  page.drawRectangle({ x: margin, y: y - 50, width: contentW, height: 60, color: bgLight });
  page.drawText('Nama',   { x: margin + 16, y: y - 16, size: 9, font: fontReg, color: gray });
  page.drawText(sanitize(order.name),  { x: col2, y: y - 16, size: 9, font: fontBold, color: dark });
  page.drawText('No. HP', { x: margin + 16, y: y - 34, size: 9, font: fontReg, color: gray });
  page.drawText(sanitize(order.phone), { x: col2, y: y - 34, size: 9, font: fontBold, color: dark });
  y -= 72;

  // ── Rincian Biaya ──
  page.drawText('RINCIAN BIAYA', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;
  page.drawRectangle({ x: margin, y: y - 20, width: contentW, height: 22, color: teal });
  page.drawText('Deskripsi', { x: margin + 12, y: y - 14, size: 9, font: fontBold, color: white });
  page.drawText('Jumlah',    { x: width - margin - 100, y: y - 14, size: 9, font: fontBold, color: white });
  y -= 22;

  const biayaRows: [string, string][] = [
    [`Tiket ${sanitize(rawRoute)} (${order.passengers} penumpang)`, sanitize(formatRp(order.harga))],
    ['Kode unik pembayaran', `+ ${sanitize(formatRp(order.kodeUnik))}`],
  ];
  biayaRows.forEach(([desc, val], i) => {
    const rowY = y - 14 - i * 22;
    const bg   = i % 2 === 0 ? white : bgLight;
    page.drawRectangle({ x: margin, y: rowY - 8, width: contentW, height: 22, color: bg });
    const descDisplay = desc.length > 55 ? desc.slice(0, 55) + '...' : desc;
    page.drawText(descDisplay, { x: margin + 12,          y: rowY, size: 9, font: fontReg,  color: dark });
    page.drawText(val,         { x: width - margin - 100, y: rowY, size: 9, font: fontBold, color: dark });
  });
  y -= biayaRows.length * 22 + 4;

  // ── Total ──
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 4;
  page.drawRectangle({ x: margin, y: y - 36, width: contentW, height: 38, color: teal });
  page.drawText('TOTAL PEMBAYARAN', { x: margin + 12,          y: y - 14, size: 10, font: fontBold, color: rgb(0.8, 0.95, 0.93) });
  page.drawText(sanitize(formatRp(order.total)), { x: width - margin - 130, y: y - 14, size: 16, font: fontBold, color: white });
  y -= 52;

  // ── Instruksi ──
  y -= 8;
  page.drawRectangle({ x: margin, y: y - 78, width: contentW, height: 88, color: yellow, borderColor: yBorder, borderWidth: 1 });
  page.drawText('INSTRUKSI PENTING', { x: margin + 16, y: y - 14, size: 8, font: fontBold, color: rgb(0.57, 0.25, 0.055) });
  const instruksi = [
    `Tunjukkan tiket ini atau nomor pesanan ${sanitize(order.id)} kepada driver`,
    'Siapkan diri 15 menit sebelum waktu penjemputan',
    'Driver akan menghubungi Anda sebelum tiba',
    'Bawa identitas diri (KTP/SIM)',
  ];
  instruksi.forEach((line, i) => {
    page.drawText(`- ${line}`, { x: margin + 16, y: y - 30 - i * 14, size: 8.5, font: fontReg, color: rgb(0.47, 0.21, 0.043) });
  });
  y -= 100;

  // ── Footer ──
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 16;
  page.drawText('Travel Bengkulu  |  BTN Air Bang Curup, Bengkulu', { x: margin, y,      size: 8, font: fontReg, color: gray });
  page.drawText('bengkulutravel.com  |  cs@bengkulutravel.com  |  0852-6864-5461', { x: margin, y: y - 14, size: 8, font: fontReg, color: gray });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// ─────────────────────────────────────────────
// HTML Email Tiket ke Pelanggan
// ─────────────────────────────────────────────
function generateTicketEmailHTML(order: Order & { departureTime?: string }): string {
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

    // 2. Generate PDF tiket — dipakai untuk email pelanggan
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generateTicketPDF(orderWithDep);
      console.log('[CONFIRM] PDF tiket generated, size:', pdfBuffer.length, 'bytes');
    } catch (pdfErr) {
      // PDF gagal tidak menghentikan proses — email tetap dikirim tanpa lampiran
      console.error('[CONFIRM] Gagal generate PDF:', pdfErr);
    }

    const emailPromises: Promise<unknown>[] = [];

    // 3. Kirim email + PDF ke pelanggan (jika ada email)
    if (pelangganEmail) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emailPayload: any = {
        from:    `Travel Bengkulu <${fromEmail}>`,
        to:      pelangganEmail,
        // Hindari karakter → di subject, beberapa mail server reject
        subject: `Tiket Perjalanan ${sanitize(updated.route)} - ${updated.id}`,
        html:    generateTicketEmailHTML(orderWithDep),
      };

      // Lampirkan PDF jika berhasil di-generate
      // PENTING: Resend membutuhkan base64 string, BUKAN Buffer langsung
      if (pdfBuffer) {
        emailPayload.attachments = [{
          filename: `Tiket-${updated.id}.pdf`,
          content:  pdfBuffer.toString('base64'),
        }];
      }

      emailPromises.push(
        resend.emails.send(emailPayload)
          .then(r => console.log('[CONFIRM] Email tiket terkirim ke pelanggan:', r))
          .catch(e => console.error('[CONFIRM] GAGAL kirim email pelanggan:', e))
      );
    }

    // 4. Notifikasi email ke admin
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
    ? `<p style="color:#16a34a;font-size:12px;text-align:center;margin-top:12px;">Tiket PDF sudah dikirim ke: <strong>${pelangganEmail}</strong></p>`
    : `<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:12px;">Pelanggan tidak punya email &mdash; sampaikan konfirmasi via WhatsApp</p>`
  }
</div>`,
      })
        .then(r => console.log('[CONFIRM] Email notif admin terkirim:', r))
        .catch(e => console.error('[CONFIRM] GAGAL kirim email admin:', e))
    );

    // Jalankan semua email secara paralel
    await Promise.allSettled(emailPromises);

    // 5. Kirim WA notifikasi ke-2 ke pemesan (fire-and-forget)
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
        ? `Pesanan ${orderId} dikonfirmasi & tiket dikirim ke ${pelangganEmail}`
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
