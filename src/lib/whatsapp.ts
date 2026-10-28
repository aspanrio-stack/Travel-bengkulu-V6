// Nomor & pesan WhatsApp admin — dipakai tombol Chat di BottomNav.
export const WA_NUMBER = '6282374497929';

const AWAL = 'Halo Admin Travel Bengkulu, ';

// Pathname → pesan WA yang relevan dengan halaman yang sedang dibuka.
const pesanMap: Record<string, string> = {
  '/travel-bengkulu-palembang': 'saya ingin pesan travel Bengkulu ke Palembang',
  '/travel-palembang-bengkulu': 'saya ingin pesan travel Palembang ke Bengkulu',
  '/travel-bengkulu-jambi':     'saya ingin pesan travel Bengkulu ke Jambi',
  '/travel-jambi-bengkulu':     'saya ingin pesan travel Jambi ke Bengkulu',
  '/travel-bengkulu-curup':     'saya ingin pesan travel Bengkulu ke Curup',
  '/travel-curup-bengkulu':     'saya ingin pesan travel Curup ke Bengkulu',
  '/travel-bengkulu-bandung':   'saya ingin pesan travel Hiace Bengkulu ke Bandung',
  '/jadwal-travel-bengkulu-bandung': 'saya ingin tanya jadwal travel Hiace Bengkulu ke Bandung',
  '/ongkos-travel-bengkulu-bandung': 'saya ingin tanya ongkos travel Hiace Bengkulu ke Bandung',
  '/bengkulu-bandung-berapa-jam': 'saya ingin pesan travel Hiace Bengkulu ke Bandung',
  '/bus-bengkulu-bandung':      'saya ingin tanya travel Hiace Bengkulu ke Bandung',
  '/travel-curup-bandung':      'saya ingin pesan travel Hiace Curup ke Bandung',
  '/travel-bandung-curup':      'saya ingin pesan travel Hiace Bandung ke Curup',
  '/travel-bandung-bengkulu':   'saya ingin pesan travel Hiace Bandung ke Bengkulu',
  '/travel-bengkulu-padang':    'saya ingin pesan travel Hiace Bengkulu ke Padang',
  '/travel-padang-bengkulu':    'saya ingin pesan travel Hiace Padang ke Bengkulu',
  '/travel-curup-padang':       'saya ingin pesan travel Hiace Curup ke Padang',
  '/travel-padang-curup':       'saya ingin pesan travel Hiace Padang ke Curup',
  '/travel-bengkulu-lebong':    'saya ingin pesan travel Bengkulu ke Lebong',
  '/travel-lebong-bengkulu':    'saya ingin pesan travel Lebong ke Bengkulu',
  '/travel-bengkulu-lampung':   'saya ingin pesan travel Bengkulu ke Lampung',
  '/travel-lampung-bengkulu':   'saya ingin pesan travel Lampung ke Bengkulu',
  '/travel-curup-bandara-bengkulu': 'saya ingin pesan antar jemput Curup ke Bandara Bengkulu',
  '/antar-jemput-bandara-curup':    'saya ingin pesan antar jemput Bandara ke Curup',
  '/rental-mobil-curup':        'saya ingin informasi rental mobil di Curup',
  '/kirim-paket-bengkulu-palembang': 'saya ingin kirim paket Bengkulu ke Palembang',
  '/pesan':                     'saya ingin pesan travel / rental mobil',
  '/pembayaran':                'saya ingin konfirmasi pembayaran pesanan saya',
  '/hotel-di-curup':            'saya ingin info travel ke Curup sekaligus rekomendasi hotel',
  '/hotel-di-lebong':           'saya ingin info travel ke Lebong sekaligus rekomendasi hotel',
  '/destinasi':                 'saya ingin info destinasi wisata Bengkulu dan paket perjalanannya',
  '/':                          'saya ingin informasi layanan travel dan harga tiket',
};

const pesanDefault = 'saya ingin informasi layanan travel';

function judulDariSlug(slug: string): string {
  return decodeURIComponent(slug)
    .split('-')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function pesanWaUntukPath(pathname: string): string {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  if (pesanMap[path]) return AWAL + pesanMap[path];

  if (path.startsWith('/destinasi/')) {
    return `${AWAL}saya ingin info perjalanan ke ${judulDariSlug(path.split('/')[2] ?? '')}`;
  }
  if (path.includes('hotel')) return `${AWAL}saya ingin info travel sekaligus rekomendasi hotel`;
  if (path.includes('makanan')) return `${AWAL}saya ingin info travel ke Bengkulu dan rekomendasi kuliner`;
  if (path.includes('wisata')) return `${AWAL}saya ingin info paket travel ke tempat wisata Bengkulu`;
  return AWAL + pesanDefault;
}

export function waLinkUntukPath(pathname: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesanWaUntukPath(pathname))}`;
}
