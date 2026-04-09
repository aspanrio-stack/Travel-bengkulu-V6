import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Curup ke Bandara Bengkulu – Antar Jemput Tepat Waktu',
  description:
    'Layanan antar jemput Curup ke Bandara Fatmawati Soekarno Bengkulu. Tepat waktu, armada nyaman, harga terjangkau. Pesan via WhatsApp 0852-6864-5461. Siap 24 jam!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-curup-bandara-bengkulu' },
};

export default function TravelCurupBandaraBengkulu() {
  return (
    <ArticleLayout
      title="Travel Curup ke Bandara Bengkulu"
      description="Layanan antar jemput khusus dari Curup ke Bandara Fatmawati Soekarno Bengkulu. On-time guarantee, siap 24 jam."
      breadcrumbs={[{ label: 'Travel Curup ke Bandara Bengkulu' }]}
      badge="✈️ Airport Transfer"
      price="Rp 100.000"
    >
      <p>
        Kami menyediakan layanan <strong>antar jemput khusus dari Curup ke Bandara Fatmawati Soekarno Bengkulu</strong> yang dirancang khusus untuk penumpang pesawat. Ketepatan waktu adalah prioritas utama kami — driver kami selalu hadir sebelum waktu penjemputan dan memantau jadwal penerbangan Anda.
      </p>

      <h2>Tarif Antar Jemput Curup–Bandara Bengkulu</h2>
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
            <td>Curup → Bandara Bengkulu</td>
            <td><strong>Rp 100.000</strong></td>
            <td>Per orang, door to door</td>
          </tr>
          <tr>
            <td>Bandara Bengkulu → Curup</td>
            <td><strong>Rp 100.000</strong></td>
            <td>Per orang, door to door</td>
          </tr>
          <tr>
            <td>Sewa Eksklusif (1 mobil)</td>
            <td>Hubungi Kami</td>
            <td>Cocok untuk keluarga/rombongan</td>
          </tr>
        </tbody>
      </table>

      <h2>Informasi Bandara Fatmawati Soekarno Bengkulu</h2>
      <table>
        <thead>
          <tr>
            <th>Informasi</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nama Resmi</td>
            <td>Bandara Fatmawati Soekarno</td>
          </tr>
          <tr>
            <td>Kode IATA</td>
            <td>BKS</td>
          </tr>
          <tr>
            <td>Lokasi</td>
            <td>Kota Bengkulu</td>
          </tr>
          <tr>
            <td>Jarak dari Curup</td>
            <td>±85–90 km</td>
          </tr>
          <tr>
            <td>Estimasi Waktu dari Curup</td>
            <td>2–2,5 jam</td>
          </tr>
        </tbody>
      </table>

      <h2>Maskapai yang Beroperasi di Bandara Bengkulu</h2>
      <ul>
        <li><strong>Garuda Indonesia</strong> — Rute Bengkulu–Jakarta (CGK)</li>
        <li><strong>Citilink</strong> — Rute Bengkulu–Jakarta (CGK)</li>
        <li><strong>Lion Air</strong> — Rute Bengkulu–Jakarta dan kota lainnya</li>
        <li><strong>Batik Air</strong> — Rute Bengkulu–Jakarta</li>
        <li><strong>Wings Air</strong> — Rute penerbangan regional</li>
      </ul>

      <h2>Mengapa Penting Pesan Airport Transfer?</h2>
      <p>
        Perjalanan dari Curup ke Bandara Bengkulu membutuhkan waktu <strong>2–2,5 jam</strong>. Jika berangkat dengan angkutan umum atau ojek online, risiko ketinggalan pesawat cukup tinggi karena sulitnya mendapat kendaraan yang tepat waktu.
      </p>
      <p>
        Dengan layanan airport transfer kami, semua risiko tersebut hilang. Driver kami:
      </p>
      <ul>
        <li>Hadir <strong>15–30 menit sebelum</strong> waktu penjemputan</li>
        <li>Memantau jadwal penerbangan untuk antisipasi perubahan jadwal</li>
        <li>Mengetahui rute tercepat Curup–Bandara Bengkulu</li>
        <li>Membantu membawa bagasi ke kendaraan</li>
      </ul>

      <h2>Tips Perjalanan Curup ke Bandara Bengkulu</h2>
      <ul>
        <li>
          <strong>Waktu ideal berangkat dari Curup:</strong> Minimal <strong>3,5 jam sebelum jadwal penerbangan</strong>
          <br />
          Contoh: Pesawat pukul 10.00 WIB → berangkat dari Curup pukul 06.30 WIB
        </li>
        <li><strong>Pesan H-1 atau lebih awal</strong> terutama untuk penerbangan pagi</li>
        <li><strong>Siapkan dokumen perjalanan</strong> — KTP/Paspor, tiket pesawat, dan bagasi sebelum driver tiba</li>
        <li><strong>Informasikan nomor penerbangan</strong> saat booking agar kami bisa pantau jika ada delay</li>
        <li><strong>Untuk penjemputan dari bandara</strong> — beritahukan jadwal landing agar driver sudah stand-by</li>
      </ul>

      <h2>Layanan Penjemputan dari Bandara ke Curup</h2>
      <p>
        Kami juga melayani <strong>penjemputan dari Bandara Bengkulu ke Curup</strong>. Setelah mendarat, tidak perlu khawatir mencari transportasi — driver kami sudah menunggu di area kedatangan.
      </p>
      <p>
        Cukup informasikan nomor penerbangan dan jadwal tiba, kami yang akan memantau dan memastikan driver hadir tepat waktu meski ada keterlambatan penerbangan.
      </p>

      <h2>Cara Memesan</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Informasikan: nama, tanggal, dan jam penjemputan</li>
        <li>Berikan alamat jemput di Curup</li>
        <li>Sebutkan nomor penerbangan dan maskapai</li>
        <li>Konfirmasi pemesanan ✅</li>
        <li>Driver kami hadir tepat waktu</li>
      </ol>

      <h2>FAQ Antar Jemput Curup ke Bandara Bengkulu</h2>

      <h3>Curup ke Bandara Bengkulu berapa jam?</h3>
      <p>
        Perjalanan dari Curup ke Bandara Fatmawati Soekarno Bengkulu membutuhkan waktu sekitar <strong>2–2,5 jam</strong> dengan jarak ±85 km.
      </p>

      <h3>Berapa jam sebelumnya harus berangkat dari Curup?</h3>
      <p>
        Kami menyarankan berangkat dari Curup minimal <strong>3,5 jam sebelum jadwal boarding</strong> untuk antisipasi kondisi jalan dan proses check-in di bandara.
      </p>

      <h3>Apakah bisa pesan untuk penerbangan subuh?</h3>
      <p>
        Bisa! Kami beroperasi <strong>24 jam</strong> termasuk untuk penerbangan paling pagi sekalipun. Driver kami siap menjemput dini hari dari Curup.
      </p>

      <h3>Berapa tarif sewa mobil eksklusif Curup ke Bandara?</h3>
      <p>
        Untuk sewa eksklusif 1 unit kendaraan (tidak berbagi dengan penumpang lain), silakan hubungi kami via WhatsApp untuk mendapatkan penawaran harga terbaik sesuai jenis kendaraan.
      </p>

      <h3>Apakah driver menunggu jika pesawat delay?</h3>
      <p>
        Ya! Untuk layanan jemput dari bandara, kami memantau status penerbangan secara aktif. Jika ada keterlambatan, driver kami akan menyesuaikan waktu penjemputan tanpa biaya tambahan.
      </p>

      <h3>Apa bedanya dengan antar jemput bandara Curup?</h3>
      <p>
        Layanan{' '}
        <Link href="/antar-jemput-bandara-curup" className="text-primary-600 hover:underline">
          Antar Jemput Bandara Curup
        </Link>{' '}
        adalah untuk Bandara Curup (FAK). Halaman ini adalah untuk <strong>Bandara Fatmawati Soekarno di Kota Bengkulu</strong> — bandara yang lebih besar dengan lebih banyak pilihan penerbangan.
      </p>

      <h2>Layanan Terkait dari Curup</h2>
      <ul>
        <li><Link href="/travel-curup-bengkulu" className="text-primary-600 hover:underline">Travel Curup Bengkulu – Rp 80.000 Door to Door</Link></li>
        <li><Link href="/antar-jemput-bandara-curup" className="text-primary-600 hover:underline">Antar Jemput Bandara Curup (FAK) – Rp 100.000</Link></li>
        <li><Link href="/rental-mobil-curup" className="text-primary-600 hover:underline">Rental Mobil Curup – Lepas Kunci Mulai Rp 300.000</Link></li>
        <li><Link href="/travel-bengkulu-curup" className="text-primary-600 hover:underline">Travel Bengkulu ke Curup – Rp 80.000</Link></li>
      </ul>
    </ArticleLayout>
  );
}
