import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Bengkulu – Jasa Antar Jemput Door to Door Terpercaya',
  description:
    'Travel Bengkulu terpercaya. Melayani Bengkulu–Palembang, Bengkulu–Jambi, Bengkulu–Curup. Antar jemput door to door mulai Rp 80.000. Pesan WA 0852-6864-5461.',
  alternates: { canonical: 'https://www.bengkulutravel.com/travel-bengkulu' },
};

const routes = [
  { from: 'Bengkulu', to: 'Palembang', price: 'Rp 250.000', duration: '8–10 jam', href: '/travel-bengkulu-palembang', img: '/images/innova.jpg' },
  { from: 'Bengkulu', to: 'Jambi', price: 'Rp 250.000', duration: '9–12 jam', href: '/travel-bengkulu-jambi', img: '/images/avanza.jpg' },
  { from: 'Bengkulu', to: 'Curup', price: 'Rp 80.000', duration: '2–2,5 jam', href: '/travel-bengkulu-curup', img: '/images/avanza.jpg' },
  { from: 'Palembang', to: 'Bengkulu', price: 'Rp 250.000', duration: '8–10 jam', href: '/travel-palembang-bengkulu', img: '/images/innova.jpg' },
  { from: 'Jambi', to: 'Bengkulu', price: 'Rp 250.000', duration: '9–12 jam', href: '/travel-jambi-bengkulu', img: '/images/hiace.jpg' },
];

export default function TravelBengkulu() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Beroperasi 24 Jam Setiap Hari
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Travel Bengkulu<br />Terpercaya & Terjangkau
          </h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            Jasa travel antar jemput <strong className="text-white">door to door</strong> dari dan ke Bengkulu. Armada Toyota Avanza, Innova & HiAce. Tarif mulai <strong className="text-white">Rp 80.000</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/6285268645461?text=Halo%20saya%20ingin%20pesan%20travel%20Bengkulu"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-400 hover:bg-green-300 text-slate-900 font-bold px-7 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pesan Sekarang
            </a>
            <a href="tel:+6285268645461" className="bg-white/20 hover:bg-white/30 text-white font-semibold px-7 py-3.5 rounded-xl transition-all">
              📞 0852-6864-5461
            </a>
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-slate-800 mb-2">Rute Travel Bengkulu</h2>
            <p className="text-slate-500">Pilih rute perjalanan Anda</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {routes.map((r) => (
              <Link key={r.href} href={r.href} className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-40 overflow-hidden">
                  <Image src={r.img} alt={`Travel ${r.from} ${r.to}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-bold text-lg leading-tight">{r.from} → {r.to}</p>
                    <p className="text-slate-300 text-xs">{r.duration}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Tarif per orang</p>
                    <p className="text-primary-600 font-bold text-xl">{r.price}</p>
                  </div>
                  <span className="text-primary-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    Detail →
                  </span>
                </div>
              </Link>
            ))}

            {/* Rental Card */}
            <Link href="/rental-mobil-curup" className="card overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-40 overflow-hidden">
                <Image src="/images/hiace.jpg" alt="Rental Mobil Curup" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-bold text-lg">Rental Mobil Curup</p>
                  <p className="text-slate-300 text-xs">Lepas kunci</p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Mulai dari</p>
                  <p className="text-primary-600 font-bold text-xl">Rp 300.000</p>
                </div>
                <span className="text-primary-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Detail →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-slate-800 text-center mb-10">Kenapa Pilih Travel Bengkulu Kami?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: '🚗', title: 'Door to Door', desc: 'Dijemput dari rumah, diantar ke tujuan' },
              { icon: '💰', title: 'Tarif Terjangkau', desc: 'Mulai Rp 80.000, harga pasti tanpa biaya tersembunyi' },
              { icon: '⏰', title: 'Tepat Waktu', desc: 'Pengemudi selalu hadir on-time' },
              { icon: '🛡️', title: 'Aman & Terpercaya', desc: 'Ratusan penumpang sudah membuktikan' },
              { icon: '📞', title: 'Siap 24 Jam', desc: 'Pesan kapan saja via WhatsApp' },
              { icon: '🚙', title: 'Armada Terawat', desc: 'Avanza, Innova, HiAce selalu prima' },
            ].map((item) => (
              <div key={item.title} className="text-center p-4 rounded-2xl hover:bg-primary-50 transition-colors">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-slate-800 text-center mb-10">FAQ Travel Bengkulu</h2>
          <div className="space-y-5 prose-article">
            <h3>Apa itu travel Bengkulu?</h3>
            <p>Travel Bengkulu adalah layanan transportasi antar kota dengan sistem door to door — penumpang dijemput dari alamat asal dan diantar langsung ke tujuan tanpa perlu ke terminal.</p>

            <h3>Rute mana saja yang dilayani travel Bengkulu?</h3>
            <p>Kami melayani rute Bengkulu–Palembang, Bengkulu–Jambi, Bengkulu–Curup, serta rute sebaliknya. Tersedia juga rental mobil dan antar jemput bandara Curup.</p>

            <h3>Berapa tarif travel Bengkulu?</h3>
            <p>Tarif bervariasi tergantung rute: Bengkulu–Curup Rp 80.000, Bengkulu–Palembang dan Bengkulu–Jambi Rp 250.000 per orang.</p>

            <h3>Bagaimana cara pesan travel Bengkulu?</h3>
            <p>Cukup hubungi kami via WhatsApp di <strong>0852-6864-5461</strong>. Beritahukan rute, tanggal, jumlah penumpang, dan alamat jemput. Kami konfirmasi dalam hitungan menit.</p>

            <h3>Armada apa yang digunakan?</h3>
            <p>Kami menggunakan Toyota Avanza, Toyota Innova, dan Toyota HiAce — semua dalam kondisi terawat dan ber-AC.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
