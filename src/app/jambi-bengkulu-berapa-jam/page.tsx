import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Jambi Bengkulu Berapa Jam? Jarak, Rute & Estimasi Waktu',
  description:
    'Jambi ke Bengkulu berapa jam? Jaraknya ±540 km, waktu tempuh 9–12 jam via darat. Info rute lengkap, kondisi jalan, tips & travel door to door Rp 250.000.',
  alternates: { canonical: 'https://www.bengkulutravel.com/jambi-bengkulu-berapa-jam' },
};

export default function JambiBengkuluBerapaJam() {
  return (
    <ArticleLayout
      title="Jambi ke Bengkulu Berapa Jam?"
      description="Info lengkap jarak, waktu tempuh, rute terbaik, dan tips perjalanan dari Jambi ke Bengkulu."
      breadcrumbs={[{ label: 'Artikel' }, { label: 'Jambi Bengkulu Berapa Jam' }]}
      badge="🕐 Info Perjalanan"
    >
      <p>
        Banyak yang bertanya <strong>"Jambi ke Bengkulu berapa jam?"</strong> sebelum merencanakan perjalanan antar provinsi ini. Jawabannya tergantung pada moda transportasi yang digunakan dan kondisi jalan saat itu. Artikel ini membahas secara lengkap estimasi waktu, rute, dan tips terbaik perjalanan Jambi–Bengkulu.
      </p>

      <h2>Jambi ke Bengkulu Berapa Jam via Darat?</h2>
      <p>
        Perjalanan darat dari Jambi ke Bengkulu membutuhkan waktu sekitar <strong>9–12 jam</strong> dengan jarak tempuh <strong>±540 km</strong>. Waktu ini sudah termasuk 1–2 kali berhenti istirahat di perjalanan.
      </p>

      <h2>Perbandingan Semua Moda Transportasi</h2>
      <table>
        <thead>
          <tr>
            <th>Transportasi</th>
            <th>Jarak</th>
            <th>Waktu Tempuh</th>
            <th>Harga</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Travel Door to Door</strong></td>
            <td>±540 km</td>
            <td><strong>9–12 jam</strong></td>
            <td><strong>Rp 250.000/orang</strong></td>
          </tr>
          <tr>
            <td>Bus AKAP</td>
            <td>±540 km</td>
            <td>12–15 jam</td>
            <td>Rp 180.000–230.000</td>
          </tr>
          <tr>
            <td>Mobil Pribadi</td>
            <td>±540 km</td>
            <td>9–12 jam</td>
            <td>BBM ±Rp 400.000</td>
          </tr>
          <tr>
            <td>Pesawat (via transit)</td>
            <td>—</td>
            <td>4–6 jam total</td>
            <td>Rp 700.000+</td>
          </tr>
        </tbody>
      </table>

      <h2>Rute Jambi ke Bengkulu</h2>
      <p>Rute darat paling umum dan efisien dari Jambi ke Bengkulu:</p>
      <p>
        <strong>Jambi → Sarolangun → Bangko (Merangin) → Muara Bungo → Lubuklinggau → Curup → Kepahiang → Bengkulu</strong>
      </p>

      <h2>Detail Waktu Tempuh Per Segmen</h2>
      <table>
        <thead>
          <tr>
            <th>Segmen</th>
            <th>Jarak</th>
            <th>Estimasi Waktu</th>
            <th>Kondisi Jalan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jambi → Sarolangun</td>
            <td>±110 km</td>
            <td>2 jam</td>
            <td>Baik, jalan nasional</td>
          </tr>
          <tr>
            <td>Sarolangun → Bangko</td>
            <td>±60 km</td>
            <td>1 jam</td>
            <td>Baik</td>
          </tr>
          <tr>
            <td>Bangko → Muara Bungo</td>
            <td>±80 km</td>
            <td>1,5 jam</td>
            <td>Baik, ada tikungan</td>
          </tr>
          <tr>
            <td>Muara Bungo → Lubuklinggau</td>
            <td>±100 km</td>
            <td>2 jam</td>
            <td>Trans-Sumatera, baik</td>
          </tr>
          <tr>
            <td>Lubuklinggau → Curup</td>
            <td>±75 km</td>
            <td>1,5 jam</td>
            <td>Cukup baik</td>
          </tr>
          <tr>
            <td>Curup → Bengkulu</td>
            <td>±85 km</td>
            <td>2 jam</td>
            <td>Berkelok, perbukitan</td>
          </tr>
        </tbody>
      </table>

      <h2>Kota yang Dilewati dari Jambi ke Bengkulu</h2>
      <ul>
        <li><strong>Sarolangun</strong> — Kota pertama keluar Jambi, cocok untuk sarapan</li>
        <li><strong>Bangko/Merangin</strong> — Terkenal dengan Geopark Merangin, fosil tanaman purba</li>
        <li><strong>Muara Bungo</strong> — Kota transit ramai, banyak rumah makan dan SPBU</li>
        <li><strong>Lubuklinggau</strong> — Kota terbesar di jalur ini, cocok istirahat siang</li>
        <li><strong>Curup</strong> — Kota sejuk di kaki gunung, hampir sampai Bengkulu</li>
      </ul>

      <h2>Tips Perjalanan Jambi ke Bengkulu</h2>
      <ul>
        <li><strong>Berangkat pukul 05.00–06.00 WIB</strong> agar tiba di Bengkulu sebelum malam</li>
        <li><strong>Istirahat di Muara Bungo</strong> untuk makan siang, pilihan restoran banyak</li>
        <li><strong>Waspada segmen Curup–Bengkulu</strong> yang berkelok dan menurun tajam</li>
        <li><strong>Isi BBM di Lubuklinggau</strong> sebelum melanjutkan perjalanan ke Bengkulu</li>
        <li><strong>Bawa jaket</strong> karena area Curup cukup dingin terutama pagi hari</li>
        <li><strong>Pesan travel H-1</strong> terutama saat libur panjang dan lebaran</li>
      </ul>

      <h2>Kenapa Pilih Travel Dibanding Bus?</h2>
      <p>
        Meskipun harga bus lebih murah, travel door to door menawarkan keunggulan yang signifikan untuk perjalanan jauh seperti Jambi–Bengkulu:
      </p>
      <ul>
        <li>Tidak perlu ke terminal — dijemput langsung di rumah atau hotel</li>
        <li>Lebih cepat 2–3 jam karena tidak banyak berhenti</li>
        <li>Kenyamanan lebih baik dengan kursi yang lebih lega</li>
        <li>Diantar langsung ke tujuan di Bengkulu</li>
        <li>Pengemudi berpengalaman di rute Trans-Sumatera</li>
      </ul>

      <h2>FAQ Jambi ke Bengkulu</h2>

      <h3>Jambi ke Bengkulu berapa km?</h3>
      <p>Jarak Jambi ke Bengkulu via darat sekitar <strong>540–580 km</strong> tergantung rute yang diambil.</p>

      <h3>Bengkulu ke Jambi berapa jam naik travel?</h3>
      <p>Dengan travel door to door, perjalanan Bengkulu–Jambi (atau Jambi–Bengkulu) membutuhkan waktu <strong>9–12 jam</strong> termasuk istirahat.</p>

      <h3>Berapa ongkos travel Jambi ke Bengkulu?</h3>
      <p>Tarif travel Jambi–Bengkulu di layanan kami <strong>Rp 250.000 per orang</strong>, sudah termasuk jemput di lokasi Anda dan antar ke tujuan.</p>

      <h3>Apakah ada travel Jambi Bengkulu setiap hari?</h3>
      <p>Ya, kami beroperasi <strong>setiap hari</strong>. Hubungi kami via WhatsApp untuk cek jadwal dan ketersediaan kursi.</p>

      <h3>Rute mana yang paling cepat dari Jambi ke Bengkulu?</h3>
      <p>Rute tercepat adalah via <strong>Sarolangun–Bangko–Muara Bungo–Lubuklinggau–Curup–Bengkulu</strong>. Hindari rute memutar yang justru lebih lama.</p>

      <h2>Artikel Terkait</h2>
      <ul>
        <li><Link href="/travel-jambi-bengkulu" className="text-primary-600 hover:underline">Travel Jambi Bengkulu – Antar Jemput Door to Door</Link></li>
        <li><Link href="/travel-bengkulu-jambi" className="text-primary-600 hover:underline">Travel Bengkulu Jambi – Jadwal dan Tarif</Link></li>
        <li><Link href="/jarak-jambi-bengkulu" className="text-primary-600 hover:underline">Jarak Jambi Bengkulu – Info Lengkap</Link></li>
      </ul>
    </ArticleLayout>
  );
}
