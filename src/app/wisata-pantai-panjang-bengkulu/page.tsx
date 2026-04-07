import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Wisata Pantai Panjang Bengkulu – Pantai Terpanjang di Bengkulu',
  description:
    'Panduan wisata Pantai Panjang Bengkulu: lokasi, tiket masuk, fasilitas, kuliner, dan tips berkunjung. Pantai eksotis dengan pasir putih sepanjang 7 km.',
  alternates: { canonical: 'https://bengkulutravel.com/wisata-pantai-panjang-bengkulu' },
};

export default function WisataPantaiPanjangBengkulu() {
  return (
    <ArticleLayout
      title="Wisata Pantai Panjang Bengkulu"
      description="Panduan lengkap mengunjungi Pantai Panjang Bengkulu, ikon wisata pantai terbaik di Bengkulu."
      breadcrumbs={[{ label: 'Artikel' }, { label: 'Wisata Pantai Panjang' }]}
      badge="🏖️ Destinasi Wisata"
    >
      <p>
        <strong>Pantai Panjang Bengkulu</strong> adalah destinasi wisata pantai paling ikonik di Bengkulu. Membentang sepanjang lebih dari <strong>7 kilometer</strong> dari ujung ke ujung, pantai ini menawarkan keindahan alam yang menakjubkan dengan pasir yang bersih dan deburan ombak Samudera Hindia yang khas.
      </p>

      <h2>Lokasi dan Cara Mencapai Pantai Panjang</h2>
      <p>
        Pantai Panjang terletak di bagian barat Kota Bengkulu, sangat mudah dijangkau dari pusat kota hanya dalam 10–15 menit berkendara. Alamat lengkapnya berada di Jl. Pantai Nala, Kota Bengkulu.
      </p>
      <p>
        Cara mencapai Pantai Panjang:
      </p>
      <ul>
        <li>Dari pusat kota Bengkulu: ±10–15 menit berkendara</li>
        <li>Dari Bandara Fatmawati Soekarno: ±20 menit berkendara</li>
        <li>Bisa menggunakan ojek online, travel, atau rental mobil</li>
      </ul>

      <h2>Daya Tarik Pantai Panjang</h2>
      <ul>
        <li>
          <strong>Garis Pantai Panjang</strong> – Membentang lebih dari 7 km, memberikan ruang yang luas untuk berjalan-jalan, berlari, atau sekadar bersantai.
        </li>
        <li>
          <strong>Pasir Putih Halus</strong> – Tekstur pasir yang halus nyaman untuk duduk atau bermain di tepi pantai.
        </li>
        <li>
          <strong>Sunset yang Memukau</strong> – Matahari terbenam di ufuk barat Samudera Hindia menciptakan pemandangan langit yang spektakuler.
        </li>
        <li>
          <strong>Hutan Wisata</strong> – Di sepanjang pantai terdapat jalur hutan pinus yang cocok untuk trekking ringan.
        </li>
        <li>
          <strong>Ombak untuk Surfing</strong> – Beberapa titik di Pantai Panjang memiliki ombak yang cocok untuk surfing bagi pemula.
        </li>
      </ul>

      <h2>Fasilitas di Pantai Panjang</h2>
      <ul>
        <li>Area parkir yang luas</li>
        <li>Warung makan dan restoran seafood</li>
        <li>Toilet umum dan kamar bilas</li>
        <li>Penyewaan payung dan tikar pantai</li>
        <li>Area bermain anak</li>
        <li>Penginapan dan hotel di sepanjang jalan pantai</li>
        <li>Spot foto yang Instagramable</li>
      </ul>

      <h2>Kuliner Khas di Sekitar Pantai Panjang</h2>
      <p>
        Mengunjungi Pantai Panjang tidak lengkap tanpa mencicipi kuliner khasnya:
      </p>
      <ul>
        <li><strong>Ikan Bakar dan Seafood Segar</strong> – Banyak warung makan seafood dengan harga terjangkau</li>
        <li><strong>Pendap</strong> – Ikan yang dibungkus daun talas khas Bengkulu</li>
        <li><strong>Lempuk Durian</strong> – Oleh-oleh khas Bengkulu yang wajib dibawa pulang</li>
        <li><strong>Es Cendol dan Minuman Kelapa Muda</strong> – Segar dinikmati setelah berjemur di pantai</li>
      </ul>

      <h2>Tiket Masuk dan Jam Buka</h2>
      <table>
        <thead>
          <tr>
            <th>Keterangan</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tiket Masuk</td>
            <td>Gratis (area pantai umum)</td>
          </tr>
          <tr>
            <td>Parkir Kendaraan</td>
            <td>Rp 5.000 – Rp 10.000</td>
          </tr>
          <tr>
            <td>Jam Buka</td>
            <td>24 jam (paling ramai sore–malam)</td>
          </tr>
          <tr>
            <td>Waktu Terbaik</td>
            <td>Sore hari (untuk sunset)</td>
          </tr>
        </tbody>
      </table>

      <h2>Tips Berkunjung ke Pantai Panjang</h2>
      <ul>
        <li>Datang sore hari untuk menikmati sunset yang indah</li>
        <li>Bawa tabir surya (sunscreen) karena terik matahari cukup menyengat</li>
        <li>Waspada terhadap ombak besar, jangan berenang terlalu jauh ke laut</li>
        <li>Jaga kebersihan pantai – buang sampah pada tempatnya</li>
        <li>Bawa pakaian ganti jika berencana bermain air</li>
        <li>Kunjungi di pagi hari untuk suasana yang lebih sepi dan sejuk</li>
      </ul>

      <h2>Destinasi Wisata Terdekat dari Pantai Panjang</h2>
      <ul>
        <li><strong>Benteng Marlborough</strong> – ±5 menit dari Pantai Panjang</li>
        <li><strong>Rumah Bung Karno</strong> – ±10 menit dari Pantai Panjang</li>
        <li><strong>Danau Dendam Tak Sudah</strong> – ±20 menit dari Pantai Panjang</li>
        <li><strong>Masjid Jamik</strong> – ±10 menit dari Pantai Panjang</li>
      </ul>

      <h2>Butuh Transportasi ke Pantai Panjang?</h2>
      <p>
        Kami menyediakan layanan travel dan rental mobil yang bisa mengantarkan Anda ke Pantai Panjang dan berbagai destinasi wisata lainnya di Bengkulu. Hubungi kami via WhatsApp untuk informasi lebih lanjut.
      </p>
    </ArticleLayout>
  );
}
