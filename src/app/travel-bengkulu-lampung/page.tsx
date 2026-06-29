import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Bengkulu Lampung – Antar Jemput Door to Door Rp 300.000',
  description: 'Jasa travel Bengkulu Lampung via Liwa. Tarif Rp 300.000/orang, door to door. Rute tercepat lewat Liwa-Krui. Pesan via WhatsApp!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-bengkulu-lampung' },
};


const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://bengkulutravel.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Travel Bengkulu",
      "item": "https://bengkulutravel.com/travel-bengkulu"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Bengkulu–Lampung",
      "item": "https://bengkulutravel.com/travel-bengkulu-lampung"
    }
  ]
};

export default function Page() {
  return (
    <ArticleLayout
      title="Travel Bengkulu Lampung"
      description="Layanan travel Bengkulu–Lampung via jalur Liwa-Krui. Rute tercepat dengan pemandangan pantai barat Sumatera yang indah."
      breadcrumbs={[{ label: 'Travel Bengkulu Lampung' }]}
      badge="🔥 Rute Baru"
      price="Rp 300.000"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Tombol Pesan */}
      <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-primary-800 font-semibold text-sm">Siap memesan? Klik tombol di bawah untuk langsung ke form pemesanan.</p>
        <Link
          href="/pesan?rute=bkl-lmp"
          className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm"
        >
          🎫 Pesan Sekarang
        </Link>
      </div>

      <p>
        <strong>Travel Bengkulu Lampung</strong> melayani perjalanan dengan sistem antar jemput <em>door to door</em>.
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
          <tr><td>Rute</td><td><strong>Bengkulu → Lampung</strong></td></tr>
          <tr><td>Tarif</td><td><strong>Rp 300.000/orang</strong></td></tr>
          <tr><td>Jarak</td><td>±570 km</td></tr>
          <tr><td>Waktu Tempuh</td><td>11–13 jam</td></tr>
          <tr><td>Via</td><td>Liwa</td></tr>
          <tr><td>Jadwal</td><td>Setiap hari, fleksibel</td></tr>
          <tr><td>Sistem</td><td>Door to door</td></tr>
          <tr><td>Armada</td><td>Toyota Innova, HiAce</td></tr>
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
        <li><strong>Pengemudi Berpengalaman</strong> — hafal rute Bengkulu–Lampung</li>
        <li><strong>Pesan 24 Jam</strong> — via WhatsApp kapan saja</li>
      </ul>

      <section style={{marginTop: "2rem", padding: "1.25rem", background: "#f0f9f0", borderRadius: "8px", borderLeft: "4px solid #16a34a"}}>
        <h3 style={{marginBottom: "0.75rem", color: "#15803d", fontSize: "1rem", fontWeight: 700}}>Layanan &amp; Info Terkait Rute Lampung</h3>
        <ul style={{listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
          <li><Link href="/travel-lampung-bengkulu" style={{color: "#16a34a", textDecoration: "underline"}}>Travel Lampung → Bengkulu</Link></li>
          <li><Link href="/berapa-jam-lampung-bengkulu" style={{color: "#16a34a", textDecoration: "underline"}}>Lampung ke Bengkulu Berapa Jam?</Link></li>
          <li><Link href="/lampung-bengkulu-lewat-mana" style={{color: "#16a34a", textDecoration: "underline"}}>Lampung–Bengkulu Lewat Mana?</Link></li>
          <li><Link href="/ongkos-travel-bengkulu-lampung" style={{color: "#16a34a", textDecoration: "underline"}}>Ongkos Travel Bengkulu–Lampung</Link></li>
          <li><Link href="/ongkos-travel-bengkulu-2026" style={{color: "#16a34a", textDecoration: "underline"}}>Ongkos Travel Bengkulu 2026</Link></li>
          <li><Link href="/travel-bengkulu" style={{color: "#16a34a", textDecoration: "underline"}}>Semua Rute Travel Bengkulu</Link></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
