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
import { getOrderById } from '@/lib/orders';
import { getSession } from '@/lib/auth';
import { generateTicketPDF } from '@/lib/ticket-pdf';
import { issueTicket } from '@/lib/tickets';

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
    // QR verifikasi hanya untuk pesanan yang sudah dikonfirmasi; token yang sama dipakai saat cetak ulang
    const ticket = order.status === 'success' ? await issueTicket(order) : null;
    const pdfBuffer = await generateTicketPDF({ ...order, departureTime }, ticket);
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
