/** GET /api/rates — override tarif dari tab Update Tarif admin (publik; dibaca form pemesanan). */
import { NextResponse } from 'next/server';
import { getRateOverrides } from '@/lib/rates-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const overrides = await getRateOverrides();
  return NextResponse.json({ overrides }, { headers: { 'Cache-Control': 'no-store' } });
}
