/**
 * lib/orders.ts
 * Penyimpanan pesanan menggunakan Vercel KV (Redis) via REST API.
 * Ringan, tanpa dependency tambahan, cocok untuk Vercel Free Tier.
 *
 * Setup: tambahkan Vercel KV di dashboard Vercel (gratis hingga 256MB)
 * lalu set environment variables:
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 */

export interface Order {
  id: string;
  name: string;
  phone: string;
  email?: string;
  route: string;
  routeId: string;
  date: string;
  passengers: number;
  pickup: string;
  dropoff?: string;
  harga: number;
  kodeUnik: number;
  total: number;
  status: 'pending' | 'success' | 'cancelled';
  createdAt: string;
  confirmedAt?: string;
}

// ─────────────────────────────────────────────
// Helper: fetch ke Vercel KV REST API
// ─────────────────────────────────────────────
async function kvFetch(path: string, options?: RequestInit) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error('Vercel KV belum dikonfigurasi. Set KV_REST_API_URL dan KV_REST_API_TOKEN.');
  }

  const res = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    // Batasi timeout agar tidak melebihi Vercel Free Tier (10 detik)
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`KV Error ${res.status}: ${text}`);
  }

  return res.json();
}

// ─────────────────────────────────────────────
// Simpan pesanan baru
// ─────────────────────────────────────────────
export async function saveOrder(order: Order): Promise<void> {
  // Simpan data order sebagai JSON dengan key: order:{id}
  await kvFetch(`/set/order:${order.id}`, {
    method: 'POST',
    body: JSON.stringify(JSON.stringify(order)),
  });

  // Tambahkan id ke list semua pesanan (sorted set by timestamp)
  await kvFetch(`/zadd/orders`, {
    method: 'POST',
    body: JSON.stringify({
      score: Date.now(),
      member: order.id,
    }),
  });
}

// ─────────────────────────────────────────────
// Ambil semua pesanan (terbaru di atas, maks 100)
// ─────────────────────────────────────────────
export async function getAllOrders(): Promise<Order[]> {
  // Ambil 100 ID terbaru (descending)
  const listRes = await kvFetch('/zrange/orders/+inf/-inf?byScore=true&rev=true&limit=0,100');
  const ids: string[] = listRes.result || [];

  if (ids.length === 0) return [];

  // Ambil semua data order secara paralel (mget)
  const keys = ids.map(id => `order:${id}`);
  const mgetRes = await kvFetch('/mget/' + keys.join('/'));
  const values: (string | null)[] = mgetRes.result || [];

  // Parse JSON, filter yang null
  return values
    .filter((v): v is string => v !== null)
    .map(v => JSON.parse(v) as Order);
}

// ─────────────────────────────────────────────
// Ambil 1 pesanan berdasarkan ID
// ─────────────────────────────────────────────
export async function getOrderById(id: string): Promise<Order | null> {
  const res = await kvFetch(`/get/order:${id}`);
  if (!res.result) return null;
  return JSON.parse(res.result) as Order;
}

// ─────────────────────────────────────────────
// Update status pesanan
// ─────────────────────────────────────────────
export async function updateOrderStatus(
  id: string,
  status: 'success' | 'cancelled'
): Promise<Order | null> {
  const order = await getOrderById(id);
  if (!order) return null;

  const updated: Order = {
    ...order,
    status,
    confirmedAt: new Date().toISOString(),
  };

  await kvFetch(`/set/order:${id}`, {
    method: 'POST',
    body: JSON.stringify(JSON.stringify(updated)),
  });

  return updated;
}

// ─────────────────────────────────────────────
// Format harga Rupiah
// ─────────────────────────────────────────────
export function formatRp(angka: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
}
