import Link from 'next/link';
import Image from 'next/image';

/**
 * Banner hotel (satu gambar besar) untuk halaman Jelajah.
 * Foto: simpan di /public/images/hotel/hotel-bengkulu.webp (disarankan 1600x900, <200 KB),
 * HOTEL_IMAGE di bawah sudah terisi. Jika diubah menjadi null, tampil ilustrasi gradient + kolam sebagai placeholder.
 */
const HOTEL_IMAGE: string | null = '/images/hotel/hotel-bengkulu.webp';

const chips = [
  { icon: '🏊', label: 'Kolam Renang' },
  { icon: '🌿', label: 'Asri & Sejuk' },
  { icon: '🕌', label: 'Pilihan Syariah' },
];

function PlaceholderArt() {
  return (
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f766e" />
          <stop offset="0.55" stopColor="#14b8a6" />
          <stop offset="1" stopColor="#99f6e4" />
        </linearGradient>
        <linearGradient id="hb-pool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#hb-sky)" />
      <circle cx="610" cy="110" r="46" fill="#fde68a" opacity="0.9" />
      {/* gedung hotel */}
      <rect x="70" y="150" width="300" height="150" rx="10" fill="#f8fafc" opacity="0.95" />
      {[0, 1, 2, 3, 4].map(i => (
        <g key={i}>
          <rect x={92 + i * 56} y="172" width="32" height="30" rx="4" fill="#99f6e4" />
          <rect x={92 + i * 56} y="222" width="32" height="30" rx="4" fill="#99f6e4" />
        </g>
      ))}
      {/* kolam */}
      <rect x="0" y="300" width="800" height="150" fill="#d9f99d" opacity="0.5" />
      <rect x="60" y="318" width="520" height="92" rx="40" fill="url(#hb-pool)" />
      <path d="M90 350 q30 -14 60 0 t60 0 t60 0 t60 0 t60 0 t60 0" stroke="#e0f2fe" strokeWidth="4" fill="none" opacity="0.8" />
      <path d="M90 378 q30 -14 60 0 t60 0 t60 0 t60 0 t60 0 t60 0" stroke="#e0f2fe" strokeWidth="4" fill="none" opacity="0.6" />
      {/* pohon kelapa */}
      <g stroke="#065f46" strokeWidth="9" strokeLinecap="round" fill="none">
        <path d="M690 420 C 685 340 700 290 720 240" />
      </g>
      <g fill="#059669">
        <path d="M720 240 q-70 -30 -110 10 q60 -10 110 -10z" />
        <path d="M720 240 q70 -30 110 10 q-60 -10 -110 -10z" />
        <path d="M720 240 q-30 -70 -85 -75 q50 30 85 75z" />
        <path d="M720 240 q30 -70 85 -75 q-50 30 -85 75z" />
      </g>
    </svg>
  );
}

export default function HotelBanner() {
  return (
    <section aria-label="Hotel di Bengkulu" className="mt-8">
      <Link
        href="/daftar-hotel-di-bengkulu"
        className="group grid overflow-hidden rounded-3xl bg-primary-900 shadow-xl shadow-primary-900/15 ring-1 ring-primary-900/10 transition-transform active:scale-[0.99] lg:grid-cols-5"
      >
        {/* Gambar: tanpa teks di atasnya, jadi foto (dan tulisan di dalam foto) tetap bersih */}
        <div className="relative aspect-video overflow-hidden lg:col-span-3 lg:aspect-auto lg:min-h-[340px]">
          {HOTEL_IMAGE ? (
            <Image
              src={HOTEL_IMAGE}
              alt="Kolam renang hotel dengan kursi santai, payung, dan pohon kelapa yang hijau"
              fill
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover object-left-bottom transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <PlaceholderArt />
          )}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-primary-800 shadow-md backdrop-blur">
            🏨 Penginapan Pilihan
          </span>
          <span className="absolute right-3 top-3 rotate-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-lg">
            Mulai Rp 100.000/malam
          </span>
        </div>

        {/* Teks: panel terpisah di bawah gambar (HP) atau di samping (layar lebar) */}
        <div className="flex flex-col justify-center bg-gradient-to-br from-primary-800 to-primary-900 p-5 text-white lg:col-span-2 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Kota Bengkulu · Curup · Lebong</p>
          <h2 className="mt-1.5 font-display text-2xl font-bold leading-tight md:text-3xl">
            Menginap Nyaman di Bengkulu
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/90">
            Dari guest house hemat sampai hotel bintang 4. Istirahat tenang setelah perjalanan, tinggal pilih yang paling cocok.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map(c => (
              <span key={c.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold">
                <span aria-hidden="true">{c.icon}</span>
                {c.label}
              </span>
            ))}
          </div>

          <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary-800 shadow-lg transition-transform group-hover:translate-x-0.5 lg:self-start">
            Lihat Hotel <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </section>
  );
}
