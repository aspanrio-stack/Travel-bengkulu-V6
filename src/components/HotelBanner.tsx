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
        className="group relative block aspect-[4/3] overflow-hidden rounded-3xl shadow-xl shadow-primary-900/15 ring-1 ring-primary-900/10 transition-transform active:scale-[0.99] sm:aspect-[16/9] lg:aspect-[21/9]"
      >
        {HOTEL_IMAGE ? (
          <Image
            src={HOTEL_IMAGE}
            alt="Kolam renang hotel dengan kursi santai dan pepohonan kelapa yang hijau"
            fill
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <PlaceholderArt />
        )}

        {/* gradasi agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/30 to-transparent" aria-hidden="true" />

        {/* lencana atas */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-primary-800 shadow-md backdrop-blur">
            🏨 Penginapan Pilihan
          </span>
        </div>
        <span className="absolute right-4 top-4 rotate-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-lg">
          Mulai Rp 100.000/malam
        </span>

        {/* konten bawah */}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Kota Bengkulu · Curup · Lebong</p>
          <h2 className="mt-1 font-display text-2xl font-bold leading-tight md:text-4xl">
            Menginap Nyaman di Bengkulu
          </h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
            Dari guest house hemat sampai hotel bintang 4. Istirahat tenang setelah perjalanan, tinggal pilih yang paling cocok.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {chips.map(c => (
              <span key={c.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                <span aria-hidden="true">{c.icon}</span>
                {c.label}
              </span>
            ))}
            <span className="ml-auto inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary-800 shadow-lg transition-transform group-hover:translate-x-0.5">
              Lihat Hotel <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
