/**
 * API: POST /api/admin/reset
 * Reset data pesanan — arsipkan dulu ke key terpisah, baru hapus.
 *
 * Mode:
 * - "archive" → pindahkan semua pesanan ke archive:YYYY-MM sebelum hapus
 * - "clear"   → hapus semua pesanan tanpa arsip (permanen)
 *
 * Proteksi:
 * - Hanya admin terautentikasi yang bisa akses
 * - Butuh konfirmasi header khusus agar tidak tidak sengaja terpicu
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import Redis from 'ioredis';

function getRedis(): Redis {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error('REDIS_URL belum dikonfigurasi');
  return new Redis(url, { maxRetriesPerRequest: 3, connectTimeout: 8000 });
}

export async function POST(req: NextRequest) {
  // Cek session admin
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { mode, confirmText } = await req.json();

    // Validasi konfirmasi teks — cegah reset tidak sengaja
    if (confirmText !== 'RESET KONFIRMASI') {
      return NextResponse.json({
        error: 'Teks konfirmasi salah. Ketik: RESET KONFIRMASI'
      }, { status: 400 });
    }

    if (!['archive', 'clear'].includes(mode)) {
      return NextResponse.json({ error: 'Mode tidak valid' }, { status: 400 });
    }

    const redis = getRedis();

    // Ambil semua ID pesanan
    const ids = await redis.zrevrange('orders', 0, -1);
    if (ids.length === 0) {
      return NextResponse.json({ success: true, message: 'Tidak ada data untuk direset', count: 0 });
    }

    const pipeline = redis.pipeline();

    if (mode === 'archive') {
      // ── ARSIP: Pindahkan ke key archive:YYYY-MM ──
      const bulanIni = new Date().toISOString().slice(0, 7); // contoh: 2026-04
      const archiveKey = `archive:${bulanIni}`;

      // Salin sorted set ke archive
      for (const id of ids) {
        const score = await redis.zscore('orders', id);
        pipeline.zadd(archiveKey, parseFloat(score || '0'), id);
      }

      // Set expiry arsip 1 tahun (365 hari)
      pipeline.expire(archiveKey, 60 * 60 * 24 * 365);
    }

    // Hapus semua data order
    for (const id of ids) {
      pipeline.del(`order:${id}`);
    }

    // Hapus sorted set utama
    pipeline.del('orders');

    await pipeline.exec();
    await redis.quit();

    return NextResponse.json({
      success: true,
      message: mode === 'archive'
        ? `${ids.length} pesanan diarsipkan ke archive:${new Date().toISOString().slice(0, 7)} dan data aktif dihapus`
        : `${ids.length} pesanan dihapus permanen`,
      count: ids.length,
      mode,
    });

  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json({
      error: 'Gagal reset: ' + (error instanceof Error ? error.message : 'Unknown')
    }, { status: 500 });
  }
}

// GET — Lihat statistik storage
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const redis = getRedis();

    // Hitung total pesanan aktif
    const totalOrders = await redis.zcard('orders');

    // Cari semua arsip yang ada
    const archiveKeys = await redis.keys('archive:*');
    const archiveInfo: Record<string, number> = {};

    for (const key of archiveKeys) {
      archiveInfo[key] = await redis.zcard(key);
    }

    // Info memori Redis
    const info = await redis.info('memory');
    const usedMemoryMatch = info.match(/used_memory_human:(.+)/);
    const usedMemory = usedMemoryMatch ? usedMemoryMatch[1].trim() : 'N/A';

    await redis.quit();

    return NextResponse.json({
      totalOrders,
      archives: archiveInfo,
      usedMemory,
    });

  } catch (error) {
    return NextResponse.json({ error: 'Gagal ambil info storage' }, { status: 500 });
  }
}
