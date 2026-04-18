import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Hotel di Kota Bengkulu – Rekomendasi Penginapan Terbaik 2025',
  description:
    'Daftar hotel terbaik di Kota Bengkulu. Dari hotel budget hingga bintang 4. Lokasi strategis dekat Pantai Panjang, Benteng Marlborough, dan pusat kota. Info lengkap!',
  alternates: { canonical: 'https://bengkulutravel.com/hotel-di-kota-bengkulu' },
};

export default function HotelDiKotaBengkulu() {
  return (
    <ArticleLayout
      title="Hotel di Kota Bengkulu"
      description="Rekomendasi hotel terbaik di Kota Bengkulu untuk wisata, bisnis, dan transit. Lengkap dengan info harga, fasilitas, dan lokasi."
      breadcrumbs={[
        { label: 'Hotel di Bengkulu', href: '/daftar-hotel-di-bengkulu' },
        { label: 'Hotel di Kota Bengkulu' },
      ]}
      badge="🏨 Panduan Menginap"
    >
      <p>
        <strong>Kota Bengkulu</strong> sebagai ibukota Provinsi Bengkulu menawarkan pilihan hotel yang paling beragam dibanding daerah lain di Bengkulu. Dari hotel budget yang ramah kantong hingga hotel bintang 4 dengan fasilitas mewah, semuanya tersedia di kota yang kaya sejarah ini. Dengan pesona Pantai Panjang, Benteng Marlborough, dan berbagai destinasi wisata lainnya, menginap di Kota Bengkulu adalah pengalaman yang tak terlupakan.
      </p>

      <p>
        Baru tiba di Kota Bengkulu dan butuh transportasi lanjutan ke daerah lain? Kami melayani{' '}
        <Link href="/travel-bengkulu-curup" className="text-primary-600 font-semibold hover:underline">
          travel Bengkulu–Curup
        </Link>{' '}
        (Rp 80.000) dan{' '}
        <Link href="/travel-bengkulu-lebong" className="text-primary-600 font-semibold hover:underline">
          travel Bengkulu–Lebong
        </Link>{' '}
        (Rp 100.000) dengan sistem door to door dari hotel Anda!
      </p>

      <h2>Rekomendasi Hotel di Kota Bengkulu</h2>

      <h3>1. Grage Hotel Bengkulu ⭐⭐⭐⭐</h3>
      <p>
        Hotel bintang 4 paling bergengsi di Kota Bengkulu. Terletak strategis di pusat kota dengan pemandangan laut yang memukau. Fasilitas lengkap termasuk kolam renang, spa, restoran fine dining, dan ballroom untuk acara besar. Pilihan utama untuk tamu VIP, pejabat, dan wisatawan premium.
      </p>
      <ul>
        <li>Lokasi: Jl. Pantai Nala, dekat Pantai Panjang</li>
        <li>Fasilitas: AC, WiFi, kolam renang, spa, restoran, ballroom, parkir</li>
        <li>Harga: Rp 600.000 – 1.500.000/malam</li>
        <li>Cocok untuk: tamu VIP, honeymoon, acara pernikahan</li>
      </ul>

      <h3>2. Hotel Nala Seaside Bengkulu ⭐⭐⭐</h3>
      <p>
        Hotel bintang 3 dengan lokasi premium di tepi Pantai Panjang. Dari jendela kamar, tamu bisa menikmati sunrise dan sunset Samudera Hindia yang spektakuler. Restoran seafoodnya terkenal dengan cita rasa segar langsung dari laut Bengkulu. Sangat populer di kalangan wisatawan domestik dan mancanegara.
      </p>
      <ul>
        <li>Lokasi: Tepi Pantai Panjang, Bengkulu</li>
        <li>Fasilitas: AC, WiFi, restoran seafood, pemandangan pantai</li>
        <li>Harga: Rp 400.000 – 800.000/malam</li>
        <li>Cocok untuk: wisatawan, pasangan, keluarga</li>
      </ul>

      <h3>3. Hotel Santika Bengkulu ⭐⭐⭐⭐</h3>
      <p>
        Jaringan hotel nasional terpercaya yang hadir di Bengkulu dengan standar internasional. Kamar-kamar modern yang luas dengan fasilitas bisnis lengkap. Cocok untuk tamu korporat yang membutuhkan fasilitas meeting dan business center. Layanan profesional dengan standar Santika Hotels yang sudah terjamin kualitasnya.
      </p>
      <ul>
        <li>Lokasi: Pusat bisnis Kota Bengkulu</li>
        <li>Fasilitas: AC, WiFi, kolam renang, meeting room, restoran, gym</li>
        <li>Harga: Rp 500.000 – 1.200.000/malam</li>
        <li>Cocok untuk: tamu bisnis dan korporat</li>
      </ul>

      <h3>4. Hotel Horizon Bengkulu ⭐⭐⭐</h3>
      <p>
        Hotel bintang 3 dengan harga yang lebih terjangkau namun tetap menawarkan kenyamanan optimal. Letaknya di pusat kota memudahkan akses ke berbagai objek wisata sejarah seperti Benteng Marlborough dan Rumah Pengasingan Bung Karno. Restoran menyajikan masakan Melayu dan internasional yang lezat.
      </p>
      <ul>
        <li>Lokasi: Pusat Kota Bengkulu, dekat objek wisata sejarah</li>
        <li>Fasilitas: AC, WiFi, restoran, ruang meeting, parkir</li>
        <li>Harga: Rp 300.000 – 600.000/malam</li>
        <li>Cocok untuk: wisatawan sejarah, keluarga, tamu bisnis</li>
      </ul>

      <h3>5. Grand Zuri Bengkulu ⭐⭐⭐⭐</h3>
      <p>
        Hotel grand dengan desain modern yang mewah. Salah satu hotel terbesar di Bengkulu dengan kapasitas ballroom yang mampu menampung ribuan tamu. Sering menjadi venue untuk acara pemerintahan, konferensi nasional, dan pernikahan mewah. Pelayanan prima dengan staf yang terlatih secara profesional.
      </p>
      <ul>
        <li>Lokasi: Jalan strategis Kota Bengkulu</li>
        <li>Fasilitas: AC, WiFi, kolam renang, spa, ballroom, restoran, gym</li>
        <li>Harga: Rp 700.000 – 1.800.000/malam</li>
        <li>Cocok untuk: acara besar, tamu premium, konferensi</li>
      </ul>

      <h3>6. Hotel Bougenville Bengkulu ⭐⭐</h3>
      <p>
        Hotel menengah yang menjadi favorit wisatawan dengan budget terbatas. Kamar bersih dan nyaman dengan harga yang sangat bersahabat. Letaknya dekat dengan Pasar Panorama dan Terminal Bengkulu, memudahkan akses transportasi ke berbagai penjuru kota. Sarapan pagi sudah termasuk dalam tarif kamar.
      </p>
      <ul>
        <li>Lokasi: Dekat Pasar Panorama, Bengkulu</li>
        <li>Fasilitas: AC, WiFi, sarapan included, parkir</li>
        <li>Harga: Rp 200.000 – 400.000/malam</li>
        <li>Cocok untuk: wisatawan budget dan backpacker</li>
      </ul>

      <h3>7. Guest House Pantai Panjang</h3>
      <p>
        Pilihan penginapan budget paling populer di kalangan backpacker dan wisatawan muda. Jaraknya hanya 5 menit berjalan kaki dari Pantai Panjang yang ikonik. Suasana santai dan komunal dengan fasilitas dapur bersama dan ruang tamu yang nyaman untuk bersosialisasi sesama traveler.
      </p>
      <ul>
        <li>Lokasi: 5 menit dari Pantai Panjang</li>
        <li>Fasilitas: AC/kipas, WiFi, dapur bersama, ruang santai</li>
        <li>Harga: Rp 100.000 – 250.000/malam</li>
        <li>Cocok untuk: backpacker dan wisatawan muda</li>
      </ul>

      <h2>Perbandingan Harga Hotel di Kota Bengkulu</h2>
      <table>
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Harga Per Malam</th>
            <th>Contoh Hotel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Budget / Backpacker</td>
            <td>Rp 100.000 – 250.000</td>
            <td>Guest House, Hostel</td>
          </tr>
          <tr>
            <td>Hotel Menengah ⭐⭐</td>
            <td>Rp 200.000 – 450.000</td>
            <td>Hotel Bougenville</td>
          </tr>
          <tr>
            <td>Hotel Bintang 3 ⭐⭐⭐</td>
            <td>Rp 300.000 – 800.000</td>
            <td>Hotel Horizon, Nala Seaside</td>
          </tr>
          <tr>
            <td>Hotel Bintang 4 ⭐⭐⭐⭐</td>
            <td>Rp 600.000 – 1.800.000</td>
            <td>Grage Hotel, Grand Zuri, Santika</td>
          </tr>
        </tbody>
      </table>

      <h2>Lokasi Strategis Hotel di Kota Bengkulu</h2>
      <p>
        Kota Bengkulu memiliki beberapa kawasan strategis untuk menginap:
      </p>
      <ul>
        <li><strong>Kawasan Pantai Panjang</strong> — untuk menikmati pantai dan sunrise setiap pagi</li>
        <li><strong>Pusat Kota (Simpang Lima)</strong> — akses mudah ke semua destinasi wisata</li>
        <li><strong>Kawasan Bisnis</strong> — cocok untuk tamu korporat dan dinas</li>
        <li><strong>Dekat Bandara</strong> — praktis untuk tamu yang terbang pagi atau malam</li>
      </ul>

      <h2>Wisata Wajib dari Hotel di Kota Bengkulu</h2>
      <ul>
        <li><strong>Pantai Panjang</strong> — pantai 7 km paling ikonik di Bengkulu</li>
        <li><strong>Benteng Marlborough</strong> — peninggalan kolonial Inggris abad ke-18</li>
        <li><strong>Rumah Pengasingan Bung Karno</strong> — museum bersejarah wajib kunjung</li>
        <li><strong>Danau Dendam Tak Sudah</strong> — danau legenda dengan habitat burung migran</li>
        <li><strong>Pulau Tikus</strong> — snorkeling dan diving dengan terumbu karang alami</li>
      </ul>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 my-6">
        <h3 className="text-primary-800 font-bold text-lg mb-3">🚗 Perlu Transportasi dari Bengkulu?</h3>
        <p className="text-slate-700 mb-4">
          Setelah menginap di Kota Bengkulu, rencanakan perjalanan Anda ke daerah lain di Bengkulu dengan mudah dan nyaman bersama kami:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/travel-bengkulu-curup" className="flex items-center gap-2 bg-white border border-primary-200 hover:bg-primary-50 px-4 py-3 rounded-xl transition-colors">
            <span className="text-xl">🚗</span>
            <div>
              <p className="font-bold text-primary-700 text-sm">Ke Curup</p>
              <p className="text-xs text-slate-500">Rp 80.000 · 2–2,5 jam</p>
            </div>
          </Link>
          <Link href="/travel-bengkulu-lebong" className="flex items-center gap-2 bg-white border border-primary-200 hover:bg-primary-50 px-4 py-3 rounded-xl transition-colors">
            <span className="text-xl">🚗</span>
            <div>
              <p className="font-bold text-primary-700 text-sm">Ke Lebong</p>
              <p className="text-xs text-slate-500">Rp 100.000 · 3–4 jam</p>
            </div>
          </Link>
          <Link href="/travel-bengkulu-palembang" className="flex items-center gap-2 bg-white border border-primary-200 hover:bg-primary-50 px-4 py-3 rounded-xl transition-colors">
            <span className="text-xl">🚗</span>
            <div>
              <p className="font-bold text-primary-700 text-sm">Ke Palembang</p>
              <p className="text-xs text-slate-500">Rp 250.000 · 8–10 jam</p>
            </div>
          </Link>
          <Link href="/travel-bengkulu-jambi" className="flex items-center gap-2 bg-white border border-primary-200 hover:bg-primary-50 px-4 py-3 rounded-xl transition-colors">
            <span className="text-xl">🚗</span>
            <div>
              <p className="font-bold text-primary-700 text-sm">Ke Jambi</p>
              <p className="text-xs text-slate-500">Rp 250.000 · 9–12 jam</p>
            </div>
          </Link>
        </div>
      </div>

      <h2>FAQ Hotel di Kota Bengkulu</h2>

      <h3>Hotel mana yang paling dekat dengan Pantai Panjang Bengkulu?</h3>
      <p>Hotel Nala Seaside dan beberapa guest house di kawasan Pantai Nala adalah yang paling dekat dengan Pantai Panjang. Dari hotel ini Anda bisa berjalan kaki langsung ke pantai dalam 5–10 menit.</p>

      <h3>Apakah ada hotel budget di Kota Bengkulu?</h3>
      <p>Ada banyak! Mulai dari Rp 100.000 per malam untuk guest house dan hostel. Kawasan sekitar Pantai Panjang dan Pasar Panorama banyak pilihan penginapan budget yang bersih dan nyaman.</p>

      <h3>Bagaimana cara dari hotel di Bengkulu ke Curup atau Lebong?</h3>
      <p>Gunakan layanan travel kami — <Link href="/travel-bengkulu-curup" className="text-primary-600 hover:underline">ke Curup Rp 80.000</Link> atau <Link href="/travel-bengkulu-lebong" className="text-primary-600 hover:underline">ke Lebong Rp 100.000</Link>. Dijemput langsung dari hotel Anda!</p>
    </ArticleLayout>
  );
}
