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
