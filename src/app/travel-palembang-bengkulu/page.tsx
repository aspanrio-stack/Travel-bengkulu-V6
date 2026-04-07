import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Palembang Bengkulu – Antar Jemput Door to Door Rp 250.000',
  description:
    'Jasa travel Palembang Bengkulu door to door. Tarif Rp 250.000/orang. Berangkat setiap hari. Armada nyaman, pengemudi berpengalaman. Pesan via WA!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-palembang-bengkulu' },
};

export default function TravelPalembangBengkulu() {
  return (
    <ArticleLayout
      title="Travel Palembang Bengkulu"
      description="Layanan travel antar jemput door to door dari Palembang langsung ke tujuan Anda di Bengkulu."
      breadcrumbs={[{ label: 'Travel Palembang Bengkulu' }]}
      badge="🚗 Rute Populer"
      price="Rp 250.000"
    >
      <p>
        <strong>Travel Palembang Bengkulu</strong> melayani perjalanan antar kota dari Palembang menuju Bengkulu dengan sistem antar jemput <em>door to door</em>. Anda tidak perlu repot mencari kendaraan atau naik angkutan umum, karena kami langsung menjemput dari lokasi Anda di Palembang dan mengantarkan ke tujuan di Bengkulu.
      </p>

      <h2>Harga Travel Palembang Bengkulu</h2>
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
            <td>Palembang → Bengkulu</td>
            <td><strong>Rp 250.000</strong></td>
            <td>Per orang, door to door</td>
          </tr>
        </tbody>
      </table>

      <h2>Estimasi Waktu dan Rute</h2>
      <p>
        Jarak Palembang ke Bengkulu sekitar 460 km dengan estimasi waktu tempuh <strong>8–10 jam</strong>. Rute melewati: <em>Palembang → Prabumulih → Lahat → Lubuklinggau → Curup → Kepahiang → Bengkulu</em>.
      </p>

      <h2>Titik Jemput di Palembang</h2>
      <p>
        Kami melayani penjemputan dari berbagai area di Palembang, termasuk:
      </p>
      <ul>
        <li>Pusat Kota Palembang</li>
        <li>Sekitar Palembang Indah Mall (PIM)</li>
        <li>Area Plaju dan Jakabaring</li>
        <li>Bandara SMB II Palembang (dengan koordinasi sebelumnya)</li>
        <li>Dan area lainnya di Palembang</li>
      </ul>

      <h2>Armada Tersedia</h2>
      <ul>
        <li><strong>Toyota Avanza</strong> – Kapasitas 5–6 penumpang + bagasi</li>
        <li><strong>Toyota Innova</strong> – Lebih lapang dan nyaman untuk perjalanan jauh</li>
        <li><strong>Toyota HiAce</strong> – Untuk rombongan besar 10–13 orang</li>
      </ul>

      <h2>Cara Pesan Travel Palembang–Bengkulu</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Informasikan jadwal keberangkatan dan jumlah penumpang</li>
        <li>Berikan alamat lengkap titik jemput di Palembang</li>
        <li>Konfirmasi pemesanan dan lakukan pembayaran sesuai ketentuan</li>
        <li>Driver kami siap menjemput tepat waktu</li>
      </ol>

      <h2>Keunggulan Layanan Kami</h2>
      <ul>
        <li>Tidak perlu ke terminal atau stasiun – langsung dijemput di lokasi Anda</li>
        <li>Perjalanan langsung tanpa harus berganti kendaraan</li>
        <li>Pengemudi berpengalaman yang hafal rute Palembang–Bengkulu</li>
        <li>Harga tetap, tidak ada kenaikan mendadak</li>
        <li>Tersedia 24 jam untuk pemesanan</li>
      </ul>
    </ArticleLayout>
  );
}
