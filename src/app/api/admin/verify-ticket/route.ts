/**
 * POST /api/admin/verify-ticket   body: { token: string }
 * Petugas (admin login) menandai tiket SUDAH DIGUNAKAN saat penumpang naik.
 * Hanya admin yang bisa — scan QR oleh publik/pelanggan TIDAK mengubah status tiket.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { isValidTokenFormat, markTicketUsed } from '@/lib/tickets';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let token: unknown;
  try { ({ token } = await req.json()); } catch { /* body kosong */ }
  if (!isValidTokenFormat(token)) {
    return NextResponse.json({ error: 'Token tidak valid' }, { status: 400 });
  }

  const r = await markTicketUsed(token, session.username);
  switch (r.result) {
    case 'marked':
      return NextResponse.json({ success: true, status: 'used', verifiedAt: r.ticket.verified_at });
    case 'already-used':
      return NextResponse.json(
        { success: false, status: 'already-used', verifiedAt: r.ticket?.verified_at ?? null },
        { status: 409 }
      );
    case 'not-found':
      return NextResponse.json({ error: 'Tiket tidak ditemukan atau sudah kedaluwarsa' }, { status: 404 });
    default:
      return NextResponse.json({ error: 'Gagal memproses validasi, coba lagi' }, { status: 500 });
  }
}
