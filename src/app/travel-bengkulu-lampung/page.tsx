import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Bengkulu Lampung – Antar Jemput Door to Door Rp 300.000',
  description:
    'Jasa travel Bengkulu Lampung via Liwa. Tarif Rp 300.000/orang, door to door. Rute tercepat lewat Liwa-Krui. Armada nyaman, berangkat setiap hari. Pesan sekarang!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-bengkulu-lampung' },
};

export default function TravelBengkuluLampung() {
  return (
    <ArticleLayout
      title="Travel Bengkulu Lampung via Liwa"
      description="Layanan travel antar jemput door to door Bengkulu–Lampung via jalur Liwa-Krui. Rute tercepat dan pemandangan terbaik."
      breadcrumbs={[{ label: 'Travel Bengkulu Lampung' }]}
      badge="🔥 Rute Baru"
      price="Rp 300.000"
    >
      <p>
        <strong>Travel Bengkulu Lampung</strong> kini hadir dengan rute terbaik via <strong>Liwa</strong> — jalur yang tidak hanya lebih cepat tetapi juga melewati pemandangan alam yang spektakuler di kawasan Bukit Barisan Selatan. Dengan tarif <strong>Rp 300.000 per orang</strong> dan sistem door to door, perjalanan Bengkulu ke Lampung kini semakin mudah.
      </p>

      <h2>Tarif Travel Bengkulu–Lampung</h2>
      <table>
        <thead>
          <tr>
            <th>Rute</th>
            <th>Tarif per Orang</th>
            <th>Via</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bengkulu → Bandar Lampung</td>
            <td><strong>Rp 300.000</strong></td>
            <td>Liwa – Krui</td>
          </tr>
          <tr>
            <td>Bandar Lampung → Bengkulu</td>
            <td><strong>Rp 300.000</strong></td>
            <td>Krui – Liwa</td>
          </tr>
        </tbody>
      </table>

      <h2>Mengapa Via Liwa?</h2>
      <p>
        Rute <strong>via Liwa</strong> adalah pilihan terbaik perjalanan Bengkulu–Lampung karena:
      </p>
      <ul>
        <li><strong>Lebih Cepat</strong> — Dibanding rute via Palembang yang harus memutar jauh</li>
        <li><strong>Pemandangan Indah</strong> — Melewati Taman Nasional Bukit Barisan Selatan dan Pantai Krui yang eksotis</li>
        <li><strong>Jalan Semakin Baik</strong> — Kondisi jalan terus membaik terutama setelah pelebaran jalur Liwa</li>
        <li><strong>Lebih Hemat</strong> — Tidak perlu biaya tol seperti rute via Palembang</li>
      </ul>

      <h2>Rute Lengkap Bengkulu ke Lampung via Liwa</h2>
      <p>
        <strong>Bengkulu → Seluma → Manna (Bengkulu Selatan) → Bintuhan (Kaur) → Krui (Pesisir Barat) → Liwa (Lampung Barat) → Bandar Lampung</strong>
      </p>
      <p>
        Perjalanan ini melewati pesisir barat Sumatera yang terkenal dengan pantai-pantai indahnya sebelum masuk ke pegunungan Liwa menuju Bandar Lampung.
      </p>

      <h2>Jarak dan Estimasi Waktu Tempuh</h2>
      <table>
        <thead>
          <tr>
            <th>Segmen</th>
            <th>Jarak</th>
            <th>Waktu</th>
            <th>Kondisi Jalan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bengkulu → Manna</td>
            <td>±120 km</td>
            <td>2,5 jam</td>
            <td>Jalan nasional, baik</td>
          </tr>
          <tr>
            <td>Manna → Bintuhan (Kaur)</td>
            <td>±80 km</td>
            <td>1,5 jam</td>
            <td>Jalan pesisir, cukup baik</td>
          </tr>
          <tr>
            <td>Bintuhan → Krui</td>
            <td>±100 km</td>
            <td>2 jam</td>
            <td>Melewati TNBBS, indah</td>
          </tr>
          <tr>
            <td>Krui → Liwa</td>
            <td>±60 km</td>
            <td>1,5 jam</td>
            <td>Jalan naik pegunungan</td>
          </tr>
          <tr>
            <td>Liwa → Bandar Lampung</td>
            <td>±210 km</td>
            <td>3,5 jam</td>
            <td>Jalan nasional, baik</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Total: ±570 km, estimasi 11–13 jam</strong> termasuk istirahat.</p>

      <h2>Destinasi Menarik Sepanjang Rute</h2>
      <p>
        Salah satu keistimewaan rute via Liwa adalah pemandangan luar biasa yang bisa Anda nikmati sepanjang perjalanan:
      </p>
      <ul>
        <li><strong>Pantai Muara Labuhan, Seluma</strong> — Pantai eksotis tidak jauh dari Bengkulu</li>
        <li><strong>Pantai Laguna Indah, Kaur</strong> — Pantai berpasir putih dengan air jernih</li>
        <li><strong>Pantai Krui, Pesisir Barat</strong> — Surganya peselancar dunia, ombak kelas dunia</li>
        <li><strong>Taman Nasional Bukit Barisan Selatan</strong> — Habitat harimau dan gajah sumatera</li>
        <li><strong>Kota Liwa, Lampung Barat</strong> — Kota sejuk di dataran tinggi dengan kuliner khas</li>
      </ul>

      <h2>Armada yang Digunakan</h2>
      <ul>
        <li><strong>Toyota Avanza</strong> — Cocok untuk 4–5 penumpang, irit dan nyaman</li>
        <li><strong>Toyota Innova</strong> — Pilihan premium, suspensi lebih halus untuk perjalanan panjang</li>
        <li><strong>Toyota HiAce</strong> — Untuk rombongan besar, kapasitas hingga 13 penumpang</li>
      </ul>

      <h2>Tips Perjalanan Bengkulu ke Lampung via Liwa</h2>
      <ul>
        <li><strong>Berangkat dini hari pukul 04.00–05.00 WIB</strong> agar tiba di Bandar Lampung sore/malam</li>
        <li><strong>Bawa jaket</strong> karena kawasan Liwa cukup dingin terutama malam hari</li>
        <li><strong>Siapkan kamera</strong> — pemandangan pantai dan hutan sepanjang rute sangat fotogenik</li>
        <li><strong>Pesan H-1 atau lebih awal</strong> terutama saat musim liburan</li>
        <li><strong>Waspada di segmen Krui–Liwa</strong> yang menanjak dan berkelok melewati pegunungan</li>
        <li><strong>Bawa obat anti mabuk</strong> jika mudah mabuk perjalanan karena banyak tikungan</li>
      </ul>

      <h2>Cara Memesan Travel Bengkulu Lampung</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Sebutkan rute: Bengkulu → Lampung via Liwa</li>
        <li>Informasikan tanggal berangkat dan jumlah penumpang</li>
        <li>Berikan alamat lengkap penjemputan di Bengkulu</li>
        <li>Beritahukan tujuan di Lampung (Bandar Lampung/Metro/dll)</li>
        <li>Konfirmasi pemesanan — driver kami hadir tepat waktu ✅</li>
      </ol>

      <h2>FAQ Travel Bengkulu Lampung</h2>

      <h3>Bengkulu ke Lampung berapa jam via Liwa?</h3>
      <p>
        Perjalanan Bengkulu–Lampung via Liwa membutuhkan waktu sekitar <strong>11–13 jam</strong> dengan jarak ±570 km, termasuk 1–2 kali berhenti istirahat.
      </p>

      <h3>Kenapa pilih rute via Liwa bukan via Palembang?</h3>
      <p>
        Rute via Liwa lebih <strong>langsung dan tidak memutar</strong>. Rute via Palembang jaraknya jauh lebih panjang karena harus naik dulu ke Palembang baru turun ke Lampung. Via Liwa juga menawarkan pemandangan pesisir barat Sumatera yang luar biasa indah.
      </p>

      <h3>Bengkulu ke Bandar Lampung berapa km via Liwa?</h3>
      <p>
        Jarak Bengkulu ke Bandar Lampung via Liwa sekitar <strong>570 km</strong> melewati pesisir barat Sumatera.
      </p>

      <h3>Apakah bisa antar ke kota lain di Lampung selain Bandar Lampung?</h3>
      <p>
        Bisa! Kami juga melayani pengantaran ke Metro, Pringsewu, Kotabumi, dan kota-kota lain di Lampung. Hubungi kami untuk konfirmasi tarif sesuai tujuan.
      </p>

      <h3>Apakah ada travel Bengkulu Lampung setiap hari?</h3>
      <p>
        Ya, kami beroperasi <strong>setiap hari</strong>. Untuk rute Lampung yang cukup jauh, disarankan memesan minimal 1–2 hari sebelumnya.
      </p>

      <h3>Apakah melewati Pantai Krui?</h3>
      <p>
        Ya! Rute via Liwa melewati <strong>Pantai Krui</strong> di Pesisir Barat Lampung yang terkenal. Anda bisa menikmati pemandangannya sepanjang perjalanan.
      </p>

      <h2>Artikel Terkait</h2>
      <ul>
        <li><Link href="/travel-lampung-bengkulu" className="text-primary-600 hover:underline">Travel Lampung Bengkulu – Door to Door Rp 300.000</Link></li>
        <li><Link href="/travel-bengkulu-palembang" className="text-primary-600 hover:underline">Travel Bengkulu Palembang – Rp 250.000</Link></li>
        <li><Link href="/travel-bengkulu" className="text-primary-600 hover:underline">Semua Rute Travel Bengkulu</Link></li>
      </ul>
    </ArticleLayout>
  );
}
