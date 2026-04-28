/**
 * API: POST /api/admin/confirm-rental
 * Konfirmasi pembayaran rental:
 * 1. Update status → 'success'
 * 2. Generate PDF Invoice + Kwitansi
 * 3. Kirim email ke pelanggan (jika ada)
 * 4. Kirim notifikasi ke admin dengan WA link
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getRentalOrderById,
  updateRentalOrderStatus,
  formatRp,
  VEHICLE_LABELS,
  RENTAL_TYPE_LABELS,
  AREA_LABELS,
  type RentalOrder,
} from '@/lib/orders';
import { getSession } from '@/lib/auth';
import { Resend } from 'resend';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// ─────────────────────────────────────────────
// Sanitasi teks untuk PDF (WinAnsi safe)
// ─────────────────────────────────────────────
function sanitize(text: string): string {
  return (text || '')
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/'/g, "'").replace(/'/g, "'")
    .replace(/"/g, '"').replace(/"/g, '"')
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
// Generate WA link konfirmasi rental
// ─────────────────────────────────────────────
function generateWALink(order: RentalOrder): string {
  const lines = [
    `Assalamualaikum / Halo *${order.name}*,`,
    '',
    `Pembayaran rental Anda telah kami *konfirmasi* ✅`,
    '',
    `*Detail Rental:*`,
    `🚗 Kendaraan : ${VEHICLE_LABELS[order.vehicle]}`,
    `📋 Jenis Sewa: ${RENTAL_TYPE_LABELS[order.rentalType]}${order.rentalType === 'with_driver' ? ' - ' + AREA_LABELS[order.area] : ''}`,
    `📅 Mulai     : ${order.startDate}`,
    `📅 Selesai   : ${order.endDate} (${order.days} hari)`,
    `🕐 Jam Ambil : ${order.pickupTime} WIB`,
    `📍 Lokasi    : ${order.pickupAddress}`,
    `💰 Total     : ${formatRp(order.totalPrice)}`,
    '',
    `No. Pesanan: *${order.id}*`,
    '',
    order.email
      ? `Invoice & kwitansi sudah dikirim ke email *${order.email}* 📧`
      : `Mohon simpan nomor pesanan ini sebagai bukti pembayaran.`,
    '',
    `Harap siapkan KTP saat penyerahan unit.`,
    '',
    `Terima kasih telah mempercayai *Travel Bengkulu* 🙏`,
  ].filter(l => l !== undefined);

  return `https://wa.me/${normalizePhone(order.phone)}?text=${encodeURIComponent(lines.join('\n'))}`;
}

// ─────────────────────────────────────────────
// Generate PDF Invoice + Kwitansi
// ─────────────────────────────────────────────
async function generateRentalPDF(order: RentalOrder): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const margin   = 48;
  const contentW = width - margin * 2;
  const col2     = margin + contentW * 0.45;

  // Warna
  const amber    = rgb(0.761, 0.424, 0.059);
  const amberLt  = rgb(0.878, 0.584, 0.157);
  const white    = rgb(1, 1, 1);
  const dark     = rgb(0.059, 0.090, 0.161);
  const gray     = rgb(0.392, 0.455, 0.545);
  const green    = rgb(0.086, 0.643, 0.361);
  const bgLight  = rgb(0.976, 0.980, 0.988);
  const bgAmber  = rgb(1.000, 0.975, 0.878);

  // ── Header ──
  page.drawRectangle({ x: 0, y: height - 130, width, height: 130, color: amber });
  page.drawRectangle({ x: margin, y: height - 100, width: 44, height: 44, color: amberLt });
  page.drawText('R', { x: margin + 14, y: height - 84, size: 22, font: fontBold, color: white });
  page.drawText('Travel Bengkulu', { x: margin + 56, y: height - 72, size: 18, font: fontBold, color: white });
  page.drawText('Invoice & Kwitansi Rental', { x: margin + 56, y: height - 90, size: 10, font: fontReg, color: rgb(1, 0.93, 0.8) });
  page.drawText('RENTAL', { x: width - margin - 90, y: height - 62, size: 11, font: fontBold, color: rgb(1, 0.93, 0.8) });
  page.drawText(sanitize(order.id), { x: width - margin - 90, y: height - 78, size: 9, font: fontBold, color: white });

  let y = height - 155;

  // ── Status box ──
  page.drawRectangle({ x: margin, y: y - 14, width: contentW, height: 34, color: rgb(0.94, 0.99, 0.96), borderColor: rgb(0.53, 0.94, 0.65), borderWidth: 1 });
  page.drawText('Pembayaran Dikonfirmasi - Invoice Resmi', { x: margin + 16, y: y - 2, size: 11, font: fontBold, color: green });
  y -= 46;

  // ── No. Pesanan ──
  page.drawRectangle({ x: margin, y: y - 28, width: contentW, height: 48, color: bgLight });
  page.drawText('NOMOR PESANAN', { x: margin + 16, y: y - 4, size: 8, font: fontBold, color: gray });
  page.drawText(sanitize(order.id), { x: margin + 16, y: y - 20, size: 16, font: fontBold, color: dark });
  const tglKonfirmasi = order.confirmedAt
    ? new Date(order.confirmedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  page.drawText(`Tanggal: ${sanitize(tglKonfirmasi)}`, { x: width - margin - 140, y: y - 14, size: 9, font: fontReg, color: gray });
  y -= 60;

  // ── Detail Rental ──
  page.drawText('DETAIL RENTAL', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  const vehicleLabel    = sanitize(VEHICLE_LABELS[order.vehicle]);
  const rentalTypeLabel = sanitize(RENTAL_TYPE_LABELS[order.rentalType] + (order.rentalType === 'with_driver' ? ' - ' + AREA_LABELS[order.area] : ''));

  const detailRows: [string, string][] = [
    ['Kendaraan',    vehicleLabel],
    ['Jenis Sewa',   rentalTypeLabel],
    ['Tanggal Mulai',sanitize(order.startDate)],
    ['Tanggal Selesai', sanitize(order.endDate)],
    ['Durasi',       `${order.days} hari`],
    ['Jam Ambil',    sanitize(order.pickupTime) + ' WIB'],
    ['Lokasi',       sanitize(order.pickupAddress)],
    ...(order.notes ? [['Catatan', sanitize(order.notes)] as [string, string]] : []),
  ];

  const detailH = detailRows.length * 18 + 20;
  page.drawRectangle({ x: margin, y: y - detailH, width: contentW, height: detailH, color: bgAmber, borderColor: rgb(0.98, 0.82, 0.4), borderWidth: 1 });
  detailRows.forEach(([label, val], i) => {
    const ry = y - 14 - i * 18;
    page.drawText(label, { x: margin + 16, y: ry, size: 9, font: fontReg, color: gray });
    const display = val.length > 38 ? val.slice(0, 38) + '...' : val;
    page.drawText(display, { x: col2, y: ry, size: 9, font: fontBold, color: dark });
  });
  y -= detailH + 16;

  // ── Data Pemesan ──
  page.drawText('DATA PEMESAN', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;
  page.drawRectangle({ x: margin, y: y - 50, width: contentW, height: 60, color: bgLight });
  page.drawText('Nama',  { x: margin + 16, y: y - 16, size: 9, font: fontReg, color: gray });
  page.drawText(sanitize(order.name), { x: col2, y: y - 16, size: 9, font: fontBold, color: dark });
  page.drawText('No. HP', { x: margin + 16, y: y - 34, size: 9, font: fontReg, color: gray });
  page.drawText(sanitize(order.phone), { x: col2, y: y - 34, size: 9, font: fontBold, color: dark });
  y -= 72;

  // ── Rincian Harga ──
  page.drawText('RINCIAN PEMBAYARAN', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  const biayaRows: [string, number][] = [
    [`Sewa ${vehicleLabel}`, order.pricePerDay],
    ...(order.driverFeePerDay > 0 ? [[`Jasa Sopir (${AREA_LABELS[order.area]})`, order.driverFeePerDay] as [string, number]] : []),
  ];
  const biayaH = biayaRows.length * 22 + 20;
  page.drawRectangle({ x: margin, y: y - biayaH, width: contentW, height: biayaH, color: bgLight });
  biayaRows.forEach(([label, harga], i) => {
    const ry = y - 14 - i * 22;
    page.drawText(sanitize(label) + '/hari', { x: margin + 16, y: ry, size: 9, font: fontReg, color: gray });
    page.drawText(sanitize(formatRp(harga)), { x: col2, y: ry, size: 9, font: fontBold, color: dark });
  });
  y -= biayaH + 6;

  // ── Total ──
  page.drawRectangle({ x: margin, y: y - 46, width: contentW, height: 56, color: amber });
  page.drawText('TOTAL PEMBAYARAN', { x: margin + 16, y: y - 14, size: 8, font: fontBold, color: rgb(1, 0.93, 0.8) });
  page.drawText(`${order.days} hari x ${sanitize(formatRp(order.pricePerDay + order.driverFeePerDay))}`, { x: margin + 16, y: y - 28, size: 9, font: fontReg, color: rgb(0.95, 0.85, 0.7) });
  page.drawText(sanitize(formatRp(order.totalPrice)), { x: width - margin - 16, y: y - 22, size: 22, font: fontBold, color: white });
  // right align trick — approximate
  y -= 64;

  // ── Catatan Penting ──
  y -= 10;
  page.drawRectangle({ x: margin, y: y - 66, width: contentW, height: 76, color: rgb(0.97, 0.97, 0.97), borderColor: rgb(0.85, 0.85, 0.85), borderWidth: 1 });
  page.drawText('CATATAN PENTING', { x: margin + 16, y: y - 10, size: 8, font: fontBold, color: gray });
  const notes = [
    '- Siapkan KTP asli saat penyerahan unit',
    '- Tunjukkan email ini atau nomor pesanan sebagai bukti',
    order.rentalType === 'lepas_kunci' ? '- SIM A aktif wajib ditunjukkan saat pengambilan' : '',
    '- Hubungi kami jika ada perubahan jadwal',
  ].filter(Boolean);
  notes.forEach((n, i) => {
    page.drawText(sanitize(n), { x: margin + 16, y: y - 26 - i * 13, size: 8, font: fontReg, color: dark });
  });
  y -= 90;

  // ── Footer ──
  page.drawLine({ start: { x: margin, y: y }, end: { x: width - margin, y: y }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
  y -= 14;
  page.drawText('Travel Bengkulu · 0852-6864-5461 · cs@bengkulutravel.com · bengkulutravel.com', { x: margin, y, size: 8, font: fontReg, color: gray });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// ─────────────────────────────────────────────
// HTML Email Pelanggan
// ─────────────────────────────────────────────
function generateRentalEmailHTML(order: RentalOrder): string {
  const vehicleLabel    = VEHICLE_LABELS[order.vehicle];
  const rentalTypeLabel = RENTAL_TYPE_LABELS[order.rentalType] + (order.rentalType === 'with_driver' ? ' - ' + AREA_LABELS[order.area] : '');

  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:560px;margin:32px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#b45309,#d97706);padding:32px 24px;text-align:center;">
    <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:12px;">🚗</div>
    <h1 style="color:white;font-size:22px;font-weight:800;margin:0 0 4px;">Pesanan Rental Dikonfirmasi!</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:0;">Travel Bengkulu · Rental Mobil</p>
  </div>

  <!-- Body -->
  <div style="padding:28px 24px;">
    <p style="color:#334155;font-size:14px;margin:0 0 20px;">Halo <strong>${order.name}</strong>, pembayaran rental Anda telah kami konfirmasi ✅</p>

    <!-- No Pesanan -->
    <div style="background:#fef9f0;border:1px solid #fcd34d;border-radius:10px;padding:16px;margin-bottom:20px;">
      <p style="color:#92400e;font-size:11px;font-weight:700;text-transform:uppercase;margin:0 0 4px;">No. Pesanan</p>
      <p style="color:#78350f;font-size:20px;font-weight:800;letter-spacing:1px;margin:0;font-family:monospace;">${order.id}</p>
    </div>

    <!-- Detail -->
    <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:20px;">
      ${[
        ['🚗 Kendaraan', vehicleLabel],
        ['📋 Jenis Sewa', rentalTypeLabel],
        ['📅 Tanggal Mulai', order.startDate],
        ['📅 Tanggal Selesai', `${order.endDate} (${order.days} hari)`],
        ['🕐 Jam Pengambilan', order.pickupTime + ' WIB'],
        ['📍 Lokasi', order.pickupAddress],
        ...(order.notes ? [['📝 Catatan', order.notes]] : []),
      ].map(([l, v], i) => `
      <tr style="background:${i % 2 === 0 ? '#f8fafc' : 'white'}">
        <td style="padding:10px 12px;color:#64748b;width:40%;">${l}</td>
        <td style="padding:10px 12px;font-weight:600;color:#1e293b;">${v}</td>
      </tr>`).join('')}
    </table>

    <!-- Harga -->
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
      <tr>
        <td style="padding:6px 0;color:#64748b;">Sewa ${vehicleLabel}/hari</td>
        <td style="padding:6px 0;text-align:right;font-weight:600;">${formatRp(order.pricePerDay)}</td>
      </tr>
      ${order.driverFeePerDay > 0 ? `<tr>
        <td style="padding:6px 0;color:#64748b;">Jasa Sopir (${AREA_LABELS[order.area]})/hari</td>
        <td style="padding:6px 0;text-align:right;font-weight:600;">${formatRp(order.driverFeePerDay)}</td>
      </tr>` : ''}
      <tr style="border-top:2px solid #e2e8f0;">
        <td style="padding:12px 0;font-weight:700;color:#1e293b;">Total (${order.days} hari)</td>
        <td style="padding:12px 0;text-align:right;font-size:20px;font-weight:800;color:#b45309;">${formatRp(order.totalPrice)}</td>
      </tr>
    </table>

    <!-- Penting -->
    <div style="background:#fef9f0;border-left:4px solid #f59e0b;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="color:#92400e;font-size:13px;font-weight:700;margin:0 0 8px;">📋 Yang Perlu Dipersiapkan:</p>
      <ul style="color:#78350f;font-size:12px;margin:0;padding-left:18px;line-height:1.8;">
        <li>Siapkan <strong>KTP asli</strong> saat penyerahan unit</li>
        ${order.rentalType === 'lepas_kunci' ? '<li>Siapkan <strong>SIM A aktif</strong> untuk lepas kunci</li>' : ''}
        <li>Invoice & kwitansi terlampir di email ini 📎</li>
        <li>Hubungi kami jika ada perubahan jadwal</li>
      </ul>
    </div>

    <!-- Tombol WA -->
    <div style="text-align:center;">
      <a href="https://wa.me/6285268645461" style="display:inline-block;background:#22c55e;color:white;font-size:13px;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;">
        💬 WhatsApp: 0852-6864-5461
      </a>
      <p style="color:#94a3b8;font-size:11px;margin:10px 0 0;">cs@bengkulutravel.com · bengkulutravel.com</p>
    </div>
  </div>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:16px;text-align:center;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">© ${new Date().getFullYear()} Travel Bengkulu · Rental Mobil Bengkulu</p>
  </div>
</div>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// POST: Konfirmasi Pembayaran Rental
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'Order ID diperlukan' }, { status: 400 });

    const order = await getRentalOrderById(orderId);
    if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    if (order.status === 'success') return NextResponse.json({ error: 'Pesanan sudah dikonfirmasi' }, { status: 400 });

    const updated = await updateRentalOrderStatus(orderId, 'success');
    if (!updated) return NextResponse.json({ error: 'Gagal update status' }, { status: 500 });

    const fromEmail  = process.env.EMAIL_FROM  || 'noreply@bengkulutravel.com';
    const adminEmail = process.env.EMAIL_ADMIN || 'cs@bengkulutravel.com';
    const resend     = new Resend(process.env.RESEND_API_KEY);
    const waLink     = generateWALink(updated);

    const emailPromises = [];
    const pelangganEmail = (updated.email || '').trim();

    // ── Kirim invoice + PDF ke pelanggan ──
    if (pelangganEmail) {
      let pdfBuffer: Buffer | null = null;
      try {
        pdfBuffer = await generateRentalPDF(updated);
        console.log('[PDF Rental] Generated, size:', pdfBuffer.length);
      } catch (pdfErr) {
        console.error('[PDF Rental] FAILED:', pdfErr);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emailPayload: any = {
        from: `Travel Bengkulu <${fromEmail}>`,
        to: pelangganEmail,
        subject: `✅ Invoice Rental ${VEHICLE_LABELS[updated.vehicle]} — ${updated.id}`,
        html: generateRentalEmailHTML(updated),
      };

      if (pdfBuffer) {
        emailPayload.attachments = [{
          filename: `Invoice-Rental-${updated.id}.pdf`,
          content: pdfBuffer.toString('base64'),
        }];
      }

      emailPromises.push(
        resend.emails.send(emailPayload)
          .then(r => { console.log('[Email Rental] Terkirim:', r); })
          .catch(e => { console.error('[Email Rental] Gagal:', e); throw e; })
      );
    }

    // ── Notifikasi admin ──
    emailPromises.push(
      resend.emails.send({
        from: `Travel Bengkulu <${fromEmail}>`,
        to: adminEmail,
        subject: `✅ Rental Dikonfirmasi: ${updated.id} — ${VEHICLE_LABELS[updated.vehicle]}`,
        html: `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
  <h2 style="color:#b45309;">✅ Rental Berhasil Dikonfirmasi</h2>
  <table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #e2e8f0;">
    <tr style="background:#fef9f0;"><td style="padding:10px 12px;color:#64748b;width:35%;">No. Pesanan</td><td style="padding:10px 12px;font-weight:700;font-family:monospace;">${updated.id}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Nama</td><td style="padding:10px 12px;font-weight:600;">${updated.name}</td></tr>
    <tr style="background:#fef9f0;"><td style="padding:10px 12px;color:#64748b;">No. HP</td><td style="padding:10px 12px;font-weight:600;">${updated.phone}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Kendaraan</td><td style="padding:10px 12px;font-weight:600;">${VEHICLE_LABELS[updated.vehicle]}</td></tr>
    <tr style="background:#fef9f0;"><td style="padding:10px 12px;color:#64748b;">Jenis Sewa</td><td style="padding:10px 12px;font-weight:600;">${RENTAL_TYPE_LABELS[updated.rentalType]}${updated.rentalType === 'with_driver' ? ' - ' + AREA_LABELS[updated.area] : ''}</td></tr>
    <tr><td style="padding:10px 12px;color:#64748b;">Tanggal</td><td style="padding:10px 12px;font-weight:600;">${updated.startDate} s/d ${updated.endDate} (${updated.days} hari)</td></tr>
    <tr style="background:#fef9f0;"><td style="padding:10px 12px;color:#64748b;">Total</td><td style="padding:10px 12px;font-weight:800;color:#b45309;font-size:16px;">${formatRp(updated.totalPrice)}</td></tr>
  </table>
  <div style="margin-top:20px;text-align:center;">
    <a href="${waLink}" style="display:inline-block;background:#22c55e;color:white;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:14px;">
      💬 Kirim Konfirmasi ke ${updated.name} via WA
    </a>
  </div>
  ${pelangganEmail
    ? `<p style="color:#16a34a;font-size:12px;text-align:center;margin-top:12px;">📧 Invoice PDF sudah dikirim ke: <strong>${pelangganEmail}</strong></p>`
    : `<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:12px;">Pelanggan tidak punya email — sampaikan konfirmasi via WhatsApp</p>`
  }
</div>`,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    const gagal = results.filter(r => r.status === 'rejected');
    if (gagal.length > 0) console.error('Beberapa email rental gagal:', gagal);

    return NextResponse.json({
      success: true,
      message: pelangganEmail
        ? `Rental dikonfirmasi & invoice dikirim ke ${pelangganEmail}`
        : 'Rental dikonfirmasi (pelanggan tidak ada email)',
      emailSent: !!pelangganEmail,
      waLink,
    });

  } catch (error) {
    console.error('Confirm rental error:', error);
    return NextResponse.json({
      error: 'Terjadi kesalahan: ' + (error instanceof Error ? error.message : 'Unknown'),
    }, { status: 500 });
  }
}
