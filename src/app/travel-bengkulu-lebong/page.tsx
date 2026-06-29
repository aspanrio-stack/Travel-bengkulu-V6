import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Lebong Bengkulu – Antar Jemput Door to Door Rp 100.000',
  description: 'Jasa travel Lebong Bengkulu via Bengkulu Utara. Tarif Rp 100.000/orang, door to door. Pesan via WhatsApp 0852-6864-5461!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-bengkulu-lebong' },
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
      "name": "Bengkulu–Lebong",
      "item": "https://bengkulutravel.com/travel-bengkulu-lebong"
    }
  ]
};

export default function Page() {
  return (
    <ArticleLayout
      title="Travel Lebong Bengkulu"
      description="Layanan travel dari Lebong ke Bengkulu. Dijemput dari Muara Aman langsung ke tujuan Anda di Bengkulu."
      breadcrumbs={[{ label: 'Travel Lebong Bengkulu' }]}
      badge="🚗 Rute Baru"
      price="Rp 100.000"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ===== KOTAK PEMESANAN UTAMA ===== */}
      <div className="mb-6 rounded-2xl overflow-hidden border-2 border-primary-500 shadow-lg">
        <div className="bg-primary-600 px-5 py-3 flex items-center gap-2">
          <span className="text-xl">🎫</span>
          <p className="text-white font-bold text-base tracking-wide uppercase">
            Mau Pesan Travel? Pesan di Sini!
          </p>
        </div>
        <div className="bg-primary-50 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-primary-800">
            Isi form online — admin akan <strong>mengkonfirmasi pesananmu secara otomatis</strong> ✅
          </p>
          <Link
            href="/pesan?rute=lbg-bkl"
            className="shrink-0 relative bg-primary-600 hover:bg-primary-700 hover:scale-105 active:scale-95 text-white font-extrabold px-7 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm whitespace-nowrap animate-bounce"
            style={{ animationDuration: '1.2s' }}
          >
            🎫 Pesan Online!
          </Link>
        </div>
      </div>
      {/* ===== END KOTAK PEMESANAN ===== */}

      <p>
        <strong>Travel Lebong Bengkulu</strong> melayani perjalanan dengan sistem antar jemput <em>door to door</em>.
        Dengan tarif <strong>Rp 100.000 per orang</strong>, kami menjemput langsung dari lokasi Anda
        via Bengkulu Utara dan mengantarkan ke tujuan tanpa perlu berganti kendaraan.
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
          <tr><td>Rute</td><td><strong>Lebong → Bengkulu</strong></td></tr>
          <tr><td>Tarif</td><td><strong>Rp 100.000/orang</strong></td></tr>
          <tr><td>Jarak</td><td>±150 km</td></tr>
          <tr><td>Waktu Tempuh</td><td>3–4 jam</td></tr>
          <tr><td>Via</td><td>Bengkulu Utara</td></tr>
          <tr><td>Jadwal</td><td>Setiap hari, fleksibel</td></tr>
          <tr><td>Sistem</td><td>Door to door</td></tr>
          <tr><td>Armada</td><td>Toyota Avanza, Innova, HiAce</td></tr>
        </tbody>
      </table>

      <h2>Cara Memesan</h2>
      <ol>
        <li>Klik tombol <strong>"Pesan Online!"</strong> di atas untuk mengisi form pemesanan</li>
        <li>Informasikan tanggal berangkat dan jumlah penumpang</li>
        <li>Berikan alamat lengkap penjemputan</li>
        <li>Konfirmasi pesanan — driver kami siap menjemput tepat waktu ✅</li>
      </ol>

      <h2>Keunggulan Layanan Kami</h2>
      <ul>
        <li><strong>Door to Door</strong> — dijemput dari rumah, diantar ke tujuan</li>
        <li><strong>Tarif Flat</strong> — Rp 100.000/orang, tidak ada biaya tersembunyi</li>
        <li><strong>Armada Terawat</strong> — Avanza, Innova, HiAce ber-AC</li>
        <li><strong>Pengemudi Berpengalaman</strong> — hafal rute Lebong–Bengkulu</li>
        <li><strong>Pesan 24 Jam</strong> — via WhatsApp kapan saja</li>
      </ul>

      <section style={{marginTop: "2rem", padding: "1.25rem", background: "#f0f9f0", borderRadius: "8px", borderLeft: "4px solid #16a34a"}}>
        <h3 style={{marginBottom: "0.75rem", color: "#15803d", fontSize: "1rem", fontWeight: 700}}>Layanan &amp; Info Terkait Rute Lebong</h3>
        <ul style={{listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
          <li><Link href="/travel-lebong-bengkulu" style={{color: "#16a34a", textDecoration: "underline"}}>Travel Lebong → Bengkulu</Link></li>
          <li><Link href="/bengkulu-lebong-berapa-jam" style={{color: "#16a34a", textDecoration: "underline"}}>Bengkulu–Lebong Berapa Jam?</Link></li>
          <li><Link href="/jarak-bengkulu-lebong" style={{color: "#16a34a", textDecoration: "underline"}}>Jarak Bengkulu–Lebong</Link></li>
          <li><Link href="/bengkulu-lebong-lewat-mana" style={{color: "#16a34a", textDecoration: "underline"}}>Bengkulu–Lebong Lewat Mana?</Link></li>
          <li><Link href="/makanan-khas-lebong" style={{color: "#16a34a", textDecoration: "underline"}}>Makanan Khas Lebong</Link></li>
          <li><Link href="/travel-bengkulu" style={{color: "#16a34a", textDecoration: "underline"}}>Semua Rute Travel Bengkulu</Link></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
