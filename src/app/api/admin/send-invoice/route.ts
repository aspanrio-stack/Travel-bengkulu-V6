/**
 * API: POST /api/admin/send-invoice
 * Kirim invoice PDF ke email pelanggan.
 *
 * Payload: { orderId: string }
 *
 * Lokasi file: app/api/admin/send-invoice/route.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, formatRp } from '@/lib/orders';
import { getSession } from '@/lib/auth';
import { Resend } from 'resend';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// ─────────────────────────────────────────────
// Sanitasi teks: ganti/hapus karakter non-ASCII
// agar aman untuk font Helvetica (WinAnsi encoding)
// ─────────────────────────────────────────────
function sanitize(text: string): string {
  return (text || '')
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/…/g, '...')
    .replace(/[^\x00-\xFF]/g, '');
}

// ─────────────────────────────────────────────
// Generate PDF Invoice
// ─────────────────────────────────────────────
async function generateInvoicePDF(order: {
  id: string; name: string; phone: string; email?: string;
  route: string; date: string; passengers: number;
  harga: number; kodeUnik: number; total: number;
  paymentMethod: string; status: string;
  createdAt: string; confirmedAt?: string;
  pickup: string; dropoff?: string; departureTime?: string;
}): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage([595, 842]); // A4

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const margin   = 48;
  const contentW = width - margin * 2;

  // Warna
  const blue    = rgb(0.118, 0.306, 0.847); // #1e4ed8
  const blueLt  = rgb(0.239, 0.455, 0.965); // #3d74f6
  const white   = rgb(1, 1, 1);
  const dark    = rgb(0.059, 0.090, 0.161);
  const gray    = rgb(0.392, 0.455, 0.545);
  const bgLight = rgb(0.976, 0.980, 0.988);
  const green   = rgb(0.086, 0.643, 0.361);
  const lineClr = rgb(0.878, 0.910, 0.941);

  // ── Header ──
  page.drawRectangle({ x: 0, y: height - 130, width, height: 130, color: blue });
  page.drawRectangle({ x: margin, y: height - 100, width: 44, height: 44, color: blueLt });
  page.drawText('T', { x: margin + 14, y: height - 84, size: 22, font: fontBold, color: white });
  page.drawText('Travel Bengkulu', { x: margin + 56, y: height - 72, size: 18, font: fontBold, color: white });
  page.drawText('INVOICE RESMI', { x: margin + 56, y: height - 90, size: 10, font: fontReg, color: rgb(0.75, 0.85, 1.0) });

  // No. invoice di kanan atas
  page.drawText('NO. INVOICE', { x: width - margin - 100, y: height - 62, size: 8, font: fontBold, color: rgb(0.75, 0.85, 1.0) });
  page.drawText(`INV-${sanitize(order.id)}`, { x: width - margin - 100, y: height - 76, size: 9, font: fontBold, color: white });

  let y = height - 150;

  // ── Info invoice & pelanggan (2 kolom) ──
  const col2 = margin + contentW / 2 + 8;

  page.drawText('DITAGIHKAN KEPADA:', { x: margin, y, size: 8, font: fontBold, color: gray });
  page.drawText('INFORMASI INVOICE:', { x: col2, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  // Kolom kiri: data pelanggan
  page.drawText(sanitize(order.name), { x: margin, y, size: 11, font: fontBold, color: dark });
  y -= 14;
  page.drawText(sanitize(order.phone), { x: margin, y, size: 9, font: fontReg, color: gray });
  y -= 12;
  if (order.email) {
    page.drawText(sanitize(order.email), { x: margin, y, size: 9, font: fontReg, color: gray });
    y -= 12;
  }

  // Kolom kanan: info invoice
  const infoY = height - 164;
  const infoRows: [string, string][] = [
    ['No. Invoice',   `INV-${sanitize(order.id)}`],
    ['Tanggal',       new Date(order.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })],
    ['Status',        order.status === 'success' ? 'LUNAS' : 'MENUNGGU'],
    ['Metode Bayar',  order.paymentMethod === 'qris' ? 'QRIS' : 'Tunai'],
  ];
  infoRows.forEach(([label, val], i) => {
    const ry = infoY - i * 14;
    page.drawText(label, { x: col2, y: ry, size: 8, font: fontReg, color: gray });
    page.drawText(sanitize(val), { x: col2 + 80, y: ry, size: 8, font: fontBold, color: dark });
  });

  y = Math.min(y, infoY - infoRows.length * 14) - 20;

  // ── Separator ──
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 20;

  // ── Detail perjalanan ──
  page.drawText('DETAIL PERJALANAN', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  // Pisah rute: support '→', '->', ' ke '
  const rawRoute = order.route || '';
  const routeParts = rawRoute.includes('→')
    ? rawRoute.split('→').map(s => s.trim())
    : rawRoute.includes('->')
    ? rawRoute.split('->').map(s => s.trim())
    : rawRoute.includes(' ke ')
    ? rawRoute.split(' ke ').map(s => s.trim())
    : [rawRoute, ''];
  const routeDisplay = sanitize(`${routeParts[0]} -> ${routeParts[1] || ''}`);

  const tripRows: [string, string][] = [
    ['Rute',          routeDisplay],
    ['Tanggal',       sanitize(order.date)],
    ...(order.departureTime ? [['Jam Berangkat', sanitize(order.departureTime)] as [string, string]] : []),
    ['Penumpang',     `${order.passengers} orang`],
    ['Jemput di',     sanitize(order.pickup)],
    ['Antar ke',      sanitize(order.dropoff || '-')],
  ];

  const tripH = tripRows.length * 18 + 16;
  page.drawRectangle({ x: margin, y: y - tripH, width: contentW, height: tripH, color: bgLight });
  tripRows.forEach(([label, val], i) => {
    const ry = y - 12 - i * 18;
    page.drawText(label, { x: margin + 12, y: ry, size: 9, font: fontReg, color: gray });
    const display = val.length > 40 ? val.slice(0, 40) + '...' : val;
    page.drawText(display, { x: margin + 160, y: ry, size: 9, font: fontBold, color: dark });
  });
  y -= tripH + 20;

  // ── Rincian biaya ──
  page.drawText('RINCIAN BIAYA', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  // Header tabel biaya
  page.drawRectangle({ x: margin, y: y - 20, width: contentW, height: 22, color: blue });
  page.drawText('Deskripsi', { x: margin + 12, y: y - 14, size: 9, font: fontBold, color: white });
  page.drawText('Jumlah', { x: width - margin - 100, y: y - 14, size: 9, font: fontBold, color: white });
  y -= 22;

  // Baris biaya
  const biayaRows: [string, string][] = [
    [`Tiket perjalanan ${routeDisplay} (${order.passengers} penumpang)`, sanitize(formatRp(order.harga))],
    ['Kode unik pembayaran', `+ ${sanitize(formatRp(order.kodeUnik))}`],
  ];

  biayaRows.forEach(([desc, val], i) => {
    const rowY = y - 14 - i * 22;
    const bg = i % 2 === 0 ? white : bgLight;
    page.drawRectangle({ x: margin, y: rowY - 8, width: contentW, height: 22, color: bg });
    const descDisplay = desc.length > 55 ? desc.slice(0, 55) + '...' : desc;
    page.drawText(descDisplay, { x: margin + 12, y: rowY, size: 9, font: fontReg, color: dark });
    page.drawText(val, { x: width - margin - 100, y: rowY, size: 9, font: fontBold, color: dark });
  });
  y -= biayaRows.length * 22 + 4;

  // Total
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 4;
  page.drawRectangle({ x: margin, y: y - 36, width: contentW, height: 38, color: blue });
  page.drawText('TOTAL PEMBAYARAN', { x: margin + 12, y: y - 14, size: 10, font: fontBold, color: rgb(0.75, 0.85, 1.0) });
  page.drawText(sanitize(formatRp(order.total)), { x: width - margin - 130, y: y - 14, size: 16, font: fontBold, color: white });
  y -= 52;

  // ── Status pembayaran ──
  if (order.status === 'success') {
    page.drawRectangle({ x: margin, y: y - 28, width: contentW, height: 34, color: rgb(0.94, 0.99, 0.96), borderColor: rgb(0.53, 0.94, 0.65), borderWidth: 1 });
    page.drawText('UNPAID - Pembayaran belum dikonfirmasi', { x: margin + 16, y: y - 10, size: 11, font: fontBold, color: green });
    if (order.confirmedAt) {
      const confDate = new Date(order.confirmedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      page.drawText(`Dikonfirmasi pada: ${sanitize(confDate)}`, { x: margin + 16, y: y - 22, size: 8, font: fontReg, color: green });
    }
    y -= 46;
  }

  // ── Catatan ──
  y -= 8;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 16;
  page.drawText('Catatan:', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 12;
  [
    '- Invoice ini adalah bukti resmi tagihan pembayaran perjalanan Travel Bengkulu.',
    '- Simpan invoice ini sebagai referensi jika ada pertanyaan.',
    '- Untuk pertanyaan, hubungi kami di 0852-6864-5461 atau cs@bengkulutravel.com',
  ].forEach((line, i) => {
    page.drawText(line, { x: margin, y: y - i * 12, size: 8, font: fontReg, color: gray });
  });
  y -= 48;

  // ── Footer ──
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 14;
  page.drawText('Travel Bengkulu  |  BTN Air Bang Curup, Bengkulu', { x: margin, y, size: 8, font: fontReg, color: gray });
  page.drawText('bengkulutravel.com  |  cs@bengkulutravel.com  |  0852-6864-5461', { x: margin, y: y - 12, size: 8, font: fontReg, color: gray });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// ─────────────────────────────────────────────
// Template HTML Invoice Email
// ─────────────────────────────────────────────
function generateInvoiceHTML(order: {
  id: string; name: string; phone: string; email?: string;
  route: string; date: string; passengers: number;
  harga: number; kodeUnik: number; total: number;
  paymentMethod: string; status: string;
  createdAt: string; confirmedAt?: string;
  pickup: string; dropoff?: string; departureTime?: string;
}) {
  const tanggalInvoice = new Date(order.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const statusLabel = order.status === 'success' ? 'LUNAS' : 'MENUNGGU';
  const statusColor = order.status === 'success' ? '#16a34a' : '#d97706';
  const metodeBayar = order.paymentMethod === 'qris' ? 'QRIS' : 'Tunai';

  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><title>Invoice Travel Bengkulu - INV-${order.id}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);border-radius:16px 16px 0 0;padding:28px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
      <div>
        <div style="background:rgba(255,255,255,0.2);width:44px;height:44px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:8px;">
          <span style="color:white;font-size:22px;font-weight:900;">T</span>
        </div>
        <h1 style="color:white;font-size:20px;font-weight:800;margin:0 0 2px;">Travel Bengkulu</h1>
        <p style="color:rgba(255,255,255,0.75);font-size:12px;margin:0;">INVOICE RESMI</p>
      </div>
      <div style="text-align:right;">
        <p style="color:rgba(255,255,255,0.7);font-size:10px;font-weight:700;letter-spacing:1px;margin:0 0 4px;">NO. INVOICE</p>
        <p style="color:white;font-size:14px;font-weight:800;margin:0;font-family:monospace;">INV-${order.id}</p>
        <p style="color:rgba(255,255,255,0.7);font-size:11px;margin:4px 0 0;">${tanggalInvoice}</p>
      </div>
    </div>
  </div>

  <div style="background:white;padding:28px;border:1px solid #e2e8f0;border-top:none;">

    <!-- Info pelanggan & invoice -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr>
        <td style="width:50%;vertical-align:top;">
          <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:1px;margin:0 0 8px;">DITAGIHKAN KEPADA</p>
          <p style="color:#0f172a;font-size:14px;font-weight:700;margin:0 0 4px;">${order.name}</p>
          <p style="color:#64748b;font-size:12px;margin:0 0 2px;">${order.phone}</p>
          ${order.email ? `<p style="color:#64748b;font-size:12px;margin:0;">${order.email}</p>` : ''}
        </td>
        <td style="width:50%;vertical-align:top;">
          <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:1px;margin:0 0 8px;">INFORMASI INVOICE</p>
          <table style="border-collapse:collapse;font-size:12px;">
            <tr><td style="color:#64748b;padding:2px 12px 2px 0;">Status</td><td style="font-weight:700;color:${statusColor};">${statusLabel}</td></tr>
            <tr><td style="color:#64748b;padding:2px 12px 2px 0;">Metode</td><td style="font-weight:600;color:#0f172a;">${metodeBayar}</td></tr>
            <tr><td style="color:#64748b;padding:2px 12px 2px 0;">No. Pesanan</td><td style="font-weight:600;color:#0f172a;font-family:monospace;">${order.id}</td></tr>
          </table>
        </td>
      </tr>
    </table>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;">

    <!-- Detail perjalanan -->
    <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:1px;margin:0 0 10px;">DETAIL PERJALANAN</p>
    <div style="background:#f8fafc;border-radius:10px;padding:14px;margin-bottom:20px;">
      <p style="color:#1e40af;font-size:15px;font-weight:800;text-align:center;margin:0 0 10px;">${order.route}</p>
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <tr><td style="color:#64748b;padding:4px 0;width:35%;">Tanggal</td><td style="color:#0f172a;font-weight:600;">${order.date}</td></tr>
        ${order.departureTime ? `<tr><td style="color:#64748b;padding:4px 0;">Jam Berangkat</td><td style="color:#0f172a;font-weight:600;">${order.departureTime}</td></tr>` : ''}
        <tr><td style="color:#64748b;padding:4px 0;">Penumpang</td><td style="color:#0f172a;font-weight:600;">${order.passengers} orang</td></tr>
        <tr><td style="color:#64748b;padding:4px 0;">Jemput di</td><td style="color:#0f172a;font-weight:600;">${order.pickup}</td></tr>
        ${order.dropoff ? `<tr><td style="color:#64748b;padding:4px 0;">Antar ke</td><td style="color:#0f172a;font-weight:600;">${order.dropoff}</td></tr>` : ''}
      </table>
    </div>

    <!-- Rincian biaya -->
    <p style="color:#64748b;font-size:10px;font-weight:700;letter-spacing:1px;margin:0 0 10px;">RINCIAN BIAYA</p>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:4px;">
      <thead>
        <tr style="background:#1e40af;">
          <th style="color:white;font-size:11px;padding:10px 12px;text-align:left;border-radius:8px 0 0 0;">Deskripsi</th>
          <th style="color:white;font-size:11px;padding:10px 12px;text-align:right;border-radius:0 8px 0 0;">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background:#f8fafc;">
          <td style="padding:10px 12px;color:#0f172a;">Tiket perjalanan ${order.route} (${order.passengers} penumpang)</td>
          <td style="padding:10px 12px;color:#0f172a;font-weight:600;text-align:right;">${formatRp(order.harga)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;color:#64748b;font-size:12px;">Kode unik pembayaran</td>
          <td style="padding:10px 12px;color:#64748b;font-size:12px;text-align:right;">+ ${formatRp(order.kodeUnik)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Total -->
    <div style="background:#1e40af;border-radius:10px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <span style="color:rgba(255,255,255,0.8);font-size:12px;font-weight:700;">TOTAL PEMBAYARAN</span>
      <span style="color:white;font-size:22px;font-weight:800;">${formatRp(order.total)}</span>
    </div>

    <!-- Status lunas -->
    ${order.status === 'success' ? `
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px;text-align:center;margin-bottom:20px;">
      <p style="color:#16a34a;font-size:14px;font-weight:700;margin:0;">&#10003; LUNAS — Pembayaran telah dikonfirmasi</p>
      ${order.confirmedAt ? `<p style="color:#4ade80;font-size:11px;margin:4px 0 0;">Dikonfirmasi: ${new Date(order.confirmedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>` : ''}
    </div>` : ''}

    <!-- Catatan -->
    <div style="background:#f8fafc;border-radius:10px;padding:14px;margin-bottom:20px;">
      <p style="color:#64748b;font-size:11px;font-weight:700;margin:0 0 6px;">Catatan:</p>
      <ul style="color:#94a3b8;font-size:11px;margin:0;padding-left:16px;line-height:1.8;">
        <li>Invoice ini adalah bukti resmi pembayaran Travel Bengkulu</li>
        <li>Simpan invoice ini sebagai referensi jika ada pertanyaan</li>
        <li>Invoice PDF terlampir di email ini &#128206;</li>
      </ul>
    </div>

    <div style="text-align:center;">
      <a href="https://wa.me/6285268645461" style="display:inline-block;background:#22c55e;color:white;font-size:13px;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;">
        WhatsApp: 0852-6864-5461
      </a>
      <p style="color:#94a3b8;font-size:11px;margin:10px 0 0;">cs@bengkulutravel.com &middot; bengkulutravel.com</p>
    </div>
  </div>

  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:16px;text-align:center;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">&copy; ${new Date().getFullYear()} Travel Bengkulu &mdash; Semua hak dilindungi</p>
  </div>

</div>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// POST Handler
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
    if (!order.email) {
      return NextResponse.json({ error: 'Pelanggan tidak memiliki email' }, { status: 400 });
    }

    const fromEmail  = process.env.EMAIL_FROM  || 'noreply@bengkulutravel.com';
    const resend     = new Resend(process.env.RESEND_API_KEY);

    const departureTime = (order as typeof order & { departureTime?: string }).departureTime;

    // Generate PDF invoice
    let pdfBuffer: Buffer | null = null;
    try {
      console.log('[INVOICE PDF] Starting generation for order:', order.id);
      pdfBuffer = await generateInvoicePDF({ ...order, departureTime });
      console.log('[INVOICE PDF] Generated successfully, size:', pdfBuffer.length, 'bytes');
    } catch (pdfErr) {
      console.error('[INVOICE PDF] Generation FAILED:', pdfErr);
      console.error('[INVOICE PDF] Error:', pdfErr instanceof Error ? pdfErr.message : String(pdfErr));
      pdfBuffer = null;
    }

    // Siapkan payload email
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emailPayload: any = {
      from: `Travel Bengkulu <${fromEmail}>`,
      to: order.email,
      subject: `Invoice Perjalanan ${order.route} - INV-${order.id}`,
      html: generateInvoiceHTML({ ...order, departureTime }),
    };

    // ✅ Lampirkan PDF sebagai base64 string
    if (pdfBuffer) {
      emailPayload.attachments = [
        {
          filename: `Invoice-${order.id}.pdf`,
          content: pdfBuffer.toString('base64'),
        },
      ];
    }

    const result = await resend.emails.send(emailPayload);
    console.log('[INVOICE EMAIL] Sent:', result);

    return NextResponse.json({
      success: true,
      message: `Invoice berhasil dikirim ke ${order.email}`,
      pdfAttached: !!pdfBuffer,
    });

  } catch (error) {
    console.error('[INVOICE] Error:', error);
    return NextResponse.json({
      error: 'Gagal kirim invoice: ' + (error instanceof Error ? error.message : 'Unknown'),
    }, { status: 500 });
  }
}
