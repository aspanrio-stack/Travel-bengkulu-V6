/**
 * app/api/admin/rates/route.ts
 *
 * GET  /api/admin/rates  — baca tarif dari Redis, fallback ke default
 *                          (routes.ts + rental-config.ts) jika belum pernah disimpan
 * POST /api/admin/rates  — simpan tarif baru ke Redis (dipakai tab "Update Tarif")
 *
 * Pola sama seperti /api/rates pada dashboard RPM Travel, disesuaikan dengan
 * getRedis() milik lib/orders.ts yang sudah dipakai proyek ini.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/orders';
import { buildDefaultRates, type PriceItem } from '@/lib/rates';
import { getSession } from '@/lib/auth';

const REDIS_KEY = 'bengkulu:rates';

// ─────────────────────────────────────────────
// GET — ambil semua tarif
// ─────────────────────────────────────────────
export async function GET() {
  try {
    const redis = getRedis();
    const raw = await redis.get(REDIS_KEY);

    if (!raw) {
      // Belum pernah disimpan → kembalikan default dari routes.ts + rental-config.ts
      return NextResponse.json({ rates: buildDefaultRates() });
    }

    return NextResponse.json({ rates: JSON.parse(raw) as PriceItem[] });
  } catch (error) {
    console.error('Get rates error:', error);
    // Fallback ke default jika Redis error, dashboard tetap bisa dipakai
    return NextResponse.json({ rates: buildDefaultRates() });
  }
}

// ─────────────────────────────────────────────
// POST — simpan tarif baru
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { rates } = body as { rates: PriceItem[] };

    if (!Array.isArray(rates)) {
      return NextResponse.json({ error: 'Format data tidak valid' }, { status: 400 });
    }

    for (const r of rates) {
      if (!r.id || typeof r.harga !== 'number' || r.harga < 0) {
        return NextResponse.json(
          { error: `Data tidak valid pada: ${r.id ?? '?'}` },
          { status: 400 }
        );
      }
    }

    const redis = getRedis();
    await redis.set(REDIS_KEY, JSON.stringify(rates));

    return NextResponse.json({ ok: true, saved: rates.length });
  } catch (error) {
    console.error('Save rates error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan tarif' }, { status: 500 });
  }
}
