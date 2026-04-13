import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getRouteById, formatPrice } from '@/lib/routes';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { routeId, passengers, name, phone, email, date, pickupAddress, dropoffAddress, paymentMethod } = body;

    // Validasi input
    if (!routeId || !passengers || !name || !phone || !date || !pickupAddress) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const route = getRouteById(routeId);
    if (!route) {
      return NextResponse.json({ error: 'Rute tidak ditemukan' }, { status: 404 });
    }

    const totalPrice = route.price * parseInt(passengers);
    const orderId = `BKL-${Date.now()}-${uuidv4().split('-')[0].toUpperCase()}`;

    // Midtrans parameter
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalPrice,
      },
      customer_details: {
        first_name: name,
        phone: phone,
        // Hanya kirim email jika diisi — Midtrans tolak string kosong
        ...(email && email.trim() ? { email: email.trim() } : {}),
      },
      item_details: [
        {
          id: routeId,
          price: route.price,
          quantity: parseInt(passengers),
          name: `Travel ${route.from} → ${route.to}`,
          category: 'Travel',
        },
      ],
      // Aktifkan metode pembayaran sesuai pilihan
      enabled_payments: paymentMethod === 'bank_transfer'
        ? ['bca_va', 'bni_va', 'bri_va', 'mandiri_bill', 'permata_va', 'other_va']
        : ['qris', 'gopay', 'shopeepay', 'dana', 'ovo'],
      custom_field1: `${route.from} ke ${route.to}`,
      custom_field2: date,
      custom_field3: `${pickupAddress} | ${dropoffAddress || '-'}`,
    };

    // Call Midtrans API
    const authKey = Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64');
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const midtransUrl = isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const midtransResponse = await fetch(midtransUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authKey}`,
      },
      body: JSON.stringify(parameter),
    });

    const midtransData = await midtransResponse.json();

    if (!midtransResponse.ok) {
      console.error('Midtrans error:', midtransData);
      return NextResponse.json({ error: 'Gagal membuat transaksi' }, { status: 500 });
    }

    return NextResponse.json({
      token: midtransData.token,
      redirect_url: midtransData.redirect_url,
      order_id: orderId,
      total: totalPrice,
      total_formatted: formatPrice(totalPrice),
      route: `${route.from} → ${route.to}`,
      date,
      passengers,
      name,
      phone,
      email,
      pickup: pickupAddress,
      dropoff: dropoffAddress,
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
