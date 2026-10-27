// Konfigurasi 3 halaman rute HiAce Bandung: dipakai BandungRoutePage.
// Ubah tarif/estimasi di sini (dan di routes.ts) agar seragam.
export const HARGA_BANDUNG = 800000;
// Isi jumlah kursi Hiace yang sebenarnya, mis. '12 Penumpang'.
export const KAPASITAS_HIACE = 'Konfirmasi admin';

export interface BandungRoute {
  slug: string;
  routeId: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  lead: string;
  heroSrc: string;
  heroW: number;
  heroH: number;
  heroAlt: string;
  jalur: string;
  jemput: string;
  tujuan: string;
  related: { href: string; label: string }[];
  // Opsional (default = perilaku halaman Bandung)
  imgDir?: string;
  heroPos?: string;
  via?: string;          // label rute di teks, mis. 'Tol Palembang'
  jadwal?: string;       // ringkas, mis. '2 kali seminggu'
  jadwalFaq?: string;
  badge?: string;
  ctaText?: string;
  perkVia?: string;
  perkJadwal?: string;
  kapasitas?: string;    // kartu 'Kapasitas' di ringkasan
  armadaCard?: string;   // kartu 'Armada' di ringkasan
  jadwalCards?: { jam?: string; time?: string; judul: string; sub: string; armada: string; icon: string; tone: 'hiace' | 'random' }[];
  jadwalRow?: string;
  armadaRow?: string;
  catatanArmada?: string; // kotak catatan di bawah intro
  durasiNote?: string;   // faktor yang memengaruhi waktu tempuh
  durasiFaq?: string;    // bagian 'termasuk ...'
  galeri?: { src: string; w: number; h: number; alt: string; cap: string }[];
}

const JALUR_CRP_BDG =
  'Dari Curup, HiAce melaju lewat Lubuklinggau, Sekayu, dan Prabumulih menuju Palembang. Dari Palembang perjalanan masuk Tol Trans Sumatera ke arah Lampung sampai Bakauheni, menyeberang ke Merak, lalu lanjut tol Jakarta–Cikampek dan Cipularang menuju Bandung.';

export const BANDUNG_ROUTES: Record<string, BandungRoute> = {
  'travel-curup-bandung': {
    slug: 'travel-curup-bandung',
    routeId: 'crp-bdg',
    from: 'Curup',
    to: 'Bandung',
    price: HARGA_BANDUNG,
    duration: '30–36 jam',
    metaTitle: 'Travel Curup Bandung Hiace via Tol Palembang Rp 800.000',
    metaDesc:
      'Travel Curup Bandung naik Hiace via Tol Palembang, Rp 800.000/orang. Berangkat 2 kali seminggu, dijemput di Curup, kabin lega TV & audio. Pesan WA 0852-6864-5461.',
    h1: 'Travel Curup Bandung Hiace',
    lead: 'Travel Hiace dari Curup langsung ke Bandung lewat Tol Palembang, berangkat 2 kali seminggu. Kabin lega dengan TV dan audio.',
    heroSrc: 'hiace-curup-bandung-hero.webp',
    heroW: 750,
    heroH: 1000,
    heroAlt: 'Toyota Hiace hitam armada travel Curup Bandung di atas kapal penyeberangan',
    jalur: JALUR_CRP_BDG,
    jemput: 'Area Curup',
    tujuan: 'Bandung',
    related: [
      { href: '/travel-bandung-curup', label: 'Travel Bandung → Curup' },
      { href: '/travel-bandung-bengkulu', label: 'Travel Bandung → Bengkulu' },
      { href: '/travel-curup-bengkulu', label: 'Travel Curup → Bengkulu' },
      { href: '/travel-bengkulu-curup', label: 'Travel Bengkulu → Curup' },
      { href: '/rental-mobil-curup', label: 'Rental Mobil Curup' },
      { href: '/hotel-di-curup', label: 'Hotel di Curup' },
      { href: '/travel-bengkulu', label: 'Semua Rute Travel Bengkulu' },
    ],
  },
  'travel-bandung-curup': {
    slug: 'travel-bandung-curup',
    routeId: 'bdg-crp',
    from: 'Bandung',
    to: 'Curup',
    price: HARGA_BANDUNG,
    duration: '30–36 jam',
    metaTitle: 'Travel Bandung Curup Hiace via Tol Palembang Rp 800.000',
    metaDesc:
      'Travel Bandung Curup naik Hiace via Tol Palembang, Rp 800.000/orang. Berangkat 2 kali seminggu, kabin lega TV & audio. Pesan WA 0852-6864-5461.',
    h1: 'Travel Bandung Curup Hiace',
    lead: 'Travel Hiace dari Bandung langsung ke Curup lewat Tol Palembang, berangkat 2 kali seminggu. Kabin lega dengan TV dan audio.',
    heroSrc: 'hiace-curup-bandung-malam.webp',
    heroW: 562,
    heroH: 1000,
    heroAlt: 'Toyota Hiace putih armada travel Bandung Curup saat penyeberangan malam',
    jalur:
      'Dari Bandung, HiAce masuk tol Cipularang dan Jakarta–Merak menuju Pelabuhan Merak, menyeberang ke Bakauheni, lalu masuk Tol Trans Sumatera ke arah Palembang. Dari Palembang perjalanan lanjut lewat Prabumulih, Sekayu, dan Lubuklinggau hingga tiba di Curup.',
    jemput: 'Area Bandung',
    tujuan: 'Curup',
    related: [
      { href: '/travel-curup-bandung', label: 'Travel Curup → Bandung' },
      { href: '/travel-bandung-bengkulu', label: 'Travel Bandung → Bengkulu' },
      { href: '/travel-curup-bengkulu', label: 'Travel Curup → Bengkulu' },
      { href: '/rental-mobil-curup', label: 'Rental Mobil Curup' },
      { href: '/hotel-di-curup', label: 'Hotel di Curup' },
      { href: '/makanan-khas-curup', label: 'Makanan Khas Curup' },
      { href: '/travel-bengkulu', label: 'Semua Rute Travel Bengkulu' },
    ],
  },
  'travel-bandung-bengkulu': {
    slug: 'travel-bandung-bengkulu',
    routeId: 'bdg-bkl',
    from: 'Bandung',
    to: 'Bengkulu',
    price: HARGA_BANDUNG,
    duration: '32–38 jam',
    metaTitle: 'Travel Bandung Bengkulu Hiace via Tol Palembang Rp 800.000',
    metaDesc:
      'Travel Bandung Bengkulu naik Hiace via Tol Palembang, Rp 800.000/orang. Berangkat 2 kali seminggu, kabin lega TV & audio. Pesan WA 0852-6864-5461.',
    h1: 'Travel Bandung Bengkulu Hiace',
    lead: 'Travel Hiace dari Bandung ke Kota Bengkulu lewat Tol Palembang dan Curup, berangkat 2 kali seminggu. Kabin lega dengan TV dan audio.',
    heroSrc: 'hiace-curup-bandung-malam.webp',
    heroW: 562,
    heroH: 1000,
    heroAlt: 'Toyota Hiace putih armada travel Bandung Bengkulu saat penyeberangan malam',
    jalur:
      'Dari Bandung, HiAce masuk tol menuju Merak, menyeberang ke Bakauheni, lalu lewat Tol Trans Sumatera ke Palembang. Dari Palembang perjalanan lanjut melalui Prabumulih, Sekayu, Lubuklinggau, dan Curup, kemudian turun ke Kota Bengkulu.',
    jemput: 'Area Bandung',
    tujuan: 'Kota Bengkulu',
    related: [
      { href: '/travel-bandung-curup', label: 'Travel Bandung → Curup' },
      { href: '/travel-curup-bandung', label: 'Travel Curup → Bandung' },
      { href: '/travel-curup-bengkulu', label: 'Travel Curup → Bengkulu' },
      { href: '/travel-bengkulu-curup', label: 'Travel Bengkulu → Curup' },
      { href: '/tempat-wisata-bengkulu', label: 'Wisata Bengkulu' },
      { href: '/daftar-hotel-di-bengkulu', label: 'Hotel di Bengkulu' },
      { href: '/travel-bengkulu', label: 'Semua Rute Travel Bengkulu' },
    ],
  },
};

// ───────── Rute Padang (Hiace silver) ─────────
export const HARGA_PADANG = 300000;
const PADANG_DIR = '/images/hiace-padang';
const PADANG_GALERI = (nama: string, utama: 'samping' | 'depan') => [
  { src: 'kabin-led-tv.webp', w: 450, h: 800, alt: `Kabin Hiace travel ${nama} dengan plafon LED, TV, dan speaker`, cap: 'Plafon LED, TV, dan speaker di kabin.' },
  { src: 'kursi-sabuk-pengaman.webp', w: 450, h: 800, alt: `Kursi penumpang Hiace travel ${nama} dengan sabuk pengaman`, cap: 'Kursi penumpang dengan sabuk pengaman.' },
  { src: 'area-depan-tv-speaker.webp', w: 450, h: 800, alt: `Area depan kabin Hiace travel ${nama} dengan TV dan speaker`, cap: 'Area depan kabin dengan TV dan speaker.' },
  { src: 'kursi-belakang-lantai.webp', w: 450, h: 800, alt: `Deretan kursi belakang Hiace travel ${nama}`, cap: 'Deretan kursi dengan ruang kaki lega.' },
  utama === 'samping'
    ? { src: 'hiace-silver-depan.webp', w: 720, h: 1280, alt: `Tampak depan Toyota Hiace silver travel ${nama}`, cap: 'Tampak depan armada Hiace.' }
    : { src: 'hiace-silver-samping.webp', w: 720, h: 1280, alt: `Tampak samping Toyota Hiace silver travel ${nama}`, cap: 'Tampak samping armada Hiace.' },
];
const PADANG_BASE = {
  price: HARGA_PADANG,
  imgDir: PADANG_DIR,
  via: 'Curup & Lubuklinggau',
  jadwal: '2 jam keberangkatan, 14.00 dan 18.30',
  jadwalFaq: 'Ada 2 jam keberangkatan: pukul 18.30 dengan mobil Hiace dan pukul 14.00 dengan mobil random (bukan Hiace). Hubungi admin untuk sisa kursi.',
  armadaCard: 'Hiace · Mobil Random',
  jadwalCards: [
    { jam: '14.00 WIB', time: '14:00', judul: 'Keberangkatan Siang', sub: 'Menggunakan mobil random (bukan Hiace)', armada: 'Mobil Random', icon: '☀️', tone: 'random' as const },
    { jam: '18.30 WIB', time: '18:30', judul: 'Keberangkatan Malam', sub: 'Menggunakan Toyota Hiace', armada: 'Hiace', icon: '🌙', tone: 'hiace' as const },
  ],
  jadwalRow: 'Pukul 14.00 (mobil random) dan 18.30 (Hiace)',
  armadaRow: 'Toyota Hiace untuk jam 18.30 (sabuk pengaman, TV & audio). Jam 14.00 memakai mobil random',
  catatanArmada: 'Pilih keberangkatan pukul 18.30 jika Anda ingin naik Hiace. Keberangkatan pukul 14.00 menggunakan mobil random (bukan Hiace).',
  badge: '🚐 Rute Baru · Hiace',
  ctaText: 'Pilih jam 18.30 untuk naik Hiace. Isi form untuk cek kursi.',
  perkVia: 'rute lewat Curup dan Lubuklinggau menuju Padang',
  perkJadwal: 'jam 18.30 dengan Hiace, jam 14.00 dengan mobil random',
  durasiNote: 'kondisi jalan, cuaca, dan lalu lintas',
  durasiFaq: 'istirahat dan makan',
};
const relPadang = (...extra: { href: string; label: string }[]) => [
  ...extra,
  { href: '/travel-curup-bengkulu', label: 'Travel Curup → Bengkulu' },
  { href: '/travel-bengkulu-curup', label: 'Travel Bengkulu → Curup' },
  { href: '/travel-bengkulu', label: 'Semua Rute Travel Bengkulu' },
];
const L_BKL_PDG = { href: '/travel-bengkulu-padang', label: 'Travel Bengkulu → Padang' };
const L_PDG_BKL = { href: '/travel-padang-bengkulu', label: 'Travel Padang → Bengkulu' };
const L_CRP_PDG = { href: '/travel-curup-padang', label: 'Travel Curup → Padang' };
const L_PDG_CRP = { href: '/travel-padang-curup', label: 'Travel Padang → Curup' };

export const PADANG_ROUTES: Record<string, BandungRoute> = {
  'travel-bengkulu-padang': {
    ...PADANG_BASE,
    slug: 'travel-bengkulu-padang', routeId: 'bkl-pdg', from: 'Bengkulu', to: 'Padang',
    duration: '18–22 jam',
    metaTitle: 'Travel Bengkulu Padang Hiace Rp 300.000 via Curup',
    metaDesc: 'Travel Bengkulu Padang naik Hiace, Rp 300.000/orang via Curup dan Lubuklinggau. Kabin lega TV & audio, jemput di Bengkulu. Pesan WA 0852-6864-5461.',
    h1: 'Travel Bengkulu Padang Hiace',
    lead: 'Travel Hiace dari Bengkulu ke Padang lewat Curup dan Lubuklinggau. Tarif Rp 300.000 per orang, kabin lega dengan TV dan audio.',
    heroSrc: 'hiace-silver-samping.webp', heroW: 720, heroH: 1280, heroPos: 'object-[50%_45%]',
    heroAlt: 'Toyota Hiace silver armada travel Bengkulu Padang',
    jalur: 'Dari Kota Bengkulu, Hiace naik ke Curup, lalu lanjut ke Lubuklinggau dan meneruskan perjalanan ke Padang. Sopir berhenti di rumah makan dan SPBU untuk istirahat, makan, dan ibadah.',
    jemput: 'Area Kota Bengkulu', tujuan: 'Padang',
    galeri: PADANG_GALERI('Bengkulu Padang', 'samping'),
    related: relPadang(L_PDG_BKL, L_CRP_PDG, { href: '/tempat-wisata-bengkulu', label: 'Wisata Bengkulu' }),
  },
  'travel-padang-bengkulu': {
    ...PADANG_BASE,
    slug: 'travel-padang-bengkulu', routeId: 'pdg-bkl', from: 'Padang', to: 'Bengkulu',
    duration: '18–22 jam',
    metaTitle: 'Travel Padang Bengkulu Hiace Rp 300.000 via Curup',
    metaDesc: 'Travel Padang Bengkulu naik Hiace, Rp 300.000/orang via Lubuklinggau dan Curup. Kabin lega TV & audio. Pesan WA 0852-6864-5461.',
    h1: 'Travel Padang Bengkulu Hiace',
    lead: 'Travel Hiace dari Padang ke Bengkulu lewat Lubuklinggau dan Curup. Tarif Rp 300.000 per orang, kabin lega dengan TV dan audio.',
    heroSrc: 'hiace-silver-depan.webp', heroW: 720, heroH: 1280, heroPos: 'object-[50%_40%]',
    heroAlt: 'Tampak depan Toyota Hiace silver armada travel Padang Bengkulu',
    jalur: 'Dari Padang, Hiace menuju Lubuklinggau, lalu naik ke Curup dan turun ke Kota Bengkulu. Sopir berhenti di rumah makan dan SPBU untuk istirahat, makan, dan ibadah.',
    jemput: 'Area Padang', tujuan: 'Kota Bengkulu',
    galeri: PADANG_GALERI('Padang Bengkulu', 'depan'),
    related: relPadang(L_BKL_PDG, L_PDG_CRP, { href: '/tempat-wisata-bengkulu', label: 'Wisata Bengkulu' }),
  },
  'travel-curup-padang': {
    ...PADANG_BASE,
    slug: 'travel-curup-padang', routeId: 'crp-pdg', from: 'Curup', to: 'Padang',
    duration: '16–20 jam',
    metaTitle: 'Travel Curup Padang Hiace Rp 300.000 via Lubuklinggau',
    metaDesc: 'Travel Curup Padang naik Hiace, Rp 300.000/orang via Lubuklinggau. Kabin lega TV & audio, jemput di Curup. Pesan WA 0852-6864-5461.',
    h1: 'Travel Curup Padang Hiace',
    lead: 'Travel Hiace dari Curup ke Padang lewat Lubuklinggau. Tarif Rp 300.000 per orang, kabin lega dengan TV dan audio.',
    heroSrc: 'hiace-silver-samping.webp', heroW: 720, heroH: 1280, heroPos: 'object-[50%_45%]',
    heroAlt: 'Toyota Hiace silver armada travel Curup Padang',
    jalur: 'Dari Curup, Hiace menuju Lubuklinggau dan meneruskan perjalanan ke Padang. Sopir berhenti di rumah makan dan SPBU untuk istirahat, makan, dan ibadah.',
    jemput: 'Area Curup', tujuan: 'Padang',
    galeri: PADANG_GALERI('Curup Padang', 'depan'),
    related: relPadang(L_PDG_CRP, L_BKL_PDG, { href: '/rental-mobil-curup', label: 'Rental Mobil Curup' }, { href: '/hotel-di-curup', label: 'Hotel di Curup' }),
  },
  'travel-padang-curup': {
    ...PADANG_BASE,
    slug: 'travel-padang-curup', routeId: 'pdg-crp', from: 'Padang', to: 'Curup',
    duration: '16–20 jam',
    metaTitle: 'Travel Padang Curup Hiace Rp 300.000 via Lubuklinggau',
    metaDesc: 'Travel Padang Curup naik Hiace, Rp 300.000/orang via Lubuklinggau. Kabin lega TV & audio. Pesan WA 0852-6864-5461.',
    h1: 'Travel Padang Curup Hiace',
    lead: 'Travel Hiace dari Padang ke Curup lewat Lubuklinggau. Tarif Rp 300.000 per orang, kabin lega dengan TV dan audio.',
    heroSrc: 'hiace-silver-depan.webp', heroW: 720, heroH: 1280, heroPos: 'object-[50%_40%]',
    heroAlt: 'Tampak depan Toyota Hiace silver armada travel Padang Curup',
    jalur: 'Dari Padang, Hiace menuju Lubuklinggau dan melanjutkan perjalanan ke Curup. Sopir berhenti di rumah makan dan SPBU untuk istirahat, makan, dan ibadah.',
    jemput: 'Area Padang', tujuan: 'Curup',
    galeri: PADANG_GALERI('Padang Curup', 'samping'),
    related: relPadang(L_CRP_PDG, L_PDG_BKL, { href: '/rental-mobil-curup', label: 'Rental Mobil Curup' }, { href: '/makanan-khas-curup', label: 'Makanan Khas Curup' }),
  },
};
