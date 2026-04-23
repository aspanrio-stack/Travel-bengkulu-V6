/**
 * API: POST /api/track
 * Catat klik WhatsApp ke Redis — ringan, tanpa response data.
 * Hanya increment counter, tidak ada konfirmasi ke user.
 *
 * Data tersimpan di Redis:
 *   wa:total          → total semua klik
 *   wa:YYYY-MM-DD     → klik per hari
 *   wa:YYYY-MM        → klik per bulan
 */
import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis';

let redis: Redis | null = null;

function getRedis(): Redis {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) throw new Error('REDIS_URL tidak ada');
  redis = new Redis(url, { maxRetriesPerRequest: 1, connectTimeout: 3000 });
  return redis;
}

export async function POST(req: NextRequest) {
  try {
    const { source } = await req.json();
    const r = getRedis();
    const now = new Date();
    const hari = now.toISOString().slice(0, 10);   // 2026-04-23
    const bulan = now.toISOString().slice(0, 7);   // 2026-04

    // Increment semua counter sekaligus (pipeline = 1 round-trip)
    const p = r.pipeline();
    p.incr('wa:total');
    p.incr(`wa:${hari}`);
    p.incr(`wa:${bulan}`);
    // Set expiry 90 hari untuk data harian
    p.expire(`wa:${hari}`, 60 * 60 * 24 * 90);
    // Set expiry 1 tahun untuk data bulanan
    p.expire(`wa:${bulan}`, 60 * 60 * 24 * 365);
    await p.exec();

    // Respons kosong 204 — tidak ada data yang dikembalikan ke user
    return new NextResponse(null, { status: 204 });

  } catch {
    // Diam-diam abaikan error — jangan ganggu user
    return new NextResponse(null, { status: 204 });
  }
}

// GET — Ambil statistik klik (untuk admin dashboard)
export async function GET() {
  try {
    const r = getRedis();
    const now = new Date();
    const hari = now.toISOString().slice(0, 10);
    const bulan = now.toISOString().slice(0, 7);

    const [total, hariIni, bulanIni] = await Promise.all([
      r.get('wa:total'),
      r.get(`wa:${hari}`),
      r.get(`wa:${bulan}`),
    ]);

    return NextResponse.json({
      total: parseInt(total || '0'),
      hariIni: parseInt(hariIni || '0'),
      bulanIni: parseInt(bulanIni || '0'),
    });

  } catch {
    return NextResponse.json({ total: 0, hariIni: 0, bulanIni: 0 });
  }
}
