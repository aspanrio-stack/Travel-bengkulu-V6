import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Rental Mobil Curup – Lepas Kunci Mulai Rp 300.000',
  description:
    'Sewa mobil di Curup lepas kunci mulai Rp 300.000/hari. Tersedia Toyota Avanza, Innova, HiAce. Cocok untuk wisata, bisnis, dan acara. Pesan via WA!',
  alternates: { canonical: 'https://bengkulutravel.com/rental-mobil-curup' },
};

export default function RentalMobilCurup() {
  return (
    <ArticleLayout
      title="Rental Mobil Curup"
      description="Sewa mobil di Curup dengan sistem lepas kunci. Bebas kemana saja dengan harga terjangkau."
      breadcrumbs={[{ label: 'Rental Mobil Curup' }]}
      badge="🔑 Lepas Kunci"
      price="Rp 300.000"
    >
      <p>
        <strong>Rental Mobil Curup</strong> menyediakan layanan sewa kendaraan dengan sistem <em>lepas kunci</em> — Anda bisa menggunakan mobil sesuka hati tanpa harus ditemani driver. Cocok untuk liburan keluarga, keperluan bisnis, atau acara-acara khusus di Curup dan Rejang Lebong.
      </p>

      <h2>Daftar Harga Rental Mobil Curup</h2>
      <table>
        <thead>
          <tr>
            <th>Tipe Kendaraan</th>
            <th>Harga per Hari</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Toyota Avanza</td>
            <td><strong>Rp 300.000</strong></td>
            <td>Lepas kunci, BBM sendiri</td>
          </tr>
          <tr>
            <td>Toyota Innova</td>
            <td><strong>Rp 400.000</strong></td>
            <td>Lepas kunci, BBM sendiri</td>
          </tr>
          <tr>
            <td>Toyota HiAce</td>
            <td><strong>Rp 600.000+</strong></td>
            <td>Hubungi untuk harga spesial</td>
          </tr>
        </tbody>
      </table>
      <p className="text-sm text-slate-500">* Harga sewaktu-waktu bisa berubah. Konfirmasi via WhatsApp untuk harga terbaru.</p>

      <h2>Ketentuan Sewa Mobil Lepas Kunci</h2>
      <ul>
        <li>Peminjam wajib memiliki SIM A yang masih berlaku</li>
        <li>KTP asli diserahkan sebagai jaminan selama penyewaan</li>
        <li>Bahan bakar (BBM) ditanggung penyewa</li>
        <li>Mobil dikembalikan dalam kondisi bersih</li>
        <li>Tidak boleh dibawa ke luar kota tanpa pemberitahuan sebelumnya</li>
        <li>Kerusakan akibat kelalaian penyewa menjadi tanggung jawab penyewa</li>
      </ul>

      <h2>Armada yang Tersedia</h2>
      <ul>
        <li>
          <strong>Toyota Avanza</strong> — Kapasitas 7 penumpang. MPV serbaguna yang irit BBM dan mudah dikendarai. Cocok untuk wisata keluarga di sekitar Curup.
        </li>
        <li>
          <strong>Toyota Innova</strong> — Kapasitas 7 penumpang. Lebih bertenaga dan nyaman, ideal untuk perjalanan ke area perbukitan sekitar Rejang Lebong.
        </li>
        <li>
          <strong>Toyota HiAce</strong> — Kapasitas 12–14 penumpang. Ideal untuk rombongan besar, gathering, atau acara keluarga.
        </li>
      </ul>

      <h2>Tempat Wisata yang Bisa Dikunjungi dari Curup</h2>
      <p>Dengan menyewa mobil di Curup, Anda bisa leluasa menjelajahi berbagai destinasi wisata di Rejang Lebong:</p>
      <ul>
        <li>Kebun Teh Kabawetan – ±30 menit dari Curup</li>
        <li>Danau Tes – ±45 menit dari Curup</li>
        <li>Air Terjun Suban – ±15 menit dari Curup</li>
        <li>Taman Nasional Kerinci Seblat (TNKS) – untuk petualangan alam</li>
        <li>Pasar Tradisional Curup – untuk oleh-oleh khas Rejang</li>
      </ul>

      <h2>Cara Menyewa Mobil di Curup</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Informasikan tanggal dan lama penyewaan</li>
        <li>Pilih tipe kendaraan yang diinginkan</li>
        <li>Siapkan KTP dan SIM A asli</li>
        <li>Bayar sesuai kesepakatan, kendaraan siap digunakan</li>
      </ol>
    </ArticleLayout>
  );
}
