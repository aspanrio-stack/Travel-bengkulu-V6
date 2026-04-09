import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Lebong Bengkulu – Antar Jemput Door to Door Rp 100.000',
  description:
    'Jasa travel Lebong Bengkulu via Bengkulu Utara. Tarif Rp 100.000/orang, door to door. Dijemput dari Muara Aman langsung ke Bengkulu. Pesan WA 0852-6864-5461!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-lebong-bengkulu' },
};

export default function TravelLebongBengkulu() {
  return (
    <ArticleLayout
      title="Travel Lebong Bengkulu"
      description="Layanan travel dari Lebong ke Bengkulu via Bengkulu Utara. Antar jemput door to door, tarif terjangkau."
      breadcrumbs={[{ label: 'Travel Lebong Bengkulu' }]}
      badge="🚗 Rute Baru"
      price="Rp 100.000"
    >
      <p>
        <strong>Travel Lebong Bengkulu</strong> melayani perjalanan dari Kabupaten Lebong menuju Kota Bengkulu dengan sistem antar jemput <em>door to door</em>. Dijemput langsung dari rumah atau lokasi Anda di Lebong (Muara Aman), kemudian diantar ke tujuan di Bengkulu tanpa perlu berganti kendaraan.
      </p>

      <h2>Tarif dan Informasi Perjalanan</h2>
      <table>
        <thead>
          <tr>
            <th>Informasi</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tarif</td>
            <td><strong>Rp 100.000/orang</strong></td>
          </tr>
          <tr>
            <td>Rute</td>
            <td>Lebong → Bengkulu Utara → Bengkulu</td>
          </tr>
          <tr>
            <td>Jarak</td>
            <td>±150 km</td>
          </tr>
          <tr>
            <td>Waktu Tempuh</td>
            <td>3–4 jam</td>
          </tr>
          <tr>
            <td>Jadwal</td>
            <td>Setiap hari</td>
          </tr>
          <tr>
            <td>Sistem</td>
            <td>Door to door</td>
          </tr>
        </tbody>
      </table>

      <h2>Cara Memesan</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Sebutkan rute Lebong → Bengkulu</li>
        <li>Informasikan tanggal dan jumlah penumpang</li>
        <li>Berikan alamat jemput di Lebong</li>
        <li>Konfirmasi dan driver kami siap menjemput ✅</li>
      </ol>

      <h2>Artikel Terkait</h2>
      <ul>
        <li><Link href="/travel-bengkulu-lebong" className="text-primary-600 hover:underline">Travel Bengkulu Lebong – Info Lengkap</Link></li>
        <li><Link href="/travel-bengkulu" className="text-primary-600 hover:underline">Semua Rute Travel Bengkulu</Link></li>
      </ul>
    </ArticleLayout>
  );
}
