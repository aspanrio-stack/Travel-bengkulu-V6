import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Lampung Bengkulu – Antar Jemput Door to Door Rp 300.000',
  description:
    'Jasa travel Lampung Bengkulu via Liwa-Krui. Tarif Rp 300.000/orang, door to door. Dijemput dari Bandar Lampung langsung ke Bengkulu. Pesan WA 0852-6864-5461!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-lampung-bengkulu' },
};

export default function TravelLampungBengkulu() {
  return (
    <ArticleLayout
      title="Travel Lampung Bengkulu via Liwa"
      description="Layanan travel dari Lampung ke Bengkulu via jalur Liwa-Krui. Antar jemput door to door, tarif Rp 300.000/orang."
      breadcrumbs={[{ label: 'Travel Lampung Bengkulu' }]}
      badge="🔥 Rute Baru"
      price="Rp 300.000"
    >
      <p>
        <strong>Travel Lampung Bengkulu</strong> melayani perjalanan dari Provinsi Lampung menuju Bengkulu melalui jalur <strong>Liwa–Krui</strong> yang melewati pesisir barat Sumatera yang indah. Dengan tarif <strong>Rp 300.000 per orang</strong> dan sistem door to door, kami menjemput langsung dari lokasi Anda di Lampung dan mengantarkan ke tujuan di Bengkulu.
      </p>

      <h2>Tarif dan Info Perjalanan</h2>
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
            <td><strong>Rp 300.000/orang</strong></td>
          </tr>
          <tr>
            <td>Rute</td>
            <td>Lampung → Liwa → Krui → Bengkulu</td>
          </tr>
          <tr>
            <td>Jarak</td>
            <td>±570 km</td>
          </tr>
          <tr>
            <td>Waktu Tempuh</td>
            <td>11–13 jam</td>
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

      <h2>Rute Perjalanan Lampung ke Bengkulu</h2>
      <p>
        <strong>Bandar Lampung → Liwa (Lampung Barat) → Krui (Pesisir Barat) → Bintuhan (Kaur) → Manna (Bengkulu Selatan) → Seluma → Bengkulu</strong>
      </p>

      <h2>Area Penjemputan di Lampung</h2>
      <p>Kami melayani penjemputan dari seluruh wilayah Lampung, termasuk:</p>
      <ul>
        <li>Bandar Lampung (Rajabasa, Tanjung Karang, Kedaton, dan sekitarnya)</li>
        <li>Metro</li>
        <li>Pringsewu dan Tanggamus</li>
        <li>Liwa dan Lampung Barat</li>
        <li>Dan area lainnya — hubungi kami untuk konfirmasi</li>
      </ul>

      <h2>Keunggulan Rute via Liwa</h2>
      <ul>
        <li>Melewati <strong>Pantai Krui</strong> yang terkenal dengan ombak surfing kelas dunia</li>
        <li>Pemandangan <strong>Taman Nasional Bukit Barisan Selatan</strong> yang memukau</li>
        <li>Rute <strong>lebih efisien</strong> dibanding via Palembang yang memutar jauh</li>
        <li>Jalur pesisir barat yang terus <strong>diperbaiki dan diperlebar</strong></li>
      </ul>

      <h2>Cara Memesan</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Sebutkan rute: Lampung → Bengkulu via Liwa</li>
        <li>Informasikan tanggal dan jumlah penumpang</li>
        <li>Berikan alamat jemput di Lampung</li>
        <li>Konfirmasi dan driver kami siap menjemput ✅</li>
      </ol>

      <h2>FAQ</h2>

      <h3>Lampung ke Bengkulu berapa jam?</h3>
      <p>Sekitar <strong>11–13 jam</strong> via jalur Liwa–Krui dengan jarak ±570 km.</p>

      <h3>Apakah ada travel Lampung Bengkulu setiap hari?</h3>
      <p>Ya, kami beroperasi setiap hari. Disarankan pesan <strong>H-1 atau lebih awal</strong> untuk rute ini.</p>

      <h2>Artikel Terkait</h2>
      <ul>
        <li><Link href="/travel-bengkulu-lampung" className="text-primary-600 hover:underline">Travel Bengkulu Lampung – Info Lengkap via Liwa</Link></li>
        <li><Link href="/travel-bengkulu" className="text-primary-600 hover:underline">Semua Rute Travel Bengkulu</Link></li>
      </ul>
    </ArticleLayout>
  );
}
