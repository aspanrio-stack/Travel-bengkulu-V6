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
  /**
   * Info per jam keberangkatan: jenis armada + pemberitahuan khusus
   * yang muncul di form pemesanan saat jam tersebut dipilih.
   */
  timeInfo?: Record<string, { car: string; notice?: string; price?: number }>;
  /**
   * Hari keberangkatan tetap (0 = Minggu … 6 = Sabtu). Kosong = setiap hari / fleksibel.
   */
  departureDays?: number[];
  /** Label hari untuk ditampilkan, mis. 'Rabu dan Jumat' */
  departureDaysLabel?: string;
  /** Sembunyikan dari pilihan rute cepat di beranda (rute turunan koridor Padang) */
  hideOnHome?: boolean;
}

/** Selisih tarif untuk kendaraan selain Hiace (rute koridor Padang) */
export const KURANG_NON_HIACE = 50000;

const noticeRandom = (jam: string) =>
  `Perhatian: keberangkatan pukul ${jam.replace(':', '.')} menggunakan mobil random (bukan Hiace), tarif Rp 50.000 lebih murah. Pilih jam Hiace jika Anda ingin naik Hiace.`;

/** Tujuan di koridor Padang — tarif Hiace per orang dari Bengkulu (Curup mengikuti tarif yang sama) */
export const TUJUAN_KORIDOR_PADANG: { slug: string; nama: string; hiace: number }[] = [
  { slug: 'bkt', nama: 'Bukit Tinggi', hiace: 350000 },
  { slug: 'bgk', nama: 'Bangko', hiace: 300000 },
  { slug: 'srl', nama: 'Sarolangun', hiace: 300000 },
  { slug: 'bgo', nama: 'Muara Bungo', hiace: 300000 },
  { slug: 'slk', nama: 'Solok', hiace: 350000 },
  { slug: 'skt', nama: 'Singkut', hiace: 300000 },
];

function koridorPadangRoutes(): Route[] {
  const asal = [
    { prefix: 'bkl', nama: 'Bengkulu', jamHiace: '12:15', jamRandom: '11:00', via: 'Curup, Lubuklinggau' },
    { prefix: 'crp', nama: 'Curup', jamHiace: '14:15', jamRandom: '13:00', via: 'Lubuklinggau' },
  ];
  return asal.flatMap(a =>
    TUJUAN_KORIDOR_PADANG.map((t): Route => ({
      id: `${a.prefix}-${t.slug}`,
      from: a.nama,
      to: t.nama,
      price: t.hiace,
      duration: 'Estimasi dikonfirmasi admin',
      via: a.via,
      hideOnHome: true,
      departureTimes: [a.jamHiace, a.jamRandom],
      departureNote: `Hiace berangkat pukul ${a.jamHiace.replace(':', '.')} (Rp ${(t.hiace / 1000).toFixed(0)}.000). Mobil random pukul ${a.jamRandom.replace(':', '.')} (Rp ${((t.hiace - KURANG_NON_HIACE) / 1000).toFixed(0)}.000, bukan Hiace).`,
      timeInfo: {
        [a.jamHiace]: { car: 'Hiace' },
        [a.jamRandom]: { car: 'Mobil Random', price: t.hiace - KURANG_NON_HIACE, notice: noticeRandom(a.jamRandom) },
      },
    })),
  );
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
    price: 100000,
    duration: '2–2,5 jam',
    departureTimes: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
    departureNote: 'Keberangkatan setiap jam, pukul 06.00–19.00.',
  },
  {
    id: 'crp-bkl',
    from: 'Curup',
    to: 'Bengkulu',
    price: 100000,
    duration: '2–2,5 jam',
    departureTimes: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
    departureNote: 'Keberangkatan setiap jam, pukul 06.00–19.00.',
  },
  {
    id: 'crp-bnd',
    from: 'Curup',
    to: 'Bandara Bengkulu',
    price: 150000,
    duration: '2–2,5 jam',
    departureTimes: [],
    departureNote: 'Jadwal menyesuaikan jam penerbangan Anda (3 jam sebelum keberangkatan pesawat). Masukkan jam penerbangan di kolom catatan.',
  },
  {
    id: 'bnd-crp',
    from: 'Bandara Bengkulu',
    to: 'Curup',
    price: 150000,
    duration: '2–2,5 jam',
    departureTimes: [],
    departureNote: 'Jadwal menyesuaikan jam kedatangan pesawat Anda. Masukkan jam kedatangan di kolom catatan.',
  },
  {
    id: 'plm-crp',
    from: 'Palembang',
    to: 'Curup',
    price: 250000,
    duration: '7–9 jam',
    departureTimes: [],
    departureNote: 'Hubungi kami untuk konfirmasi jadwal keberangkatan dari Palembang.',
  },
  {
    id: 'crp-plm',
    from: 'Curup',
    to: 'Palembang',
    price: 250000,
    duration: '7–9 jam',
    departureTimes: [],
    departureNote: 'Hubungi kami untuk konfirmasi jadwal keberangkatan dari Curup.',
  },
  {
    id: 'jmb-crp',
    from: 'Jambi',
    to: 'Curup',
    price: 250000,
    duration: '9–11 jam',
    departureTimes: [],
    departureNote: 'Hubungi kami untuk konfirmasi jadwal keberangkatan dari Jambi.',
  },
  {
    id: 'crp-jmb',
    from: 'Curup',
    to: 'Jambi',
    price: 250000,
    duration: '9–11 jam',
    departureTimes: [],
    departureNote: 'Hubungi kami untuk konfirmasi jadwal keberangkatan dari Curup.',
  },
  {
    id: 'crp-bdg',
    from: 'Curup',
    to: 'Bandung',
    price: 800000,
    duration: '30–36 jam',
    via: 'Tol Palembang, Bakauheni–Merak',
    departureTimes: ['13:00'],
    departureDays: [3, 5],
    departureDaysLabel: 'Rabu dan Jumat',
    departureNote: 'Berangkat setiap Rabu dan Jumat pukul 13.00 dari Curup. Hubungi kami untuk konfirmasi sisa kursi.',
  },
  {
    id: 'crp-lmp',
    from: 'Curup',
    to: 'Lampung',
    price: 350000,
    duration: 'Estimasi dikonfirmasi admin',
    via: 'Tol Palembang',
    hideOnHome: true,
    departureTimes: ['13:00'],
    departureDays: [3, 5],
    departureDaysLabel: 'Rabu dan Jumat',
    departureNote: 'Berangkat setiap Rabu dan Jumat pukul 13.00 dari Curup (mobil yang sama dengan tujuan Bandung). Titik turun di Lampung disepakati dengan admin.',
  },
  {
    id: 'crp-jkt',
    from: 'Curup',
    to: 'Jakarta',
    price: 700000,
    duration: 'Estimasi dikonfirmasi admin',
    via: 'Tol Palembang, Bakauheni–Merak',
    hideOnHome: true,
    departureTimes: ['13:00'],
    departureDays: [3, 5],
    departureDaysLabel: 'Rabu dan Jumat',
    departureNote: 'Berangkat setiap Rabu dan Jumat pukul 13.00 dari Curup (mobil yang sama dengan tujuan Bandung). Titik turun di Jakarta disepakati dengan admin.',
  },
  {
    id: 'bkl-bdg',
    from: 'Bengkulu',
    to: 'Bandung',
    price: 800000,
    duration: '32–38 jam',
    via: 'Curup, Tol Palembang, Bakauheni–Merak',
    departureTimes: ['11:00'],
    departureDays: [3, 5],
    departureDaysLabel: 'Rabu dan Jumat',
    departureNote: 'Berangkat setiap Rabu dan Jumat pukul 11.00 dari Bengkulu. Hubungi kami untuk konfirmasi sisa kursi.',
  },
  {
    id: 'bdg-crp',
    from: 'Bandung',
    to: 'Curup',
    price: 800000,
    duration: '30–36 jam',
    via: 'Tol Palembang, Bakauheni–Merak',
    departureTimes: ['13:00'],
    departureDays: [3, 5],
    departureDaysLabel: 'Rabu dan Jumat',
    departureNote: 'Berangkat setiap Rabu dan Jumat pukul 13.00 dari Bandung. Hubungi kami untuk konfirmasi sisa kursi.',
  },
  {
    id: 'bdg-bkl',
    from: 'Bandung',
    to: 'Bengkulu',
    price: 800000,
    duration: '32–38 jam',
    via: 'Tol Palembang, Curup',
    departureTimes: ['13:00'],
    departureDays: [3, 5],
    departureDaysLabel: 'Rabu dan Jumat',
    departureNote: 'Berangkat setiap Rabu dan Jumat pukul 13.00 dari Bandung. Hubungi kami untuk konfirmasi sisa kursi.',
  },
  {
    id: 'bkl-pdg',
    from: 'Bengkulu',
    to: 'Padang',
    price: 350000,
    duration: '18–22 jam',
    via: 'Curup, Lubuklinggau',
    departureTimes: ['12:15', '11:00'],
    departureNote: 'Hiace berangkat pukul 12.15 (Rp 350.000). Mobil random pukul 11.00 (Rp 300.000, bukan Hiace).',
    timeInfo: {
      '12:15': { car: 'Hiace' },
      '11:00': { car: 'Mobil Random', price: 300000, notice: noticeRandom('11:00') },
    },
  },
  {
    id: 'pdg-bkl',
    from: 'Padang',
    to: 'Bengkulu',
    price: 350000,
    duration: '18–22 jam',
    via: 'Curup, Lubuklinggau',
    departureTimes: ['11:00', '10:00'],
    departureNote: 'Hiace berangkat pukul 11.00 (Rp 350.000). Mobil random pukul 10.00 (Rp 300.000, bukan Hiace).',
    timeInfo: {
      '11:00': { car: 'Hiace' },
      '10:00': { car: 'Mobil Random', price: 300000, notice: noticeRandom('10:00') },
    },
  },
  {
    id: 'crp-pdg',
    from: 'Curup',
    to: 'Padang',
    price: 350000,
    duration: '16–20 jam',
    via: 'Lubuklinggau',
    departureTimes: ['14:15', '13:00'],
    departureNote: 'Hiace berangkat pukul 14.15 (Rp 350.000). Mobil random pukul 13.00 (Rp 300.000, bukan Hiace).',
    timeInfo: {
      '14:15': { car: 'Hiace' },
      '13:00': { car: 'Mobil Random', price: 300000, notice: noticeRandom('13:00') },
    },
  },
  {
    id: 'pdg-crp',
    from: 'Padang',
    to: 'Curup',
    price: 350000,
    duration: '16–20 jam',
    via: 'Lubuklinggau',
    departureTimes: ['11:00', '10:00'],
    departureNote: 'Hiace berangkat pukul 11.00 (Rp 350.000). Mobil random pukul 10.00 (Rp 300.000, bukan Hiace).',
    timeInfo: {
      '11:00': { car: 'Hiace' },
      '10:00': { car: 'Mobil Random', price: 300000, notice: noticeRandom('10:00') },
    },
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
  ...koridorPadangRoutes(),
];

export function getRouteById(id: string): Route | undefined {
  return ROUTES.find(r => r.id === id);
}

/** Harga per orang; mobil non-Hiace (timeInfo.price) bisa berbeda dari harga dasar */
export function getRoutePrice(route: Route | undefined, time?: string): number {
  if (!route) return 0;
  return (time && route.timeInfo?.[time]?.price) || route.price;
}

/** Cek apakah tanggal (YYYY-MM-DD) jatuh pada hari keberangkatan rute */
export function isDepartureDay(route: Route | undefined, date: string): boolean {
  if (!route?.departureDays?.length || !date) return true;
  const [y, m, d] = date.split('-').map(Number);
  return route.departureDays.includes(new Date(y, m - 1, d).getDay());
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

/** Format jam "10:00" → "10.00 WIB" */
export function getTimeInfo(route: Route | undefined, time: string) {
  return route?.timeInfo?.[time];
}

export function formatDepartureTime(time: string): string {
  return time.replace(':', '.') + ' WIB';
}
