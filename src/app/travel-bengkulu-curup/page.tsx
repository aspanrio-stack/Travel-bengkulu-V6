import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Travel Bengkulu Curup – Antar Jemput Door to Door Rp 80.000',
  description:
    'Jasa travel Bengkulu Curup door to door murah. Tarif hanya Rp 80.000/orang. Berangkat setiap hari. Armada nyaman. Pesan via WhatsApp 0852-6864-5461!',
  alternates: { canonical: 'https://bengkulutravel.com/travel-bengkulu-curup' },
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
      "name": "Bengkulu–Curup",
      "item": "https://bengkulutravel.com/travel-bengkulu-curup"
    }
  ]
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Tombol Pesan Cepat */}
      <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-primary-800 font-semibold text-sm">Siap memesan? Klik tombol di bawah untuk langsung ke form pemesanan.</p>
        <Link
          href="/pesan?rute=bkl-crp"
          className="shrink-0 bg-primary-700 hover:bg-primary-800 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm"
        >
          🎫 Pesan Sekarang
        </Link>
      </div>
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

      <section style={{marginTop: "2rem", padding: "1.25rem", background: "#f0f9f0", borderRadius: "8px", borderLeft: "4px solid #16a34a"}}>
        <h3 style={{marginBottom: "0.75rem", color: "#15803d", fontSize: "1rem", fontWeight: 700}}>Layanan &amp; Info Terkait Rute Curup</h3>
        <ul style={{listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
          <li><Link href="/travel-curup-bengkulu" style={{color: "#16a34a", textDecoration: "underline"}}>Travel Curup → Bengkulu</Link></li>
          <li><Link href="/rental-mobil-curup" style={{color: "#16a34a", textDecoration: "underline"}}>Rental Mobil Curup</Link></li>
          <li><Link href="/antar-jemput-bandara-curup" style={{color: "#16a34a", textDecoration: "underline"}}>Antar Jemput Bandara Curup</Link></li>
          <li><Link href="/travel-curup-bandara-bengkulu" style={{color: "#16a34a", textDecoration: "underline"}}>Travel Curup–Bandara Bengkulu</Link></li>
          <li><Link href="/makanan-khas-curup" style={{color: "#16a34a", textDecoration: "underline"}}>Makanan Khas Curup</Link></li>
          <li><Link href="/travel-bengkulu" style={{color: "#16a34a", textDecoration: "underline"}}>Semua Rute Travel Bengkulu</Link></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
