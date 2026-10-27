// Konfigurasi 3 halaman rute HiAce Bandung: dipakai BandungRoutePage.
// Ubah tarif/estimasi di sini (dan di routes.ts) agar seragam.
export const HARGA_BANDUNG = 800000;

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
