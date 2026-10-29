/**
 * lib/ticket-pdf.ts
 * Generator PDF tiket TUNGGAL (dipakai /api/admin/confirm dan /api/admin/print-ticket).
 * Logo di header + QR verifikasi publik di kotak "Validasi Keaslian" + catatan retensi 3 bulan.
 */
import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib';
import QRCode from 'qrcode';
import { formatRp, type Order } from './orders';
import { LOGO_PNG_BASE64 } from './ticket-assets';
import { TICKET_RETENTION_DAYS, type IssuedTicket } from './tickets';

/** Hapus karakter non-Latin1 agar aman untuk font Helvetica (WinAnsi). */
export function sanitize(text: string): string {
  return (text || '')
    .replace(/→/g, '->').replace(/←/g, '<-')
    .replace(/–/g, '-').replace(/—/g, '-')
    .replace(/\u2018/g, "'").replace(/\u2019/g, "'")
    .replace(/\u201C/g, '"').replace(/\u201D/g, '"')
    .replace(/…/g, '...')
    .replace(/[^\x00-\xFF]/g, '');
}

function wrap(text: string, font: PDFFont, size: number, maxW: number): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const word of text.split(' ')) {
    const next = cur ? `${cur} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxW && cur) { lines.push(cur); cur = word; }
    else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

const fmtDate = (d: Date) =>
  d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });

export async function generateTicketPDF(
  order: Order & { departureTime?: string },
  ticket: IssuedTicket | null
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 portrait
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const margin = 48;
  const contentW = width - margin * 2;
  const col2 = margin + contentW / 2;

  const teal = rgb(0.059, 0.463, 0.431);
  const tealLt = rgb(0.082, 0.596, 0.565);
  const tealPale = rgb(0.8, 0.95, 0.93);
  const white = rgb(1, 1, 1);
  const dark = rgb(0.059, 0.090, 0.161);
  const gray = rgb(0.392, 0.455, 0.545);
  const green = rgb(0.086, 0.643, 0.361);
  const bgLight = rgb(0.976, 0.980, 0.988);
  const yellow = rgb(1.0, 0.980, 0.878);
  const yBorder = rgb(0.992, 0.906, 0.533);
  const yText = rgb(0.47, 0.21, 0.043);
  const lineClr = rgb(0.878, 0.910, 0.941);

  // ── Header + logo ──
  const headerH = 112;
  page.drawRectangle({ x: 0, y: height - headerH, width, height: headerH, color: teal });

  const logoR = 30;
  const logoCx = margin + logoR;
  const logoCy = height - headerH / 2;
  page.drawCircle({ x: logoCx, y: logoCy, size: logoR, color: white }); // lingkaran putih agar logo gelap tetap terbaca
  try {
    const logo = await pdfDoc.embedPng(Buffer.from(LOGO_PNG_BASE64, 'base64'));
    const s = logoR * 2 - 8; // 52pt, menyisakan 4pt tepi putih
    page.drawImage(logo, { x: logoCx - s / 2, y: logoCy - s / 2, width: s, height: s });
  } catch (e) {
    console.error('[TICKET-PDF] Logo gagal di-embed:', e);
    page.drawText('BT', { x: logoCx - 11, y: logoCy - 6, size: 16, font: fontBold, color: teal });
  }

  const titleX = margin + logoR * 2 + 14;
  page.drawText('Travel Bengkulu', { x: titleX, y: logoCy + 6, size: 20, font: fontBold, color: white });
  page.drawText('Tiket Perjalanan Resmi', { x: titleX, y: logoCy - 12, size: 10, font: fontReg, color: tealPale });

  const idText = sanitize(order.id);
  const idW = fontBold.widthOfTextAtSize(idText, 9);
  page.drawText('TIKET', { x: width - margin - fontBold.widthOfTextAtSize('TIKET', 11), y: logoCy + 10, size: 11, font: fontBold, color: tealPale });
  page.drawText(idText, { x: width - margin - idW, y: logoCy - 5, size: 9, font: fontBold, color: white });

  let y = height - headerH - 24;

  // ── Status ──
  page.drawRectangle({ x: margin, y: y - 14, width: contentW, height: 32, color: rgb(0.94, 0.99, 0.96), borderColor: rgb(0.53, 0.94, 0.65), borderWidth: 1 });
  page.drawText('Pembayaran Berhasil - Tiket Dikonfirmasi', { x: margin + 16, y: y - 4, size: 10, font: fontBold, color: green });
  y -= 42;

  // ── Nomor Pesanan ──
  page.drawRectangle({ x: margin, y: y - 24, width: contentW, height: 44, color: bgLight });
  page.drawText('NOMOR PESANAN', { x: margin + 16, y: y - 2, size: 8, font: fontBold, color: gray });
  page.drawText(idText, { x: margin + 16, y: y - 18, size: 16, font: fontBold, color: dark });
  const tgl = fmtDate(order.confirmedAt ? new Date(order.confirmedAt) : new Date());
  const tglTxt = `Dikonfirmasi: ${sanitize(tgl)}`;
  page.drawText(tglTxt, { x: width - margin - 16 - fontReg.widthOfTextAtSize(tglTxt, 8), y: y - 12, size: 8, font: fontReg, color: gray });
  y -= 54;

  // ── Detail Perjalanan ──
  page.drawText('DETAIL PERJALANAN', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 12;

  const rawRoute = order.route || '';
  const routeParts = rawRoute.includes('→') ? rawRoute.split('→').map(s => s.trim())
    : rawRoute.includes('->') ? rawRoute.split('->').map(s => s.trim())
    : rawRoute.includes(' ke ') ? rawRoute.split(' ke ').map(s => s.trim())
    : [rawRoute, ''];
  const fromCity = sanitize(routeParts[0] || rawRoute);
  const toCity = sanitize(routeParts[1] || '');

  const tripRows: [string, string][] = [
    ['Tanggal', sanitize(order.date)],
    ['Penumpang', `${order.passengers} orang`],
    ['Jemput di', sanitize(order.pickup || '-')],
    ['Antar ke', sanitize(order.dropoff || '-')],
  ];
  if (order.departureTime) tripRows.splice(1, 0, ['Jam Berangkat', sanitize(order.departureTime)]);

  const rowH = 16;
  const tripH = tripRows.length * rowH + 42;
  page.drawRectangle({ x: margin, y: y - tripH, width: contentW, height: tripH, color: rgb(0.94, 0.99, 0.97), borderColor: rgb(0.60, 0.96, 0.89), borderWidth: 1 });
  const fromW = fontBold.widthOfTextAtSize(fromCity, 15);
  const arrowX = margin + 16 + fromW + 8;
  page.drawText(fromCity, { x: margin + 16, y: y - 22, size: 15, font: fontBold, color: teal });
  page.drawText('->', { x: arrowX, y: y - 22, size: 15, font: fontBold, color: tealLt });
  if (toCity) page.drawText(toCity, { x: arrowX + 22, y: y - 22, size: 15, font: fontBold, color: teal });
  tripRows.forEach(([label, val], i) => {
    const ry = y - 42 - i * rowH;
    const display = val.length > 36 ? val.slice(0, 36) + '...' : val;
    page.drawText(label, { x: margin + 16, y: ry, size: 9, font: fontReg, color: gray });
    page.drawText(display, { x: col2, y: ry, size: 9, font: fontBold, color: dark });
  });
  y -= tripH + 14;

  // ── Data Penumpang ──
  page.drawText('DATA PENUMPANG', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 12;
  page.drawRectangle({ x: margin, y: y - 40, width: contentW, height: 46, color: bgLight });
  page.drawText('Nama', { x: margin + 16, y: y - 12, size: 9, font: fontReg, color: gray });
  page.drawText(sanitize(order.name), { x: col2, y: y - 12, size: 9, font: fontBold, color: dark });
  page.drawText('No. HP', { x: margin + 16, y: y - 30, size: 9, font: fontReg, color: gray });
  page.drawText(sanitize(order.phone), { x: col2, y: y - 30, size: 9, font: fontBold, color: dark });
  y -= 60;

  // ── Rincian Biaya ──
  page.drawText('RINCIAN BIAYA', { x: margin, y, size: 8, font: fontBold, color: gray });
  y -= 12;
  page.drawRectangle({ x: margin, y: y - 18, width: contentW, height: 20, color: teal });
  page.drawText('Deskripsi', { x: margin + 12, y: y - 12, size: 9, font: fontBold, color: white });
  page.drawText('Jumlah', { x: width - margin - 100, y: y - 12, size: 9, font: fontBold, color: white });
  y -= 20;

  const biayaRows: [string, string][] = [
    [`Tiket ${sanitize(rawRoute)} (${order.passengers} penumpang)`, sanitize(formatRp(order.harga))],
    ['Kode unik pembayaran', `+ ${sanitize(formatRp(order.kodeUnik))}`],
  ];
  biayaRows.forEach(([desc, val], i) => {
    const rowY = y - 12 - i * 20;
    page.drawRectangle({ x: margin, y: rowY - 7, width: contentW, height: 20, color: i % 2 === 0 ? white : bgLight });
    page.drawText(desc.length > 55 ? desc.slice(0, 55) + '...' : desc, { x: margin + 12, y: rowY, size: 9, font: fontReg, color: dark });
    page.drawText(val, { x: width - margin - 100, y: rowY, size: 9, font: fontBold, color: dark });
  });
  y -= biayaRows.length * 20 + 2;

  // ── Total ──
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 4;
  page.drawRectangle({ x: margin, y: y - 32, width: contentW, height: 34, color: teal });
  page.drawText('TOTAL PEMBAYARAN', { x: margin + 12, y: y - 13, size: 10, font: fontBold, color: tealPale });
  const totalTxt = sanitize(formatRp(order.total));
  page.drawText(totalTxt, { x: width - margin - 12 - fontBold.widthOfTextAtSize(totalTxt, 16), y: y - 14, size: 16, font: fontBold, color: white });
  y -= 48;

  // ── Instruksi (kiri) + Validasi Keaslian / QR (kanan) ──
  const boxH = 126;
  const qrBoxW = 122;
  const gap = 10;
  const instrW = contentW - qrBoxW - gap;
  const boxTop = y;

  page.drawRectangle({ x: margin, y: boxTop - boxH, width: instrW, height: boxH, color: yellow, borderColor: yBorder, borderWidth: 1 });
  page.drawText('INSTRUKSI PENTING', { x: margin + 14, y: boxTop - 16, size: 8, font: fontBold, color: rgb(0.57, 0.25, 0.055) });
  const instruksi = [
    `Tunjukkan tiket ini atau nomor pesanan ${idText} kepada driver`,
    'Siapkan diri 15 menit sebelum waktu penjemputan',
    'Driver akan menghubungi Anda sebelum tiba',
    'Bawa identitas diri (KTP/SIM)',
    ticket ? 'Tiket sah jika hasil scan QR berstatus VALID' : 'Hubungi admin jika perlu verifikasi keaslian tiket',
    'Satu tiket hanya berlaku untuk satu kali perjalanan',
  ];
  let iy = boxTop - 32;
  instruksi.forEach(line => {
    wrap(`- ${line}`, fontReg, 8.5, instrW - 28).forEach(l => {
      page.drawText(l, { x: margin + 14, y: iy, size: 8.5, font: fontReg, color: yText });
      iy -= 13;
    });
  });

  const qrX = width - margin - qrBoxW;
  page.drawRectangle({ x: qrX, y: boxTop - boxH, width: qrBoxW, height: boxH, color: white, borderColor: teal, borderWidth: 1.2 });
  const heading = 'VALIDASI KEASLIAN';
  page.drawText(heading, { x: qrX + (qrBoxW - fontBold.widthOfTextAtSize(heading, 7.5)) / 2, y: boxTop - 13, size: 7.5, font: fontBold, color: teal });

  if (ticket) {
    const qrPng = await QRCode.toBuffer(ticket.verifyUrl, {
      errorCorrectionLevel: 'M', margin: 1, width: 360, color: { dark: '#0f172a', light: '#ffffff' },
    });
    const qrImg = await pdfDoc.embedPng(qrPng);
    const qs = 82;
    page.drawImage(qrImg, { x: qrX + (qrBoxW - qs) / 2, y: boxTop - 18 - qs, width: qs, height: qs });
    const cap1 = 'Scan untuk cek keaslian';
    const cap2 = 'bengkulutravel.com/verify';
    page.drawText(cap1, { x: qrX + (qrBoxW - fontBold.widthOfTextAtSize(cap1, 7)) / 2, y: boxTop - 18 - qs - 10, size: 7, font: fontBold, color: dark });
    page.drawText(cap2, { x: qrX + (qrBoxW - fontReg.widthOfTextAtSize(cap2, 6.5)) / 2, y: boxTop - 18 - qs - 19, size: 6.5, font: fontReg, color: gray });
  } else {
    wrap('QR verifikasi belum tersedia. Hubungi admin untuk verifikasi tiket ini.', fontReg, 8, qrBoxW - 20)
      .forEach((l, i) => page.drawText(l, { x: qrX + 10, y: boxTop - 40 - i * 11, size: 8, font: fontReg, color: gray }));
  }
  y = boxTop - boxH - 12;

  // ── Catatan retensi data 3 bulan ──
  const keep = ticket ? fmtDate(ticket.expiresAt) : null;
  const retention =
    `Kebijakan data: data verifikasi tiket ini disimpan selama ${Math.round(TICKET_RETENTION_DAYS / 30)} bulan sejak tanggal terbit` +
    (keep ? ` (hingga ${keep})` : '') +
    '. Setelah itu data dihapus otomatis dan tiket tidak dapat diverifikasi lagi secara online.';
  wrap(sanitize(retention), fontReg, 7.5, contentW).forEach(l => {
    page.drawText(l, { x: margin, y, size: 7.5, font: fontReg, color: gray });
    y -= 10;
  });
  y -= 6;

  // ── Footer ──
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 13;
  page.drawText('Travel Bengkulu  |  BTN Air Bang Curup, Bengkulu', { x: margin, y, size: 8, font: fontReg, color: gray });
  page.drawText('bengkulutravel.com  |  cs@bengkulutravel.com  |  0852-6864-5461', { x: margin, y: y - 12, size: 8, font: fontReg, color: gray });

  if (y - 12 < 20) console.warn('[TICKET-PDF] Konten hampir melewati batas bawah halaman. y =', y - 12);

  return Buffer.from(await pdfDoc.save());
}
