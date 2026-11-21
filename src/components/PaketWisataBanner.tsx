import Image from 'next/image';
import { WA_NUMBER } from '@/lib/whatsapp';

/**
 * Iklan Paket Perjalanan Wisata (Bromo, Yogyakarta, Borobudur) untuk halaman Jelajah.
 * Server component. Tombol WhatsApp memakai tautan wa.me sehingga klik otomatis
 * terhitung oleh WaClickTracker (dashboard admin).
 * Foto: /public/images/paket/paket-wisata-jawa.webp (1600x900).
 */

const wa = (pesan: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo Admin Travel Bengkulu, ${pesan}`)}`;

const places = ['🌋 Bromo', '🏯 Yogyakarta', '🛕 Borobudur'];

const paketAllIn = [
  'Hotel untuk menginap',
  'Tiket masuk tempat wisata',
  'Kendaraan + BBM + sopir',
];

const paketKendaraan = ['Kendaraan', 'BBM', 'Sopir'];

export default function PaketWisataBanner({ className = 'mt-8' }: { className?: string } = {}) {
  return (
    <section id="paket-wisata" aria-label="Paket perjalanan wisata Bromo, Yogyakarta, Borobudur" className={`scroll-mt-20 ${className}`}>
      <div className="grid overflow-hidden rounded-3xl bg-primary-900 shadow-xl shadow-primary-900/15 ring-1 ring-primary-900/10 lg:grid-cols-5">
        {/* Foto (tanpa teks di atasnya) */}
        <div className="relative aspect-video overflow-hidden lg:order-2 lg:col-span-3 lg:aspect-auto lg:min-h-[400px]">
          <Image
            src="/images/paket/paket-wisata-jawa.webp"
            alt="Kolase wisata Tugu Yogyakarta, Candi Borobudur, dan Gunung Bromo dengan mobil Hiace berisi koper siap berangkat"
            fill
            sizes="(max-width: 1024px) 100vw, 700px"
            className="object-cover"
          />
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-primary-800 shadow-md backdrop-blur">
            🧳 Paket Wisata
          </span>
        </div>

        {/* Panel teks + paket */}
        <div className="flex flex-col justify-center bg-gradient-to-br from-primary-800 to-primary-900 p-5 text-white lg:order-1 lg:col-span-2 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">Paket Perjalanan Wisata</p>
          <h2 className="mt-1.5 font-display text-2xl font-bold leading-tight md:text-3xl">
            Bromo, Yogyakarta &amp; Borobudur
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/90">
            Liburan keliling Jawa tanpa ribet. Pilih paket yang sesuai kebutuhan Anda, kami yang antar dengan nyaman.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {places.map(p => (
              <span key={p} className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold">
                {p}
              </span>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {/* All In (disorot) */}
            <div className="relative rounded-2xl bg-white p-4 text-slate-800 shadow-lg">
              <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-0.5 text-[11px] font-bold text-slate-900 shadow">
                ★ Paling Praktis
              </span>
              <h3 className="font-display text-lg font-bold text-primary-800">Paket All In</h3>
              <ul className="mt-2 space-y-1.5 text-[13px]">
                {paketAllIn.map(i => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-600" aria-hidden="true">✓</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <a
                href={wa('saya ingin tanya Paket Wisata All In Bromo, Yogyakarta, Borobudur (sudah termasuk hotel, tiket masuk wisata, kendaraan, BBM, dan sopir)')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-800"
              >
                Tanya Paket All In via WhatsApp <span aria-hidden="true">→</span>
              </a>
            </div>

            {/* Kendaraan saja */}
            <div className="rounded-2xl border border-white/25 bg-white/10 p-4">
              <h3 className="font-display text-lg font-bold">Paket Kendaraan + Sopir + BBM</h3>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/95">
                {paketKendaraan.map(i => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-amber-300" aria-hidden="true">✓</span>
                    {i}
                  </li>
                ))}
              </ul>
              <p className="mt-1.5 text-xs text-white/75">Hotel dan tiket masuk wisata diatur sendiri.</p>
              <a
                href={wa('saya ingin tanya Paket Wisata Bromo, Yogyakarta, Borobudur khusus kendaraan + sopir + BBM')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/40 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Tanya Paket Kendaraan via WhatsApp <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <p className="mt-4 text-xs text-white/75">Harga dan jadwal menyesuaikan jumlah peserta. Hubungi kami via WhatsApp.</p>
        </div>
      </div>
    </section>
  );
}
