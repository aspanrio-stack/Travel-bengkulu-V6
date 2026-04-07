import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Bengkulu ke Palembang – Travel Door to Door Rp 250.000',
  description:
    'Travel Bengkulu ke Palembang door to door hanya Rp 250.000/orang. Jarak 460 km, waktu tempuh 8–10 jam. Berangkat setiap hari. Pesan via WhatsApp sekarang!',
  alternates: { canonical: 'https://www.bengkulutravel.com/bengkulu-ke-palembang' },
};

export default function BengkuluKePalembang() {
  return (
    <ArticleLayout
      title="Travel Bengkulu ke Palembang"
      description="Layanan travel Bengkulu ke Palembang door to door setiap hari. Tarif Rp 250.000/orang, dijemput dari rumah."
      breadcrumbs={[{ label: 'Travel Bengkulu ke Palembang' }]}
      badge="🚗 Door to Door"
      price="Rp 250.000"
    >
      <p>
        Butuh transportasi dari <strong>Bengkulu ke Palembang</strong>? Kami menyediakan layanan travel antar jemput <em>door to door</em> dengan tarif terjangkau hanya <strong>Rp 250.000 per orang</strong>. Berangkat setiap hari, dijemput langsung dari rumah atau lokasi Anda di Bengkulu, diantar sampai tujuan di Palembang.
      </p>

      <h2>Kenapa Pilih Travel Kami Bengkulu ke Palembang?</h2>
      <ul>
        <li><strong>Door to Door</strong> — tidak perlu ke terminal, dijemput dan diantar langsung</li>
        <li><strong>Tarif Flat Rp 250.000</strong> — harga sudah pasti, tidak ada biaya tambahan</li>
        <li><strong>Berangkat Setiap Hari</strong> — jadwal fleksibel pagi, siang, dan malam</li>
        <li><strong>Armada Nyaman</strong> — Toyota Avanza, Innova, dan HiAce ber-AC</li>
        <li><strong>Pengemudi Berpengalaman</strong> — hafal rute dan profesional</li>
        <li><strong>Pesan 24 Jam</strong> — via WhatsApp kapan saja</li>
      </ul>

      <h2>Info Perjalanan Bengkulu ke Palembang</h2>
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
            <td>±460 km</td>
          </tr>
          <tr>
            <td>Waktu Tempuh</td>
            <td>8–10 jam</td>
          </tr>
          <tr>
            <td>Tarif</td>
            <td><strong>Rp 250.000/orang</strong></td>
          </tr>
          <tr>
            <td>Sistem</td>
            <td>Door to door</td>
          </tr>
          <tr>
            <td>Jadwal</td>
            <td>Setiap hari</td>
          </tr>
          <tr>
            <td>Armada</td>
            <td>Avanza, Innova, HiAce</td>
          </tr>
        </tbody>
      </table>

      <h2>Rute Bengkulu ke Palembang</h2>
      <p>
        Perjalanan dari Bengkulu ke Palembang melewati rute Trans-Sumatera yang cukup nyaman:
      </p>
      <p>
        <strong>Bengkulu → Kepahiang → Curup → Lubuklinggau → Lahat → Prabumulih → Palembang</strong>
      </p>

      <h2>Area Penjemputan di Bengkulu</h2>
      <p>Kami melayani penjemputan dari seluruh wilayah Kota Bengkulu dan sekitarnya, termasuk:</p>
      <ul>
        <li>Pusat Kota Bengkulu</li>
        <li>Curup dan Rejang Lebong</li>
        <li>Kepahiang</li>
        <li>Seluma</li>
        <li>Dan area lainnya — hubungi kami untuk konfirmasi</li>
      </ul>

      <h2>Area Pengantaran di Palembang</h2>
      <p>Kami mengantarkan ke seluruh area Kota Palembang, termasuk:</p>
      <ul>
        <li>Pusat Kota dan Ilir Barat/Timur</li>
        <li>Plaju dan Kertapati</li>
        <li>Jakabaring dan Seberang Ulu</li>
        <li>Sekitar Bandara SMB II Palembang</li>
        <li>Dan seluruh area Palembang lainnya</li>
      </ul>

      <h2>Cara Pesan Travel Bengkulu ke Palembang</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Informasikan tanggal berangkat dan jumlah penumpang</li>
        <li>Berikan alamat penjemputan di Bengkulu</li>
        <li>Beritahukan tujuan di Palembang</li>
        <li>Konfirmasi pemesanan dan pembayaran</li>
        <li>Driver kami tiba tepat waktu di lokasi Anda ✅</li>
      </ol>

      <h2>FAQ Travel Bengkulu ke Palembang</h2>

      <h3>Bengkulu ke Palembang berapa jam naik travel?</h3>
      <p>Dengan travel door to door, perjalanan Bengkulu–Palembang ditempuh dalam <strong>8–10 jam</strong> termasuk istirahat di rest area.</p>

      <h3>Apakah harga Rp 250.000 sudah termasuk jemput di rumah?</h3>
      <p>Ya, tarif Rp 250.000 sudah termasuk penjemputan di alamat Anda dan pengantaran ke tujuan di Palembang. Tidak ada biaya tambahan.</p>

      <h3>Bisa pesan untuk besok?</h3>
      <p>Bisa, asalkan masih ada kursi tersedia. Disarankan pesan minimal H-1, terutama saat musim liburan atau hari besar nasional.</p>

      <h3>Bagaimana kalau penumpang lebih dari 1 orang?</h3>
      <p>Bisa! Tarif tetap Rp 250.000 per orang. Untuk rombongan keluarga, bisa sewa 1 unit kendaraan eksklusif — hubungi kami untuk harga spesial.</p>
    </ArticleLayout>
  );
}
