/**
 * API: POST /api/admin/kwitansi
 * Generate PDF kwitansi manual dan opsional kirim via email.
 *
 * Payload: KwitansiData (lihat interface di bawah)
 *
 * Lokasi file: app/api/admin/kwitansi/route.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { Resend } from 'resend';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// ─────────────────────────────────────────────
// Interface data kwitansi
// ─────────────────────────────────────────────
interface KwitansiData {
  nomorKwitansi: string;       // auto-generated
  perusahaan: 'bengkulutravel' | 'kgtransport';
  penerima: {
    nama: string;
    alamat: string;
    noHp: string;
  };
  layanan: 'rental' | 'rental_sopir' | 'all_in';
  tarif: number;               // rupiah
  jumlahHari: number;
  tanggal: string;             // ISO date string
  pembayaran: 'tunai' | 'transfer';
  catatan?: string;
  // Jika kirim email
  email?: string;
}

// ─────────────────────────────────────────────
// Sanitasi teks
// ─────────────────────────────────────────────
function sanitize(text: string): string {
  return (text || '')
    .replace(/→/g, '->')
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/'/g, "'").replace(/'/g, "'")
    .replace(/"/g, '"').replace(/"/g, '"')
    .replace(/…/g, '...')
    .replace(/[^\x00-\xFF]/g, '');
}

function formatRp(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(n);
}

function labelLayanan(layanan: KwitansiData['layanan']): string {
  const map = {
    rental:       'Rental Mobil',
    rental_sopir: 'Rental Mobil + Sopir',
    all_in:       'All In (Mobil + Sopir + Bensin)',
  };
  return map[layanan];
}

// ─────────────────────────────────────────────
// Generate PDF Kwitansi
// ─────────────────────────────────────────────
async function generateKwitansiPDF(data: KwitansiData): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page   = pdfDoc.addPage([595, 420]); // A5 landscape-ish, ringkas

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const margin = 40;

  // Warna
  const isBT    = data.perusahaan === 'bengkulutravel';
  const primary = isBT ? rgb(0.118, 0.306, 0.847) : rgb(0.067, 0.502, 0.157); // biru vs hijau
  const white   = rgb(1, 1, 1);
  const dark    = rgb(0.059, 0.090, 0.161);
  const gray    = rgb(0.392, 0.455, 0.545);
  const bgLight = rgb(0.976, 0.980, 0.988);
  const lineClr = rgb(0.878, 0.910, 0.941);

  const namaPerusahaan = isBT ? 'BengkuluTravel.com' : 'KG Transport';
  const alamat = 'BTN Air Bang, Curup, Rejang Lebong, Bengkulu';
  const total  = data.tarif * data.jumlahHari;

  // ── Header ──
  page.drawRectangle({ x: 0, y: height - 90, width, height: 90, color: primary });

  // Logo inisial
  page.drawRectangle({ x: margin, y: height - 70, width: 40, height: 40, color: rgb(0.8, 0.88, 1.0) });
  page.drawText(isBT ? 'BT' : 'KG', {
    x: margin + 6, y: height - 53, size: 16, font: fontBold, color: white,
  });

  // Nama perusahaan
  page.drawText(sanitize(namaPerusahaan), {
    x: margin + 52, y: height - 44, size: 16, font: fontBold, color: white,
  });
  page.drawText(sanitize(alamat), {
    x: margin + 52, y: height - 60, size: 8, font: fontReg, color: rgb(0.8, 0.9, 1),
  });

  // Judul KWITANSI di kanan
  page.drawText('KWITANSI', {
    x: width - margin - 90, y: height - 42, size: 18, font: fontBold, color: white,
  });
  page.drawText(`No. ${sanitize(data.nomorKwitansi)}`, {
    x: width - margin - 90, y: height - 58, size: 8, font: fontReg, color: rgb(0.8, 0.9, 1),
  });

  let y = height - 110;

  // ── Info Penerima & Tanggal (2 kolom) ──
  const col2 = margin + (width - margin * 2) / 2 + 10;

  page.drawText('DITERIMA DARI:', { x: margin, y, size: 7, font: fontBold, color: gray });
  page.drawText('INFORMASI:', { x: col2, y, size: 7, font: fontBold, color: gray });
  y -= 13;

  page.drawText(sanitize(data.penerima.nama), { x: margin, y, size: 11, font: fontBold, color: dark });
  page.drawText(sanitize(data.penerima.noHp), { x: col2, y, size: 9, font: fontBold, color: dark });
  y -= 12;

  page.drawText(sanitize(data.penerima.alamat), { x: margin, y, size: 8, font: fontReg, color: gray });

  // Tanggal
  const tgl = new Date(data.tanggal).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  page.drawText(sanitize(`Tanggal: ${tgl}`), { x: col2, y, size: 8, font: fontReg, color: gray });
  y -= 12;

  // Pembayaran
  const bayarLabel = data.pembayaran === 'tunai' ? '[X] Tunai   [ ] Transfer' : '[ ] Tunai   [X] Transfer';
  page.drawText(sanitize(`Bayar: ${bayarLabel}`), { x: col2, y, size: 8, font: fontReg, color: dark });

  y -= 18;
  // ── Separator ──
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 14;

  // ── Tabel Layanan ──
  const contentW = width - margin * 2;

  // Header tabel
  page.drawRectangle({ x: margin, y: y - 18, width: contentW, height: 20, color: primary });
  page.drawText('Keterangan',       { x: margin + 10,          y: y - 12, size: 8, font: fontBold, color: white });
  page.drawText('Hari',             { x: margin + contentW - 160, y: y - 12, size: 8, font: fontBold, color: white });
  page.drawText('Tarif/Hari',       { x: margin + contentW - 110, y: y - 12, size: 8, font: fontBold, color: white });
  page.drawText('Jumlah',           { x: margin + contentW - 52,  y: y - 12, size: 8, font: fontBold, color: white });
  y -= 20;

  // Baris layanan
  page.drawRectangle({ x: margin, y: y - 18, width: contentW, height: 20, color: bgLight });
  page.drawText(sanitize(labelLayanan(data.layanan)), { x: margin + 10, y: y - 12, size: 9, font: fontReg, color: dark });
  page.drawText(String(data.jumlahHari),              { x: margin + contentW - 148, y: y - 12, size: 9, font: fontBold, color: dark });
  page.drawText(sanitize(formatRp(data.tarif)),        { x: margin + contentW - 108, y: y - 12, size: 9, font: fontReg, color: dark });
  page.drawText(sanitize(formatRp(total)),             { x: margin + contentW - 52,  y: y - 12, size: 9, font: fontBold, color: dark });
  y -= 22;

  // Garis bawah tabel
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: lineClr });
  y -= 4;

  // ── Total ──
  page.drawRectangle({ x: margin + contentW - 180, y: y - 22, width: 180, height: 24, color: primary });
  page.drawText('TOTAL:', { x: margin + contentW - 170, y: y - 14, size: 9, font: fontBold, color: white });
  page.drawText(sanitize(formatRp(total)), { x: margin + contentW - 85, y: y - 14, size: 11, font: fontBold, color: white });
  y -= 30;

  // ── Catatan (jika ada) ──
  if (data.catatan) {
    page.drawText(sanitize(`Catatan: ${data.catatan}`), {
      x: margin, y: y - 4, size: 8, font: fontReg, color: gray,
    });
    y -= 16;
  }

  // ── Area Tanda Tangan ──
  const signY = 50;
  // Tanda tangan penerima
  page.drawText('Penerima,', { x: margin, y: signY + 30, size: 8, font: fontReg, color: gray });
  page.drawLine({ start: { x: margin, y: signY + 6 }, end: { x: margin + 90, y: signY + 6 }, thickness: 0.5, color: lineClr });
  page.drawText(sanitize(data.penerima.nama), { x: margin, y: signY - 6, size: 7, font: fontReg, color: gray });

  // Tanda tangan & stempel pembuat
  const signX2 = width - margin - 100;
  page.drawText('Hormat Kami,', { x: signX2, y: signY + 30, size: 8, font: fontReg, color: gray });
  page.drawText('(Stempel & TTD)', { x: signX2 - 5, y: signY + 18, size: 7, font: fontReg, color: rgb(0.75,0.75,0.75) });
  // Kotak stempel
  page.drawRectangle({ x: signX2 - 5, y: signY - 5, width: 100, height: 40, borderColor: lineClr, borderWidth: 1, color: rgb(0.98,0.98,0.98) });
  page.drawLine({ start: { x: signX2, y: signY + 6 }, end: { x: signX2 + 95, y: signY + 6 }, thickness: 0.5, color: lineClr });
  page.drawText(sanitize(namaPerusahaan), { x: signX2, y: signY - 6, size: 7, font: fontReg, color: gray });

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
    const body: KwitansiData & { action: 'print' | 'send' } = await req.json();

    const { action, ...data } = body;

    // Validasi dasar
    if (!data.nomorKwitansi || !data.penerima?.nama || !data.tarif || !data.jumlahHari) {
      return NextResponse.json({ error: 'Data kwitansi tidak lengkap' }, { status: 400 });
    }

    // Generate PDF
    const pdfBuffer = await generateKwitansiPDF(data);
    const pdfBase64 = pdfBuffer.toString('base64');

    // Jika hanya cetak → kembalikan PDF sebagai base64
    if (action === 'print' || !data.email) {
      return NextResponse.json({
        success: true,
        pdf: pdfBase64,
        filename: `Kwitansi-${data.nomorKwitansi}.pdf`,
      });
    }

    // Jika kirim email
    const resend = new Resend(process.env.RESEND_API_KEY);
    const namaPerusahaan = data.perusahaan === 'bengkulutravel' ? 'BengkuluTravel.com' : 'KG Transport';
    const fromEmail = process.env.EMAIL_FROM || 'noreply@bengkulutravel.com';

    await resend.emails.send({
      from: `${namaPerusahaan} <${fromEmail}>`,
      to: data.email,
      subject: `Kwitansi No. ${data.nomorKwitansi} — ${namaPerusahaan}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <h2 style="color:#1e40af;">Kwitansi Pembayaran</h2>
          <p>Yth. <strong>${data.penerima.nama}</strong>,</p>
          <p>Terlampir kwitansi pembayaran No. <strong>${data.nomorKwitansi}</strong> dari <strong>${namaPerusahaan}</strong>.</p>
          <p style="color:#64748b;font-size:13px;">Terima kasih atas kepercayaan Anda.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;">
          <p style="color:#94a3b8;font-size:11px;">${namaPerusahaan} &middot; BTN Air Bang, Curup, Rejang Lebong, Bengkulu</p>
        </div>
      `,
      attachments: [
        {
          filename: `Kwitansi-${data.nomorKwitansi}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: `Kwitansi berhasil dikirim ke ${data.email}`,
    });

  } catch (error) {
    console.error('[KWITANSI] Error:', error);
    return NextResponse.json({
      error: 'Gagal generate kwitansi: ' + (error instanceof Error ? error.message : 'Unknown'),
    }, { status: 500 });
  }
}
  
