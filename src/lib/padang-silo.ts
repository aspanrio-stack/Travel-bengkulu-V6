import { getRouteById, TUJUAN_KORIDOR_PADANG, KURANG_NON_HIACE } from './routes';

export const BASE = 'https://bengkulutravel.com';
export const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
export const titik = (t: string) => t.replace(':', '.');

/** Jam & tarif koridor Padang dari routes.ts (satu sumber data untuk pilar dan silo) */
export function jamPadang(id: string) {
  const r = getRouteById(id)!;
  const info = r.timeInfo ?? {};
  const hiace = (r.departureTimes ?? []).find((t) => info[t]?.car === 'Hiace') ?? '';
  const random = (r.departureTimes ?? []).find((t) => info[t]?.car === 'Mobil Random') ?? '';
  return {
    id,
    from: r.from,
    to: r.to,
    duration: r.duration,
    hiace,
    random,
    hiaceHarga: r.price,
    randomHarga: info[random]?.price ?? r.price - KURANG_NON_HIACE,
  };
}

/** Tarif per tujuan dari Kota Bengkulu / Curup (Padang + kota di jalur) */
export function tarifTujuanPadang() {
  const padang = getRouteById('bkl-pdg')!.price;
  const baris = [
    ...TUJUAN_KORIDOR_PADANG.map((t) => ({ nama: t.nama, hiace: t.hiace })),
  ];
  const urut = ['Bukit Tinggi', 'Padang', 'Bangko', 'Sarolangun', 'Muara Bungo', 'Solok', 'Singkut'];
  return [...baris, { nama: 'Padang', hiace: padang }]
    .sort((a, b) => urut.indexOf(a.nama) - urut.indexOf(b.nama))
    .map((t) => ({ ...t, random: t.hiace - KURANG_NON_HIACE }));
}
