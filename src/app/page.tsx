import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ServiceCard from '@/components/ServiceCard';

export const metadata: Metadata = {
  title: 'Travel Bengkulu | Antar Jemput Door to Door Terpercaya',
  description:
    'Jasa travel Bengkulu terpercaya. Melayani rute Bengkulu-Palembang, Bengkulu-Jambi, Bengkulu-Curup door to door. Tarif terjangkau mulai Rp 80.000. Hubungi kami!',
};

const WA = 'https://wa.me/6285268645461?text=Halo%20Travel%20Bengkulu%2C%20saya%20ingin%20pesan%20travel';

const services = [
  {
    icon: null,
    title: 'Travel Bengkulu – Palembang',
    description: 'Layanan antar jemput door to door Bengkulu–Palembang. Nyaman, aman, dan tepat waktu.',
    price: 'Rp 250.000',
    href: '/travel-bengkulu-palembang',
    badge: '🔥 Populer',
    image: '/images/innova.jpg',
  },
  {
    icon: null,
    title: 'Travel Palembang – Bengkulu',
    description: 'Berangkat dari Palembang, diantar langsung ke tujuan Anda di Bengkulu.',
    price: 'Rp 250.000',
    href: '/travel-palembang-bengkulu',
    image: '/images/avanza.jpg',
  },
  {
    icon: null,
    title: 'Travel Bengkulu – Jambi',
    description: 'Rute Bengkulu–Jambi dengan armada nyaman. Antar jemput di lokasi Anda.',
    price: 'Rp 250.000',
    href: '/travel-bengkulu-jambi',
    image: '/images/innova.jpg',
  },
  {
    icon: null,
    title: 'Travel Jambi – Bengkulu',
    description: 'Dari Jambi langsung ke Bengkulu. Penjemputan dari rumah atau hotel Anda.',
    price: 'Rp 250.000',
    href: '/travel-jambi-bengkulu',
    image: '/images/avanza.jpg',
  },
  {
    icon: null,
    title: 'Travel Bengkulu – Curup',
    description: 'Perjalanan singkat Bengkulu–Curup yang nyaman. Cocok untuk keluarga maupun bisnis.',
    price: 'Rp 80.000',
    href: '/travel-bengkulu-curup',
    badge: '💸 Hemat',
    image: '/images/avanza.jpg',
  },
  {
    icon: null,
    title: 'Rental Mobil Curup',
    description: 'Sewa mobil lepas kunci di Curup. Tersedia Avanza, Innova, HiAce.',
    price: 'Rp 300.000',
    href: '/rental-mobil-curup',
    image: '/images/hiace.jpg',
  },
  {
    icon: null,
    title: 'Antar Jemput Bandara Curup',
    description: 'Layanan khusus antar jemput ke Bandara Curup. On-time guarantee.',
    price: 'Rp 100.000',
    href: '/antar-jemput-bandara-curup',
    image: '/images/innova.jpg',
    badge: '✈️ Airport',
  },
  {
    icon: null,
    title: 'Kirim Paket Bengkulu–Palembang',
    description: 'Pengiriman paket barang dari Bengkulu ke Palembang dan sebaliknya.',
    price: 'Hubungi Kami',
    href: '/kirim-paket-bengkulu-palembang',
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
    desc: 'Layanan pemesanan tersedia 24 jam via WhatsApp. Kapan saja siap melayani.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-900 overflow-hidden">
        {/* Background decorative */}
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
              Siap Melayani 24 Jam
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Travel Bengkulu<br />
              <span className="text-primary-400">Terpercaya &</span><br />
              Terjangkau
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl">
              Layanan travel antar jemput <strong className="text-white">door to door</strong> dengan armada nyaman. Melayani rute Bengkulu–Palembang, Bengkulu–Jambi, Bengkulu–Curup, dan berbagai destinasi lainnya.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={WA} target="_blank" rel="noopener noreferrer" className="btn-wa text-base px-7 py-3.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Pesan via WhatsApp
              </a>
              <Link href="#layanan" className="border border-white/30 text-white hover:bg-white/10 font-semibold px-7 py-3.5 rounded-xl transition-all inline-flex items-center gap-2">
                Lihat Layanan
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>

            {/* Quick info */}
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

          {/* Right side car visual */}
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
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl px-4 py-3">
                <p className="text-xs text-slate-500">Tarif Mulai</p>
                <p className="text-primary-600 font-bold text-lg">Rp 80.000</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white rounded-2xl shadow-xl px-4 py-3">
                <p className="text-xs opacity-80">Siap Melayani</p>
                <p className="font-bold text-lg">24 Jam</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
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
              Berbagai pilihan rute dan layanan travel untuk kebutuhan perjalanan Anda di Bengkulu dan sekitarnya.
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
            <p className="section-subtitle max-w-xl mx-auto">
              Kami hadir untuk memberikan pengalaman perjalanan terbaik dengan harga yang terjangkau.
            </p>
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

      {/* ARMADA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="badge bg-primary-100 text-primary-700 mb-3">Armada</span>
            <h2 className="section-title">Kendaraan Kami</h2>
            <p className="section-subtitle">Tiga pilihan armada nyaman dan terawat untuk perjalanan Anda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Toyota Avanza',
                type: 'MPV · 7 Penumpang',
                desc: 'Cocok untuk perjalanan keluarga atau grup kecil. Kabin luas, irit BBM, dan nyaman untuk rute dalam kota maupun antar provinsi.',
                img: '/images/avanza.jpg',
                specs: ['7 Penumpang', 'AC Double Blower', 'Bagasi Luas'],
              },
              {
                name: 'Toyota Innova',
                type: 'MPV Premium · 7 Penumpang',
                desc: 'Kenyamanan premium untuk perjalanan jauh. Suspensi lebih halus, kabin lebih lega, pilihan terbaik untuk perjalanan antar kota.',
                img: '/images/innova.jpg',
                specs: ['7 Penumpang', 'Suspensi Premium', 'Kabin Lega'],
                featured: true,
              },
              {
                name: 'Toyota HiAce',
                type: 'Van · 12–14 Penumpang',
                desc: 'Ideal untuk rombongan besar atau grup keluarga. Kapasitas penumpang besar dengan ruang bagasi ekstra luas.',
                img: '/images/hiace.jpg',
                specs: ['12–14 Penumpang', 'Kabin Tinggi', 'Bagasi Ekstra'],
              },
            ].map((car) => (
              <div key={car.name} className={`card overflow-hidden relative group ${car.featured ? 'ring-2 ring-primary-500' : ''}`}>
                {car.featured && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                    ⭐ Paling Populer
                  </div>
                )}
                {/* Photo */}
                <div className="relative h-52 overflow-hidden bg-slate-200">
                  <Image
                    src={car.img}
                    alt={car.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
                    {car.specs.map((s) => (
                      <span key={s} className="bg-white/90 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display font-bold text-slate-800 text-xl mb-0.5">{car.name}</h3>
                  <p className="text-primary-600 text-sm font-semibold mb-3">{car.type}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{car.desc}</p>
                </div>
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
            Hubungi kami sekarang via WhatsApp untuk konfirmasi jadwal dan ketersediaan. Kami siap melayani 24 jam!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-400 hover:bg-green-300 text-slate-900 font-bold px-8 py-4 rounded-xl flex items-center gap-3 transition-all shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat WhatsApp Sekarang
            </a>
            <a
              href="tel:+6285268645461"
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-3 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0852-6864-5461
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
