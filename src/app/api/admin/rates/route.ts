/**
 * app/api/admin/rates/route.ts
 *
 * GET  /api/admin/rates  — daftar tarif untuk tab "Update Tarif": default dari kode
 *                          (routes.ts + rental-config.ts) + nilai yang pernah disimpan admin
 * POST /api/admin/rates  — simpan tarif (hanya admin). Yang disimpan hanya item yang berbeda
 *                          dari default; selanjutnya dibaca form pemesanan, halaman pembayaran,
 *                          kalkulator beranda, dan halaman daftar ongkos lewat /api/rates.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/orders';
import { buildDefaultRates, mergeWithOverrides, type PriceItem } from '@/lib/rates';
import { getRateOverrides, RATES_REDIS_KEY } from '@/lib/rates-server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const overrides = await getRateOverrides();
  return NextResponse.json({ rates: mergeWithOverrides(overrides) });
}

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

    const defaults = new Map(buildDefaultRates().map((d) => [d.id, d.harga]));
    const diffs: { id: string; harga: number }[] = [];

    for (const r of rates) {
      if (!r?.id || !defaults.has(r.id)) {
        return NextResponse.json({ error: `Item tarif tidak dikenal: ${r?.id ?? '?'}` }, { status: 400 });
      }
      if (!Number.isFinite(r.harga) || r.harga <= 0 || r.harga > 100_000_000) {
        return NextResponse.json({ error: `Harga tidak valid pada: ${r.id}` }, { status: 400 });
      }
      const harga = Math.round(r.harga);
      if (harga !== defaults.get(r.id)) diffs.push({ id: r.id, harga });
    }

    const redis = getRedis();
    if (diffs.length) await redis.set(RATES_REDIS_KEY, JSON.stringify(diffs));
    else await redis.del(RATES_REDIS_KEY);

    return NextResponse.json({ ok: true, saved: rates.length, overridden: diffs.length });
  } catch (error) {
    console.error('Save rates error:', error);
    return NextResponse.json({ error: 'Gagal menyimpan tarif' }, { status: 500 });
  }
}
