export interface Route {
  id: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  via?: string;
  /**
   * Jam keberangkatan tetap. Kosong = fleksibel / dinamis (bandara).
   * Format: 'HH:MM'
   */
  departureTimes?: string[];
  /**
   * Pesan khusus untuk rute ini (ditampilkan di bawah dropdown jam)
   */
  departureNote?: string;
}

export const ROUTES: Route[] = [
  {
    id: 'bkl-plm',
    from: 'Bengkulu',
    to: 'Palembang',
    price: 250000,
    duration: '8–10 jam',
    departureTimes: ['10:00', '16:00'],
  },
  {
    id: 'plm-bkl',
    from: 'Palembang',
    to: 'Bengkulu',
    price: 250000,
    duration: '8–10 jam',
    departureTimes: ['10:00', '19:00'],
  },
  {
    id: 'bkl-jmb',
    from: 'Bengkulu',
    to: 'Jambi',
    price: 250000,
    duration: '9–12 jam',
    departureTimes: ['16:00'],
  },
  {
    id: 'jmb-bkl',
    from: 'Jambi',
    to: 'Bengkulu',
    price: 250000,
    duration: '9–12 jam',
    departureTimes: [],
    departureNote: 'Hubungi kami untuk konfirmasi jadwal keberangkatan dari Jambi.',
  },
  {
    id: 'bkl-crp',
    from: 'Bengkulu',
    to: 'Curup',
    price: 80000,
    duration: '2–2,5 jam',
    departureTimes: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
    departureNote: 'Keberangkatan setiap jam, pukul 06.00–19.00.',
  },
  {
    id: 'crp-bkl',
    from: 'Curup',
    to: 'Bengkulu',
    price: 80000,
    duration: '2–2,5 jam',
    departureTimes: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
    departureNote: 'Keberangkatan setiap jam, pukul 06.00–19.00.',
  },
  {
    id: 'crp-bnd',
    from: 'Curup',
    to: 'Bandara Bengkulu',
    price: 125000,
    duration: '2–2,5 jam',
    departureTimes: [],
    departureNote: 'Jadwal menyesuaikan jam penerbangan Anda (3 jam sebelum keberangkatan pesawat). Masukkan jam penerbangan di kolom catatan.',
  },
  {
    id: 'bnd-crp',
    from: 'Bandara Bengkulu',
    to: 'Curup',
    price: 125000,
    duration: '2–2,5 jam',
    departureTimes: [],
    departureNote: 'Jadwal menyesuaikan jam kedatangan pesawat Anda. Masukkan jam kedatangan di kolom catatan.',
  },
  {
    id: 'bkl-lbg',
    from: 'Bengkulu',
    to: 'Lebong',
    price: 100000,
    duration: '3–4 jam',
    via: 'Bengkulu Utara',
    departureTimes: [],
    departureNote: 'Hubungi kami untuk konfirmasi jadwal keberangkatan.',
  },
  {
    id: 'lbg-bkl',
    from: 'Lebong',
    to: 'Bengkulu',
    price: 100000,
    duration: '3–4 jam',
    via: 'Bengkulu Utara',
    departureTimes: [],
    departureNote: 'Hubungi kami untuk konfirmasi jadwal keberangkatan.',
  },
  {
    id: 'bkl-lmp',
    from: 'Bengkulu',
    to: 'Lampung',
    price: 300000,
    duration: '11–13 jam',
    via: 'Liwa',
    departureTimes: [],
    departureNote: 'Hubungi kami untuk konfirmasi jadwal keberangkatan ke Lampung.',
  },
  {
    id: 'lmp-bkl',
    from: 'Lampung',
    to: 'Bengkulu',
    price: 300000,
    duration: '11–13 jam',
    via: 'Liwa',
    departureTimes: [],
    departureNote: 'Hubungi kami untuk konfirmasi jadwal keberangkatan dari Lampung.',
  },
];

export function getRouteById(id: string): Route | undefined {
  return ROUTES.find(r => r.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

/** Format jam "10:00" → "10.00 WIB" */
export function formatDepartureTime(time: string): string {
  return time.replace(':', '.') + ' WIB';
}
