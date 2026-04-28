/**
 * API: POST /api/rental
 * Simpan pesanan rental baru ke Redis.
 * Dipanggil oleh RentalForm sebelum redirect ke WA atau halaman QRIS.
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveRentalOrder, type RentalOrder, type RentalVehicle, type RentalType, type RentalArea } from '@/lib/orders';

function generateId(): string {
  const now = new Date();
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RNT-${ymd}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name, phone, email,
      vehicle, rentalType, area,
      startDate, endDate, days,
      pickupTime, pickupAddress, notes,
      pricePerDay, driverFeePerDay, totalPrice,
      paymentMethod,
    } = body;

    // Validasi minimal
    if (!name || !phone || !vehicle || !rentalType || !startDate || !endDate || !pickupAddress) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const order: RentalOrder = {
      id: generateId(),
      type: 'rental',
      name,
      phone,
      email: email || undefined,
      vehicle: vehicle as RentalVehicle,
      rentalType: rentalType as RentalType,
      area: (area || 'dalam_kota') as RentalArea,
      startDate,
      endDate,
      days: Number(days) || 1,
      pickupTime: pickupTime || '08:00',
      pickupAddress,
      notes: notes || undefined,
      pricePerDay: Number(pricePerDay) || 0,
      driverFeePerDay: Number(driverFeePerDay) || 0,
      totalPrice: Number(totalPrice) || 0,
      status: 'pending',
      paymentMethod: paymentMethod === 'qris' ? 'qris' : 'tunai',
      createdAt: new Date().toISOString(),
    };

    await saveRentalOrder(order);

    return NextResponse.json({ success: true, id: order.id });
  } catch (error) {
    console.error('Rental order error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan pesanan: ' + (error instanceof Error ? error.message : 'Unknown') },
      { status: 500 }
    );
  }
}
