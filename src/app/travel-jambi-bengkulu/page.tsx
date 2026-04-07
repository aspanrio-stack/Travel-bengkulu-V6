import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Jambi Bengkulu – Antar Jemput Door to Door Rp 250.000',
  description:
    'Jasa travel Jambi Bengkulu door to door. Tarif Rp 250.000/orang. Dijemput dari rumah langsung antar ke tujuan di Bengkulu. Pesan via WhatsApp!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-jambi-bengkulu' },
};

export default function TravelJambiBengkulu() {
  return (
    <ArticleLayout
      title="Travel Jambi Bengkulu"
      description="Layanan travel dari Jambi menuju Bengkulu. Antar jemput door to door, berangkat setiap hari."
      breadcrumbs={[{ label: 'Travel Jambi Bengkulu' }]}
      badge="🗺️ Rute Sumatera"
      price="Rp 250.000"
    >
      <p>
        <strong>Travel Jambi Bengkulu</strong> melayani perjalanan dari Provinsi Jambi menuju Bengkulu dengan sistem <em>door to door</em>. Kami menjemput langsung dari rumah, hotel, atau kantor Anda di Jambi, kemudian mengantarkan ke tujuan di Bengkulu tanpa perlu transit atau ganti kendaraan.
      </p>

      <h2>Harga dan Tarif</h2>
      <table>
        <thead>
          <tr>
            <th>Rute</th>
            <th>Tarif</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jambi → Bengkulu</td>
            <td><strong>Rp 250.000</strong></td>
            <td>Per orang, termasuk jemput & antar</td>
          </tr>
        </tbody>
      </table>

      <h2>Estimasi Perjalanan</h2>
      <p>
        Jarak Jambi ke Bengkulu sekitar <strong>540–580 km</strong> dengan waktu tempuh kurang lebih <strong>9–12 jam</strong>. Perjalanan melewati:
      </p>
      <p>
        <em>Jambi → Sarolangun → Bangko → Muara Bungo → Lubuklinggau → Curup → Kepahiang → Bengkulu</em>
      </p>

      <h2>Pilihan Armada</h2>
      <ul>
        <li><strong>Toyota Avanza</strong> – Ideal untuk 4–5 penumpang beserta bagasi</li>
        <li><strong>Toyota Innova</strong> – Lebih lega dan nyaman untuk perjalanan antar provinsi</li>
        <li><strong>Toyota HiAce</strong> – Untuk rombongan hingga 13 penumpang</li>
      </ul>

      <h2>Area Penjemputan di Jambi</h2>
      <p>Kami melayani penjemputan dari seluruh area Kota Jambi, meliputi:</p>
      <ul>
        <li>Pusat Kota Jambi dan sekitarnya</li>
        <li>Area Telanaipura dan Jelutung</li>
        <li>Sekitar Mal dan pusat perbelanjaan di Jambi</li>
        <li>Bandara Sultan Thaha Syaifuddin (dengan koordinasi)</li>
      </ul>

      <h2>Cara Pemesanan</h2>
      <ol>
        <li>Chat WhatsApp ke <strong>0852-6864-5461</strong></li>
        <li>Sebutkan tanggal berangkat, jumlah penumpang</li>
        <li>Konfirmasi alamat jemput di Jambi dan tujuan di Bengkulu</li>
        <li>Kami akan konfirmasi dan beri detail pembayaran</li>
        <li>Driver siap menjemput tepat waktu</li>
      </ol>

      <h2>Keunggulan Travel Jambi–Bengkulu Kami</h2>
      <ul>
        <li>Tidak perlu ke terminal bus – cukup tunggu di rumah</li>
        <li>Tarif flat Rp 250.000, tanpa biaya tambahan</li>
        <li>Armada terawat dan ber-AC</li>
        <li>Pengemudi berpengalaman di jalur Trans-Sumatera</li>
        <li>Pemesanan bisa dilakukan 24 jam via WhatsApp</li>
      </ul>
    </ArticleLayout>
  );
}
