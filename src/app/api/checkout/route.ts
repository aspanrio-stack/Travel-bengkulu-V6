import { NextResponse } from 'next/server';
import Midtrans from 'midtrans-client';

const snap = new Midtrans.Snap({
  isProduction: false, // Ubah ke true jika sudah siap launching (Production)
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { name, phone, route, price, passengers } = await request.json();
    const orderId = `TRV-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price * parseInt(passengers),
      },
      item_details: [
        {
          id: route.replace(/\s+/g, '-'),
          price: price,
          quantity: parseInt(passengers),
          name: `Tiket Travel: ${route}`,
        },
      ],
      customer_details: {
        first_name: name,
        phone: phone,
      },
      // Aktifkan hanya metode pembayaran tertentu (Opsional)
      enabled_payments: ["gopay", "shopeepay", "other_qris", "bank_transfer"],
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token, orderId });
  } catch (error) {
    console.error('Midtrans Error:', error);
    return NextResponse.json({ error: 'Gagal membuat transaksi' }, { status: 500 });
  }
}
