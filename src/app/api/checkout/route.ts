import { NextResponse } from 'next/server';
const midtransClient = require('midtrans-client');

let snap = new midtransClient.Snap({
  isProduction: false, // Ubah ke true kalau sudah mau rilis resmi
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

export async function POST(request: Request) {
  const { id, name, price, customerDetails } = await request.json();

  let parameter = {
    transaction_details: {
      order_id: `TRV-${Date.now()}`,
      gross_amount: price,
    },
    customer_details: {
      first_name: customerDetails.name,
      phone: customerDetails.phone,
    },
    enabled_payments: ["qris", "bank_transfer"],
  };

  const token = await snap.createTransactionToken(parameter);
  return NextResponse.json({ token });
}
