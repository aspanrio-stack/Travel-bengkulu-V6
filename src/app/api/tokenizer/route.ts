import { NextResponse } from 'next/server';
// @ts-ignore
import Midtrans from 'midtrans-client';

export async function POST(request: Request) {
  try {
    const { id, productName, price, quantity, customerName, customerPhone } = await request.json();

    // Inisialisasi harus di dalam fungsi POST atau dipisahkan dengan benar
    const snap = new Midtrans.Snap({
      isProduction: false, // Ubah ke true jika sudah siap live
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: id || `TRV-${Date.now()}`,
        gross_amount: Number(price) * Number(quantity),
      },
      item_details: [
        {
          id: 'ITEM1',
          price: Number(price),
          quantity: Number(quantity),
          name: productName,
        },
      ],
      customer_details: {
        first_name: customerName,
        phone: customerPhone,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    
    return NextResponse.json({ token: transaction.token });
  } catch (error: any) {
    console.error("Midtrans Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
