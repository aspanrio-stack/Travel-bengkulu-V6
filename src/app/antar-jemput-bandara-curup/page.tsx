import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Antar Jemput Bandara Curup – Tarif Rp 100.000',
  description:
    'Layanan antar jemput bandara Curup (Bandara Fatmawati Curup). Tarif Rp 100.000. On-time guarantee. Armada nyaman. Pesan via WhatsApp 0852-6864-5461!',
  alternates: { canonical: 'https://bengkulutravel.com/antar-jemput-bandara-curup' },
};

export default function AntarJemputBandaraCurup() {
  return (
    <ArticleLayout
      title="Antar Jemput Bandara Curup"
      description="Layanan khusus antar jemput ke dan dari Bandara di Curup. Tepat waktu, nyaman, dan terjangkau."
      breadcrumbs={[{ label: 'Antar Jemput Bandara Curup' }]}
      badge="✈️ Airport Transfer"
      price="Rp 100.000"
    >
      <p>
        Kami menyediakan layanan <strong>antar jemput bandara Curup</strong> yang khusus dirancang untuk penumpang pesawat yang membutuhkan transportasi dari/ke bandara secara on-time dan nyaman. Dengan tarif flat hanya <strong>Rp 100.000</strong>, Anda tidak perlu khawatir soal transportasi dari atau ke bandara.
      </p>

      <h2>Tarif Antar Jemput Bandara</h2>
      <table>
        <thead>
          <tr>
            <th>Layanan</th>
            <th>Tarif</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jemput dari Bandara</td>
            <td><strong>Rp 100.000</strong></td>
            <td>Ke seluruh area Curup</td>
          </tr>
          <tr>
            <td>Antar ke Bandara</td>
            <td><strong>Rp 100.000</strong></td>
            <td>Dari seluruh area Curup</td>
          </tr>
        </tbody>
      </table>

      <h2>Kenapa Penting Booking Airport Transfer?</h2>
      <p>
        Perjalanan ke bandara membutuhkan ketepatan waktu yang tinggi. Jika Anda terlambat, bisa ketinggalan pesawat. Sebaliknya, saat Anda baru tiba dari perjalanan jauh, hal terakhir yang Anda inginkan adalah antri mencari transportasi di bandara.
      </p>
      <p>
        Dengan memesan layanan antar jemput bandara Curup kami, semua itu tidak akan terjadi. Driver kami sudah stand-by sebelum waktu penjemputan dan memantau status penerbangan Anda.
      </p>

      <h2>Keunggulan Layanan Kami</h2>
      <ul>
        <li><strong>On-Time Guarantee</strong> – Driver tiba minimal 15 menit sebelum waktu yang ditentukan</li>
        <li><strong>Flight Monitoring</strong> – Kami pantau jadwal penerbangan untuk antisipasi keterlambatan</li>
        <li><strong>Tarif Flat</strong> – Tidak ada biaya parkir, tol, atau biaya lain yang tersembunyi</li>
        <li><strong>Armada Bersih</strong> – Kendaraan selalu dalam kondisi bersih dan terawat</li>
        <li><strong>Pemesanan Mudah</strong> – Cukup chat WhatsApp, selesai dalam hitungan menit</li>
      </ul>

      <h2>Cara Pemesanan</h2>
      <ol>
        <li>Hubungi via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Informasikan: nomor penerbangan, jam tiba/berangkat, dan nama</li>
        <li>Berikan alamat tujuan (untuk jemput dari bandara) atau alamat jemput (untuk antar ke bandara)</li>
        <li>Konfirmasi pemesanan</li>
        <li>Driver kami akan tepat waktu di lokasi</li>
      </ol>

      <h2>Tips Pengguna Bandara di Curup</h2>
      <ul>
        <li>Untuk keberangkatan, disarankan tiba di bandara minimal 1 jam sebelum jadwal boarding</li>
        <li>Pesan antar jemput bandara minimal H-1 untuk memastikan ketersediaan</li>
        <li>Simpan nomor WhatsApp kami agar mudah dihubungi kapan saja</li>
        <li>Informasikan perkiraan bagasi agar kami menyiapkan kendaraan yang sesuai</li>
      </ul>
    </ArticleLayout>
  );
}
