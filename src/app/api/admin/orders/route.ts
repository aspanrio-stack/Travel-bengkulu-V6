/**
 * API: GET /api/admin/orders — Ambil semua pesanan
 * API: POST /api/admin/orders — Simpan pesanan baru (dipanggil dari form booking)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, saveOrder, Order } from '@/lib/orders';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// GET — Daftar semua pesanan (hanya admin)
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

// POST — Simpan pesanan baru (dari halaman pembayaran)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, phone, email, routeId, route,
      date, passengers, pickup, dropoff,
      harga, kodeUnik, total, paymentMethod,
    } = body;

    if (!name || !phone || !route || !total) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const order: Order = {
      id: uuidv4().split('-')[0].toUpperCase() + Date.now().toString().slice(-4),
      name,
      phone,
      email: email || '',
      route,
      routeId: routeId || '',
      date,
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

    await saveOrder(order);

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error) {
    console.error('Save order error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan pesanan' }, { status: 500 });
  }
}
