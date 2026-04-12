import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      custom_field1,
      custom_field2,
      custom_field3,
    } = body;

    // Verifikasi signature dari Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      console.error('Invalid signature from Midtrans webhook');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Cek apakah pembayaran berhasil
    const isSuccess =
      transaction_status === 'capture' ||
      transaction_status === 'settlement';
    const isFraud = fraud_status === 'deny';

    if (isSuccess && !isFraud) {
      console.log(`Payment SUCCESS for order: ${order_id}`);

      // Parse data dari custom fields
      const route = custom_field1 || '';
      const travelDate = custom_field2 || '';
      const addressInfo = custom_field3 || '';
      const [pickup, dropoff] = addressInfo.split(' | ');

      // Kirim tiket via email (call internal API)
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bengkulutravel.com';

      await fetch(`${baseUrl}/api/send-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order_id,
          route,
          date: travelDate,
          amount: gross_amount,
          paymentType: payment_type,
          pickup,
          dropoff,
          // Data penumpang dari order_id akan di-lookup di send-ticket
        }),
      });
    }

    return NextResponse.json({ status: 'OK' });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
