/**
 * lib/orders.ts
 * Penyimpanan pesanan menggunakan Redis via ioredis.
 *
 * Struktur data di Redis:
 *   order:{id}        → JSON string data pesanan travel
 *   orders            → Sorted Set, member=id, score=timestamp
 *   rental:{id}       → JSON string data pesanan rental
 *   rentals           → Sorted Set, member=id, score=timestamp
 */

import Redis from 'ioredis';

// ─────────────────────────────────────────────
// TYPE: Pesanan Travel (tidak berubah)
// ─────────────────────────────────────────────
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
  paymentMethod: 'qris' | 'tunai';
  createdAt: string;
  confirmedAt?: string;
}

// ─────────────────────────────────────────────
// TYPE: Pesanan Rental
// ─────────────────────────────────────────────
export type RentalVehicle = 'avanza' | 'innova' | 'hiace';
export type RentalType = 'with_driver' | 'lepas_kunci';
export type RentalArea = 'dalam_kota' | 'luar_kota';

export interface RentalOrder {
  id: string;
  type: 'rental';               // pembeda dari travel Order
  name: string;
  phone: string;
  email?: string;

  vehicle: RentalVehicle;       // avanza | innova | hiace
  rentalType: RentalType;       // with_driver | lepas_kunci
  area: RentalArea;             // dalam_kota | luar_kota (hanya untuk with_driver)

  startDate: string;            // YYYY-MM-DD
  endDate: string;              // YYYY-MM-DD
  days: number;                 // dihitung otomatis
  pickupTime: string;           // HH:MM
  pickupAddress: string;
  notes?: string;

  pricePerDay: number;          // harga mobil/hari
  driverFeePerDay: number;      // jasa sopir/hari (0 jika lepas kunci)
  totalPrice: number;           // (pricePerDay + driverFeePerDay) × days

  status: 'pending' | 'success' | 'cancelled';
  paymentMethod: 'qris' | 'tunai';
  createdAt: string;
  confirmedAt?: string;
}

// ─────────────────────────────────────────────
// Tabel harga rental
// ─────────────────────────────────────────────
export const RENTAL_PRICES = {
  with_driver: {
    dalam_kota: { avanza: 600_000, innova: 700_000, hiace: 1_500_000 },
    luar_kota:  { avanza: 700_000, innova: 800_000, hiace: 2_000_000 },
  },
  lepas_kunci: {
    // area tidak berlaku untuk lepas kunci, pakai 'dalam_kota' sebagai default key
    dalam_kota: { avanza: 350_000, innova: 500_000, hiace: 0 },
    luar_kota:  { avanza: 350_000, innova: 500_000, hiace: 0 },
  },
  driver_fee: {
    dalam_kota: 250_000,
    luar_kota:  350_000,
  },
} as const;

export const VEHICLE_LABELS: Record<RentalVehicle, string> = {
  avanza: 'Toyota Avanza',
  innova: 'Toyota Innova',
  hiace:  'Toyota HiAce',
};

export const RENTAL_TYPE_LABELS: Record<RentalType, string> = {
  with_driver: 'Dengan Sopir',
  lepas_kunci: 'Lepas Kunci',
};

export const AREA_LABELS: Record<RentalArea, string> = {
  dalam_kota: 'Dalam Kota',
  luar_kota:  'Luar Kota',
};

// ─────────────────────────────────────────────
// Singleton Redis client
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
  redisClient.on('error', (err) => { console.error('Redis connection error:', err); });
  return redisClient;
}

// ─────────────────────────────────────────────
// TRAVEL ORDER FUNCTIONS (tidak berubah)
// ─────────────────────────────────────────────
export async function saveOrder(order: Order): Promise<void> {
  const redis = getRedis();
  const pipeline = redis.pipeline();
  pipeline.set(`order:${order.id}`, JSON.stringify(order));
  pipeline.zadd('orders', Date.now(), order.id);
  await pipeline.exec();
}

export async function getAllOrders(): Promise<Order[]> {
  const redis = getRedis();
  const ids = await redis.zrevrange('orders', 0, 99);
  if (ids.length === 0) return [];
  const keys = ids.map(id => `order:${id}`);
  const values = await redis.mget(...keys);
  return values.filter((v): v is string => v !== null).map(v => JSON.parse(v) as Order);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const redis = getRedis();
  const data = await redis.get(`order:${id}`);
  if (!data) return null;
  return JSON.parse(data) as Order;
}

export async function updateOrderStatus(
  id: string,
  status: 'success' | 'cancelled'
): Promise<Order | null> {
  const order = await getOrderById(id);
  if (!order) return null;
  const updated: Order = { ...order, status, confirmedAt: new Date().toISOString() };
  const redis = getRedis();
  await redis.set(`order:${id}`, JSON.stringify(updated));
  return updated;
}

// ─────────────────────────────────────────────
// RENTAL ORDER FUNCTIONS
// ─────────────────────────────────────────────
export async function saveRentalOrder(order: RentalOrder): Promise<void> {
  const redis = getRedis();
  const pipeline = redis.pipeline();
  pipeline.set(`rental:${order.id}`, JSON.stringify(order));
  pipeline.zadd('rentals', Date.now(), order.id);
  await pipeline.exec();
}

export async function getAllRentalOrders(): Promise<RentalOrder[]> {
  const redis = getRedis();
  const ids = await redis.zrevrange('rentals', 0, 99);
  if (ids.length === 0) return [];
  const keys = ids.map(id => `rental:${id}`);
  const values = await redis.mget(...keys);
  return values.filter((v): v is string => v !== null).map(v => JSON.parse(v) as RentalOrder);
}

export async function getRentalOrderById(id: string): Promise<RentalOrder | null> {
  const redis = getRedis();
  const data = await redis.get(`rental:${id}`);
  if (!data) return null;
  return JSON.parse(data) as RentalOrder;
}

export async function updateRentalOrderStatus(
  id: string,
  status: 'success' | 'cancelled'
): Promise<RentalOrder | null> {
  const order = await getRentalOrderById(id);
  if (!order) return null;
  const updated: RentalOrder = { ...order, status, confirmedAt: new Date().toISOString() };
  const redis = getRedis();
  await redis.set(`rental:${id}`, JSON.stringify(updated));
  return updated;
}

// ─────────────────────────────────────────────
// Format Rupiah (shared)
// ─────────────────────────────────────────────
export function formatRp(angka: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
}
