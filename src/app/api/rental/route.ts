/**
 * app/api/rental/route.ts
 *
 * POST /api/rental
 * Simpan pesanan rental baru + kirim WA notifikasi via Fonnte
 *
 * WA yang dikirim:
 *   1. Ke pemesan  → konfirmasi pesanan rental diterima
 *   2. Ke admin 1 & 2 → detail rental + instruksi konfirmasi
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveOrder, Order } from '@/lib/orders';
import {
  sendWA,
  sendWABulk,
  ADMIN_NUMBERS,
  formatRp,
} from '@/lib/fonnte';
import { v4 as uuidv4 } from 'uuid';

// Label helper
const VEHICLE_MAP: Record<string, string> = {
  avanza: 'Toyota Avanza',
  innova: 'Toyota Innova',
  hiace:  'Toyota HiAce',
};
const RENTAL_TYPE_MAP: Record<string, string> = {
  with_driver: 'Dengan Sopir',
  lepas_kunci: 'Lepas Kunci',
};
const AREA_MAP: Record<string, string> = {
  dalam_kota: 'Dalam Kota',
  luar_kota:  'Luar Kota',
};

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

    if (!name || !phone || !vehicle || !totalPrice) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // ── Buat order ──
    const order: Order = {
      id: 'RNT-' + uuidv4().split('-')[0].toUpperCase() + Date.now().toString().slice(-4),
      name,
      phone,
      email: email || '',
      route: `Rental ${VEHICLE_MAP[vehicle] || vehicle} (${RENTAL_TYPE_MAP[rentalType] || rentalType})`,
      routeId: 'rental',
      date: startDate,
      departureTime: `${startDate} s/d ${endDate} (${days} hari) · Ambil pukul ${pickupTime}`,
      passengers: 1,
      pickup: pickupAddress,
      dropoff: notes || '',
      harga: parseInt(pricePerDay) || 0,
      kodeUnik: 0,
      total: parseInt(totalPrice) || 0,
      status: 'pending',
      paymentMethod: (paymentMethod === 'tunai' ? 'tunai' : 'qris') as 'qris' | 'tunai',
      createdAt: new Date().toISOString(),
    };

    await saveOrder(order);

    // ── Susun pesan WA ke pemesan ──
    const msgPemesan = [
      `Assalamualaikum / Halo *${name}* 👋`,
      '',
      `✅ *Pesanan Rental Anda telah kami terima!*`,
      '',
      `🚗 *Detail Rental:*`,
      `Kendaraan  : ${VEHICLE_MAP[vehicle] || vehicle}`,
      `Jenis Sewa : ${RENTAL_TYPE_MAP[rentalType] || rentalType}${rentalType === 'with_driver' ? ` - ${AREA_MAP[area] || area}` : ''}`,
      `Tanggal    : ${startDate} s/d ${endDate} (${days} hari)`,
      `Jam Ambil  : ${pickupTime} WIB`,
      `Lokasi     : ${pickupAddress}`,
      notes ? `Catatan    : ${notes}` : '',
      '',
      `💰 *Rincian Harga:*`,
      `Sewa/Hari  : ${formatRp(parseInt(pricePerDay) || 0)}`,
      parseInt(driverFeePerDay) > 0 ? `Jasa Sopir : ${formatRp(parseInt(driverFeePerDay))}` : '',
      `Total      : ${formatRp(parseInt(totalPrice) || 0)}`,
      `Pembayaran : ${paymentMethod === 'qris' ? 'QRIS (Transfer)' : 'Tunai saat pengambilan'}`,
      `🔖 No. Pesanan: *${order.id}*`,
      '',
      `⏳ Admin kami akan segera menghubungi Anda untuk konfirmasi ketersediaan unit.`,
      '',
      `Terima kasih telah memesan di *Travel Bengkulu* 🙏`,
    ].filter(Boolean).join('\n');

    // ── Susun pesan WA ke admin ──
    const msgAdmin = [
      `🔔 *PESANAN RENTAL BARU!*`,
      `━━━━━━━━━━━━━━━━━━━━━━━`,
      `🔖 No. Pesanan : *${order.id}*`,
      '',
      `🚗 *Detail Rental:*`,
      `Kendaraan  : ${VEHICLE_MAP[vehicle] || vehicle}`,
      `Jenis Sewa : ${RENTAL_TYPE_MAP[rentalType] || rentalType}${rentalType === 'with_driver' ? ` - ${AREA_MAP[area] || area}` : ''}`,
      `Tanggal    : ${startDate} s/d ${endDate} (${days} hari)`,
      `Jam Ambil  : ${pickupTime} WIB`,
      `Lokasi     : ${pickupAddress}`,
      notes ? `Catatan    : ${notes}` : '',
      '',
      `👤 *Data Pemesan:*`,
      `Nama  : ${name}`,
      `HP    : ${phone}`,
      `Email : ${email || '(tidak diisi)'}`,
      '',
      `💰 Total     : ${formatRp(parseInt(totalPrice) || 0)}`,
      `💳 Metode    : ${paymentMethod === 'qris' ? '📱 QRIS' : '💵 Tunai'}`,
      `━━━━━━━━━━━━━━━━━━━━━━━`,
      paymentMethod === 'qris'
        ? `⚠️ *Segera cek pembayaran QRIS!*\nSetelah pembayaran diterima, tekan *✅ Konfirmasi* di dashboard admin.\nTiket/Invoice otomatis terkirim ke pelanggan.`
        : `ℹ️ Pesanan *Tunai* — Segera konfirmasi ketersediaan unit kepada pelanggan.`,
    ].filter(Boolean).join('\n');

    // Fire-and-forget
    Promise.allSettled([
      sendWA(phone, msgPemesan),
      sendWABulk(ADMIN_NUMBERS, msgAdmin),
    ]).then(results => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`[Fonnte Rental] Gagal kirim WA index ${i}:`, r.reason);
        }
      });
    });

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error) {
    console.error('Save rental order error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan pesanan rental' }, { status: 500 });
  }
}
