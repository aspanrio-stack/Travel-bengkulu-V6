import Midtrans from 'midtrans-client';
import { NextResponse } from 'next/server';

let snap = new Midtrans.Snap({
  isProduction: false, // Ubah jadi true kalau sudah mau dipakai beneran
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

export async function POST(request: Request) {
  const { id, productName, price, quantity, customerName, customerPhone } = await request.json();

  let parameter = {
    item_details: {
      name: productName,
      price: price,
      quantity: quantity
    },
    transaction_details: {
      order_id: id,
      gross_amount: price * quantity
    },
    customer_details: {
      first_name: customerName,
      phone: customerPhone
    }
  };

  const token = await snap.createTransactionToken(parameter);
  return NextResponse.json({ token });
}
