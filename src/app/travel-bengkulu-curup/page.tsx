import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Bengkulu Curup – Antar Jemput Door to Door Rp 80.000',
  description:
    'Jasa travel Bengkulu Curup door to door murah. Tarif hanya Rp 80.000/orang. Berangkat setiap hari. Armada nyaman. Pesan via WhatsApp 0852-6864-5461!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-bengkulu-curup' },
};

export default function TravelBengkuluCurup() {
  return (
    <ArticleLayout
      title="Travel Bengkulu Curup"
      description="Perjalanan Bengkulu–Curup yang nyaman dan hemat. Antar jemput door to door dengan harga terjangkau."
      breadcrumbs={[{ label: 'Travel Bengkulu Curup' }]}
      badge="💸 Termurah"
      price="Rp 80.000"
    >
      <p>
        <strong>Travel Bengkulu Curup</strong> adalah layanan transportasi antar kota dalam provinsi yang menghubungkan Kota Bengkulu dengan Curup, ibukota Kabupaten Rejang Lebong. Dengan tarif terjangkau hanya <strong>Rp 80.000</strong> per orang dan sistem door to door, perjalanan ke Curup kini semakin praktis.
      </p>

      <h2>Tarif Travel Bengkulu–Curup</h2>
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
            <td>Bengkulu → Curup</td>
            <td><strong>Rp 80.000</strong></td>
            <td>Per orang, door to door</td>
          </tr>
          <tr>
            <td>Curup → Bengkulu</td>
            <td><strong>Rp 80.000</strong></td>
            <td>Per orang, door to door</td>
          </tr>
        </tbody>
      </table>

      <h2>Jarak dan Waktu Tempuh</h2>
      <p>
        Jarak Bengkulu ke Curup sekitar <strong>80–90 km</strong> dengan waktu tempuh <strong>2–2,5 jam</strong>. Rute melewati jalan provinsi yang cukup baik: <em>Bengkulu → Kepahiang → Curup</em>.
      </p>

      <h2>Mengapa Pilih Travel ke Curup?</h2>
      <p>
        Dibandingkan naik bus umum atau travel biasa yang mengharuskan Anda ke terminal, layanan kami jauh lebih praktis. Anda cukup menghubungi kami, menyebutkan alamat, dan kami yang datang menjemput ke lokasi Anda.
      </p>

      <h2>Jadwal dan Pemesanan</h2>
      <ul>
        <li>Tersedia keberangkatan pagi, siang, dan sore hari</li>
        <li>Pesan minimal beberapa jam sebelum keberangkatan</li>
        <li>Untuk waktu spesifik, disarankan memesan H-1</li>
      </ul>

      <h2>Cara Memesan</h2>
      <ol>
        <li>Hubungi via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Sebutkan rute, tanggal, dan jumlah penumpang</li>
        <li>Berikan alamat penjemputan</li>
        <li>Konfirmasi dan bayar</li>
        <li>Driver menjemput tepat waktu</li>
      </ol>

      <h2>Destinasi Populer di Curup</h2>
      <p>
        Curup dan sekitarnya menawarkan berbagai destinasi wisata dan kuliner menarik yang sayang untuk dilewatkan:
      </p>
      <ul>
        <li><strong>Air Terjun Kepahiang</strong> – Indah dan sejuk, cocok untuk piknik keluarga</li>
        <li><strong>Danau Tes</strong> – Danau buatan dengan pemandangan perbukitan yang memukau</li>
        <li><strong>Kebun Teh Kabawetan</strong> – Hamparan teh hijau yang fotogenik</li>
        <li><strong>Wisata Kuliner Curup</strong> – Berbagai hidangan khas Rejang Lebong</li>
      </ul>
    </ArticleLayout>
  );
}
