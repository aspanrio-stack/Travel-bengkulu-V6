/**
 * lib/orders.ts
 * Penyimpanan pesanan menggunakan Redis via ioredis.
 * Menggunakan REDIS_URL dari Vercel Redis.
 *
 * Struktur data di Redis:
 *   order:{id}     → JSON string data pesanan
 *   orders         → Sorted Set, member=id, score=timestamp
 */

import Redis from 'ioredis';

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
// Singleton Redis client
// Reuse koneksi agar tidak boros di Vercel Free
// ─────────────────────────────────────────────
let redisClient: Redis | null = null;

function getRedis(): Redis {
  if (redisClient) return redisClient;

  const url = process.env.REDIS_URL;
  if (!url) throw new Error('REDIS_URL belum dikonfigurasi di environment variables.');

  redisClient = new Redis(url, {
    maxRetriesPerRequest: 3,
    connectTimeout: 8000,
    lazyConnect: true,
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  return redisClient;
}

// ─────────────────────────────────────────────
// Simpan pesanan baru
// ─────────────────────────────────────────────
export async function saveOrder(order: Order): Promise<void> {
  const redis = getRedis();
  const pipeline = redis.pipeline();

  // Simpan data order sebagai JSON string
  pipeline.set(`order:${order.id}`, JSON.stringify(order));

  // Tambah ke sorted set dengan score = timestamp
  pipeline.zadd('orders', Date.now(), order.id);

  await pipeline.exec();
}

// ─────────────────────────────────────────────
// Ambil semua pesanan (terbaru dulu, maks 100)
// ─────────────────────────────────────────────
export async function getAllOrders(): Promise<Order[]> {
  const redis = getRedis();

  // Ambil semua ID dari sorted set (descending = terbaru dulu)
  const ids = await redis.zrevrange('orders', 0, 99);
  if (ids.length === 0) return [];

  // Ambil semua data sekaligus dengan mget
  const keys = ids.map(id => `order:${id}`);
  const values = await redis.mget(...keys);

  return values
    .filter((v): v is string => v !== null)
    .map(v => JSON.parse(v) as Order);
}

// ─────────────────────────────────────────────
// Ambil 1 pesanan berdasarkan ID
// ─────────────────────────────────────────────
export async function getOrderById(id: string): Promise<Order | null> {
  const redis = getRedis();
  const data = await redis.get(`order:${id}`);
  if (!data) return null;
  return JSON.parse(data) as Order;
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

  const redis = getRedis();
  await redis.set(`order:${id}`, JSON.stringify(updated));

  return updated;
}

// ─────────────────────────────────────────────
// Format Rupiah
// ─────────────────────────────────────────────
export function formatRp(angka: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
}
