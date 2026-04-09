import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Curup Bengkulu – Antar Jemput Door to Door Rp 80.000',
  description:
    'Jasa travel Curup Bengkulu door to door. Tarif hanya Rp 80.000/orang. Dijemput dari rumah di Curup, diantar langsung ke Bengkulu. Pesan WA 0852-6864-5461!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-curup-bengkulu' },
};

export default function TravelCurupBengkulu() {
  return (
    <ArticleLayout
      title="Travel Curup Bengkulu"
      description="Layanan travel antar jemput door to door dari Curup langsung ke Bengkulu. Tarif hemat, berangkat setiap hari."
      breadcrumbs={[{ label: 'Travel Curup Bengkulu' }]}
      badge="💸 Termurah"
      price="Rp 80.000"
    >
      <p>
        <strong>Travel Curup Bengkulu</strong> melayani perjalanan dari Curup (Rejang Lebong) menuju Kota Bengkulu dengan sistem antar jemput <em>door to door</em>. Kami menjemput langsung dari rumah, kantor, atau hotel Anda di Curup dan mengantarkan ke tujuan di Bengkulu tanpa perlu ke terminal atau berganti kendaraan.
      </p>

      <h2>Tarif Travel Curup–Bengkulu</h2>
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
            <td>Curup → Bengkulu</td>
            <td><strong>Rp 80.000</strong></td>
            <td>Door to door</td>
          </tr>
          <tr>
            <td>Bengkulu → Curup</td>
            <td><strong>Rp 80.000</strong></td>
            <td>Door to door</td>
          </tr>
        </tbody>
      </table>

      <h2>Informasi Perjalanan</h2>
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
            <td>±85 km</td>
          </tr>
          <tr>
            <td>Waktu Tempuh</td>
            <td>2–2,5 jam</td>
          </tr>
          <tr>
            <td>Rute</td>
            <td>Curup → Kepahiang → Bengkulu</td>
          </tr>
          <tr>
            <td>Jadwal</td>
            <td>Setiap hari, fleksibel</td>
          </tr>
          <tr>
            <td>Armada</td>
            <td>Toyota Avanza, Innova, HiAce</td>
          </tr>
        </tbody>
      </table>

      <h2>Area Penjemputan di Curup</h2>
      <p>Kami melayani penjemputan dari seluruh wilayah Curup dan Rejang Lebong, termasuk:</p>
      <ul>
        <li>Pusat Kota Curup dan sekitarnya</li>
        <li>BTN Air Bang — Lokasi Head Office kami</li>
        <li>Perumahan dan perumnas di Curup</li>
        <li>Kepahiang dan sekitarnya</li>
        <li>Curup Tengah, Curup Utara, Curup Selatan, Curup Timur</li>
        <li>Dan seluruh wilayah Rejang Lebong lainnya</li>
      </ul>

      <h2>Area Pengantaran di Bengkulu</h2>
      <p>Kami mengantarkan ke seluruh wilayah Kota Bengkulu dan sekitarnya:</p>
      <ul>
        <li>Pusat Kota Bengkulu</li>
        <li>Bengkulu Utara, Selatan, Tengah</li>
        <li>Area kampus UNIB dan IAIN Bengkulu</li>
        <li>Ratu Samban, Teluk Segara, Sungai Serut</li>
        <li>Bandara Fatmawati Soekarno Bengkulu</li>
        <li>Dan seluruh area Kota Bengkulu</li>
      </ul>

      <h2>Kenapa Pilih Travel Kami dari Curup ke Bengkulu?</h2>
      <ul>
        <li><strong>Kantor Kami di Curup</strong> — Head office kami berlokasi di BTN Air Bang Curup, jadi kami sangat hafal seluruh wilayah Curup dan Rejang Lebong</li>
        <li><strong>Tarif Termurah</strong> — Hanya Rp 80.000 per orang, lebih hemat dibanding angkutan umum yang tidak door to door</li>
        <li><strong>Door to Door</strong> — Tidak perlu repot ke terminal, cukup tunggu di rumah</li>
        <li><strong>Berpengalaman</strong> — Sudah melayani rute Curup–Bengkulu sejak lama</li>
        <li><strong>Pengemudi Lokal</strong> — Pengemudi kami orang Curup yang hafal setiap sudut kota</li>
        <li><strong>Pesan 24 Jam</strong> — Hubungi kapan saja via WhatsApp</li>
      </ul>

      <h2>Cara Memesan Travel Curup ke Bengkulu</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Sebutkan rute: Curup → Bengkulu</li>
        <li>Informasikan tanggal, jam berangkat, dan jumlah penumpang</li>
        <li>Berikan alamat lengkap penjemputan di Curup</li>
        <li>Beritahukan tujuan di Bengkulu</li>
        <li>Konfirmasi — driver kami siap menjemput tepat waktu ✅</li>
      </ol>

      <h2>FAQ Travel Curup Bengkulu</h2>

      <h3>Curup ke Bengkulu berapa jam?</h3>
      <p>
        Perjalanan Curup ke Bengkulu dengan travel membutuhkan waktu sekitar <strong>2–2,5 jam</strong> dengan jarak ±85 km melewati Kepahiang.
      </p>

      <h3>Curup ke Bengkulu berapa km?</h3>
      <p>
        Jarak Curup ke Bengkulu sekitar <strong>85 km</strong> via jalur Kepahiang–Bengkulu.
      </p>

      <h3>Berapa ongkos travel Curup ke Bengkulu?</h3>
      <p>
        Tarif travel Curup–Bengkulu di layanan kami hanya <strong>Rp 80.000 per orang</strong>, sudah termasuk jemput di rumah dan antar ke tujuan di Bengkulu.
      </p>

      <h3>Apakah bisa antar ke Bandara Bengkulu dari Curup?</h3>
      <p>
        Ya! Kami juga melayani antar jemput khusus dari Curup ke Bandara Fatmawati Soekarno Bengkulu. Lihat layanan{' '}
        <Link href="/travel-curup-bandara-bengkulu" className="text-primary-600 hover:underline">
          Travel Curup ke Bandara Bengkulu
        </Link>{' '}
        untuk info lengkap.
      </p>

      <h3>Apakah ada travel Curup Bengkulu setiap hari?</h3>
      <p>
        Ya, kami beroperasi <strong>setiap hari</strong> dengan jadwal fleksibel. Tersedia keberangkatan pagi, siang, dan sore sesuai kebutuhan Anda.
      </p>

      <h3>Apakah bisa pesan untuk hari ini?</h3>
      <p>
        Bisa, selama masih ada ketersediaan armada. Hubungi kami segera via WhatsApp untuk cek jadwal hari ini.
      </p>

      <h2>Layanan Lain dari Curup</h2>
      <ul>
        <li><Link href="/travel-curup-bandara-bengkulu" className="text-primary-600 hover:underline">Antar Jemput Curup ke Bandara Bengkulu</Link></li>
        <li><Link href="/rental-mobil-curup" className="text-primary-600 hover:underline">Rental Mobil Curup – Lepas Kunci Mulai Rp 300.000</Link></li>
        <li><Link href="/antar-jemput-bandara-curup" className="text-primary-600 hover:underline">Antar Jemput Bandara Curup</Link></li>
        <li><Link href="/travel-bengkulu-curup" className="text-primary-600 hover:underline">Travel Bengkulu ke Curup</Link></li>
      </ul>
    </ArticleLayout>
  );
}
