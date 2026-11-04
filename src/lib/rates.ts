/**
 * lib/rates.ts
 *
 * Sumber tarif gabungan (rute travel + sewa mobil) untuk tab "Update Tarif"
 * di dashboard admin — setara dengan RatesTab pada dashboard RPM Travel.
 *
 * Nilai default diambil dari ROUTES (routes.ts) & RENTAL_PRICES (rental-config.ts).
 * Setelah admin menyimpan lewat dashboard, nilai terbaru disimpan di Redis
 * (key: "bengkulu:rates") lewat /api/admin/rates dan menjadi sumber tampilan
 * berikutnya di tab ini.
 *
 * Catatan: seperti pada RatesTab RPM Travel, tab ini saat ini hanya mengelola
 * nilai yang tersimpan di Redis untuk ditampilkan di dashboard — form
 * pemesanan publik (BookingForm/RentalForm) masih membaca harga statis dari
 * routes.ts & rental-config.ts. Jika ingin perubahan tarif di sini langsung
 * memengaruhi harga yang dilihat/dibayar pelanggan, form-form itu perlu
 * disambungkan ke /api/admin/rates juga (lihat catatan di summary).
 */

import { ROUTES } from './routes';
import {
  RENTAL_PRICES,
  VEHICLE_LABELS,
  RENTAL_TYPE_LABELS,
  AREA_LABELS,
  type RentalVehicle,
  type RentalType,
  type RentalArea,
} from './rental-config';

export interface PriceItem {
  id: string;
  label: string;
  harga: number;
  satuanLabel: string; // '/pax' | '/hari'
  kategori: 'travel' | 'sewa';
  keterangan?: string;
}

const VEHICLES: RentalVehicle[] = ['avanza', 'innova', 'hiace'];
const RENTAL_TYPES: RentalType[] = ['with_driver', 'lepas_kunci'];
const AREAS: RentalArea[] = ['dalam_kota', 'luar_kota'];

export function buildDefaultRates(): PriceItem[] {
  const travelItems: PriceItem[] = ROUTES.map((r) => ({
    id: `route:${r.id}`,
    label: `Travel ${r.from} – ${r.to}`,
    harga: r.price,
    satuanLabel: '/pax',
    kategori: 'travel',
    keterangan: r.via ? `via ${r.via} · ${r.duration}` : r.duration,
  }));

  const sewaItems: PriceItem[] = [];

  RENTAL_TYPES.forEach((type) => {
    AREAS.forEach((area) => {
      VEHICLES.forEach((vehicle) => {
        const harga = RENTAL_PRICES[type][area][vehicle];
        if (harga === 0) return; // kombinasi tidak ditawarkan (mis. HiAce lepas kunci)
        sewaItems.push({
          id: `rental:${type}:${area}:${vehicle}`,
          label: `${VEHICLE_LABELS[vehicle]} — ${RENTAL_TYPE_LABELS[type]} (${AREA_LABELS[area]})`,
          harga,
          satuanLabel: '/hari',
          kategori: 'sewa',
        });
      });
    });
  });

  AREAS.forEach((area) => {
    sewaItems.push({
      id: `rental:driver_fee:${area}`,
      label: `Jasa Sopir (${AREA_LABELS[area]})`,
      harga: RENTAL_PRICES.driver_fee[area],
      satuanLabel: '/hari',
      kategori: 'sewa',
      keterangan: 'Ditambahkan di luar harga mobil untuk paket Dengan Sopir',
    });
  });

  return [...travelItems, ...sewaItems];
}

// ─────────────────────────────────────────────
// Tarif yang disimpan admin = daftar override { id, harga }, hanya untuk item yang BERBEDA
// dari default di kode. Item yang tidak diubah selalu mengikuti routes.ts / rental-config.ts.
// (Data lama berformat daftar PriceItem lengkap juga tetap terbaca.)
// ─────────────────────────────────────────────
export type RateOverrides = Record<string, number>;

/** Ubah data tersimpan (array) → map id→harga; abaikan id tak dikenal / harga tidak valid. */
export function toOverrides(saved: unknown): RateOverrides {
  const known = new Set(buildDefaultRates().map((d) => d.id));
  const out: RateOverrides = {};
  if (!Array.isArray(saved)) return out;
  for (const it of saved) {
    if (it && typeof it.id === 'string' && known.has(it.id) && Number.isFinite(it.harga) && it.harga > 0) {
      out[it.id] = Math.round(it.harga);
    }
  }
  return out;
}

/** Daftar default + nilai tersimpan (untuk tab Update Tarif). */
export function mergeWithOverrides(overrides: RateOverrides): PriceItem[] {
  return buildDefaultRates().map((d) => ({ ...d, harga: overrides[d.id] ?? d.harga }));
}

type Wide<T> = T extends number ? number : { -readonly [K in keyof T]: Wide<T[K]> };

/** Tabel harga sewa mobil dengan override admin diterapkan (bentuk sama dengan RENTAL_PRICES). */
export function applyRentalOverrides(overrides: RateOverrides): Wide<typeof RENTAL_PRICES> {
  const out = JSON.parse(JSON.stringify(RENTAL_PRICES)) as Wide<typeof RENTAL_PRICES>;
  RENTAL_TYPES.forEach((type) =>
    AREAS.forEach((area) =>
      VEHICLES.forEach((vehicle) => {
        const v = overrides[`rental:${type}:${area}:${vehicle}`];
        if (v) (out[type][area] as Record<string, number>)[vehicle] = v;
      })
    )
  );
  AREAS.forEach((area) => {
    const v = overrides[`rental:driver_fee:${area}`];
    if (v) out.driver_fee[area] = v;
  });
  return out;
}
