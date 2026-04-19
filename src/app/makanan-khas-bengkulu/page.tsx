import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Makanan Khas Bengkulu – Panduan Kuliner Lengkap 2025',
  description:
    'Panduan lengkap makanan khas Bengkulu. Temukan kuliner otentik dari Kota Bengkulu, Curup Rejang Lebong, dan Lebong. Dari Pendap, Tempoyak, Lemea, hingga Kopi Robusta Lebong!',
  alternates: { canonical: 'https://bengkulutravel.com/makanan-khas-bengkulu' },
};

const regions = [
  {
    name: 'Kota Bengkulu',
    slug: 'makanan-khas-kota-bengkulu',
    icon: '🏙️',
    desc: 'Kuliner ikonik yang mencerminkan perpaduan budaya Melayu dan sejarah kolonial Bengkulu. Pendap, Bagar Hiu, hingga Lempuk Durian yang legendaris.',
    image: '/images/makanan/pendap.jpg',
    imageAlt: 'Pendap makanan khas Kota Bengkulu',
    foods: ['Pendap', 'Bagar Hiu', 'Lempuk Durian', 'Bay Tat', 'Gulai Kemba Bawang', 'Kue Tat'],
    travelLinks: [],
    color: 'primary',
  },
  {
    name: 'Curup, Rejang Lebong',
    slug: 'makanan-khas-curup',
    icon: '🏔️',
    desc: 'Cita rasa autentik suku Rejang yang unik dan menggugah selera. Tempoyak durian fermentasi, Lemea rebung bambu, dan Kopi Arabika dataran tinggi.',
    image: '/images/makanan/tempoyak.jpg',
    imageAlt: 'Tempoyak makanan khas Curup Rejang Lebong',
    foods: ['Tempoyak', 'Lemea', 'Gulai Kemba Bawang', 'Pindang Patin', 'Kopi Arabika Curup', 'Bolu Koja'],
    travelLinks: [
      { href: '/travel-bengkulu-curup', label: 'Travel Bengkulu → Curup', price: 'Rp 80.000' },
    ],
    color: 'teal',
  },
  {
    name: 'Lebong (Muara Aman)',
    slug: 'makanan-khas-lebong',
    icon: '🌿',
    desc: 'Kuliner paling autentik dan belum banyak dikenal — produk alam murni dari hutan Lebong. Kopi Robusta terbaik, Madu Hutan murni, dan Gulai Ikan Sungai Ketahun.',
    image: '/images/makanan/kopi-robusta-lebong.jpg',
    imageAlt: 'Kopi Robusta Lebong makanan khas Kabupaten Lebong',
    foods: ['Kopi Robusta Lebong', 'Madu Hutan Lebong', 'Gulai Ikan Sungai Ketahun', 'Tempoyak Lebong', 'Keripik Rebung', 'Lemea Lebong'],
    travelLinks: [
      { href: '/travel-bengkulu-lebong', label: 'Travel Bengkulu → Lebong', price: 'Rp 100.000' },
    ],
    color: 'green',
  },
];

const colorMap: Record<string, { btn: string; badge: string; border: string }> = {
  primary: { btn: 'bg-primary-600 hover:bg-primary-700', badge: 'bg-primary-100 text-primary-700', border: 'border-primary-200' },
  teal: { btn: 'bg-teal-600 hover:bg-teal-700', badge: 'bg-teal-100 text-teal-700', border: 'border-teal-200' },
  green: { btn: 'bg-green-600 hover:bg-green-700', badge: 'bg-green-100 text-green-700', border: 'border-green-200' },
};

export default function MakananKhasBengkulu() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-700 via-orange-600 to-amber-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            🍽️ Panduan Kuliner Bengkulu
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Makanan Khas Bengkulu
          </h1>
          <p className="text-orange-100 text-lg max-w-2xl mx-auto mb-6">
            Jelajahi kekayaan kuliner otentik Bengkulu dari tiga wilayah berbeda. Setiap daerah punya cita rasa uniknya sendiri yang tak akan Anda temukan di tempat lain!
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['🏙️ Kota Bengkulu', '🏔️ Curup Rejang Lebong', '🌿 Lebong', '🍜 Kuliner Tradisional', '☕ Kopi Bengkulu'].map(tag => (
              <span key={tag} className="bg-white/20 px-3 py-1.5 rounded-full font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">

        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-slate-800 mb-3">Pilih Daerah Kuliner Anda</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Bengkulu menyimpan kekayaan kuliner yang luar biasa beragam. Dari pesisir pantai hingga dataran tinggi, setiap daerah memiliki makanan khas yang mencerminkan budaya dan kearifan lokal masyarakatnya.
          </p>
        </div>

        {/* Region Cards */}
        <div className="space-y-10">
          {regions.map((region) => {
            const colors = colorMap[region.color];
            return (
              <div key={region.slug} className={`border-2 ${colors.border} rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all`}>
                {/* Image */}
                <div className="relative h-56 md:h-72 w-full bg-slate-100">
                  <Image
                    src={region.image}
                    alt={region.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 900px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-3xl">{region.icon}</span>
                    <h3 className="font-display font-bold text-white text-2xl mt-1">{region.name}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <p className="text-slate-600 leading-relaxed mb-5">{region.desc}</p>

                  {/* Foods list */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Kuliner Khas</p>
                    <div className="flex flex-wrap gap-2">
                      {region.foods.map(food => (
                        <span key={food} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${colors.badge}`}>
                          🍽️ {food}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/${region.slug}`}
                      className={`flex-1 ${colors.btn} text-white font-bold px-5 py-3 rounded-xl transition-colors text-center`}
                    >
                      Lihat Semua Kuliner {region.name} →
                    </Link>
                    {region.travelLinks.map(tl => (
                      <Link
                        key={tl.href}
                        href={tl.href}
                        className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-3 rounded-xl transition-colors text-center text-sm"
                      >
                        🎫 {tl.label} · {tl.price}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kuliner Populer */}
        <div className="mt-14">
          <h2 className="font-display text-3xl font-bold text-slate-800 text-center mb-3">
            Kuliner Paling Populer di Bengkulu
          </h2>
          <p className="text-slate-500 text-center mb-8">Yang paling sering dicari dan direkomendasikan wisatawan</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Pendap', region: 'Kota Bengkulu', emoji: '🐟', href: '/makanan-khas-kota-bengkulu' },
              { name: 'Tempoyak', region: 'Curup / Lebong', emoji: '🍈', href: '/makanan-khas-curup' },
              { name: 'Lemea', region: 'Curup / Lebong', emoji: '🎋', href: '/makanan-khas-curup' },
              { name: 'Lempuk Durian', region: 'Kota Bengkulu', emoji: '🍬', href: '/makanan-khas-kota-bengkulu' },
              { name: 'Kopi Robusta', region: 'Lebong', emoji: '☕', href: '/makanan-khas-lebong' },
              { name: 'Madu Hutan', region: 'Lebong', emoji: '🍯', href: '/makanan-khas-lebong' },
            ].map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="bg-white border border-slate-100 hover:border-orange-200 hover:shadow-md rounded-2xl p-4 text-center transition-all group"
              >
                <div className="text-4xl mb-2">{item.emoji}</div>
                <p className="font-bold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">{item.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.region}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Travel CTA */}
        <div className="mt-14 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-8 text-center text-white">
          <h2 className="font-display text-2xl font-bold mb-3">Siap Wisata Kuliner Keliling Bengkulu? 🍽️</h2>
          <p className="text-orange-100 mb-6 max-w-xl mx-auto">
            Jangan biarkan transportasi jadi hambatan! Kami siap mengantarkan Anda menjelajahi kuliner autentik dari Kota Bengkulu, Curup, hingga Lebong dengan nyaman dan terjangkau.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/travel-bengkulu-curup" className="bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors">
              🚗 Ke Curup — Rp 80.000
            </Link>
            <Link href="/travel-bengkulu-lebong" className="bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors">
              🚗 Ke Lebong — Rp 100.000
            </Link>
            <Link href="/pesan" className="bg-white text-orange-600 hover:bg-orange-50 px-5 py-3 rounded-xl font-bold text-sm transition-colors">
              🎫 Pesan Sekarang
            </Link>
          </div>
        </div>

        {/* Navbar update info */}
        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Lihat juga: <Link href="/makanan-khas-kota-bengkulu" className="text-orange-500 hover:underline">Makanan Khas Kota Bengkulu</Link> · <Link href="/makanan-khas-curup" className="text-orange-500 hover:underline">Makanan Khas Curup</Link> · <Link href="/makanan-khas-lebong" className="text-orange-500 hover:underline">Makanan Khas Lebong</Link></p>
        </div>

      </div>
    </div>
  );
}
