import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Lebong Bengkulu – Antar Jemput Door to Door Rp 100.000',
  description: 'Jasa travel Lebong Bengkulu via Bengkulu Utara. Tarif Rp 100.000/orang, door to door. Pesan via WhatsApp 0852-6864-5461!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-lebong-bengkulu' },
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
      "name": "Lebong–Bengkulu",
      "item": "https://bengkulutravel.com/travel-lebong-bengkulu"
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
      <div className="mb-8 rounded-2xl overflow-hidden border-2 border-primary-500 shadow-lg">

        {/* Header kotak */}
        <div className="bg-primary-600 px-5 py-3 flex items-center gap-2">
          <span className="text-xl">🎫</span>
          <p className="text-white font-bold text-base tracking-wide uppercase">
            Mau Pesan Travel? Pesan di Sini!
          </p>
        </div>

        {/* Isi kotak */}
        <div className="bg-primary-50 px-5 py-5 flex flex-col gap-4">

          {/* Tombol Pesan Online */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-primary-200 rounded-xl p-4">
            <div>
              <p className="font-bold text-primary-800 text-base">
                🖥️ Pesan Online — Isi Form &amp; Konfirmasi Otomatis
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                Isi form online, admin akan langsung mengkonfirmasi pesananmu secara otomatis.
              </p>
            </div>
            <Link
              href="/pesan?rute=lbg-bkl"
              className="shrink-0 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-extrabold px-7 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm whitespace-nowrap"
            >
              🎫 Pesan Online!
            </Link>
          </div>

          {/* Divider dengan label */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-primary-200" />
            <span className="text-xs text-primary-500 font-semibold uppercase tracking-widest">atau</span>
            <div className="flex-1 h-px bg-primary-200" />
          </div>

          {/* Tombol WhatsApp */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-green-200 rounded-xl p-4">
            <div>
              <p className="font-bold text-green-800 text-base">
                💬 Butuh Bantuan? Hubungi Admin
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                Tanya rute, jadwal, atau kendala pemesanan — admin siap membantu.
              </p>
            </div>
            <a
              href="https://wa.me/6285268645461?text=Halo%20admin%2C%20saya%20ingin%20bertanya%20tentang%20travel%20Lebong%20Bengkulu"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-extrabold px-7 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.546 5.877L.057 23.882a.5.5 0 0 0 .615.612l6.094-1.592A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.031-1.384l-.36-.214-3.733.976.999-3.648-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
              </svg>
              Hubungi Admin
            </a>
          </div>

          {/* Catatan kecil */}
          <p className="text-xs text-primary-600 text-center font-medium">
            ✅ Pesan via form online — konfirmasi otomatis &nbsp;|&nbsp; 🕐 Admin aktif setiap hari
          </p>
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
          <li><Link href="/travel-bengkulu-lebong" style={{color: "#16a34a", textDecoration: "underline"}}>Travel Bengkulu → Lebong</Link></li>
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
