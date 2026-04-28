/**
 * API: GET /api/admin/rentals
 * Ambil semua pesanan rental (untuk admin dashboard)
 */

import { NextResponse } from 'next/server';
import { getAllRentalOrders } from '@/lib/orders';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rentals = await getAllRentalOrders();
    return NextResponse.json({ rentals });
  } catch (error) {
    console.error('Get rentals error:', error);
    return NextResponse.json({ error: 'Gagal memuat data rental' }, { status: 500 });
  }
}
