import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Hotel di Curup – Rekomendasi Penginapan Terbaik di Rejang Lebong 2025',
  description:
    'Daftar hotel terbaik di Curup Rejang Lebong. Dari hotel budget hingga bintang. Lokasi strategis, fasilitas lengkap, cocok untuk wisata dan bisnis. Info lengkap di sini!',
  alternates: { canonical: 'https://bengkulutravel.com/hotel-di-curup' },
};

export default function HotelDiCurup() {
  return (
    <ArticleLayout
      title="Hotel di Curup Rejang Lebong"
      description="Rekomendasi hotel terbaik di Curup untuk wisata, bisnis, maupun transit. Dari penginapan budget hingga hotel berbintang."
      breadcrumbs={[{ label: 'Artikel' }, { label: 'Hotel di Curup' }]}
      badge="🏨 Panduan Menginap"
    >
      <p>
        <strong>Curup</strong>, ibukota Kabupaten Rejang Lebong, adalah kota yang sejuk dan nyaman di dataran tinggi Bengkulu. Setiap tahun ribuan wisatawan, pebisnis, dan pelancong transit berkunjung ke kota ini. Tidak heran jika pilihan <strong>hotel di Curup</strong> cukup beragam, mulai dari penginapan budget ramah kantong hingga hotel dengan fasilitas lengkap.
      </p>

      <p>
        Jika Anda baru tiba dari perjalanan jauh dan membutuhkan transportasi ke hotel, kami menyediakan layanan{' '}
        <Link href="/travel-bengkulu-curup" className="text-primary-600 font-semibold hover:underline">
          travel Bengkulu–Curup
        </Link>{' '}
        dengan tarif hanya <strong>Rp 80.000 per orang</strong>, langsung diantar ke depan hotel Anda.
      </p>

      <h2>Rekomendasi Hotel di Curup</h2>

      <h3>1. Hotel Gading Cempaka Curup</h3>
      <p>
        Salah satu hotel paling populer di Curup dengan lokasi yang strategis di pusat kota. Fasilitas lengkap termasuk restoran, ruang meeting, dan area parkir yang luas. Cocok untuk tamu bisnis maupun keluarga yang ingin menikmati kenyamanan di Curup.
      </p>
      <ul>
        <li>Lokasi: Pusat Kota Curup</li>
        <li>Fasilitas: AC, WiFi, restoran, parkir luas</li>
        <li>Cocok untuk: keluarga dan tamu bisnis</li>
      </ul>

      <h3>2. Hotel Kepahyang Indah</h3>
      <p>
        Hotel dengan pemandangan perbukitan yang indah. Kamar-kamarnya bersih dan nyaman dengan harga yang terjangkau. Pilihan tepat bagi Anda yang ingin menikmati suasana alam Curup yang sejuk sambil tetap mendapatkan fasilitas hotel yang memadai.
      </p>
      <ul>
        <li>Lokasi: Pinggiran Curup, dekat objek wisata</li>
        <li>Fasilitas: AC, WiFi, pemandangan alam</li>
        <li>Cocok untuk: wisatawan dan keluarga</li>
      </ul>

      <h3>3. Penginapan Bumi Rafflesia</h3>
      <p>
        Penginapan bertemakan alam dengan konsep yang unik, terinspirasi dari bunga Rafflesia Arnoldi yang merupakan ikon Bengkulu. Suasana alami dan tenang membuat tamu betah berlama-lama. Harga terjangkau dengan fasilitas yang cukup memadai.
      </p>
      <ul>
        <li>Lokasi: Area wisata Curup</li>
        <li>Fasilitas: WiFi, sarapan tersedia, suasana alam</li>
        <li>Cocok untuk: backpacker dan wisatawan</li>
      </ul>

      <h3>4. Hotel Bintang Curup</h3>
      <p>
        Hotel dengan standar bintang yang menawarkan kenyamanan lebih dibanding penginapan biasa. Tersedia kamar standar hingga suite dengan fasilitas modern. Restoran hotelnya menyajikan masakan Melayu dan Nusantara yang lezat.
      </p>
      <ul>
        <li>Lokasi: Jalan utama Curup</li>
        <li>Fasilitas: AC, WiFi, restoran, kolam renang</li>
        <li>Cocok untuk: keluarga dan tamu VIP</li>
      </ul>

      <h3>5. Guest House Curup Sejuk</h3>
      <p>
        Pilihan budget terbaik di Curup. Bersih, nyaman, dan harga sangat terjangkau. Cocok untuk backpacker atau pelancong yang butuh istirahat singkat sebelum melanjutkan perjalanan. Letaknya dekat terminal dan pusat oleh-oleh.
      </p>
      <ul>
        <li>Lokasi: Dekat terminal Curup</li>
        <li>Fasilitas: AC/kipas, WiFi, kamar mandi dalam</li>
        <li>Cocok untuk: backpacker dan transit</li>
      </ul>

      <h2>Tips Memilih Hotel di Curup</h2>
      <ul>
        <li><strong>Sesuaikan dengan budget</strong> — Curup memiliki pilihan dari Rp 150.000 hingga Rp 600.000 per malam</li>
        <li><strong>Perhatikan lokasi</strong> — pilih hotel dekat objek wisata yang ingin dikunjungi</li>
        <li><strong>Booking lebih awal</strong> — terutama saat akhir pekan dan musim liburan sekolah</li>
        <li><strong>Cek ulasan</strong> — lihat review di Google Maps atau platform booking online</li>
        <li><strong>Tanya fasilitas parkir</strong> — jika membawa kendaraan pribadi</li>
      </ul>

      <h2>Objek Wisata Dekat Hotel di Curup</h2>
      <p>
        Menginap di Curup memberikan kemudahan untuk mengunjungi berbagai destinasi wisata menarik:
      </p>
      <ul>
        <li><strong>Air Terjun Suban</strong> — hanya 15 menit dari pusat kota</li>
        <li><strong>Danau Tes</strong> — danau indah dengan pemandangan pegunungan</li>
        <li><strong>Kebun Teh Kabawetan</strong> — hamparan teh hijau yang fotogenik</li>
        <li><strong>Bukit Kaba</strong> — gunung berapi aktif yang populer untuk pendakian</li>
        <li><strong>Pasar Tradisional Curup</strong> — berburu kuliner dan oleh-oleh khas Rejang</li>
      </ul>

      <h2>Transportasi dari dan ke Curup</h2>
      <p>
        Setelah check-in di hotel favorit Anda di Curup, pastikan transportasi perjalanan Anda sudah terencana dengan baik. Kami menyediakan dua layanan transportasi unggulan:
      </p>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 my-4">
        <h3 className="text-primary-800 font-bold text-lg mb-3">🚗 Layanan Travel dari Curup</h3>
        <p className="text-slate-700 mb-4">
          Butuh transportasi nyaman dari Curup ke Bengkulu atau sebaliknya? Layanan{' '}
          <Link href="/travel-bengkulu-curup" className="text-primary-600 font-semibold hover:underline">
            travel Bengkulu–Curup
          </Link>{' '}
          kami hadir dengan tarif terjangkau <strong>Rp 80.000/orang</strong>, dijemput dari hotel Anda dan diantar door to door ke tujuan. Tidak perlu repot cari angkutan umum atau naik ojek ke terminal!
        </p>
        <Link
          href="/travel-bengkulu-curup"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          🎫 Pesan Travel Bengkulu–Curup
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 my-4">
        <h3 className="text-blue-800 font-bold text-lg mb-3">✈️ Antar Jemput Bandara dari Curup</h3>
        <p className="text-slate-700 mb-4">
          Jika perjalanan Anda dilanjutkan dengan penerbangan dari Bandara Fatmawati Soekarno Bengkulu, manfaatkan layanan{' '}
          <Link href="/antar-jemput-bandara-curup" className="text-blue-600 font-semibold hover:underline">
            antar jemput bandara dari Curup
          </Link>{' '}
          kami. Dijemput tepat waktu dari hotel Anda di Curup, diantar langsung ke bandara tanpa khawatir ketinggalan pesawat!
        </p>
        <Link
          href="/antar-jemput-bandara-curup"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          ✈️ Pesan Antar Jemput Bandara
        </Link>
      </div>

      <h2>FAQ Hotel di Curup</h2>

      <h3>Berapa kisaran harga hotel di Curup?</h3>
      <p>
        Harga hotel di Curup cukup variatif. Untuk penginapan budget mulai dari <strong>Rp 150.000 per malam</strong>, hotel menengah Rp 250.000–400.000, dan hotel berbintang bisa mencapai Rp 500.000–700.000 per malam.
      </p>

      <h3>Apakah hotel di Curup mudah ditemukan?</h3>
      <p>
        Ya, Curup memiliki cukup banyak pilihan penginapan yang tersebar di berbagai lokasi. Anda bisa memesan melalui platform booking online atau langsung datang ke hotel.
      </p>

      <h3>Bagaimana cara ke Curup dari Bengkulu?</h3>
      <p>
        Cara termudah adalah menggunakan layanan{' '}
        <Link href="/travel-bengkulu-curup" className="text-primary-600 hover:underline">
          travel Bengkulu–Curup
        </Link>{' '}
        dengan tarif Rp 80.000 per orang. Perjalanan hanya 2–2,5 jam dan Anda langsung diantar ke hotel tujuan.
      </p>

      <h3>Apakah ada transportasi dari hotel ke bandara Bengkulu?</h3>
      <p>
        Ada! Kami menyediakan layanan{' '}
        <Link href="/antar-jemput-bandara-curup" className="text-primary-600 hover:underline">
          antar jemput bandara dari Curup
        </Link>{' '}
        yang bisa menjemput langsung dari hotel Anda menuju Bandara Fatmawati Soekarno Bengkulu.
      </p>
    </ArticleLayout>
  );
}
