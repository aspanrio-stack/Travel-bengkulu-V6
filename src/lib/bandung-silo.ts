import { getRouteById } from './routes';

export const BASE = 'https://bengkulutravel.com';
export const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
export const titik = (t: string) => t.replace(':', '.');

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/** '32–38 jam' → { min: 32, max: 38 } */
function parseDurasi(d: string) {
  const m = d.match(/(\d+)\s*[–-]\s*(\d+)/);
  return m ? { min: Number(m[1]), max: Number(m[2]) } : { min: 0, max: 0 };
}

/** Jam & hari + durasi → "Kamis 19.00 – Jumat 01.00" (estimasi, bukan janji) */
export function estimasiTiba(hari: number, jam: string, durasi: string) {
  const { min, max } = parseDurasi(durasi);
  const [h, m] = jam.split(':').map(Number);
  const fmt = (tambah: number) => {
    const total = h * 60 + m + tambah * 60;
    const dayOff = Math.floor(total / 1440);
    const sisa = total % 1440;
    const jj = String(Math.floor(sisa / 60)).padStart(2, '0');
    const mm = String(sisa % 60).padStart(2, '0');
    return `${HARI[(hari + dayOff) % 7]} ${jj}.${mm}`;
  };
  return { awal: fmt(min), akhir: fmt(max), text: `${fmt(min)} – ${fmt(max)} WIB` };
}

/** Satu sumber data (routes.ts) untuk silo Bandung: jam, hari, tarif, durasi */
export function infoBandung(id: string) {
  const r = getRouteById(id)!;
  const jam = (r.departureTimes ?? [])[0] ?? '';
  const hari = r.departureDays ?? [];
  return {
    id,
    from: r.from,
    to: r.to,
    price: r.price,
    duration: r.duration,
    jam,
    hari,
    hariLabel: r.departureDaysLabel ?? hari.map((d) => HARI[d]).join(' dan '),
    tiba: hari.map((d) => ({ hari: HARI[d], ...estimasiTiba(d, jam, r.duration) })),
  };
}

/** Empat arah rute Bandung, urut dari target utama */
export const ARAH_BANDUNG = [
  { id: 'bkl-bdg', label: 'Kota Bengkulu → Bandung', href: '/travel-bengkulu-bandung' },
  { id: 'crp-bdg', label: 'Curup → Bandung', href: '/travel-curup-bandung' },
  { id: 'bdg-bkl', label: 'Bandung → Kota Bengkulu', href: '/travel-bandung-bengkulu' },
  { id: 'bdg-crp', label: 'Bandung → Curup', href: '/travel-bandung-curup' },
] as const;

export const PILAR = '/travel-bengkulu-bandung';

/** Tautan silo, dipakai bersama sebagai blok "Layanan Terkait" di tiap halaman */
export const SILO_LINKS = [
  { href: '/travel-bengkulu-bandung', label: 'Travel Bengkulu Bandung Hiace (jemput di Kota Bengkulu)' },
  { href: '/jadwal-travel-bengkulu-bandung', label: 'Jadwal Travel Bengkulu Bandung' },
  { href: '/ongkos-travel-bengkulu-bandung', label: 'Ongkos Travel Bengkulu Bandung' },
  { href: '/bengkulu-bandung-berapa-jam', label: 'Bengkulu Bandung Berapa Jam' },
  { href: '/bus-bengkulu-bandung', label: 'Bus Bengkulu Bandung vs Travel Hiace' },
] as const;
