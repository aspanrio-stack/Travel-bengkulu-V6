/**
 * lib/rental-config.ts
 * Konstanta rental yang aman untuk Client Component.
 * TIDAK mengandung Redis / ioredis.
 */

export type RentalVehicle = 'avanza' | 'innova' | 'hiace';
export type RentalType    = 'with_driver' | 'lepas_kunci';
export type RentalArea    = 'dalam_kota' | 'luar_kota';

export const RENTAL_PRICES = {
  with_driver: {
    dalam_kota: { avanza: 600_000, innova: 700_000, hiace: 1_500_000 },
    luar_kota:  { avanza: 700_000, innova: 800_000, hiace: 2_000_000 },
  },
  lepas_kunci: {
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
