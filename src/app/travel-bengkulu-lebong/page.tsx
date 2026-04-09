import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Bengkulu Lebong – Antar Jemput Door to Door Rp 100.000',
  description:
    'Jasa travel Bengkulu Lebong via Bengkulu Utara. Tarif Rp 100.000/orang, antar jemput door to door. Armada nyaman, berangkat setiap hari. Pesan WA 0852-6864-5461!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-bengkulu-lebong' },
};

export default function TravelBengkuluLebong() {
  return (
    <ArticleLayout
      title="Travel Bengkulu Lebong"
      description="Layanan travel antar jemput door to door Bengkulu–Lebong via Bengkulu Utara. Tarif terjangkau, armada nyaman."
      breadcrumbs={[{ label: 'Travel Bengkulu Lebong' }]}
      badge="🚗 Rute Baru"
      price="Rp 100.000"
    >
      <p>
        <strong>Travel Bengkulu Lebong</strong> hadir untuk memenuhi kebutuhan transportasi masyarakat yang ingin bepergian dari Kota Bengkulu menuju Kabupaten Lebong dan sebaliknya. Dengan tarif terjangkau hanya <strong>Rp 100.000 per orang</strong> dan sistem antar jemput <em>door to door</em>, perjalanan Anda ke Lebong kini jauh lebih mudah dan nyaman.
      </p>

      <h2>Tarif Travel Bengkulu–Lebong</h2>
      <table>
        <thead>
          <tr>
            <th>Rute</th>
            <th>Tarif per Orang</th>
            <th>Sistem</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bengkulu → Lebong</td>
            <td><strong>Rp 100.000</strong></td>
            <td>Door to door</td>
          </tr>
          <tr>
            <td>Lebong → Bengkulu</td>
            <td><strong>Rp 100.000</strong></td>
            <td>Door to door</td>
          </tr>
        </tbody>
      </table>

      <h2>Rute Perjalanan Bengkulu ke Lebong</h2>
      <p>
        Perjalanan dari Bengkulu ke Lebong dilakukan via <strong>Bengkulu Utara</strong> dengan melewati rute:
      </p>
      <p>
        <strong>Bengkulu → Bengkulu Utara (Arga Makmur) → Muara Aman (Lebong)</strong>
      </p>
      <p>
        Rute via Bengkulu Utara ini adalah jalur utama dan paling umum digunakan karena kondisi jalan yang lebih baik dan pemandangan alam yang indah sepanjang perjalanan.
      </p>

      <h2>Jarak dan Estimasi Waktu Tempuh</h2>
      <table>
        <thead>
          <tr>
            <th>Informasi</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jarak</td>
            <td>±150 km</td>
          </tr>
          <tr>
            <td>Waktu Tempuh</td>
            <td>3–4 jam</td>
          </tr>
          <tr>
            <td>Via</td>
            <td>Bengkulu Utara (Arga Makmur)</td>
          </tr>
          <tr>
            <td>Tarif</td>
            <td>Rp 100.000/orang</td>
          </tr>
          <tr>
            <td>Jadwal</td>
            <td>Setiap hari</td>
          </tr>
        </tbody>
      </table>

      <h2>Armada yang Digunakan</h2>
      <p>
        Untuk kenyamanan perjalanan Bengkulu–Lebong, kami menyediakan armada pilihan:
      </p>
      <ul>
        <li><strong>Toyota Avanza</strong> — Kapasitas 6 penumpang, nyaman untuk perjalanan keluarga</li>
        <li><strong>Toyota Innova</strong> — Lebih lapang dan nyaman, pilihan premium</li>
        <li><strong>Toyota HiAce</strong> — Ideal untuk rombongan besar hingga 13 penumpang</li>
      </ul>

      <h2>Keunggulan Travel Bengkulu–Lebong Kami</h2>
      <ul>
        <li><strong>Door to Door</strong> — Dijemput langsung dari rumah, diantar ke tujuan di Lebong</li>
        <li><strong>Tarif Terjangkau</strong> — Hanya Rp 100.000 per orang, harga flat tanpa biaya tambahan</li>
        <li><strong>Pengemudi Berpengalaman</strong> — Hafal rute Bengkulu–Bengkulu Utara–Lebong</li>
        <li><strong>Armada Terawat</strong> — Kendaraan selalu dalam kondisi prima dan ber-AC</li>
        <li><strong>Pesan 24 Jam</strong> — Hubungi kami kapan saja via WhatsApp</li>
        <li><strong>Berangkat Setiap Hari</strong> — Jadwal fleksibel sesuai kebutuhan Anda</li>
      </ul>

      <h2>Tentang Kabupaten Lebong</h2>
      <p>
        Kabupaten Lebong adalah salah satu kabupaten di Provinsi Bengkulu yang terkenal dengan keindahan alamnya. Ibukota Lebong adalah <strong>Muara Aman</strong>, sebuah kota yang dikelilingi pegunungan dan sungai yang jernih. Beberapa daya tarik Lebong yang sayang dilewatkan:
      </p>
      <ul>
        <li><strong>Danau Tes</strong> — Danau buatan yang indah dengan latar belakang perbukitan hijau</li>
        <li><strong>Air Terjun di Rimbo Pengadang</strong> — Surga tersembunyi bagi pecinta alam</li>
        <li><strong>Tambang Emas Lebong Tandai</strong> — Situs bersejarah peninggalan kolonial Belanda</li>
        <li><strong>Sungai Ketahun</strong> — Spot arung jeram yang menantang</li>
        <li><strong>Kebun Kopi Lebong</strong> — Penghasil kopi robusta berkualitas tinggi</li>
      </ul>

      <h2>Tips Perjalanan Bengkulu ke Lebong</h2>
      <ul>
        <li>Pesan travel minimal <strong>H-1</strong> untuk memastikan ketersediaan kursi</li>
        <li>Berangkat <strong>pagi hari</strong> untuk menikmati pemandangan indah sepanjang rute</li>
        <li>Bawa <strong>jaket</strong> karena Lebong dan Bengkulu Utara cukup sejuk terutama pagi hari</li>
        <li>Informasikan kepada kami jika ada <strong>barang bawaan besar</strong> agar kami siapkan kendaraan yang tepat</li>
      </ul>

      <h2>Cara Memesan Travel Bengkulu Lebong</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Sebutkan rute: Bengkulu → Lebong atau Lebong → Bengkulu</li>
        <li>Informasikan tanggal berangkat dan jumlah penumpang</li>
        <li>Berikan alamat lengkap untuk penjemputan</li>
        <li>Konfirmasi pemesanan dan pembayaran</li>
        <li>Driver kami tiba tepat waktu di lokasi Anda ✅</li>
      </ol>

      <h2>FAQ Travel Bengkulu Lebong</h2>

      <h3>Bengkulu ke Lebong berapa jam?</h3>
      <p>
        Perjalanan Bengkulu ke Lebong via Bengkulu Utara membutuhkan waktu sekitar <strong>3–4 jam</strong> dengan jarak ±150 km.
      </p>

      <h3>Bengkulu ke Lebong lewat mana?</h3>
      <p>
        Rute yang kami gunakan adalah via <strong>Bengkulu Utara (Arga Makmur)</strong> menuju Muara Aman, ibukota Lebong. Ini adalah rute utama dan paling efisien.
      </p>

      <h3>Berapa ongkos travel Bengkulu ke Lebong?</h3>
      <p>
        Tarif travel Bengkulu–Lebong di layanan kami adalah <strong>Rp 100.000 per orang</strong>, sudah termasuk jemput di rumah dan antar ke tujuan di Lebong.
      </p>

      <h3>Apakah ada travel Bengkulu Lebong setiap hari?</h3>
      <p>
        Ya, kami beroperasi <strong>setiap hari</strong>. Hubungi kami via WhatsApp untuk konfirmasi jadwal dan ketersediaan kursi.
      </p>

      <h3>Bisa sewa mobil khusus Bengkulu ke Lebong?</h3>
      <p>
        Bisa! Anda bisa menyewa satu unit kendaraan secara eksklusif untuk keluarga atau rombongan. Hubungi kami untuk harga sewa khusus.
      </p>

      <h2>Artikel Terkait</h2>
      <ul>
        <li><Link href="/travel-bengkulu-curup" className="text-primary-600 hover:underline">Travel Bengkulu Curup – Rp 80.000 Door to Door</Link></li>
        <li><Link href="/rental-mobil-curup" className="text-primary-600 hover:underline">Rental Mobil Curup – Lepas Kunci Mulai Rp 300.000</Link></li>
        <li><Link href="/travel-bengkulu" className="text-primary-600 hover:underline">Semua Rute Travel Bengkulu</Link></li>
      </ul>
    </ArticleLayout>
  );
}
