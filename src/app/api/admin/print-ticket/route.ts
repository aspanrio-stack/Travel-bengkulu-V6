/**
 * API: POST /api/admin/print-ticket
 * Generate PDF tiket untuk di-download admin (tanpa kirim email).
 *
 * Payload: { orderId: string }
 * Response: { pdf: string (base64), filename: string }
 *
 * Lokasi file: app/api/admin/print-ticket/route.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, formatRp } from '@/lib/orders';
import { getSession } from '@/lib/auth';
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
// Generate PDF Tiket (sama dengan send-invoice tapi pakai desain tiket teal)
// ─────────────────────────────────────────────
async function generateTicketPDF(order: {
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
  const teal    = rgb(0.059, 0.463, 0.431); // #0f766e
  const tealLt  = rgb(0.082, 0.596, 0.565); // #14988f
  const white   = rgb(1, 1, 1);
  const dark    = rgb(0.059, 0.090, 0.161);
  const gray    = rgb(0.392, 0.455, 0.545);
  const green   = rgb(0.086, 0.643, 0.361);
  const bgLight = rgb(0.976, 0.980, 0.988);
  const yellow  = rgb(1.000, 0.980, 0.878);
  const yBorder = rgb(0.992, 0.906, 0.533);
  const lineClr = rgb(0.878, 0.910, 0.941);

  // ── Header hijau ──
  page.drawRectangle({ x: 0, y: height - 130, width, height: 130, color: teal });
  page.drawRectangle({ x: margin, y: height - 100, width: 44, height: 44, color: tealLt });
  page.drawText('T', { x: margin + 14, y: height - 84, size: 22, font: fontBold, color: white });
  page.drawText('Travel Bengkulu', { x: margin + 56, y: height - 72, size: 18, font: fontBold, color: white });
  page.drawText('Tiket Perjalanan Resmi', { x: margin + 56, y: height - 90, size: 10, font: fontReg, color: rgb(0.8, 0.95, 0.93) });

  // Nomor order di kanan atas
  page.drawText('TIKET', { x: width - margin - 80, y: height - 62, size: 11, font: fontBold, color: rgb(0.8, 0.95, 0.93) });
  page.drawText(sanitize(order.id), { x: width - margin - 80, y: height - 78, size: 9, font: fontBold, color: white });

  let y = height - 155;

  // ── Status box ──
  const statusColor  = order.status === 'success' ? rgb(0.94, 0.99, 0.96)  : rgb(1.0, 0.98, 0.88);
  const statusBorder = order.status === 'success' ? rgb(0.53, 0.94, 0.65)  : rgb(0.99, 0.91, 0.53);
  const statusText   = order.status === 'success'
    ? 'Pembayaran Berhasil - Tiket Dikonfirmasi'
    : 'Menunggu Konfirmasi Pembayaran';
  const statusTxtClr = order.status === 'success' ? green : rgb(0.57, 0.38, 0.05);

  page.drawRectangle({ x: margin, y: y - 14, width: contentW, height: 34, color: statusColor, borderColor: statusBorder, borderWidth: 1 });
  page.drawText(sanitize(statusText), { x: margin + 16, y: y - 2, size: 10, font: fontBold, color: statusTxtClr });
  y -= 46;

  // ── Nomor Pesanan ──
  page.drawRectangle({ x: margin, y: y - 28, width: contentW, height: 48, color: bgLight });
  page.drawText('NOMOR PESANAN', { x: margin + 16, y: y - 4, size: 8, font: fontBold, color: gray });
  page.drawText(sanitize(order.id), { x: margin + 16, y: y - 20, size: 16, font: fontBold, color: dark });
  y -= 60;

  // ── DETAIL PERJALANAN ──
  page.drawText('DETAIL PERJALANAN', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  // Pisah rute
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
  const col2 = margin + contentW / 2;
  const fromW = fontBold.widthOfTextAtSize(fromCity, 15);
  const arrowX = margin + 16 + fromW + 8;
  page.drawText(fromCity, { x: margin + 16, y: y - 22, size: 15, font: fontBold, color: teal });
  page.drawText('->', { x: arrowX, y: y - 22, size: 15, font: fontBold, color: tealLt });
  if (toCity) page.drawText(toCity, { x: arrowX + 22, y: y - 22, size: 15, font: fontBold, color: teal });

  tripRows.forEach(([label, val], i) => {
    const ry = y - 44 - i * 18;
    page.drawText(label, { x: margin + 16, y: ry, size: 9, font: fontReg, color: gray });
    const display = val.length > 36 ? val.slice(0, 36) + '...' : val;
    page.drawText(display, { x: col2, y: ry, size: 9, font: fontBold, color: dark });
  });
  y -= tripH + 16;

  // ── DATA PENUMPANG ──
  page.drawText('DATA PENUMPANG', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  page.drawRectangle({ x: margin, y: y - 50, width: contentW, height: 60, color: bgLight });
  page.drawText('Nama', { x: margin + 16, y: y - 16, size: 9, font: fontReg, color: gray });
  page.drawText(sanitize(order.name), { x: col2, y: y - 16, size: 9, font: fontBold, color: dark });
  page.drawText('No. HP', { x: margin + 16, y: y - 34, size: 9, font: fontReg, color: gray });
  page.drawText(sanitize(order.phone), { x: col2, y: y - 34, size: 9, font: fontBold, color: dark });
  y -= 72;

  // ── RINCIAN BIAYA ──
  page.drawText('RINCIAN BIAYA', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 14;

  page.drawRectangle({ x: margin, y: y - 20, width: contentW, height: 22, color: teal });
  page.drawText('Deskripsi', { x: margin + 12, y: y - 14, size: 9, font: fontBold, color: white });
  page.drawText('Jumlah', { x: width - margin - 100, y: y - 14, size: 9, font: fontBold, color: white });
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
    page.drawText(descDisplay, { x: margin + 12, y: rowY, size: 9, font: fontReg, color: dark });
    page.drawText(val, { x: width - margin - 100, y: rowY, size: 9, font: fontBold, color: dark });
  });
  y -= biayaRows.length * 22 + 4;

  // Total
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 4;
  page.drawRectangle({ x: margin, y: y - 36, width: contentW, height: 38, color: teal });
  page.drawText('TOTAL PEMBAYARAN', { x: margin + 12, y: y - 14, size: 10, font: fontBold, color: rgb(0.8, 0.95, 0.93) });
  page.drawText(sanitize(formatRp(order.total)), { x: width - margin - 130, y: y - 14, size: 16, font: fontBold, color: white });
  y -= 52;

  // ── INSTRUKSI ──
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

  // ── FOOTER ──
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 16;
  page.drawText('Travel Bengkulu  |  BTN Air Bang Curup, Bengkulu', { x: margin, y, size: 8, font: fontReg, color: gray });
  page.drawText('bengkulutravel.com  |  cs@bengkulutravel.com  |  0852-6864-5461', { x: margin, y: y - 14, size: 8, font: fontReg, color: gray });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
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

    const departureTime = (order as typeof order & { departureTime?: string }).departureTime;

    console.log('[PRINT TICKET] Generating PDF for order:', order.id);
    const pdfBuffer = await generateTicketPDF({ ...order, departureTime });
    console.log('[PRINT TICKET] PDF generated, size:', pdfBuffer.length, 'bytes');

    return NextResponse.json({
      success:  true,
      pdf:      pdfBuffer.toString('base64'),
      filename: `Tiket-${order.id}.pdf`,
    });

  } catch (error) {
    console.error('[PRINT TICKET] Error:', error);
    return NextResponse.json({
      error: 'Gagal generate tiket: ' + (error instanceof Error ? error.message : 'Unknown'),
    }, { status: 500 });
  }
}
