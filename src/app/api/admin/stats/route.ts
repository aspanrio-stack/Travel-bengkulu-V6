/**
 * GET    /api/admin/stats?days=7|30|90 — data grafik (pesanan per hari, rute terbanyak, klik WA). Hanya admin.
 * DELETE /api/admin/stats              — reset hitungan klik WA (setelah uji coba). Hanya admin.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getRedis, getOrdersForStats } from '@/lib/orders';

export const dynamic = 'force-dynamic';

const wibDate = (ms: number) => new Date(ms + 7 * 3600_000).toISOString().slice(0, 10);
const toNum = (h: Record<string, string>) =>
  Object.fromEntries(Object.entries(h).map(([k, v]) => [k, Number(v) || 0])) as Record<string, number>;

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const q = Number(req.nextUrl.searchParams.get('days'));
    const days = [7, 30, 90].includes(q) ? q : 30;

    const labels: string[] = [];
    for (let i = days - 1; i >= 0; i--) labels.push(wibDate(Date.now() - i * 86400_000));

    const r = getRedis();
    const pipe = r.pipeline();
    labels.forEach(d => pipe.get(`wa:${d}`));
    const [orders, waDaily, total, pages, src, since] = await Promise.all([
      getOrdersForStats(),
      pipe.exec(),
      r.get('wa:total'),
      r.hgetall('wa:pages'),
      r.hgetall('wa:src'),
      r.get('wa:since'),
    ]);

    const active = orders.filter(o => o.status !== 'cancelled');
    const ordersPerDay: Record<string, number> = {};
    const routeCount: Record<string, { count: number; pax: number }> = {};
    for (const o of active) {
      const d = wibDate(new Date(o.createdAt).getTime());
      if (!labels.includes(d)) continue;
      ordersPerDay[d] = (ordersPerDay[d] ?? 0) + 1;
      const rt = (routeCount[o.route] ??= { count: 0, pax: 0 });
      rt.count += 1;
      rt.pax += o.passengers;
    }

    const series = labels.map((date, i) => ({
      date,
      orders: ordersPerDay[date] ?? 0,
      wa: Number(waDaily?.[i]?.[1]) || 0,
    }));

    const routes = Object.entries(routeCount)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    const pageList = Object.entries(toNum(pages))
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return NextResponse.json({
      days,
      series,
      routes,
      pages: pageList,
      sources: toNum(src),
      totals: {
        waTotal: Number(total) || 0,
        waToday: series[series.length - 1]?.wa ?? 0,
        waPeriod: series.reduce((s, d) => s + d.wa, 0),
        ordersPeriod: series.reduce((s, d) => s + d.orders, 0),
        ordersAll: active.length,
      },
      waSince: since ?? null,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Gagal memuat statistik' }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const r = getRedis();
    const keys = await r.keys('wa:*');
    if (keys.length) await r.del(...keys);
    return NextResponse.json({ success: true, removed: keys.length });
  } catch (error) {
    console.error('Reset WA stats error:', error);
    return NextResponse.json({ error: 'Gagal reset hitungan WA' }, { status: 500 });
  }
}
