import { TUJUAN_KORIDOR_PADANG, KURANG_NON_HIACE } from './routes';

// Konfigurasi 3 halaman rute HiAce Bandung: dipakai BandungRoutePage.
// Ubah tarif/estimasi di sini (dan di routes.ts) agar seragam.
export const HARGA_BANDUNG = 800000;
// Isi jumlah kursi Hiace yang sebenarnya, mis. '12 Penumpang'.
export const KAPASITAS_HIACE = '13';

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
  jadwalCards?: { routeId?: string; jam?: string; time?: string; judul: string; sub: string; armada: string; icon: string; tone: 'hiace' | 'random' }[];
  jadwalRow?: string;
  armadaRow?: string;
  catatanArmada?: string; // kotak catatan di bawah intro
  durasiNote?: string;   // faktor yang memengaruhi waktu tempuh
  durasiFaq?: string;    // bagian 'termasuk ...'
  /** Tabel tarif per tujuan (koridor Padang): Hiace vs kendaraan lain */
  tarifTujuan?: { routeId: string; tujuan: string; hiace: number; lain: number }[];
  galeri?: { src: string; w: number; h: number; alt: string; cap: string }[];
  // ── Penegasan target pasar (anti-kanibal Curup vs Bengkulu). Semua opsional. ──
  heroChip?: string;                 // label kecil di atas foto utama
  intro?: string[];                  // paragraf pengantar; **teks** = tebal
  fokus?: { tone: 'emerald' | 'sky'; eyebrow: string; judul: string; poin: string[]; kota?: string[] };
  switcher?: { text: string; label: string; href: string }; // tautan ke halaman saudara
  stops?: string[];                  // urutan titik di garis rute
  judulTarif?: string;
  tarifIntro?: string;
  judulRute?: string;
  judulKenapa?: string;
  perks?: [string, string][];        // daftar keunggulan khusus halaman
  panduan?: { href: string; label: string; desc: string }[]; // tautan silo (artikel pendukung)
  faqExtra?: [string, string][];     // FAQ khusus halaman (tampil paling atas)
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
      'Travel Curup Bandung Hiace via Tol Palembang Rp 800.000. Berangkat Rabu & Jumat: Bengkulu 11.00, Curup 13.00. Pesan WA 0852-6864-5461.',
    h1: 'Travel Curup Bandung Hiace',
    lead: 'Travel Hiace dari Curup langsung ke Bandung lewat Tol Palembang, berangkat setiap Rabu dan Jumat. Kabin lega dengan TV dan audio.',
    jadwal: 'setiap Rabu dan Jumat',
    jadwalFaq: 'Berangkat setiap Rabu dan Jumat. Dari Curup pukul 13.00 WIB, sedangkan penumpang dari Kota Bengkulu berangkat pukul 11.00 WIB. Hubungi admin untuk sisa kursi.',
    perkJadwal: 'setiap Rabu dan Jumat, bisa direncanakan jauh hari',
    jadwalCards: [
      { routeId: 'bkl-bdg', jam: '11.00 WIB', time: '11:00', judul: 'Berangkat dari Bengkulu', sub: 'Rabu & Jumat · Toyota Hiace', armada: 'Hiace', icon: '🚐', tone: 'hiace' as const },
      { jam: '13.00 WIB', time: '13:00', judul: 'Berangkat dari Curup', sub: 'Rabu & Jumat · Toyota Hiace', armada: 'Hiace', icon: '🚐', tone: 'hiace' as const },
    ],
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
      'Travel Bandung Curup naik Hiace via Tol Palembang, Rp 800.000/orang. Berangkat Rabu & Jumat 13.00, kabin lega TV & audio. Pesan WA 0852-6864-5461.',
    h1: 'Travel Bandung Curup Hiace',
    lead: 'Travel Hiace dari Bandung langsung ke Curup lewat Tol Palembang, berangkat setiap Rabu dan Jumat pukul 13.00. Kabin lega dengan TV dan audio.',
    heroSrc: 'hiace-curup-bandung-malam.webp',
    heroW: 562,
    heroH: 1000,
    heroAlt: 'Toyota Hiace putih armada travel Bandung Curup saat penyeberangan malam',
    jalur:
      'Dari Bandung, HiAce masuk tol Cipularang dan Jakarta–Merak menuju Pelabuhan Merak, menyeberang ke Bakauheni, lalu masuk Tol Trans Sumatera ke arah Palembang. Dari Palembang perjalanan lanjut lewat Prabumulih, Sekayu, dan Lubuklinggau hingga tiba di Curup.',
    jadwal: 'setiap Rabu dan Jumat pukul 13.00',
    jadwalFaq: 'Berangkat setiap Rabu dan Jumat pukul 13.00 WIB dari Bandung. Hubungi admin untuk sisa kursi.',
    perkJadwal: 'setiap Rabu dan Jumat pukul 13.00, bisa direncanakan jauh hari',
    jadwalCards: [
      { jam: '13.00 WIB', time: '13:00', judul: 'Berangkat dari Bandung', sub: 'Rabu & Jumat · Toyota Hiace', armada: 'Hiace', icon: '🚐', tone: 'hiace' as const },
    ],
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
      'Travel Bandung Bengkulu naik Hiace via Tol Palembang, Rp 800.000/orang. Berangkat Rabu & Jumat 13.00, kabin lega TV & audio. Pesan WA 0852-6864-5461.',
    h1: 'Travel Bandung Bengkulu Hiace',
    lead: 'Travel Hiace dari Bandung ke Kota Bengkulu lewat Tol Palembang dan Curup, berangkat setiap Rabu dan Jumat pukul 13.00. Kabin lega dengan TV dan audio.',
    heroSrc: 'hiace-curup-bandung-malam.webp',
    heroW: 562,
    heroH: 1000,
    heroAlt: 'Toyota Hiace putih armada travel Bandung Bengkulu saat penyeberangan malam',
    jalur:
      'Dari Bandung, HiAce masuk tol menuju Merak, menyeberang ke Bakauheni, lalu lewat Tol Trans Sumatera ke Palembang. Dari Palembang perjalanan lanjut melalui Prabumulih, Sekayu, Lubuklinggau, dan Curup, kemudian turun ke Kota Bengkulu.',
    jadwal: 'setiap Rabu dan Jumat pukul 13.00',
    jadwalFaq: 'Berangkat setiap Rabu dan Jumat pukul 13.00 WIB dari Bandung. Hubungi admin untuk sisa kursi.',
    perkJadwal: 'setiap Rabu dan Jumat pukul 13.00, bisa direncanakan jauh hari',
    jadwalCards: [
      { jam: '13.00 WIB', time: '13:00', judul: 'Berangkat dari Bandung', sub: 'Rabu & Jumat · Toyota Hiace', armada: 'Hiace', icon: '🚐', tone: 'hiace' as const },
    ],
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

// Asal Bengkulu / Curup: Hiace Rp 350.000 ke Padang, kendaraan lain Rp 50.000 lebih murah
const HARGA_PADANG_HIACE = 350000;
const padangAsalBase = (jamHiace: string, jamRandom: string, tujuan: string) => {
  const j = jamHiace.replace(':', '.');
  const jr = jamRandom.replace(':', '.');
  return {
    price: HARGA_PADANG_HIACE,
    imgDir: PADANG_DIR,
    via: 'Curup & Lubuklinggau',
    jadwal: `mobil random jam ${jr}, Hiace jam ${j}`,
    jadwalFaq: `Ada 2 jam keberangkatan: pukul ${jr} dengan mobil random, bukan Hiace (Rp 50.000 lebih murah, Rp 300.000 ke ${tujuan}) dan pukul ${j} dengan mobil Hiace (Rp 350.000 ke ${tujuan}). Hubungi admin untuk sisa kursi.`,
    armadaCard: 'Hiace · Mobil Random',
    jadwalCards: [
      { jam: `${j} WIB`, time: jamHiace, judul: 'Keberangkatan Hiace', sub: 'Toyota Hiace, kabin lega TV & audio', armada: 'Hiace', icon: '🚐', tone: 'hiace' as const },
      { jam: `${jr} WIB`, time: jamRandom, judul: 'Keberangkatan Mobil Random', sub: 'Bukan Hiace, Rp 50.000 lebih murah', armada: 'Mobil Random', icon: '☀️', tone: 'random' as const },
    ],
    jadwalRow: `Pukul ${jr} (mobil random) dan ${j} (Hiace)`,
    armadaRow: `Toyota Hiace untuk jam ${j} (sabuk pengaman, TV & audio). Jam ${jr} memakai mobil random`,
    catatanArmada: `Tarif Rp 350.000 ke ${tujuan} berlaku untuk Hiace (jam ${j}). Kendaraan selain Hiace (jam ${jr}) tarifnya Rp 50.000 lebih murah dan bukan Hiace.`,
    badge: '🚐 Rute Baru · Hiace',
    ctaText: `Pilih jam ${j} untuk naik Hiace. Isi form untuk cek kursi.`,
    perkVia: 'rute lewat Curup dan Lubuklinggau menuju Padang',
    perkJadwal: `jam ${j} dengan Hiace, jam ${jr} dengan mobil random`,
    durasiNote: 'kondisi jalan, cuaca, dan lalu lintas',
    durasiFaq: 'istirahat dan makan',
  };
};
const tarifKoridor = (prefix: 'bkl' | 'crp') => {
  const row = (routeId: string, tujuan: string, hiace: number) => ({ routeId, tujuan, hiace, lain: hiace - KURANG_NON_HIACE });
  const t = (slug: string) => TUJUAN_KORIDOR_PADANG.find((x) => x.slug === slug)!;
  return [
    row(`${prefix}-bkt`, t('bkt').nama, t('bkt').hiace),
    row(`${prefix}-pdg`, 'Padang', HARGA_PADANG_HIACE),
    row(`${prefix}-bgk`, t('bgk').nama, t('bgk').hiace),
    row(`${prefix}-srl`, t('srl').nama, t('srl').hiace),
    row(`${prefix}-bgo`, t('bgo').nama, t('bgo').hiace),
    row(`${prefix}-slk`, t('slk').nama, t('slk').hiace),
    row(`${prefix}-skt`, t('skt').nama, t('skt').hiace),
  ];
};
const PADANG_BASE_BKL = { ...padangAsalBase('12:15', '11:00', 'Padang'), tarifTujuan: tarifKoridor('bkl') };
const PADANG_BASE_CRP = { ...padangAsalBase('14:15', '13:00', 'Padang'), tarifTujuan: tarifKoridor('crp') };
// Asal Padang (ke Bengkulu / Curup): mobil random 10.00, Hiace 11.00, tarif sama
const PADANG_BASE_PDG_BKL = padangAsalBase('11:00', '10:00', 'Bengkulu');
const PADANG_BASE_PDG_CRP = padangAsalBase('11:00', '10:00', 'Curup');
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
    ...PADANG_BASE_BKL,
    slug: 'travel-bengkulu-padang', routeId: 'bkl-pdg', from: 'Bengkulu', to: 'Padang',
    duration: '18–22 jam',
    metaTitle: 'Travel Bengkulu Padang Hiace, Jemput di Kota Bengkulu',
    metaDesc: 'Travel Bengkulu Padang khusus jemput di Kota Bengkulu, lewat Curup & Lubuklinggau, bukan Mukomuko. Hiace 12.15, Rp 350.000. WA 0852-6864-5461.',
    h1: 'Travel Bengkulu Padang Hiace: Jemput di Kota Bengkulu',
    lead: 'Layanan khusus penumpang yang berada di Kota Bengkulu dan ingin ke Padang. Setelah dijemput, mobil naik lewat Curup dan Lubuklinggau, bukan lewat Mukomuko.',
    heroChip: '📍 Dijemput di Kota Bengkulu',
    intro: [
      '**Travel Bengkulu Padang** ini khusus untuk penjemputan di **Kota Bengkulu**. Anda dijemput di alamat Anda, lalu perjalanan naik melewati **Curup dan Lubuklinggau** menuju Padang. Rute ini **tidak lewat Mukomuko**, jadi tetap memakai jalur bawah via Curup.',
      'Mencari **travel dari Bengkulu ke Padang** dengan rute dan jadwal yang jelas? Hiace berangkat pukul 12.15 dengan tarif Rp 350.000 per orang ke Padang. Tersedia juga mobil random pukul 11.00 yang lebih murah Rp 50.000.',
    ],
    fokus: {
      tone: 'sky',
      eyebrow: 'Khusus Kota Bengkulu',
      judul: 'Posisi Anda di Kota Bengkulu? Ini rute Anda',
      poin: [
        'Dijemput di alamat Anda di Kota Bengkulu',
        'Lewat Curup dan Lubuklinggau, bukan Mukomuko',
        'Hiace pukul 12.15 atau mobil random pukul 11.00',
        'Bisa turun di Padang, Bukit Tinggi, Solok, dan kota di jalur',
      ],
      kota: ['Kota Bengkulu', 'Curup', 'Lubuklinggau', 'Padang'],
    },
    switcher: { text: 'Berangkat dari Curup? Tidak perlu turun ke Kota Bengkulu.', label: 'Lihat layanan Curup → Padang', href: '/travel-curup-padang' },
    panduan: [
      { href: '/jadwal-travel-bengkulu-padang', label: 'Jadwal Travel Bengkulu Padang', desc: 'Jam berangkat Hiace dan mobil random semua arah' },
      { href: '/ongkos-travel-bengkulu-padang', label: 'Ongkos Travel Bengkulu Padang', desc: 'Tarif per tujuan dan contoh hitungan biaya' },
    ],
    judulTarif: 'Tarif dari Kota Bengkulu ke Padang dan Kota Lainnya',
    tarifIntro: 'Satu keberangkatan dari Kota Bengkulu melayani beberapa kota di sepanjang jalur. Pilih tujuan Anda, tarif Hiace dan kendaraan lain tertera di bawah.',
    judulRute: 'Rute Bengkulu ke Padang via Curup dan Lubuklinggau (Bukan Mukomuko)',
    judulKenapa: 'Kenapa Naik Travel dari Kota Bengkulu',
    perks: [
      ['Jemput di Kota Bengkulu', 'alamat jemput disepakati saat pesan'],
      ['Jalur via Curup', 'bukan lewat Mukomuko'],
      ['Jadwal jelas', 'Hiace 12.15, mobil random 11.00'],
      ['Hiace kabin lega', 'sabuk pengaman, TV, dan audio'],
      ['Tarif transparan', 'Rp 350.000 ke Padang, dijelaskan sebelum membayar'],
      ['Pesan 24 jam', 'admin siap dihubungi kapan saja'],
    ],
    faqExtra: [
      ['Apakah travel Bengkulu Padang lewat Mukomuko?', 'Tidak. Dari Kota Bengkulu mobil naik lewat Curup dan Lubuklinggau, lalu lanjut ke Padang.'],
      ['Apakah layanan ini menjemput di Curup?', 'Halaman ini khusus penjemputan di Kota Bengkulu. Jika Anda berada di Curup, gunakan layanan Curup ke Padang agar tidak perlu ke Kota Bengkulu dulu.'],
    ],
    heroSrc: 'hiace-silver-samping.webp', heroW: 720, heroH: 1280, heroPos: 'object-[50%_45%]',
    heroAlt: 'Toyota Hiace silver armada travel Bengkulu Padang',
    jalur: 'Dari Kota Bengkulu, Hiace naik ke Curup, lalu lanjut ke Lubuklinggau dan meneruskan perjalanan ke Padang. Sopir berhenti di rumah makan dan SPBU untuk istirahat, makan, dan ibadah.',
    jemput: 'Area Kota Bengkulu', tujuan: 'Padang',
    galeri: PADANG_GALERI('Bengkulu Padang', 'samping'),
    related: relPadang(L_PDG_BKL, L_CRP_PDG, { href: '/jadwal-travel-bengkulu-padang', label: 'Jadwal Travel Bengkulu Padang' }, { href: '/ongkos-travel-bengkulu-padang', label: 'Ongkos Travel Bengkulu Padang' }, { href: '/tempat-wisata-bengkulu', label: 'Wisata Bengkulu' }),
  },
  'travel-padang-bengkulu': {
    ...PADANG_BASE_PDG_BKL,
    slug: 'travel-padang-bengkulu', routeId: 'pdg-bkl', from: 'Padang', to: 'Bengkulu',
    duration: '18–22 jam',
    metaTitle: 'Travel Padang Bengkulu Hiace Rp 350.000 via Curup',
    metaDesc: 'Travel Padang Bengkulu naik Hiace Rp 350.000/orang, berangkat 11.00, via Lubuklinggau dan Curup. Kabin lega TV & audio. Pesan WA 0852-6864-5461.',
    h1: 'Travel Padang Bengkulu Hiace',
    lead: 'Travel Hiace dari Padang ke Bengkulu lewat Lubuklinggau dan Curup. Berangkat pukul 11.00. Tarif Rp 350.000 per orang, kabin lega dengan TV dan audio.',
    heroSrc: 'hiace-silver-depan.webp', heroW: 720, heroH: 1280, heroPos: 'object-[50%_40%]',
    heroAlt: 'Tampak depan Toyota Hiace silver armada travel Padang Bengkulu',
    jalur: 'Dari Padang, Hiace menuju Lubuklinggau, lalu naik ke Curup dan turun ke Kota Bengkulu. Sopir berhenti di rumah makan dan SPBU untuk istirahat, makan, dan ibadah.',
    jemput: 'Area Padang', tujuan: 'Kota Bengkulu',
    galeri: PADANG_GALERI('Padang Bengkulu', 'depan'),
    related: relPadang(L_BKL_PDG, L_PDG_CRP, { href: '/tempat-wisata-bengkulu', label: 'Wisata Bengkulu' }),
  },
  'travel-curup-padang': {
    ...PADANG_BASE_CRP,
    slug: 'travel-curup-padang', routeId: 'crp-pdg', from: 'Curup', to: 'Padang',
    duration: '16–20 jam',
    metaTitle: 'Travel Curup Padang Hiace, Jemput di Rumah Tanpa ke Bengkulu',
    metaDesc: 'Travel Curup Padang berangkat langsung dari Curup, jemput di rumah, tanpa ke Kota Bengkulu. Juga Curup Bangko & Muara Bungo. WA 0852-6864-5461.',
    h1: 'Travel Curup Padang Hiace: Berangkat Langsung dari Curup',
    lead: 'Kantor kami di Curup, jadi mobil berangkat langsung dari Curup dan menjemput Anda di rumah atau titik yang disepakati. Tidak perlu ke Kota Bengkulu dulu.',
    heroChip: '📍 Berangkat langsung dari Curup',
    intro: [
      '**Travel Curup Padang** kami berangkat langsung dari **Curup**, karena kantor pusat kami ada di Curup. Anda dijemput di **rumah atau titik yang disepakati**, tanpa perlu ke Kota Bengkulu dulu. Dari Curup, mobil melaju lewat Lubuklinggau, Sarolangun, Bangko, dan Muara Bungo, lalu lanjut ke Padang.',
      'Tidak hanya ke Padang. Kami juga melayani **travel Curup Bangko** dan **travel Curup Muara Bungo**, serta Sarolangun, Singkut, Solok, dan Bukit Tinggi dalam satu jalur keberangkatan yang sama. Hiace berangkat pukul 14.15, mobil random pukul 13.00.',
    ],
    fokus: {
      tone: 'emerald',
      eyebrow: 'Kantor Pusat di Curup',
      judul: 'Posisi Anda di Curup? Langsung berangkat dari sini',
      poin: [
        'Dijemput di rumah atau titik sepakat di Curup',
        'Tanpa perjalanan ke Kota Bengkulu',
        'Lewat Lubuklinggau, Sarolangun, Bangko, Muara Bungo',
        'Hiace pukul 14.15 atau mobil random pukul 13.00',
      ],
      kota: ['Curup', 'Lubuklinggau', 'Sarolangun', 'Bangko', 'Muara Bungo', 'Padang'],
    },
    stops: ['Curup', 'Lubuklinggau', 'Sarolangun', 'Bangko', 'Muara Bungo', 'Padang'],
    switcher: { text: 'Posisi Anda di Kota Bengkulu, bukan Curup?', label: 'Lihat layanan Bengkulu → Padang', href: '/travel-bengkulu-padang' },
    judulTarif: 'Travel Curup Bangko, Curup Muara Bungo, dan Tujuan Lainnya',
    tarifIntro: 'Satu keberangkatan dari Curup melayani Padang sekaligus kota di sepanjang jalur, termasuk Bangko dan Muara Bungo. Pilih tujuan Anda, tarif Hiace dan kendaraan lain tertera di bawah.',
    judulRute: 'Rute dari Curup ke Padang Tanpa Lewat Kota Bengkulu',
    judulKenapa: 'Kenapa Naik Travel Langsung dari Curup',
    perks: [
      ['Jemput di rumah', 'titik jemput di Curup disepakati saat pesan'],
      ['Tanpa ke Bengkulu', 'berangkat langsung dari Curup'],
      ['Kantor pusat di Curup', 'mudah dihubungi dan dikunjungi'],
      ['Banyak tujuan', 'Bangko, Sarolangun, Muara Bungo, Solok, Bukit Tinggi'],
      ['Tarif transparan', 'Rp 350.000 ke Padang, Rp 300.000 ke Bangko dan Muara Bungo'],
      ['Pesan 24 jam', 'admin siap dihubungi kapan saja'],
    ],
    faqExtra: [
      ['Apakah saya harus ke Kota Bengkulu dulu?', 'Tidak. Mobil berangkat langsung dari Curup dan menjemput Anda di rumah atau titik yang disepakati di Curup.'],
      ['Berapa tarif travel Curup Bangko dan Curup Muara Bungo?', 'Tarif Hiace Curup–Bangko dan Curup–Muara Bungo masing-masing Rp 300.000 per orang. Kendaraan selain Hiace Rp 50.000 lebih murah.'],
      ['Bagaimana jika saya berada di Lubuklinggau atau kota di jalur?', 'Hubungi admin untuk mengatur titik naik di sepanjang jalur dan memastikan sisa kursi.'],
    ],
    heroSrc: 'hiace-silver-depan.webp', heroW: 720, heroH: 1280, heroPos: 'object-[50%_40%]',
    heroAlt: 'Tampak depan Toyota Hiace silver armada travel Curup Padang',
    jalur: 'Dari Curup, Hiace menuju Lubuklinggau dan meneruskan perjalanan ke Padang. Sopir berhenti di rumah makan dan SPBU untuk istirahat, makan, dan ibadah.',
    jemput: 'Area Curup', tujuan: 'Padang',
    galeri: PADANG_GALERI('Curup Padang', 'samping'),
    related: relPadang(L_PDG_CRP, L_BKL_PDG, { href: '/rental-mobil-curup', label: 'Rental Mobil Curup' }, { href: '/hotel-di-curup', label: 'Hotel di Curup' }),
  },
  'travel-padang-curup': {
    ...PADANG_BASE_PDG_CRP,
    slug: 'travel-padang-curup', routeId: 'pdg-crp', from: 'Padang', to: 'Curup',
    duration: '16–20 jam',
    metaTitle: 'Travel Padang Curup Hiace Rp 350.000 via Lubuklinggau',
    metaDesc: 'Travel Padang Curup naik Hiace Rp 350.000/orang, berangkat 11.00, via Lubuklinggau. Kabin lega TV & audio. Pesan WA 0852-6864-5461.',
    h1: 'Travel Padang Curup Hiace',
    lead: 'Travel Hiace dari Padang ke Curup lewat Lubuklinggau. Berangkat pukul 11.00. Tarif Rp 350.000 per orang, kabin lega dengan TV dan audio.',
    heroSrc: 'hiace-silver-depan.webp', heroW: 720, heroH: 1280, heroPos: 'object-[50%_40%]',
    heroAlt: 'Tampak depan Toyota Hiace silver armada travel Padang Curup',
    jalur: 'Dari Padang, Hiace menuju Lubuklinggau dan melanjutkan perjalanan ke Curup. Sopir berhenti di rumah makan dan SPBU untuk istirahat, makan, dan ibadah.',
    jemput: 'Area Padang', tujuan: 'Curup',
    galeri: PADANG_GALERI('Padang Curup', 'samping'),
    related: relPadang(L_CRP_PDG, L_PDG_BKL, { href: '/rental-mobil-curup', label: 'Rental Mobil Curup' }, { href: '/makanan-khas-curup', label: 'Makanan Khas Curup' }),
  },
};
