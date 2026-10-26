/**
 * lib/auto-confirm.ts
 *
 * Konfirmasi otomatis pesanan TUNAI: 2 jam setelah jadwal keberangkatan (WIB),
 * pesanan 'pending' dianggap sudah berangkat dan lunas → status 'success'.
 *
 * - Hanya pembayaran tunai. QRIS tetap harus diverifikasi admin.
 * - Hanya mengubah status (tanpa kirim tiket/WA/email — perjalanan sudah selesai).
 * - Pesanan tanpa jam keberangkatan dihitung 23:59 WIB pada tanggalnya (lihat getDepartureAt).
 */
import { getRedis, type Order } from '@/lib/orders';
import { getDepartureAt } from '@/lib/reviews';

export const AUTO_CONFIRM_AFTER_HOURS = 2;
const HOUR = 3_600_000;

function isDue(o: Order, now: number): boolean {
  if (o.status !== 'pending' || o.paymentMethod !== 'tunai') return false;
  const dep = getDepartureAt(o);
  return !!dep && now >= dep.getTime() + AUTO_CONFIRM_AFTER_HOURS * HOUR;
}

/**
 * Konfirmasi semua pesanan yang sudah waktunya, lalu kembalikan daftar yang sudah diperbarui
 * (urutan tetap). Data dibaca ulang dari Redis sebelum menulis agar tidak menimpa
 * konfirmasi manual admin yang terjadi bersamaan.
 */
export async function autoConfirmDueOrders(orders: Order[], now = Date.now()): Promise<Order[]> {
  const due = orders.filter(o => isDue(o, now));
  if (due.length === 0) return orders;

  const redis = getRedis();
  const updatedById = new Map<string, Order>();

  for (const o of due) {
    try {
      const raw = await redis.get(`order:${o.id}`);
      if (!raw) continue;
      const fresh = JSON.parse(raw) as Order;
      if (!isDue(fresh, now)) { updatedById.set(o.id, fresh); continue; }
      const updated: Order = {
        ...fresh,
        status: 'success',
        confirmedAt: new Date(now).toISOString(),
        autoConfirmed: true,
      };
      await redis.set(`order:${o.id}`, JSON.stringify(updated));
      updatedById.set(o.id, updated);
    } catch (e) {
      console.error('[AUTO-CONFIRM] gagal:', o.id, e);
    }
  }

  return orders.map(o => updatedById.get(o.id) ?? o);
}
