import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Daftar Hotel di Bengkulu – Panduan Penginapan Lengkap 2026',
  description:
    'Panduan lengkap hotel di Bengkulu. Temukan penginapan terbaik di Kota Bengkulu, Curup, dan Lebong. Hotel budget hingga bintang, syariah hingga konvensional. Info lengkap!',
  alternates: { canonical: 'https://bengkulutravel.com/daftar-hotel-di-bengkulu' },
};

const hotelCategories = [
  {
    city: 'Kota Bengkulu',
    description: 'Ibukota provinsi dengan pilihan hotel paling lengkap. Dari hotel bintang 4 mewah hingga guest house budget. Dekat Pantai Panjang, Benteng Marlborough, dan pusat bisnis.',
    icon: '🏙️',
    color: 'primary',
    links: [
      { href: '/hotel-di-kota-bengkulu', label: 'Hotel di Kota Bengkulu', desc: 'Budget hingga bintang 4' },
    ],
    priceRange: 'Rp 100.000 – 1.800.000/malam',
    highlights: ['Pantai Panjang', 'Benteng Marlborough', 'Rumah Bung Karno', 'Pusat Bisnis'],
    travelLink: null,
  },
  {
    city: 'Curup (Rejang Lebong)',
    description: 'Kota sejuk di dataran tinggi dengan suasana alam yang memesona. Hotel dan penginapan syariah tersedia banyak. Dekat Air Terjun Suban, Danau Tes, dan Kebun Teh Kabawetan.',
    icon: '🏔️',
    color: 'teal',
    links: [
      { href: '/hotel-di-curup', label: 'Hotel di Curup', desc: 'Semua kategori hotel' },
      { href: '/hotel-syariah-di-curup', label: 'Hotel Syariah di Curup', desc: 'Khusus penginapan halal' },
    ],
    priceRange: 'Rp 150.000 – 700.000/malam',
    highlights: ['Air Terjun Suban', 'Danau Tes', 'Kebun Teh Kabawetan', 'Bukit Kaba'],
    travelLink: { href: '/travel-bengkulu-curup', label: 'Travel Bengkulu–Curup', price: 'Rp 80.000' },
  },
  {
    city: 'Lebong (Muara Aman)',
    description: 'Kabupaten terpencil yang kaya wisata alam. Danau Tes yang memukau dan sungai-sungai jernih menjadi daya tarik utama. Penginapan dengan suasana alam yang autentik.',
    icon: '🌿',
    color: 'green',
    links: [
      { href: '/hotel-di-lebong', label: 'Hotel di Lebong', desc: 'Semua kategori hotel' },
      { href: '/hotel-syariah-di-lebong', label: 'Hotel Syariah di Lebong', desc: 'Khusus penginapan halal' },
    ],
    priceRange: 'Rp 100.000 – 600.000/malam',
    highlights: ['Danau Tes', 'Air Terjun Rimbo Pengadang', 'Sungai Ketahun', 'Tambang Emas Lebong'],
    travelLink: { href: '/travel-bengkulu-lebong', label: 'Travel Bengkulu–Lebong', price: 'Rp 100.000' },
  },
];

const colorMap: Record<string, { card: string; badge: string; btn: string; link: string }> = {
  primary: {
    card: 'border-primary-200 hover:border-primary-400',
    badge: 'bg-primary-100 text-primary-700',
    btn: 'bg-primary-600 hover:bg-primary-700',
    link: 'text-primary-600 hover:text-primary-800',
  },
  teal: {
    card: 'border-teal-200 hover:border-teal-400',
    badge: 'bg-teal-100 text-teal-700',
    btn: 'bg-teal-600 hover:bg-teal-700',
    link: 'text-teal-600 hover:text-teal-800',
  },
  green: {
    card: 'border-green-200 hover:border-green-400',
    badge: 'bg-green-100 text-green-700',
    btn: 'bg-green-600 hover:bg-green-700',
    link: 'text-green-600 hover:text-green-800',
  },
};

export default function DaftarHotelDiBengkulu() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            🏨 Panduan Hotel Bengkulu
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Daftar Hotel di Bengkulu
          </h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-6">
            Panduan lengkap penginapan terbaik di seluruh wilayah Bengkulu. Temukan hotel yang sesuai budget dan kebutuhan Anda di Kota Bengkulu, Curup, maupun Lebong.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['🏙️ Kota Bengkulu', '🏔️ Curup', '🌿 Lebong', '🕌 Hotel Syariah', '💰 Semua Budget'].map(tag => (
              <span key={tag} className="bg-white/20 px-3 py-1.5 rounded-full font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">

        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-slate-800 mb-3">Pilih Kota Tujuan Anda</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Bengkulu memiliki berbagai destinasi menarik dengan pilihan hotel yang beragam. Klik kota tujuan Anda untuk melihat rekomendasi hotel lengkap.
          </p>
        </div>

        {/* Hotel Cards */}
        <div className="space-y-8">
          {hotelCategories.map((cat) => {
            const colors = colorMap[cat.color];
            return (
              <div key={cat.city} className={`border-2 ${colors.card} rounded-2xl p-6 md:p-8 transition-all duration-300 bg-white shadow-sm`}>
                <div className="flex flex-col md:flex-row md:items-start gap-6">

                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{cat.icon}</span>
                      <div>
                        <h3 className="font-display font-bold text-slate-800 text-2xl">{cat.city}</h3>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                          {cat.priceRange}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-4">{cat.description}</p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {cat.highlights.map(h => (
                        <span key={h} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                          📍 {h}
                        </span>
                      ))}
                    </div>

                    {/* Hotel Links */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {cat.links.map(link => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`flex-1 border-2 ${colors.card} rounded-xl p-4 hover:shadow-md transition-all group`}
                        >
                          <p className={`font-bold text-sm ${colors.link} group-hover:underline`}>{link.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right - Travel CTA */}
                  {cat.travelLink && (
                    <div className="md:w-56 shrink-0">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                        <p className="text-xs text-slate-500 font-semibold mb-1">TRANSPORTASI KE SINI</p>
                        <p className="font-bold text-slate-800 text-sm mb-1">{cat.travelLink.label}</p>
                        <p className="text-primary-600 font-bold text-lg mb-3">{cat.travelLink.price}</p>
                        <Link
                          href={cat.travelLink.href}
                          className={`w-full ${colors.btn} text-white font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm`}
                        >
                          🎫 Pesan Travel
                        </Link>
                        <p className="text-xs text-slate-400 mt-2">Door to door · Setiap hari</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="mt-14">
          <h2 className="font-display text-3xl font-bold text-slate-800 text-center mb-8">Tips Memilih Hotel di Bengkulu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '📅', title: 'Booking Lebih Awal', desc: 'Terutama saat musim liburan sekolah, Idul Fitri, dan akhir pekan. Hotel di kawasan Pantai Panjang cepat penuh.' },
              { icon: '📍', title: 'Pilih Lokasi Strategis', desc: 'Tentukan dulu objek wisata yang ingin dikunjungi, lalu pilih hotel yang paling dekat dengan destinasi tersebut.' },
              { icon: '💰', title: 'Bandingkan Harga', desc: 'Cek harga di beberapa platform (Traveloka, Tiket.com, Booking.com) sebelum memutuskan. Harga bisa berbeda signifikan.' },
              { icon: '🕌', title: 'Hotel Syariah', desc: 'Untuk keluarga muslim, pilih hotel syariah yang tersedia di Curup dan Lebong. Pastikan bawa buku nikah saat check-in.' },
              { icon: '🚗', title: 'Rencanakan Transportasi', desc: 'Jika ingin keliling Bengkulu, pastikan sudah pesan travel atau rental mobil sebelum tiba di hotel.' },
              { icon: '⭐', title: 'Cek Ulasan', desc: 'Baca review dari tamu sebelumnya di Google Maps atau OTA. Fokus pada ulasan tentang kebersihan dan pelayanan.' },
            ].map(tip => (
              <div key={tip.title} className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{tip.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Travel CTA */}
        <div className="mt-14 bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-8 text-center text-white">
          <h2 className="font-display text-2xl font-bold mb-3">Butuh Transportasi Antar Kota di Bengkulu?</h2>
          <p className="text-primary-100 mb-6 max-w-xl mx-auto">
            Kami melayani perjalanan antar kota di Bengkulu dengan sistem door to door. Dijemput dari hotel Anda, diantar ke tujuan dengan nyaman!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/travel-bengkulu-curup', label: 'Bengkulu → Curup', price: 'Rp 80.000' },
              { href: '/travel-bengkulu-lebong', label: 'Bengkulu → Lebong', price: 'Rp 100.000' },
              { href: '/travel-bengkulu-palembang', label: 'Bengkulu → Palembang', price: 'Rp 250.000' },
            ].map(r => (
              <Link
                key={r.href}
                href={r.href}
                className="bg-white/20 hover:bg-white/30 text-white px-5 py-3 rounded-xl transition-colors text-sm font-semibold"
              >
                {r.label} <span className="opacity-80">· {r.price}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
