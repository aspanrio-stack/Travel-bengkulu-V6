/**
 * lib/destinations.ts
 * Data destinasi wisata Bengkulu (sumber: artikel /tempat-wisata-bengkulu).
 *
 * Foto: taruh file di /public/images/destinasi/<slug>-1.webp, -2.webp (dst.) lalu isi
 * `images`. Selama kosong, UI memakai gradient + emoji sebagai placeholder.
 */

export type DestCategory = 'pantai' | 'sejarah' | 'alam' | 'pulau';

export interface Destination {
  slug: string;
  name: string;
  area: string;            // lokasi singkat
  category: DestCategory;
  emoji: string;
  gradient: string;        // kelas Tailwind from-… to-…
  short: string;           // 1 kalimat untuk kartu
  description: string;     // untuk halaman detail
  facilities: { icon: string; label: string }[];
  /** Cara menuju: rute travel (harga dari ROUTES) atau sewa mobil dalam kota */
  access: { type: 'route'; routeId: string } | { type: 'rental' };
  images?: string[];
  popular?: boolean;
}

export const CATEGORIES: { id: DestCategory | 'semua'; label: string; icon: string }[] = [
  { id: 'semua',   label: 'Semua',   icon: '🧭' },
  { id: 'pantai',  label: 'Pantai',  icon: '🏖️' },
  { id: 'sejarah', label: 'Sejarah', icon: '🏛️' },
  { id: 'alam',    label: 'Alam',    icon: '⛰️' },
  { id: 'pulau',   label: 'Pulau',   icon: '🏝️' },
];

export const DESTINATIONS: Destination[] = [
  {
    slug: 'pantai-panjang',
    name: 'Pantai Panjang',
    area: 'Kota Bengkulu',
    category: 'pantai',
    emoji: '🏖️',
    gradient: 'from-sky-500 to-primary-600',
    short: 'Pantai sepanjang lebih dari 7 km, ikon wisata Kota Bengkulu.',
    description:
      'Pantai Panjang adalah ikon wisata Bengkulu. Membentang lebih dari 7 km dengan pasir halus dan ombak yang cukup besar. Di sekitarnya tersedia warung makan, area bermain, dan penginapan, sehingga cocok untuk liburan keluarga maupun sekadar menikmati sore.',
    facilities: [
      { icon: '🍽️', label: 'Warung makan' },
      { icon: '🎠', label: 'Area bermain' },
      { icon: '🏨', label: 'Penginapan' },
      { icon: '🅿️', label: 'Parkir' },
    ],
    access: { type: 'rental' },
    popular: true,
  },
  {
    slug: 'benteng-marlborough',
    name: 'Benteng Marlborough',
    area: 'Kota Bengkulu',
    category: 'sejarah',
    emoji: '🏰',
    gradient: 'from-amber-600 to-red-700',
    short: 'Benteng peninggalan Inggris yang dibangun tahun 1714.',
    description:
      'Benteng Marlborough adalah salah satu benteng peninggalan kolonial Inggris yang masih berdiri kokoh di Indonesia. Dibangun pada tahun 1714, benteng ini menyimpan sejarah panjang Bengkulu dan menjadi wisata sejarah paling populer di kota ini.',
    facilities: [
      { icon: '📸', label: 'Spot foto' },
      { icon: '🧭', label: 'Wisata sejarah' },
      { icon: '🅿️', label: 'Parkir' },
    ],
    access: { type: 'rental' },
    images: ['/images/destinasi/benteng-marlborough-1.webp'],
    popular: true,
  },
  {
    slug: 'rumah-pengasingan-bung-karno',
    name: 'Rumah Pengasingan Bung Karno',
    area: 'Kota Bengkulu',
    category: 'sejarah',
    emoji: '🏠',
    gradient: 'from-rose-600 to-orange-500',
    short: 'Museum bekas rumah pengasingan Soekarno (1938–1942).',
    description:
      'Ir. Soekarno diasingkan di Bengkulu pada 1938–1942. Rumah pengasingannya kini menjadi museum yang terbuka untuk umum. Di Bengkulu pula Bung Karno bertemu Fatmawati yang kelak menjadi ibu negara.',
    facilities: [
      { icon: '🏛️', label: 'Museum' },
      { icon: '📸', label: 'Spot foto' },
      { icon: '🅿️', label: 'Parkir' },
    ],
    access: { type: 'rental' },
  },
  {
    slug: 'danau-dendam-tak-sudah',
    name: 'Danau Dendam Tak Sudah',
    area: 'Kota Bengkulu',
    category: 'alam',
    emoji: '🌿',
    gradient: 'from-emerald-600 to-teal-700',
    short: 'Danau berlatar legenda, dikelilingi hutan dan burung migran.',
    description:
      'Danau dengan nama unik ini diselimuti berbagai legenda rakyat Bengkulu. Letaknya tidak jauh dari pusat kota, dikelilingi hutan, dan menjadi habitat berbagai jenis burung migran.',
    facilities: [
      { icon: '🦜', label: 'Pengamatan burung' },
      { icon: '🌳', label: 'Area hutan' },
      { icon: '📸', label: 'Spot foto' },
    ],
    access: { type: 'rental' },
  },
  {
    slug: 'pulau-tikus',
    name: 'Pulau Tikus',
    area: 'Lepas pantai Bengkulu',
    category: 'pulau',
    emoji: '🤿',
    gradient: 'from-cyan-500 to-blue-700',
    short: 'Snorkeling dan diving dengan terumbu karang alami.',
    description:
      'Pulau kecil sekitar 9 km dari lepas pantai Bengkulu ini menawarkan snorkeling dan diving dengan terumbu karang yang masih alami. Akses menggunakan perahu dari dermaga Bengkulu.',
    facilities: [
      { icon: '🤿', label: 'Snorkeling' },
      { icon: '🚤', label: 'Perahu' },
      { icon: '🪸', label: 'Terumbu karang' },
    ],
    access: { type: 'rental' },
    popular: true,
  },
  {
    slug: 'bukit-kaba',
    name: 'Bukit Kaba',
    area: 'Rejang Lebong',
    category: 'alam',
    emoji: '🌋',
    gradient: 'from-stone-600 to-emerald-700',
    short: 'Gunung berapi dengan kawah belerang yang spektakuler.',
    description:
      'Bukit Kaba di Kabupaten Rejang Lebong sangat populer di kalangan pendaki. Dari puncaknya Anda bisa melihat kawah belerang yang spektakuler dan pemandangan alam sekitar yang memukau.',
    facilities: [
      { icon: '🥾', label: 'Jalur pendakian' },
      { icon: '📸', label: 'Spot foto' },
      { icon: '⛺', label: 'Area camping' },
    ],
    access: { type: 'route', routeId: 'bkl-crp' },
    popular: true,
  },
  {
    slug: 'air-terjun-suban',
    name: 'Air Terjun Suban',
    area: 'Curup, Rejang Lebong',
    category: 'alam',
    emoji: '💧',
    gradient: 'from-teal-500 to-cyan-700',
    short: 'Air terjun sejuk dengan kolam alami untuk berenang.',
    description:
      'Air Terjun Suban di Curup memiliki kolam alami di bawahnya yang bisa digunakan untuk berenang. Suasananya sejuk dan asri, dikelilingi pohon-pohon rindang.',
    facilities: [
      { icon: '🏊', label: 'Kolam alami' },
      { icon: '🌳', label: 'Suasana asri' },
      { icon: '📸', label: 'Spot foto' },
    ],
    access: { type: 'route', routeId: 'bkl-crp' },
  },
  {
    slug: 'kebun-teh-kabawetan',
    name: 'Kebun Teh Kabawetan',
    area: 'Kepahiang',
    category: 'alam',
    emoji: '🍃',
    gradient: 'from-lime-600 to-emerald-700',
    short: 'Hamparan kebun teh di dataran tinggi, sejuk dan fotogenik.',
    description:
      'Hamparan kebun teh hijau di dataran tinggi Kepahiang menawarkan pemandangan yang sangat fotogenik. Udara sejuk dan suasana tenang membuatnya cocok untuk relaksasi dan berfoto.',
    facilities: [
      { icon: '🍵', label: 'Kebun teh' },
      { icon: '📸', label: 'Spot foto' },
      { icon: '🌤️', label: 'Udara sejuk' },
    ],
    access: { type: 'route', routeId: 'bkl-crp' },
  },
];

export const getDestination = (slug: string) => DESTINATIONS.find(d => d.slug === slug);
