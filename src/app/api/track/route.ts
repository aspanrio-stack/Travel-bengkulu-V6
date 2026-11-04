/**
 * API: POST /api/track  { path, source }
 * Catat klik WhatsApp ke Redis — ringan, tanpa response data. Dipanggil oleh WaClickTracker
 * (satu listener global untuk semua tautan wa.me di luar halaman pemesanan & admin).
 *
 * Data di Redis:
 *   wa:total          → total semua klik
 *   wa:YYYY-MM-DD     → klik per hari (WIB), kedaluwarsa 90 hari
 *   wa:YYYY-MM        → klik per bulan (WIB)
 *   wa:pages          → hash: path halaman → jumlah klik
 *   wa:src            → hash: sumber tombol (bottomnav | cta | footer) → jumlah klik
 *   wa:since          → waktu mulai penghitungan
 */
import { NextRequest, NextResponse } from 'next/server';
import { getRedis } from '@/lib/orders';

const ok = () => new NextResponse(null, { status: 204 });
const SOURCES = ['bottomnav', 'cta', 'footer'];
// Halaman yang TIDAK dihitung: pemesanan/pembayaran, admin, dan credits (bukan chat layanan travel)
const EXCLUDED = ['/pesan', '/pembayaran', '/admin', '/credits'];

function wibNow(ms = Date.now()) {
  const d = new Date(ms + 7 * 3600_000).toISOString();
  return { hari: d.slice(0, 10), bulan: d.slice(0, 7) };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    let path = typeof body?.path === 'string' ? body.path.split('?')[0].split('#')[0] : '';
    if (!/^\/[a-z0-9\-_/]{0,118}$/i.test(path)) return ok();
    path = path.replace(/\/+$/, '') || '/';
    if (EXCLUDED.some(p => path === p || path.startsWith(p + '/'))) return ok();
    const source = SOURCES.includes(body?.source) ? body.source : 'cta';

    const r = getRedis();

    // Batas wajar per IP (anti-spam): maks 30 klik / menit
    const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
    const rl = `wa:rl:${ip}`;
    const n = await r.incr(rl);
    if (n === 1) await r.expire(rl, 60);
    if (n > 30) return ok();

    const { hari, bulan } = wibNow();
    const p = r.pipeline();
    p.incr('wa:total');
    p.incr(`wa:${hari}`);
    p.incr(`wa:${bulan}`);
    p.expire(`wa:${hari}`, 60 * 60 * 24 * 90);
    p.expire(`wa:${bulan}`, 60 * 60 * 24 * 365);
    p.hincrby('wa:pages', path, 1);
    p.hincrby('wa:src', source, 1);
    p.set('wa:since', new Date().toISOString(), 'NX');
    await p.exec();
  } catch {
    // Diam-diam abaikan error — jangan ganggu pengunjung
  }
  return ok();
}

// GET — Total klik (dipakai kartu "Klik WA" di dashboard admin)
export async function GET() {
  try {
    const r = getRedis();
    const { hari, bulan } = wibNow();
    const [total, hariIni, bulanIni] = await Promise.all([
      r.get('wa:total'), r.get(`wa:${hari}`), r.get(`wa:${bulan}`),
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
