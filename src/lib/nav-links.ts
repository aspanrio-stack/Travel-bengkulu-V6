// Dipakai bersama oleh Navbar (desktop) dan MobileMenu (tab Menu di HP).

export const navLinks = [
  {
    label: 'Layanan',
    children: [
      { href: '/travel-bengkulu-palembang', label: 'Bengkulu ↔ Palembang' },
      { href: '/travel-palembang-bengkulu', label: 'Palembang ↔ Bengkulu' },
      { href: '/travel-bengkulu-jambi', label: 'Bengkulu ↔ Jambi' },
      { href: '/travel-jambi-bengkulu', label: 'Jambi ↔ Bengkulu' },
      { href: '/travel-bengkulu-curup', label: 'Bengkulu ↔ Curup' },
      { href: '/travel-curup-bandung', label: 'Curup → Bandung' },
      { href: '/travel-bandung-curup', label: 'Bandung → Curup' },
      { href: '/travel-bengkulu-bandung', label: 'Bengkulu → Bandung' },
      { href: '/travel-bandung-bengkulu', label: 'Bandung → Bengkulu' },
      { href: '/travel-bengkulu-padang', label: 'Bengkulu → Padang' },
      { href: '/travel-padang-bengkulu', label: 'Padang → Bengkulu' },
      { href: '/travel-curup-padang', label: 'Curup → Padang' },
      { href: '/travel-padang-curup', label: 'Padang → Curup' },
      { href: '/travel-bengkulu-lebong', label: 'Bengkulu ↔ Lebong' },
      { href: '/travel-bengkulu-lampung', label: 'Bengkulu ↔ Lampung' },
      { href: '/rental-mobil-curup', label: 'Rental Mobil Curup' },
      { href: '/antar-jemput-bandara-curup', label: 'Antar dan Jemput Bandara' },
      { href: '/kirim-paket-bengkulu-palembang', label: 'Kirim Paket' },
    ],
  },
  {
    label: 'Artikel',
    children: [
      { href: '/tempat-wisata-bengkulu', label: 'Wisata Bengkulu' },
      { href: '/wisata-pantai-panjang-bengkulu', label: 'Pantai Panjang' },
      { href: '/jarak-jambi-bengkulu', label: 'Jarak Jambi–Bengkulu' },
      { href: '/bengkulu-ke-palembang-berapa-jam', label: 'Bengkulu–Palembang Berapa Jam' },
    ],
  },
  {
    label: 'Hotel',
    children: [
      { href: '/daftar-hotel-di-bengkulu', label: '🏨 Semua Hotel di Bengkulu' },
      { href: '/hotel-di-kota-bengkulu', label: 'Hotel di Kota Bengkulu' },
      { href: '/hotel-di-curup', label: 'Hotel di Curup' },
      { href: '/hotel-syariah-di-curup', label: 'Hotel Syariah di Curup' },
      { href: '/hotel-di-lebong', label: 'Hotel di Lebong' },
      { href: '/hotel-syariah-di-lebong', label: 'Hotel Syariah di Lebong' },
    ],
  },
  {
    label: 'Kuliner',
    children: [
      { href: '/makanan-khas-bengkulu', label: '🍽️ Semua Makanan Khas Bengkulu' },
      { href: '/makanan-khas-kota-bengkulu', label: 'Makanan Khas Kota Bengkulu' },
      { href: '/makanan-khas-curup', label: 'Makanan Khas Curup' },
      { href: '/makanan-khas-lebong', label: 'Makanan Khas Lebong' },
    ],
  },
  { href: '/destinasi', label: 'Destinasi' },
  { href: '/#kontak', label: 'Kontak' },
];

// Pathname halaman produk → route ID di routes.ts (untuk tombol Pesan yang membawa rute).
export const PATH_TO_ROUTE_ID: Record<string, string> = {
  '/travel-bengkulu-palembang':   'bkl-plm',
  '/travel-palembang-bengkulu':   'plm-bkl',
  '/travel-bengkulu-jambi':       'bkl-jmb',
  '/travel-jambi-bengkulu':       'jmb-bkl',
  '/travel-bengkulu-curup':       'bkl-crp',
  '/travel-curup-bengkulu':       'crp-bkl',
  '/travel-curup-bandung':       'crp-bdg',
  '/travel-bandung-curup':       'bdg-crp',
  '/travel-bandung-bengkulu':    'bdg-bkl',
  '/travel-bengkulu-bandung':    'bkl-bdg',
  '/travel-bengkulu-padang':     'bkl-pdg',
  '/travel-padang-bengkulu':     'pdg-bkl',
  '/travel-curup-padang':        'crp-pdg',
  '/travel-padang-curup':        'pdg-crp',
  '/antar-jemput-bandara-curup':  'crp-bnd',
  '/travel-bengkulu-lebong':      'bkl-lbg',
  '/travel-lebong-bengkulu':      'lbg-bkl',
  '/travel-bengkulu-lampung':     'bkl-lmp',
  '/travel-lampung-bengkulu':     'lmp-bkl',
};

export function routeIdFromPath(pathname: string | null): string | null {
  return (pathname && PATH_TO_ROUTE_ID[pathname]) || null;
}
