import type { Metadata } from 'next';
import Link from 'next/link';
import FleetGallery from '@/components/FleetGallery';
import DestinationCard from '@/components/DestinationCard';
import HomeGreeting from '@/components/HomeGreeting';
import HomeBookingCard from '@/components/HomeBookingCard';
import CustomerReviewsCard from '@/components/CustomerReviewsCard';
import { DESTINATIONS } from '@/lib/destinations';
import { getRouteById, formatPrice } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Travel Bengkulu | Antar Jemput Door to Door – Curup, Palembang, Jambi',
  description:
    'Travel Bengkulu melayani antar jemput door to door rute Bengkulu–Palembang, Bengkulu–Jambi, dan Bengkulu–Curup. Armada bersih, pengemudi berpengalaman, harga pas di kantong. Pesan sekarang via WhatsApp!',
};

// Beranda statis (ISR): dibangun ulang paling cepat tiap 5 menit → ulasan baru / yang disembunyikan ikut tampil/hilang.
export const revalidate = 300;

const WA = 'https://wa.me/6282374497929?text=Halo%20Travel%20Bengkulu%2C%20saya%20ingin%20pesan%20travel';

const quickCategories = [
  { icon: '🚐', label: 'Travel', href: '/travel-bengkulu', bg: 'bg-sky-50' },
  { icon: '🚗', label: 'Rental', href: '/rental-mobil-curup', bg: 'bg-amber-50' },
  { icon: '✈️', label: 'Bandara', href: '/antar-jemput-bandara-curup', bg: 'bg-indigo-50' },
  { icon: '📦', label: 'Paket', href: '/kirim-paket-bengkulu-palembang', bg: 'bg-orange-50' },
];

const stats = [
  { value: '5+', label: 'Tahun Melayani' },
  { value: '1000+', label: 'Penumpang Puas' },
  { value: '3', label: 'Armada Siap Jalan' },
  { value: '24/7', label: 'Bisa Dipesan' },
];

const whyUs = [
  { icon: '🚗', title: 'Door to Door', desc: 'Kami jemput langsung dari rumah Anda dan antar sampai ke tujuan, tanpa ribet naik-turun kendaraan.' },
  { icon: '✅', title: 'Armada Terawat', desc: 'Toyota Avanza, Innova, dan HiAce kami servis rutin agar kondisi selalu prima di setiap perjalanan.' },
  { icon: '💰', title: 'Tarif Jelas, Tanpa Kejutan', desc: 'Harga sudah pasti sejak awal. Tidak ada biaya tambahan yang muncul di tengah jalan.' },
  { icon: '⏰', title: 'Berangkat Sesuai Jadwal', desc: 'Ketepatan waktu bukan sekadar janji. Kami tahu waktu Anda berharga.' },
  { icon: '🛡️', title: 'Pengemudi Berpengalaman', desc: 'Semua pengemudi kami hafal rute, ramah, dan mengutamakan keselamatan selama perjalanan.' },
  { icon: '📞', title: 'Pesan Kapan Saja', desc: 'Mau berangkat subuh atau tengah malam? Pemesanan via WhatsApp tersedia 24 jam penuh.' },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex flex-col justify-center min-h-0 md:min-h-[90vh] bg-slate-900 overflow-hidden rounded-b-[2rem] md:rounded-none">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900"></div>
          {/* Foto latar ikon kota — 2 file: public/images/hero-bengkulu-mobile.webp (HP) & hero-bengkulu-desktop.webp (≥768px).
              <picture> memastikan browser hanya mengunduh satu. */}
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/hero-bengkulu-desktop.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-bengkulu-mobile.webp"
              alt=""
              width={720}
              height={1234}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-bottom md:object-center"
            />
          </picture>
          {/* Lapisan gelap: pekat di area teks, menipis di bawah supaya ikon kota tetap terlihat */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/90 via-primary-900/75 to-primary-900/30 md:bg-gradient-to-r md:from-primary-900/95 md:via-primary-900/80 md:to-primary-900/35"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full pattern-dots opacity-10"></div>
          <div className="hidden md:block absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="hidden md:block absolute top-1/4 right-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 pt-5 pb-20 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
          {/* Baris atas (HP): nama brand + akun — navbar atas disembunyikan di HP */}
          <div className="md:hidden lg:col-span-2 flex items-center justify-between">
            <div className="leading-tight">
              <p className="font-display text-xl font-bold tracking-tight text-white">BENGKULU</p>
              <p className="-mt-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-300">Travel.COM</p>
            </div>
            <HomeGreeting />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-600/30 border border-primary-500/40 text-primary-300 text-xs md:text-sm font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-3 md:mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Siap Jemput 24 Jam
            </div>
            <h1 className="font-display text-[28px] md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-3 md:mb-5 [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
              Dari Bengkulu<br className="hidden md:block" />{' '}
              <span className="text-primary-400">Diantar Sampai</span><br className="hidden md:block" />{' '}
              ke Tujuan Anda
            </h1>
            <p className="md:hidden text-slate-200 text-[15px] leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
              Travel <strong className="text-white">door to door</strong> Bengkulu · Palembang · Jambi · Curup. Pesan tiket dalam hitungan detik.
            </p>
            <p className="hidden md:block text-slate-200 text-lg leading-relaxed mb-8 max-w-xl [text-shadow:0_1px_8px_rgba(0,0,0,0.4)]">
              Layanan travel <strong className="text-white">door to door</strong> yang menjemput dari rumah Anda dan mengantar langsung ke tempat tujuan. Melayani rute Bengkulu–Palembang, Bengkulu–Jambi, dan Bengkulu–Curup.
            </p>
            <div className="hidden md:flex flex-wrap gap-3">
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-wa text-base px-7 py-3.5 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Pesan Sekarang
              </a>
              <Link href="/travel-bengkulu" className="border border-white/30 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-xl transition-all inline-flex items-center gap-2">
                Cek Rute & Tarif
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="w-80 h-80 bg-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
                <div className="w-60 h-60 bg-primary-600/30 rounded-full flex items-center justify-center border border-primary-500/40">
                  <div className="text-center">
                    <div className="text-8xl mb-2 leading-none">🚐</div>
                    <p className="text-primary-300 font-semibold text-sm">Armada Kami</p>
                    <p className="text-white text-xs mt-1">Avanza · Innova · HiAce</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block md:absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-white font-bold text-xl">{s.value}</p>
                <p className="text-slate-400 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KARTU PESAN CEPAT — paling atas, tepat di bawah hero */}
      <HomeBookingCard />

      {/* QUICK START — search, kategori, destinasi populer, penawaran (mobile-first) */}
      <section aria-label="Mulai jelajah" className="relative z-10 bg-slate-50 pt-4 pb-6 md:pt-12">
        <div className="max-w-7xl mx-auto px-4">
          <form action="/destinasi" role="search" className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4 shadow-lg shadow-slate-300/40 ring-1 ring-slate-100">
            <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" /></svg>
            <label htmlFor="home-q" className="sr-only">Cari destinasi</label>
            <input id="home-q" name="q" placeholder="Cari destinasi wisata Bengkulu…" className="min-w-0 flex-1 bg-transparent py-2 text-slate-800 placeholder:text-slate-500 focus:outline-none" />
            <button className="rounded-xl bg-primary-700 px-4 py-2 text-sm font-semibold text-white">Cari</button>
          </form>

          <ul className="mt-4 grid grid-cols-4 gap-2">
            {quickCategories.map(c => (
              <li key={c.label}>
                <Link href={c.href} className="flex flex-col items-center gap-1 py-1 transition-transform active:scale-90">
                  <span aria-hidden className="text-[32px] leading-none sm:text-4xl">{c.icon}</span>
                  <span className="text-[11px] font-semibold text-slate-700 sm:text-xs">{c.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ARMADA — gambar mobil, tepat di bawah kolom cari & ikon */}
      <FleetGallery />

      {/* DESTINASI POPULER */}
      <section aria-label="Destinasi populer" className="bg-slate-50 pb-4 pt-8 md:pb-10 md:pt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-slate-800">Destinasi Populer</h2>
            <Link href="/destinasi" className="text-sm font-semibold text-primary-700">Lihat semua</Link>
          </div>
          <div className="-mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-3">
            {DESTINATIONS.filter(d => d.popular).map(d => <DestinationCard key={d.slug} d={d} compact />)}
          </div>

          <div className="mt-3 flex items-center justify-between gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 to-primary-900 p-5 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-100">Rute Hemat</p>
              <p className="mt-1 font-display text-lg font-bold">Bengkulu – Curup</p>
              <p className="text-sm text-primary-100">Mulai {formatPrice(getRouteById('bkl-crp')?.price ?? 100000)} / orang, berangkat setiap jam</p>
            </div>
            <Link href="/pesan?rute=bkl-crp" className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-primary-800">Pesan</Link>
          </div>
        </div>
      </section>

      {/* KENAPA PILIH KAMI */}
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full pattern-dots opacity-10"></div>
          <div className="hidden md:block absolute -top-24 -right-24 w-[28rem] h-[28rem] bg-primary-400/20 rounded-full blur-3xl"></div>
          <div className="hidden md:block absolute bottom-0 left-1/4 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14">
            <span className="inline-flex items-center gap-2 bg-primary-600/30 border border-primary-500/40 text-primary-300 text-sm font-medium px-4 py-2 rounded-full mb-5">
              Kenapa Travel Bengkulu
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Nyaman di Jalan,<br />Tenang Sampai Tujuan
            </h2>
            <p className="italic text-primary-200 text-lg underline decoration-primary-400/50 underline-offset-4">
              Door to Door, Bukan Sekadar Janji
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {whyUs.map((item) => (
              <div key={item.title} className="card flex items-start gap-3.5 p-4 md:block md:p-6 bg-white/95">
                <div className="w-11 h-11 md:w-12 md:h-12 shrink-0 rounded-xl bg-primary-50 flex items-center justify-center text-xl md:text-2xl md:mb-4">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base md:text-lg mb-0.5 md:mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-[13px] md:text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ULASAN PELANGGAN — otomatis hilang jika belum ada ulasan terpublikasi */}
      <CustomerReviewsCard />
    </>
  );
}
