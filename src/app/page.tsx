import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ServiceCard from '@/components/ServiceCard';

export const metadata: Metadata = {
  title: 'Travel Bengkulu | Antar Jemput Door to Door Terpercaya',
  description:
    'Jasa travel Bengkulu terpercaya. Melayani rute Bengkulu-Palembang, Bengkulu-Jambi, Bengkulu-Curup door to door. Tarif terjangkau mulai Rp 80.000. Hubungi kami!',
};

// URL WhatsApp tetap disimpan sebagai fallback atau bantuan
const WA = 'https://wa.me/6285268645461?text=Halo%20Travel%20Bengkulu%2C%20saya%20butuh%20bantuan%20pemesanan';

const services = [
  {
    icon: null,
    title: 'Travel Bengkulu – Palembang',
    description: 'Layanan antar jemput door to door Bengkulu–Palembang. Nyaman, aman, dan tepat waktu.',
    price: 'Rp 250.000',
    href: '/booking?route=Bengkulu-Palembang', // Mengarah ke booking dengan rute
    badge: '🔥 Populer',
    image: '/images/innova.jpg',
  },
  {
    icon: null,
    title: 'Travel Palembang – Bengkulu',
    description: 'Berangkat dari Palembang, diantar langsung ke tujuan Anda di Bengkulu.',
    price: 'Rp 250.000',
    href: '/booking?route=Palembang-Bengkulu',
    image: '/images/avanza.jpg',
  },
  {
    icon: null,
    title: 'Travel Bengkulu – Jambi',
    description: 'Rute Bengkulu–Jambi dengan armada nyaman. Antar jemput di lokasi Anda.',
    price: 'Rp 250.000',
    href: '/booking?route=Bengkulu-Jambi',
    image: '/images/innova.jpg',
  },
  {
    icon: null,
    title: 'Travel Jambi – Bengkulu',
    description: 'Dari Jambi langsung ke Bengkulu. Penjemputan dari rumah atau hotel Anda.',
    price: 'Rp 250.000',
    href: '/booking?route=Jambi-Bengkulu',
    image: '/images/avanza.jpg',
  },
  {
    icon: null,
    title: 'Travel Bengkulu – Curup',
    description: 'Perjalanan singkat Bengkulu–Curup yang nyaman. Cocok untuk keluarga maupun bisnis.',
    price: 'Rp 80.000',
    href: '/booking?route=Bengkulu-Curup',
    badge: '💸 Hemat',
    image: '/images/avanza.jpg',
  },
  {
    icon: null,
    title: 'Rental Mobil Curup',
    description: 'Sewa mobil lepas kunci di Curup. Tersedia Avanza, Innova, HiAce.',
    price: 'Rp 300.000',
    href: '/booking?service=Rental-Mobil',
    image: '/images/hiace.jpg',
  },
  {
    icon: null,
    title: 'Antar Jemput Bandara Curup',
    description: 'Layanan khusus antar jemput ke Bandara Curup. On-time guarantee.',
    price: 'Rp 100.000',
    href: '/booking?service=Bandara',
    image: '/images/innova.jpg',
    badge: '✈️ Airport',
  },
  {
    icon: null,
    title: 'Kirim Paket Bengkulu–Palembang',
    description: 'Pengiriman paket barang dari Bengkulu ke Palembang dan sebaliknya.',
    price: 'Hubungi Kami',
    href: '/booking?service=Kirim-Paket',
    image: '/images/hiace.jpg',
  },
];

const stats = [
  { value: '5+', label: 'Tahun Pengalaman' },
  { value: '1000+', label: 'Pelanggan Puas' },
  { value: '3', label: 'Armada Siap' },
  { value: '24/7', label: 'Layanan Aktif' },
];

const whyUs = [
  {
    icon: '🚗',
    title: 'Door to Door',
    desc: 'Dijemput dari rumah dan diantar langsung ke tujuan tanpa ribet.',
  },
  {
    icon: '✅',
    title: 'Armada Terawat',
    desc: 'Toyota Avanza, Innova, dan HiAce selalu dalam kondisi prima.',
  },
  {
    icon: '💰',
    title: 'Tarif Transparan',
    desc: 'Harga jelas, tidak ada biaya tersembunyi. Tarif terjangkau untuk semua kalangan.',
  },
  {
    icon: '⏰',
    title: 'Tepat Waktu',
    desc: 'Ketepatan waktu adalah prioritas kami. Pesan dan kami datang on-time.',
  },
  {
    icon: '🛡️',
    title: 'Aman & Terpercaya',
    desc: 'Pengemudi berpengalaman dan ramah. Perjalanan Anda aman bersama kami.',
  },
  {
    icon: '📞',
    title: 'Siap 24 Jam',
    desc: 'Layanan pemesanan tersedia 24 jam. Kapan saja kami siap melayani.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full pattern-dots opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-600/30 border border-primary-500/40 text-primary-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Sistem Tiket Otomatis Aktif
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Travel Bengkulu<br />
              <span className="text-primary-400">Terpercaya &</span><br />
              Terjangkau
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl">
              Pesan tiket travel kini lebih mudah dengan pembayaran otomatis. Melayani rute Bengkulu–Palembang, Bengkulu–Jambi, Curup, dan lainnya secara <strong className="text-white">door to door</strong>.
            </p>
            <div className="flex flex-wrap gap-3">
              {/* Ganti ke Link Booking */}
              <Link href="/booking" className="btn-primary text-base px-7 py-3.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Pesan Tiket Sekarang
              </Link>
              <Link href="#layanan" className="border border-white/30 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-xl transition-all inline-flex items-center gap-2">
                Lihat Layanan
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {[
                { label: 'Bengkulu–Palembang', price: 'Rp 250rb' },
                { label: 'Bengkulu–Jambi', price: 'Rp 250rb' },
                { label: 'Bengkulu–Curup', price: 'Rp 80rb' },
              ].map((r) => (
                <div key={r.label} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-2.5">
                  <p className="text-slate-300 text-xs">{r.label}</p>
                  <p className="text-white font-bold text-sm">{r.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="w-80 h-80 bg-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
                <div className="w-60 h-60 bg-primary-600/30 rounded-full flex items-center justify-center border border-primary-500/40">
                  <div className="text-center">
                    <div className="text-8xl mb-2">🚐</div>
                    <p className="text-primary-300 font-semibold text-sm">Armada Kami</p>
                    <p className="text-white text-xs mt-1">Avanza · Innova · HiAce</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3">
                <p className="text-xs text-slate-500">Tarif Mulai</p>
                <p className="text-primary-600 font-bold text-lg">Rp 80.000</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white rounded-2xl shadow-xl px-4 py-3">
                <p className="text-xs opacity-80">Online Booking</p>
                <p className="font-bold text-lg">24 Jam</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur border-t border-white/10">
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

      {/* SERVICES */}
      <section id="layanan" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="badge bg-primary-100 text-primary-700 mb-3">Layanan Kami</span>
            <h2 className="section-title">Rute & Layanan Travel</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Klik salah satu rute di bawah untuk langsung memesan tiket secara otomatis.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s) => (
              <ServiceCard key={s.href} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="badge bg-gold-400/10 text-gold-600 mb-3">Keunggulan Kami</span>
            <h2 className="section-title">Kenapa Pilih Travel Bengkulu?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-300 group">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-slate-800 text-lg mb-2 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Siap Memesan Travel?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            Dapatkan tiket Anda secara instan dengan sistem pembayaran otomatis kami.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="bg-white text-primary-700 hover:bg-slate-100 font-bold px-8 py-4 rounded-xl flex items-center gap-3 transition-all shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Pesan Tiket Sekarang
            </Link>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500/20 hover:bg-green-500/30 text-white border border-green-400/50 font-bold px-8 py-4 rounded-xl flex items-center gap-3 transition-all"
            >
              Hubungi Bantuan (CS)
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
