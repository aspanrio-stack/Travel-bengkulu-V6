import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Update Ongkos Travel Bengkulu 2026 – Tarif Terbaru Semua Rute',
  description:
    'Daftar tarif dan ongkos travel Bengkulu terbaru 2026. Rute Bengkulu–Palembang, Bengkulu–Jambi, Bengkulu–Curup, Bengkulu–Lebong, Bengkulu–Lampung. Info lengkap & terpercaya!',
  alternates: { canonical: 'https://bengkulutravel.com/ongkos-travel-bengkulu-2026' },
};

const routes = [
  {
    from: 'Bengkulu',
    to: 'Palembang',
    price: 250000,
    duration: '8–10 jam',
    via: null,
    href: '/travel-bengkulu-palembang',
    popular: true,
  },
  {
    from: 'Palembang',
    to: 'Bengkulu',
    price: 250000,
    duration: '8–10 jam',
    via: null,
    href: '/travel-palembang-bengkulu',
    popular: false,
  },
  {
    from: 'Bengkulu',
    to: 'Jambi',
    price: 250000,
    duration: '9–12 jam',
    via: null,
    href: '/travel-bengkulu-jambi',
    popular: true,
  },
  {
    from: 'Jambi',
    to: 'Bengkulu',
    price: 250000,
    duration: '9–12 jam',
    via: null,
    href: '/travel-jambi-bengkulu',
    popular: false,
  },
  {
    from: 'Bengkulu',
    to: 'Curup',
    price: 80000,
    duration: '2–2,5 jam',
    via: null,
    href: '/travel-bengkulu-curup',
    popular: true,
  },
  {
    from: 'Curup',
    to: 'Bengkulu',
    price: 80000,
    duration: '2–2,5 jam',
    via: null,
    href: '/travel-curup-bengkulu',
    popular: false,
  },
  {
    from: 'Bengkulu',
    to: 'Lebong',
    price: 100000,
    duration: '3–4 jam',
    via: 'Bengkulu Utara',
    href: '/travel-bengkulu-lebong',
    popular: false,
  },
  {
    from: 'Lebong',
    to: 'Bengkulu',
    price: 100000,
    duration: '3–4 jam',
    via: 'Bengkulu Utara',
    href: '/travel-lebong-bengkulu',
    popular: false,
  },
  {
    from: 'Bengkulu',
    to: 'Lampung',
    price: 300000,
    duration: '11–13 jam',
    via: 'Liwa',
    href: '/travel-bengkulu-lampung',
    popular: false,
  },
  {
    from: 'Lampung',
    to: 'Bengkulu',
    price: 300000,
    duration: '11–13 jam',
    via: 'Liwa',
    href: '/travel-lampung-bengkulu',
    popular: false,
  },
  {
    from: 'Curup',
    to: 'Bandara Bengkulu',
    price: 100000,
    duration: '2–2,5 jam',
    via: null,
    href: '/travel-curup-bandara-bengkulu',
    popular: false,
  },
  {
    from: 'Bandara Bengkulu',
    to: 'Curup',
    price: 100000,
    duration: '2–2,5 jam',
    via: null,
    href: '/antar-jemput-bandara-curup',
    popular: false,
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function OngkosTravelBengkulu2026() {
  return (
    <ArticleLayout
      title="Update Ongkos Travel Bengkulu 2026"
      description="Daftar lengkap tarif travel Bengkulu terbaru tahun 2026 untuk semua rute. Informasi resmi dari Travel Bengkulu."
      breadcrumbs={[{ label: 'Artikel' }, { label: 'Ongkos Travel Bengkulu 2026' }]}
      badge="📋 Update 2026"
    >
      <p>
        Bagi Anda yang sedang merencanakan perjalanan menggunakan jasa travel dari atau menuju Bengkulu, berikut adalah <strong>update ongkos travel Bengkulu terbaru tahun 2026</strong> yang berlaku di layanan kami. Semua tarif sudah termasuk sistem antar jemput <em>door to door</em> — dijemput dari rumah Anda dan diantar langsung ke tujuan tanpa biaya tambahan.
      </p>

      <h2>Daftar Tarif Travel Bengkulu 2026</h2>
      <p>
        Berikut adalah tarif resmi Travel Bengkulu yang berlaku mulai tahun 2026:
      </p>

      <table>
        <thead>
          <tr>
            <th>Rute Perjalanan</th>
            <th>Tarif 2026</th>
            <th>Estimasi Waktu</th>
            <th>Via</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={`${r.from}-${r.to}`}>
              <td>
                <Link href={r.href} className="text-primary-600 hover:underline font-semibold">
                  {r.from} → {r.to}
                </Link>
                {r.popular && (
                  <span className="ml-2 text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">
                    Populer
                  </span>
                )}
              </td>
              <td><strong>{formatPrice(r.price)}</strong>/orang</td>
              <td>{r.duration}</td>
              <td>{r.via || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-sm text-slate-500">
        * Tarif berlaku per orang, sistem door to door. Harga dapat berubah sewaktu-waktu. Konfirmasi tarif terkini via WhatsApp kami.
      </p>

      <h2>Apa Saja yang Sudah Termasuk dalam Tarif?</h2>
      <p>
        Tarif di atas sudah <strong>all-in</strong> mencakup:
      </p>
      <ul>
        <li>✅ Penjemputan di alamat Anda (rumah, hotel, kantor, dll)</li>
        <li>✅ Pengantaran langsung ke tujuan tanpa transit</li>
        <li>✅ Armada ber-AC (Toyota Avanza, Innova, atau HiAce)</li>
        <li>✅ Pengemudi berpengalaman dan ramah</li>
        <li>✅ Berhenti di rest area untuk istirahat</li>
        <li>❌ BBM tidak termasuk untuk sewa lepas kunci</li>
        <li>❌ Makanan dan minuman tidak termasuk</li>
      </ul>

      <h2>Perbandingan Tarif Berdasarkan Jarak</h2>
      <table>
        <thead>
          <tr>
            <th>Rute</th>
            <th>Jarak</th>
            <th>Tarif</th>
            <th>Tarif per KM</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bengkulu ↔ Curup</td>
            <td>±85 km</td>
            <td>Rp 80.000</td>
            <td>±Rp 941/km</td>
          </tr>
          <tr>
            <td>Bengkulu ↔ Lebong</td>
            <td>±150 km</td>
            <td>Rp 100.000</td>
            <td>±Rp 667/km</td>
          </tr>
          <tr>
            <td>Bengkulu ↔ Palembang</td>
            <td>±460 km</td>
            <td>Rp 250.000</td>
            <td>±Rp 543/km</td>
          </tr>
          <tr>
            <td>Bengkulu ↔ Jambi</td>
            <td>±540 km</td>
            <td>Rp 250.000</td>
            <td>±Rp 463/km</td>
          </tr>
          <tr>
            <td>Bengkulu ↔ Lampung</td>
            <td>±570 km</td>
            <td>Rp 300.000</td>
            <td>±Rp 526/km</td>
          </tr>
        </tbody>
      </table>

      <h2>Armada Travel Bengkulu 2026</h2>
      <p>
        Kami menggunakan tiga jenis armada yang disesuaikan dengan jumlah penumpang:
      </p>
      <ul>
        <li>
          <strong>Toyota Avanza</strong> — Kapasitas 5–6 penumpang. Cocok untuk keluarga kecil atau perjalanan antar kota jarak menengah seperti Bengkulu–Curup dan Bengkulu–Lebong.
        </li>
        <li>
          <strong>Toyota Innova</strong> — Kapasitas 6–7 penumpang. Lebih lapang dan nyaman untuk perjalanan jauh seperti Bengkulu–Palembang dan Bengkulu–Jambi.
        </li>
        <li>
          <strong>Toyota HiAce</strong> — Kapasitas 10–13 penumpang. Ideal untuk rombongan keluarga besar atau grup wisata.
        </li>
      </ul>

      <h2>Tips Hemat Ongkos Travel Bengkulu</h2>
      <ul>
        <li>
          <strong>Pergi rombongan</strong> — Sewa 1 unit kendaraan untuk keluarga besar lebih hemat dibanding beli kursi satuan
        </li>
        <li>
          <strong>Pesan jauh hari</strong> — Pemesanan H-3 atau lebih awal memastikan Anda mendapat armada pilihan
        </li>
        <li>
          <strong>Hindari tanggal merah</strong> — Saat libur panjang, armada cepat penuh. Pesan lebih awal atau pilih hari sebelum/sesudah libur
        </li>
        <li>
          <strong>Gabung dengan penumpang lain</strong> — Untuk perjalanan jauh seperti ke Palembang atau Jambi, bergabung dengan penumpang lain menghemat biaya
        </li>
        <li>
          <strong>Konfirmasi tarif via WhatsApp</strong> — Hubungi kami untuk harga terbaik terutama untuk rombongan
        </li>
      </ul>

      <h2>Cara Pesan Travel Bengkulu 2026</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Sebutkan rute dan tanggal keberangkatan</li>
        <li>Informasikan jumlah penumpang</li>
        <li>Berikan alamat penjemputan</li>
        <li>Konfirmasi pemesanan — driver hadir tepat waktu ✅</li>
      </ol>

      <p>
        Atau gunakan{' '}
        <Link href="/pesan" className="text-primary-600 font-semibold hover:underline">
          form pemesanan online
        </Link>{' '}
        kami yang praktis — isi data, kirim via WhatsApp, selesai!
      </p>

      <h2>FAQ Ongkos Travel Bengkulu 2026</h2>

      <h3>Apakah tarif travel Bengkulu 2026 naik dari tahun sebelumnya?</h3>
      <p>
        Tarif kami di tahun 2026 tetap kompetitif dan terjangkau. Kami berusaha menjaga harga agar tetap stabil demi kemudahan masyarakat. Konfirmasi tarif terkini selalu tersedia via WhatsApp kami.
      </p>

      <h3>Apakah ada biaya tambahan selain tarif yang tertera?</h3>
      <p>
        Tidak ada biaya tambahan. Tarif yang tertera sudah mencakup penjemputan di alamat Anda dan pengantaran ke tujuan. <strong>Tidak ada biaya supir, bensin, atau tol</strong> yang dibebankan kepada penumpang.
      </p>

      <h3>Bagaimana jika saya ingin sewa 1 mobil khusus (tidak gabung)?</h3>
      <p>
        Tersedia layanan sewa eksklusif 1 unit kendaraan. Hubungi kami via WhatsApp untuk mendapatkan penawaran harga sewa khusus sesuai rute dan jenis kendaraan yang diinginkan.
      </p>

      <h3>Apakah ada diskon untuk rombongan?</h3>
      <p>
        Untuk rombongan besar (10+ orang), kami menyediakan armada HiAce dengan harga spesial. Hubungi kami untuk negosiasi harga terbaik untuk grup Anda.
      </p>

      <h3>Berapa harga sewa mobil lepas kunci di Curup?</h3>
      <p>
        Rental mobil lepas kunci di Curup mulai dari{' '}
        <Link href="/rental-mobil-curup" className="text-primary-600 hover:underline">
          Rp 300.000 per hari
        </Link>.
        Tersedia Toyota Avanza, Innova, dan HiAce.
      </p>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 my-6">
        <h3 className="text-primary-800 font-bold text-lg mb-2">🚗 Pesan Travel Sekarang!</h3>
        <p className="text-slate-700 mb-4">
          Sudah tahu rutenya? Langsung pesan sekarang via WhatsApp atau gunakan form pemesanan online kami. Driver kami siap menjemput Anda tepat waktu!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/6285268645461?text=Halo%20saya%20ingin%20tanya%20tarif%20travel%20Bengkulu%202026"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-xl transition-colors text-center text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Tanya via WhatsApp
          </a>
          <Link
            href="/pesan"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl transition-colors text-center text-sm"
          >
            🎫 Pesan Online Sekarang
          </Link>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Artikel ini terakhir diperbarui: April 2026 · Tarif dapat berubah, konfirmasi via WhatsApp untuk harga terkini.
      </p>
    </ArticleLayout>
  );
}
