import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Bengkulu Jambi – Antar Jemput Door to Door Rp 250.000',
  description:
    'Jasa travel Bengkulu Jambi door to door. Tarif Rp 250.000/orang. Armada nyaman Toyota Avanza, Innova, HiAce. Pesan sekarang via WhatsApp!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-bengkulu-jambi' },
};

export default function TravelBengkuluJambi() {
  return (
    <ArticleLayout
      title="Travel Bengkulu Jambi"
      description="Layanan antar jemput door to door rute Bengkulu–Jambi. Nyaman, tepat waktu, dan tarif bersahabat."
      breadcrumbs={[{ label: 'Travel Bengkulu Jambi' }]}
      badge="🗺️ Rute Sumatera"
      price="Rp 250.000"
    >
      <p>
        <strong>Travel Bengkulu Jambi</strong> hadir untuk memenuhi kebutuhan transportasi Anda dari Bengkulu menuju Provinsi Jambi dengan layanan antar jemput <em>door to door</em>. Dengan tarif terjangkau dan armada yang terawat, perjalanan Bengkulu–Jambi kini semakin mudah dan menyenangkan.
      </p>

      <h2>Tarif Travel Bengkulu Jambi</h2>
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
            <td>Bengkulu → Jambi</td>
            <td><strong>Rp 250.000</strong></td>
            <td>Door to door</td>
          </tr>
          <tr>
            <td>Jambi → Bengkulu</td>
            <td><strong>Rp 250.000</strong></td>
            <td>Door to door</td>
          </tr>
        </tbody>
      </table>

      <h2>Rute dan Jarak Bengkulu–Jambi</h2>
      <p>
        Jarak dari Bengkulu ke Jambi sekitar <strong>540–580 km</strong> dengan estimasi waktu tempuh <strong>9–12 jam</strong> tergantung kondisi jalan. Rute umum yang dilalui:
      </p>
      <p>
        <em>Bengkulu → Kepahiang → Curup → Lubuklinggau → Muara Bungo → Bangko → Sarolangun → Jambi</em>
      </p>

      <h2>Armada Perjalanan</h2>
      <ul>
        <li><strong>Toyota Avanza</strong> – Efisien dan nyaman untuk perjalanan antar provinsi</li>
        <li><strong>Toyota Innova</strong> – Suspensi halus, kabin lega, ideal untuk perjalanan 10+ jam</li>
        <li><strong>Toyota HiAce</strong> – Untuk rombongan keluarga atau grup hingga 13 orang</li>
      </ul>

      <h2>Fasilitas Perjalanan</h2>
      <ul>
        <li>AC berfungsi optimal</li>
        <li>Pengemudi berpengalaman di rute Sumatera</li>
        <li>Berhenti di rest area atau rumah makan</li>
        <li>Kapasitas bagasi cukup untuk perjalanan jarak jauh</li>
        <li>Bebas rokok di dalam kendaraan</li>
      </ul>

      <h2>Cara Memesan</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Informasikan tanggal, jumlah penumpang, dan titik jemput</li>
        <li>Kami konfirmasi jadwal dan ketersediaan kendaraan</li>
        <li>Bayar sesuai kesepakatan</li>
        <li>Driver tiba tepat waktu di lokasi Anda</li>
      </ol>

      <h2>Tips Perjalanan Bengkulu – Jambi</h2>
      <ul>
        <li>Pesan H-1 atau lebih awal, terutama saat musim liburan</li>
        <li>Bawa bekal makanan dan minuman untuk perjalanan panjang</li>
        <li>Berangkat pagi untuk menghindari kemacetan di area kota</li>
        <li>Istirahat cukup sebelum perjalanan malam hari</li>
      </ul>
    </ArticleLayout>
  );
}
