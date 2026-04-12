import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const midtransClient = require('midtrans-client');
const resend = new Resend(process.env.RESEND_API_KEY);

let snap = new midtransClient.Snap({
  isProduction: true, // Karena kamu pakai key 'Mid-', ini mode Production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, date, route, passengers } = body;

    const orderId = `TRV-${Date.now()}`;
    const pricePerPerson = 250000; // Sesuaikan tarif
    const totalAmount = pricePerPerson * parseInt(passengers);

    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      customer_details: {
        first_name: name,
        phone: phone,
      },
      item_details: [{
        id: 'R001',
        price: pricePerPerson,
        quantity: parseInt(passengers),
        name: `Travel ${route}`,
      }],
      enabled_payments: ["qris", "bank_transfer", "gopay"],
    };

    const transaction = await snap.createTransaction(parameter);
    
    return NextResponse.json({ 
      token: transaction.token,
      orderId: orderId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal membuat transaksi' }, { status: 500 });
  }
}
