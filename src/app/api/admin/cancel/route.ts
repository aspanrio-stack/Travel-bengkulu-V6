/**
 * POST /api/admin/cancel  { orderId, restore?: boolean }
 * Batalkan pesanan (tidak dihitung di statistik & pendapatan) atau aktifkan kembali. Hanya admin.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { setOrderCancelled } from '@/lib/orders';
import { revokeTicketByOrder } from '@/lib/tickets';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { orderId, restore } = await req.json();
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ error: 'orderId diperlukan' }, { status: 400 });
    }
    const order = await setOrderCancelled(orderId, !restore);
    if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    if (!restore) await revokeTicketByOrder(orderId); // QR tiket pesanan batal dinonaktifkan
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ error: 'Gagal memproses pembatalan' }, { status: 500 });
  }
}
