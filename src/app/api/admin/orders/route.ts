/**
 * app/api/admin/orders/route.ts
 *
 * GET  /api/admin/orders  — Ambil semua pesanan (hanya admin)
 * POST /api/admin/orders  — Simpan pesanan baru + kirim WA notifikasi
 *
 * WA yang dikirim saat POST:
 *   1. Ke pemesan  → ringkasan pesanan + info bahwa pesanan diterima
 *   2. Ke admin 1  → detail lengkap + instruksi cek pembayaran
 *   3. Ke admin 2  → idem
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, saveOrder, Order } from '@/lib/orders';
import { getSession } from '@/lib/auth';
import {
  sendWA,
  sendWABulk,
  ADMIN_NUMBERS,
  msgPemesanTerima,
  msgAdminPesananBaru,
} from '@/lib/fonnte';
import { v4 as uuidv4 } from 'uuid';

// ─────────────────────────────────────────────
// GET — Daftar semua pesanan (hanya admin)
// ─────────────────────────────────────────────
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pesanan' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// POST — Simpan pesanan baru + kirim WA
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, phone, email, routeId, route,
      date, departureTime, passengers,
      pickup, dropoff,
      harga, kodeUnik, total, paymentMethod,
    } = body;

    if (!name || !phone || !route || !total) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // ── Buat objek pesanan ──
    const order: Order = {
      id: uuidv4().split('-')[0].toUpperCase() + Date.now().toString().slice(-4),
      name,
      phone,
      email: email || '',
      route,
      routeId: routeId || '',
      date,
      departureTime: departureTime || '',
      passengers: parseInt(passengers) || 1,
      pickup,
      dropoff: dropoff || '',
      harga: parseInt(harga) || 0,
      kodeUnik: parseInt(kodeUnik) || 0,
      total: parseInt(total) || 0,
      status: 'pending',
      paymentMethod: (paymentMethod === 'tunai' ? 'tunai' : 'qris') as 'qris' | 'tunai',
      createdAt: new Date().toISOString(),
    };

    // ── Simpan ke database / Redis ──
    await saveOrder(order);

    // ── Kirim WA secara paralel (tidak block response) ──
    const bookingData = {
      id:             order.id,
      name:           order.name,
      phone:          order.phone,
      email:          order.email || undefined,
      route:          order.route,
      date:           order.date,
      departureTime:  order.departureTime || undefined,
      passengers:     order.passengers,
      pickup:         order.pickup,
      dropoff:        order.dropoff || undefined,
      total:          order.total,
      paymentMethod:  order.paymentMethod,
    };

    // Fire-and-forget: kirim ke pemesan + semua admin
    Promise.allSettled([
      // WA ke pemesan
      sendWA(order.phone, msgPemesanTerima(bookingData)),
      // WA ke semua admin
      sendWABulk(ADMIN_NUMBERS, msgAdminPesananBaru(bookingData)),
    ]).then(results => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`[Fonnte] Gagal kirim WA index ${i}:`, r.reason);
        }
      });
    });

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error) {
    console.error('Save order error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan pesanan' }, { status: 500 });
  }
}
