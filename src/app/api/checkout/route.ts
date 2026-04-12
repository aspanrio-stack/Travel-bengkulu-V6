import { NextResponse } from 'next/server';
// @ts-ignore
import Midtrans from 'midtrans-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, route, price, passengers } = body;

    const snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    const orderId = `TRV-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(price) * Number(passengers),
      },
      item_details: [{
        id: 'TICKET-001',
        price: Number(price),
        quantity: Number(passengers),
        name: `Travel ${route}`,
      }],
      customer_details: {
        first_name: name,
        phone: phone,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token, orderId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
