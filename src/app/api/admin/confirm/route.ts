/**
 * app/api/admin/confirm/route.ts
 *
 * POST /api/admin/confirm
 * Dipanggil saat admin klik "✅ Konfirmasi" di dashboard.
 *
 * Yang terjadi:
 *   1. Update status pesanan → 'success'
 *   2. Kirim WA Notif ke-2 ke pemesan (konfirmasi pembayaran diterima)
 *   3. Kirim tiket via email JIKA lib/email tersedia (opsional)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus, Order } from '@/lib/orders';
import { getSession } from '@/lib/auth';
import { sendWA, msgPemesanKonfirmasi } from '@/lib/fonnte';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId diperlukan' }, { status: 400 });
    }

    const order: Order | null = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (order.status === 'success') {
      return NextResponse.json({ error: 'Pesanan sudah dikonfirmasi sebelumnya' }, { status: 400 });
    }

    // Update status
    await updateOrderStatus(orderId, 'success');

    const bookingData = {
      id:            order.id,
      name:          order.name,
      phone:         order.phone,
      email:         order.email || undefined,
      route:         order.route,
      date:          order.date,
      departureTime: (order as Order & { departureTime?: string }).departureTime || undefined,
      passengers:    order.passengers,
      pickup:        order.pickup,
      dropoff:       order.dropoff || undefined,
      total:         order.total,
      paymentMethod: order.paymentMethod,
    };

    // Kirim WA notif ke-2 ke pemesan
    sendWA(order.phone, msgPemesanKonfirmasi(bookingData)).catch(err => {
      console.error('[Fonnte] Gagal kirim WA konfirmasi:', err);
    });

    // Kirim email tiket jika lib/email tersedia
    // Uncomment baris di bawah jika kamu sudah punya lib/email.ts
    // if (order.email) {
    //   const { sendTicketEmail } = await import('@/lib/email');
    //   sendTicketEmail(order).catch(err => console.error('[Email] Gagal:', err));
    // }

    return NextResponse.json({
      success: true,
      message: order.email
        ? `Pesanan ${orderId} dikonfirmasi. WA notifikasi terkirim. (Email tiket perlu lib/email)`
        : `Pesanan ${orderId} dikonfirmasi. WA notifikasi terkirim ke pemesan.`,
    });

  } catch (error) {
    console.error('Confirm order error:', error);
    return NextResponse.json({ error: 'Gagal mengkonfirmasi pesanan' }, { status: 500 });
  }
}
