import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Lampung Bengkulu – Antar Jemput Door to Door Rp 300.000',
  description: 'Jasa travel Lampung Bengkulu via Liwa. Tarif Rp 300.000/orang, door to door. Dijemput dari Bandar Lampung ke Bengkulu. Pesan via WhatsApp!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-lampung-bengkulu' },
};

export default function Page() {
  return (
    <ArticleLayout
      title="Travel Lampung Bengkulu"
      description="Layanan travel dari Lampung ke Bengkulu via jalur Liwa-Krui. Antar jemput door to door setiap hari."
      breadcrumbs={[{ label: 'Travel Lampung Bengkulu' }]}
      badge="🔥 Rute Baru"
      price="Rp 300.000"
    >
      {/* Tombol Pesan */}
      <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-primary-800 font-semibold text-sm">Siap memesan? Klik tombol di bawah untuk langsung ke form pemesanan.</p>
        <Link
          href="/pesan?rute=lmp-bkl"
          className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm"
        >
          🎫 Pesan Sekarang
        </Link>
      </div>

      <p>
        <strong>Travel Lampung Bengkulu</strong> melayani perjalanan dengan sistem antar jemput <em>door to door</em>.
        Dengan tarif <strong>Rp 300.000 per orang</strong>, kami menjemput langsung dari lokasi Anda
        via Liwa dan mengantarkan ke tujuan tanpa perlu berganti kendaraan.
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
          <tr><td>Rute</td><td><strong>Lampung → Bengkulu</strong></td></tr>
          <tr><td>Tarif</td><td><strong>Rp 300.000/orang</strong></td></tr>
          <tr><td>Jarak</td><td>±570 km</td></tr>
          <tr><td>Waktu Tempuh</td><td>11–13 jam</td></tr>
          <tr><td>Via</td><td>Liwa</td></tr>
          <tr><td>Jadwal</td><td>Setiap hari, fleksibel</td></tr>
          <tr><td>Sistem</td><td>Door to door</td></tr>
          <tr><td>Armada</td><td>Toyota Avanza, Innova, HiAce</td></tr>
        </tbody>
      </table>

      <h2>Cara Memesan</h2>
      <ol>
        <li>Klik tombol <strong>"Pesan Sekarang"</strong> di atas, atau hubungi via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Informasikan tanggal berangkat dan jumlah penumpang</li>
        <li>Berikan alamat lengkap penjemputan</li>
        <li>Konfirmasi pesanan — driver kami siap menjemput tepat waktu ✅</li>
      </ol>

      <h2>Keunggulan Layanan Kami</h2>
      <ul>
        <li><strong>Door to Door</strong> — dijemput dari rumah, diantar ke tujuan</li>
        <li><strong>Tarif Flat</strong> — Rp 300.000/orang, tidak ada biaya tersembunyi</li>
        <li><strong>Armada Terawat</strong> — Avanza, Innova, HiAce ber-AC</li>
        <li><strong>Pengemudi Berpengalaman</strong> — hafal rute Lampung–Bengkulu</li>
        <li><strong>Pesan 24 Jam</strong> — via WhatsApp kapan saja</li>
      </ul>

      <h2>Layanan Terkait</h2>
      <ul>
        <li><Link href="/travel-bengkulu" className="text-primary-600 hover:underline">Semua Rute Travel Bengkulu</Link></li>
        <li><Link href="/pesan" className="text-primary-600 hover:underline">Form Pemesanan Online</Link></li>
      </ul>
    </ArticleLayout>
  );
}
