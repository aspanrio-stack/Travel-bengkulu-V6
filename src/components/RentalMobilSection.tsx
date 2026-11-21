import Link from 'next/link';
import Image from 'next/image';
import { getRateOverrides } from '@/lib/rates-server';
import { applyRentalOverrides } from '@/lib/rates';

/**
 * Section Rental Mobil di beranda: "papan harga" tiga armada (Avanza, Innova, HiAce)
 * dengan dua pilihan sewa (Lepas Kunci / Dengan Sopir), menaut ke /rental-mobil-curup.
 * Server component async: harga ikut tarif dari tab Update Tarif admin (halaman beranda
 * di-revalidate berkala); bila Redis bermasalah otomatis memakai harga default.
 * Fakta mengacu pada halaman rental: Avanza & Innova 7 penumpang, HiAce 12-14 penumpang;
 * lepas kunci butuh SIM A + KTP asli (jaminan), BBM ditanggung penyewa.
 */

const rp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

type Vehicle = 'avanza' | 'innova' | 'hiace';

const fleet: { id: Vehicle; name: string; seat: string; note: string; src: string; w: number; h: number }[] = [
  { id: 'avanza', name: 'Toyota Avanza', seat: '7 penumpang', note: 'Irit dan lincah untuk keluarga kecil', src: '/images/avanza.jpg', w: 801, h: 487 },
  { id: 'innova', name: 'Toyota Innova', seat: '7 penumpang', note: 'Lega dan bertenaga untuk jarak jauh', src: '/images/innova.jpg', w: 800, h: 500 },
  { id: 'hiace', name: 'Toyota HiAce', seat: '12–14 penumpang', note: 'Pas untuk rombongan dan gathering', src: '/images/hiace.jpg', w: 804, h: 503 },
];

const aturan = [
  { icon: '🪪', text: 'Lepas kunci: siapkan KTP dan SIM A asli' },
  { icon: '⛽', text: 'Lepas kunci: BBM ditanggung penyewa' },
  { icon: '🗺️', text: 'Tarif dalam kota dan luar kota berbeda' },
];

export default async function RentalMobilSection() {
  const prices = applyRentalOverrides(await getRateOverrides());

  return (
    <section
      id="rental-mobil"
      aria-labelledby="rental-heading"
      className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-amber-50/40 to-white py-12 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-8 h-64 w-64 rounded-full bg-primary-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Judul */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-900 shadow-sm">
            🚗 Rental Mobil
          </span>
          <h2 id="rental-heading" className="mt-4 font-display text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
            Pilih Mobilnya, <span className="text-primary-700">Tentukan Gaya Sewanya</span>
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600 md:text-base">
            Setir sendiri dengan sewa lepas kunci, atau duduk manis ditemani sopir. Liburan keluarga,
            urusan bisnis, hingga acara kantor, semua ada armadanya.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-primary-700 px-3 py-1.5 text-white">🔑 Lepas Kunci</span>
            <span className="rounded-full bg-amber-400 px-3 py-1.5 text-slate-900">🧑‍✈️ Dengan Sopir</span>
          </div>
        </div>

        {/* Papan harga: geser di HP, tiga kolom di layar lebar */}
        <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {fleet.map(v => {
            const lepas = prices.lepas_kunci.dalam_kota[v.id];
            const sopir = prices.with_driver.dalam_kota[v.id];
            return (
              <li
                key={v.id}
                className="w-[80%] shrink-0 snap-center overflow-hidden rounded-3xl bg-white shadow-lg shadow-amber-900/10 ring-1 ring-amber-100 sm:w-[55%] md:w-auto"
              >
                {/* Foto di atas latar hangat */}
                <div className="relative bg-gradient-to-br from-amber-100 to-primary-50 px-4 pb-2 pt-5">
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-primary-800 shadow">
                    👥 {v.seat}
                  </span>
                  <Image
                    src={v.src}
                    alt={`${v.name}, ${v.seat}`}
                    width={v.w}
                    height={v.h}
                    sizes="(max-width: 768px) 80vw, 380px"
                    className="mx-auto mt-4 h-32 w-auto object-contain mix-blend-multiply md:h-36"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-display text-xl font-bold text-slate-900">{v.name}</h3>
                  <p className="mt-0.5 text-[13px] text-slate-600">{v.note}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-xl bg-primary-50 px-3 py-2.5">
                      <span className="text-xs font-bold text-primary-800">🔑 Lepas Kunci</span>
                      {lepas > 0 ? (
                        <span className="text-sm font-bold text-slate-900">
                          {rp(lepas)}<span className="text-[11px] font-medium text-slate-500">/hari</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-500">Hanya dengan sopir</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2.5">
                      <span className="text-xs font-bold text-amber-900">🧑‍✈️ Dengan Sopir</span>
                      <span className="text-sm font-bold text-slate-900">
                        {rp(sopir)}<span className="text-[11px] font-medium text-slate-500">/hari</span>
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">Harga dalam kota, mulai dari. Luar kota bisa berbeda.</p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Ketentuan singkat */}
        <ul className="mx-auto mt-4 grid max-w-3xl gap-2 text-xs text-slate-700 sm:grid-cols-3">
          {aturan.map(a => (
            <li key={a.text} className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white/80 px-3 py-2">
              <span aria-hidden="true">{a.icon}</span>
              <span>{a.text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 text-center">
          <Link href="/rental-mobil-curup" className="btn-primary">
            Lihat Rental Mobil &amp; Pesan
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-3 text-xs text-slate-500">Armada, ketentuan, dan tarif lengkap ada di halaman rental mobil.</p>
        </div>
      </div>
    </section>
  );
}
