import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, orderId, name, route, date } = await request.json();

  try {
    const data = await resend.emails.send({
      from: 'Travel Bengkulu <noreply@travelbengkulu.com>',
      to: [email],
      subject: `E-Ticket Travel Bengkulu - ${orderId}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #0d9488;">E-TICKET BERHASIL</h2>
          <p>Halo <strong>${name}</strong>, pembayaran Anda telah kami terima.</p>
          <hr/>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Rute:</strong> ${route}</p>
          <p><strong>Tanggal Keberangkatan:</strong> ${date}</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">Jika ada kendala, hubungi CS kami di <strong>cs@travelbengkulu.com</strong></p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
