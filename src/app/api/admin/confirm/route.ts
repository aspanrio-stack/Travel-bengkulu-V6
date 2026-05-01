/**
 * app/api/admin/confirm/route.ts
 *
 * POST /api/admin/confirm
 *
 * Dipanggil saat admin klik "✅ Konfirmasi" di dashboard.
 * Yang terjadi:
 *   1. Update status pesanan → 'success'
 *   2. Kirim tiket PDF via email (jika ada email)
 *   3. Kirim WA notifikasi ke pemesan (Notif ke-2)
 *      → konfirmasi pembayaran diterima + nomor tiket
 *      → info tiket sudah dikirim ke email (jika ada email)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus, Order } from '@/lib/orders';
import { getSession } from '@/lib/auth';
import { sendWA, msgPemesanKonfirmasi } from '@/lib/fonnte';

// Import fungsi kirim email tiket yang sudah ada di sistem kamu
// Sesuaikan path jika berbeda
import { sendTicketEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  // ── Auth: hanya admin ──
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId diperlukan' }, { status: 400 });
    }

    // ── Ambil data pesanan ──
    const order: Order | null = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    if (order.status === 'success') {
      return NextResponse.json({ error: 'Pesanan sudah dikonfirmasi sebelumnya' }, { status: 400 });
    }

    // ── Update status ke success ──
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

    // ── Jalankan: kirim email + WA secara paralel ──
    const tasks: Promise<unknown>[] = [];

    // Task 1: Kirim tiket via email (jika ada email)
    if (order.email) {
      tasks.push(
        sendTicketEmail(order).catch(err => {
          console.error('[Email] Gagal kirim tiket:', err);
        })
      );
    }

    // Task 2: Kirim WA Notif ke-2 ke pemesan
    tasks.push(
      sendWA(order.phone, msgPemesanKonfirmasi(bookingData)).catch(err => {
        console.error('[Fonnte] Gagal kirim WA konfirmasi:', err);
      })
    );

    // Tunggu semua selesai
    await Promise.allSettled(tasks);

    return NextResponse.json({
      success: true,
      message: order.email
        ? `Pesanan ${orderId} dikonfirmasi. Tiket dikirim ke ${order.email} & WA notifikasi terkirim ke pemesan.`
        : `Pesanan ${orderId} dikonfirmasi. WA notifikasi terkirim ke pemesan.`,
    });

  } catch (error) {
    console.error('Confirm order error:', error);
    return NextResponse.json({ error: 'Gagal mengkonfirmasi pesanan' }, { status: 500 });
  }
}
