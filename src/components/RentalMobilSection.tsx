import Link from 'next/link';
import Image from 'next/image';
import { RENTAL_PRICES } from '@/lib/rental-config';

/**
 * Iklan Rental Mobil untuk halaman Jelajah (/destinasi), menaut ke /rental-mobil-curup.
 * Server component. Foto armada dari /public/images (avanza, innova, hiace).
 * Fakta mengacu pada halaman rental: Avanza & Innova 7 penumpang, HiAce 12-14 penumpang;
 * lepas kunci (SIM A + KTP asli sebagai jaminan, BBM ditanggung penyewa) atau dengan sopir.
 */

const hargaMulai = RENTAL_PRICES.lepas_kunci.dalam_kota.avanza.toLocaleString('id-ID');

const fleet = [
  { name: 'Toyota Avanza', seat: '7 penumpang', src: '/images/avanza.jpg', w: 801, h: 487, note: 'Irit & lincah' },
  { name: 'Toyota Innova', seat: '7 penumpang', src: '/images/innova.jpg', w: 800, h: 500, note: 'Lega & bertenaga' },
  { name: 'Toyota HiAce', seat: '12–14 penumpang', src: '/images/hiace.jpg', w: 804, h: 503, note: 'Untuk rombongan' },
];

const perks = [
  { icon: '🔑', title: 'Lepas Kunci atau Dengan Sopir', desc: 'Setir sendiri sesuka hati, atau duduk manis dan biarkan sopir kami yang mengantar.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Muat 7 sampai 14 Penumpang', desc: 'Dari liburan keluarga kecil sampai gathering dan rombongan besar.' },
  { icon: '🏔️', title: 'Cocok ke Mana Saja', desc: 'Wisata, urusan bisnis, hingga acara keluarga di Curup dan Rejang Lebong.' },
  { icon: '💬', title: 'Pesan Gampang', desc: 'Pesan lewat website atau tanya dulu via WhatsApp, bayar tunai atau QRIS.' },
];

const caraLepasKunci = [
  { title: 'Pilih armada & tanggal', desc: 'Tentukan unit dan jadwal sewa yang Anda butuhkan.' },
  { title: 'Isi data & lokasi ambil', desc: 'Lengkapi data diri dan tempat pengambilan unit.' },
  { title: 'Siapkan KTP & SIM A asli', desc: 'Unit diserahkan, KTP asli jadi jaminan selama sewa.' },
];

const caraSopir = [
  { title: 'Pilih armada & tujuan', desc: 'Sebutkan unit, tanggal, dan tujuan perjalanan Anda.' },
  { title: 'Pesan lewat website atau WhatsApp', desc: 'Tarif dalam kota dan luar kota berbeda, admin siap membantu.' },
  { title: 'Duduk manis, berangkat', desc: 'Sopir kami menjemput dan mengantar Anda sampai tujuan.' },
];

function Steps({ items, tone }: { items: { title: string; desc: string }[]; tone: 'teal' | 'amber' }) {
  const dot = tone === 'teal' ? 'bg-primary-700 text-white' : 'bg-amber-400 text-slate-900';
  return (
    <ol className="relative mt-4 space-y-4">
      {items.map((s, i) => (
        <li key={s.title} className="relative flex gap-3">
          {i < items.length - 1 && (
            <span className="absolute left-[15px] top-8 h-[calc(100%-0.5rem)] border-l-2 border-dashed border-slate-300" aria-hidden="true" />
          )}
          <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${dot}`}>
            {i + 1}
          </span>
          <div>
            <p className="font-bold text-slate-800">{s.title}</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{s.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Mockup kartu "Pilih Armada" dengan foto asli tiga unit */
function FleetMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary-200/60 via-primary-50 to-amber-100/70 blur-2xl" aria-hidden="true" />
      <div className="-rotate-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-primary-900/15 transition-transform duration-500 hover:rotate-0">
        <div className="flex items-center justify-between">
          <p className="font-display text-base font-bold text-slate-800">Pilih Armada Anda</p>
          <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">3 pilihan</span>
        </div>
        <ul className="mt-3 space-y-2.5">
          {fleet.map(f => (
            <li key={f.name} className="flex items-center gap-3 rounded-xl border border-primary-100 bg-primary-50/50 p-2">
              <Image
                src={f.src}
                alt={`${f.name}, ${f.seat}`}
                width={f.w}
                height={f.h}
                sizes="96px"
                className="h-14 w-24 shrink-0 rounded-lg bg-white object-contain"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">{f.name}</p>
                <p className="text-[11px] text-slate-600">{f.seat} · {f.note}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-center text-[11px] font-semibold text-amber-900">
          🔑 Lepas kunci mulai Rp {hargaMulai}/hari
        </p>
      </div>
      <span className="absolute -right-2 -top-3 rotate-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-900 shadow-lg">
        🚗 SIAP JALAN
      </span>
    </div>
  );
}

export default function RentalMobilSection() {
  return (
    <section id="rental-mobil" aria-labelledby="rental-heading" className="relative mt-10 overflow-hidden rounded-3xl bg-white px-4 py-10 shadow-sm ring-1 ring-slate-100 md:px-10 md:py-14">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-100/60 blur-3xl" />
      </div>

      <div className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
              🚗 Rental Mobil
            </span>
            <h2 id="rental-heading" className="mt-4 font-display text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              Sewa Mobil Sesuka Hati,{' '}
              <span className="text-primary-700">Bebas Jalan ke Mana Saja</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600 md:text-base">
              Liburan keluarga, urusan bisnis, atau acara kantor? Pilih Avanza, Innova, atau HiAce
              sesuai jumlah penumpang, lalu jalan kapan pun Anda siap. Mau setir sendiri atau
              ditemani sopir, semuanya bisa diatur. Mulai dari Rp {hargaMulai} per hari untuk
              sewa lepas kunci.
            </p>

            <ul className="mt-6 space-y-3">
              {perks.map(t => (
                <li key={t.title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xl" aria-hidden="true">{t.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{t.title}</h3>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{t.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <FleetMockup />
        </div>

        <h3 className="mb-6 mt-12 text-center font-display text-xl font-bold text-slate-900 md:text-2xl">
          Dua Cara Sewa, Pilih yang Paling Cocok
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-5">
            <p className="inline-block rounded-full bg-primary-700 px-3 py-1 text-xs font-bold text-white">Cara 1 · Lepas Kunci</p>
            <Steps items={caraLepasKunci} tone="teal" />
            <p className="mt-4 rounded-lg bg-white/80 p-2.5 text-xs leading-relaxed text-slate-600">
              ⛽ BBM ditanggung penyewa, mobil dikembalikan dalam kondisi bersih.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <p className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">Cara 2 · Dengan Sopir</p>
            <Steps items={caraSopir} tone="amber" />
            <p className="mt-4 rounded-lg bg-white/80 p-2.5 text-xs leading-relaxed text-slate-600">
              🧭 Pas untuk yang ingin santai dan tidak hafal jalan.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/rental-mobil-curup" className="btn-primary">
            Lihat Rental Mobil &amp; Harga
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-3 text-xs text-slate-500">Armada, ketentuan sewa, dan tarif lengkap ada di halaman rental mobil.</p>
        </div>
      </div>
    </section>
  );
}
