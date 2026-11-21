import Link from 'next/link';
import Image from 'next/image';

/**
 * Galeri kuliner khas Kota Bengkulu untuk halaman Jelajah (/destinasi).
 * Gaya "bento mosaic": foto besar + foto kecil bervariasi, label di atas foto.
 * Foto dari /public/images/makanan (sama dengan halaman /makanan-khas-kota-bengkulu).
 * Server component, tanpa JS tambahan.
 */

const foods = [
  {
    name: 'Pendap',
    emoji: '🐟',
    tag: 'Ikan berbumbu rempah dalam bungkus daun talas',
    src: '/images/makanan/pendap.jpg',
    alt: 'Pendap, makanan khas Bengkulu dari ikan berbumbu daun talas',
    span: 'col-span-2 row-span-2',
    big: true,
  },
  {
    name: 'Bagar Hiu',
    emoji: '🦈',
    tag: 'Gulai ikan hiu bumbu kuning, langka dan khas',
    src: '/images/makanan/bagar-hiu.jpg',
    alt: 'Bagar Hiu, gulai ikan hiu khas Bengkulu',
    span: 'col-span-2',
  },
  {
    name: 'Lempuk Durian',
    emoji: '🍬',
    tag: 'Dodol durian legit',
    src: '/images/makanan/lempuk-durian.jpg',
    alt: 'Lempuk Durian, oleh-oleh khas Bengkulu',
    span: '',
  },
  {
    name: 'Bay Tat',
    emoji: '🌸',
    tag: 'Kue bentuk bunga',
    src: '/images/makanan/bay-tat.jpg',
    alt: 'Bay Tat, kue khas Bengkulu berbentuk bunga',
    span: '',
  },
  {
    name: 'Gulai Kemba Bawang',
    emoji: '🥘',
    tag: 'Kuah santan kental dari batang dan daun bawang',
    src: '/images/makanan/gulai-kemba-bawang.jpg',
    alt: 'Gulai Kemba Bawang, makanan khas Bengkulu',
    span: 'col-span-2',
  },
  {
    name: 'Kue Tat',
    emoji: '🥧',
    tag: 'Kue lebaran renyah isi selai nanas',
    src: '/images/makanan/kue-tat.jpg',
    alt: 'Kue Tat khas Bengkulu',
    span: 'col-span-2',
  },
];

export default function KulinerKhasSection() {
  return (
    <section
      id="kuliner-khas"
      aria-labelledby="kuliner-heading"
      className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-primary-50 px-4 py-10 ring-1 ring-amber-100 md:px-10 md:py-14"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-200/50 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white/80 px-4 py-2 text-sm font-medium text-amber-900">
            🍽️ Kuliner Khas
          </span>
          <h2 id="kuliner-heading" className="mt-4 font-display text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            Cita Rasa <span className="text-amber-700">Kota Bengkulu</span>
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700 md:text-base">
            Sepiring pendap hangat, sepotong lempuk durian yang legit: rasa yang bikin ingin balik lagi.
            Kenali enam kuliner yang paling melekat dengan Bengkulu sebelum atau sesudah perjalanan Anda.
          </p>
        </div>

        <div className="mt-8 grid auto-rows-[8.5rem] grid-cols-2 gap-3 sm:auto-rows-[10rem] md:auto-rows-[12rem] md:grid-cols-4 md:gap-4">
          {foods.map(f => (
            <figure
              key={f.name}
              className={`group relative overflow-hidden rounded-2xl bg-white shadow-md shadow-amber-900/10 ring-4 ring-white ${f.span}`}
            >
              <Image
                src={f.src}
                alt={f.alt}
                fill
                sizes={f.big ? '(max-width: 768px) 100vw, 560px' : '(max-width: 768px) 100vw, 280px'}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" aria-hidden="true" />
              {f.big && (
                <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-900 shadow-lg">
                  ★ WAJIB DICOBA
                </span>
              )}
              <figcaption className="absolute inset-x-0 bottom-0 p-3 text-white md:p-4">
                <p className={`font-display font-bold leading-tight ${f.big ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
                  <span aria-hidden="true">{f.emoji} </span>
                  {f.name}
                </p>
                <p className={`mt-0.5 leading-snug text-white/90 ${f.big ? 'text-sm' : 'text-[11px] md:text-xs'}`}>{f.tag}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/makanan-khas-kota-bengkulu"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-amber-900/15 transition hover:-translate-y-0.5 hover:bg-amber-400"
          >
            Jelajahi Kuliner Khas Bengkulu
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-3 text-xs text-slate-600">Lengkap dengan cerita, rasa, dan tempat membelinya.</p>
        </div>
      </div>
    </section>
  );
}
