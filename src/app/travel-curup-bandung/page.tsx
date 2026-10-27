import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ArticleLayout from '@/components/ArticleLayout';

const URL_HALAMAN = 'https://bengkulutravel.com/travel-curup-bandung';
const IMG = 'https://bengkulutravel.com/images/curup-bandung';

export const metadata: Metadata = {
  title: 'Travel Curup Bandung HiAce Rp 800.000 – Berangkat 2x Seminggu',
  description:
    'Travel Curup ke Bandung naik HiAce, tarif Rp 800.000/orang. Berangkat 2 kali seminggu, dijemput di Curup, kabin lega dengan TV & audio. Pesan WA 0852-6864-5461.',
  alternates: { canonical: URL_HALAMAN },
  openGraph: {
    title: 'Travel Curup Bandung HiAce Rp 800.000 | Travel Bengkulu',
    description: 'HiAce Curup–Bandung berangkat 2x seminggu. Tarif Rp 800.000, pesan via WhatsApp.',
    url: URL_HALAMAN,
    images: [{ url: `${IMG}/hiace-curup-bandung-hero.webp`, width: 750, height: 1000 }],
    locale: 'id_ID',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bengkulutravel.com' },
        { '@type': 'ListItem', position: 2, name: 'Travel Bengkulu', item: 'https://bengkulutravel.com/travel-bengkulu' },
        { '@type': 'ListItem', position: 3, name: 'Curup–Bandung', item: URL_HALAMAN },
      ],
    },
    {
      '@type': 'Service',
      name: 'Travel HiAce Curup ke Bandung',
      serviceType: 'Travel antar kota',
      url: URL_HALAMAN,
      image: `${IMG}/hiace-curup-bandung-hero.webp`,
      provider: { '@id': 'https://bengkulutravel.com/#organization' },
      areaServed: [{ '@type': 'City', name: 'Curup' }, { '@type': 'City', name: 'Bandung' }],
      offers: {
        '@type': 'Offer',
        price: '800000',
        priceCurrency: 'IDR',
        availability: 'https://schema.org/InStock',
        url: URL_HALAMAN,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Berapa tarif travel Curup ke Bandung?',
          acceptedAnswer: { '@type': 'Answer', text: 'Tarif travel HiAce Curup ke Bandung adalah Rp 800.000 per orang.' },
        },
        {
          '@type': 'Question',
          name: 'Kapan jadwal keberangkatan Curup ke Bandung?',
          acceptedAnswer: { '@type': 'Answer', text: 'Keberangkatan 2 kali dalam seminggu. Hubungi admin lewat WhatsApp untuk hari, jam, dan sisa kursi terbaru.' },
        },
        {
          '@type': 'Question',
          name: 'Apakah dijemput dari rumah di Curup?',
          acceptedAnswer: { '@type': 'Answer', text: 'Ya, penjemputan dilakukan di area Curup sesuai titik yang disepakati saat pemesanan.' },
        },
        {
          '@type': 'Question',
          name: 'Berapa lama perjalanan Curup ke Bandung?',
          acceptedAnswer: { '@type': 'Answer', text: 'Estimasi sekitar 30 sampai 36 jam termasuk penyeberangan Bakauheni–Merak, istirahat, dan makan. Waktu aktual bergantung pada kondisi jalan, antrean pelabuhan, dan cuaca.' },
        },
        {
          '@type': 'Question',
          name: 'Bagaimana cara memesan travel Curup Bandung?',
          acceptedAnswer: { '@type': 'Answer', text: 'Pesan lewat form online di website atau hubungi admin via WhatsApp, sebutkan tanggal berangkat, jumlah penumpang, dan titik jemput.' },
        },
      ],
    },
  ],
};

const galeri = [
  { src: 'interior-hiace-karaoke-tv.webp', w: 750, h: 1000, alt: 'Interior HiAce dengan TV, speaker, dan lampu LED biru', cap: 'Kabin dengan TV, speaker, dan lampu LED.' },
  { src: 'kursi-hiace-penumpang.webp', w: 750, h: 1000, alt: 'Kursi penumpang HiAce dengan sabuk pengaman', cap: 'Kursi penumpang dengan sabuk pengaman.' },
  { src: 'kabin-hiace-lega.webp', w: 712, h: 1000, alt: 'Kabin HiAce atap tinggi dengan ruang gerak lega', cap: 'Atap tinggi dan ruang gerak lega.' },
  { src: 'hiace-curup-bandung-malam.webp', w: 562, h: 1000, alt: 'HiAce putih saat penyeberangan malam Bakauheni–Merak', cap: 'Armada saat penyeberangan malam.' },
];

const faq = [
  ['Berapa tarif travel Curup ke Bandung?', 'Tarifnya Rp 800.000 per orang.'],
  ['Kapan jadwal keberangkatannya?', 'Berangkat 2 kali seminggu. Hubungi admin untuk hari, jam, dan sisa kursi terbaru.'],
  ['Apakah dijemput dari rumah di Curup?', 'Ya, penjemputan di area Curup sesuai titik yang disepakati saat pemesanan.'],
  ['Berapa lama perjalanannya?', 'Estimasi 30–36 jam termasuk penyeberangan Bakauheni–Merak, istirahat, dan makan. Waktu aktual bisa berubah karena kondisi jalan, antrean pelabuhan, dan cuaca.'],
  ['Bagaimana cara memesan?', 'Lewat form online di website ini atau WhatsApp admin.'],
];

export default function Page() {
  return (
    <ArticleLayout
      title="Travel Curup Bandung"
      description="Travel HiAce dari Curup langsung ke Bandung, berangkat 2 kali seminggu. Dijemput di Curup, kabin lega dengan TV dan audio."
      breadcrumbs={[
        { label: 'Travel Bengkulu', href: '/travel-bengkulu' },
        { label: 'Curup–Bandung' },
      ]}
      badge="🚐 Rute Baru"
      price="Rp 800.000"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
        <Image
          src="/images/curup-bandung/hiace-curup-bandung-hero.webp"
          alt="Toyota HiAce hitam armada travel Curup Bandung di atas kapal penyeberangan"
          fill
          priority
          className="object-cover object-bottom"
          sizes="(max-width: 1024px) 100vw, 700px"
        />
      </div>

      <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-primary-800 font-semibold text-sm">Berangkat 2x seminggu. Isi form untuk cek kursi.</p>
        <Link
          href="/pesan?rute=crp-bdg"
          className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
        >
          🎫 Pesan Sekarang
        </Link>
      </div>

      <p>
        <strong>Travel Curup Bandung</strong> kini tersedia dengan armada <strong>Toyota HiAce</strong>. Tarifnya{' '}
        <strong>Rp 800.000 per orang</strong>, berangkat <strong>2 kali seminggu</strong>, dan penumpang dijemput di
        area Curup. Cocok untuk Anda yang ingin ke Bandung tanpa berganti kendaraan di tengah perjalanan.
      </p>

      <h2>Tarif dan Informasi Perjalanan</h2>
      <table>
        <thead>
          <tr><th>Informasi</th><th>Detail</th></tr>
        </thead>
        <tbody>
          <tr><td>Rute</td><td><strong>Curup → Bandung</strong></td></tr>
          <tr><td>Tarif</td><td><strong>Rp 800.000/orang</strong></td></tr>
          <tr><td>Jadwal</td><td>2 kali seminggu (hari &amp; jam: konfirmasi admin)</td></tr>
          <tr><td>Estimasi waktu</td><td>30–36 jam, tergantung jalan, antrean pelabuhan, dan cuaca</td></tr>
          <tr><td>Armada</td><td>Toyota HiAce, sabuk pengaman, TV &amp; audio</td></tr>
          <tr><td>Penjemputan</td><td>Area Curup, titik disepakati saat pesan</td></tr>
        </tbody>
      </table>

      <h2>Rute Perjalanan Curup ke Bandung</h2>
      <p>
        Perjalanan melewati Lintas Sumatera menuju Bandar Lampung, lalu menyeberang dari Pelabuhan Bakauheni ke Merak,
        dan lanjut lewat jalan tol ke Bandung. Sopir berhenti di rumah makan dan SPBU untuk istirahat, makan, dan
        ibadah agar penumpang tidak kelelahan.
      </p>
      <p>
        Dari Bengkulu atau Bandara Bengkulu? Lihat juga{' '}
        <Link href="/travel-bengkulu-curup">travel Bengkulu → Curup</Link> dan{' '}
        <Link href="/antar-jemput-bandara-curup">antar jemput Bandara Bengkulu</Link> untuk menyambung perjalanan ke Curup.
      </p>

      <h2>Galeri Armada HiAce</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 not-prose">
        {galeri.map((g) => (
          <figure key={g.src} className="m-0">
            <Image
              src={`/images/curup-bandung/${g.src}`}
              alt={g.alt}
              width={g.w}
              height={g.h}
              loading="lazy"
              className="w-full h-64 object-cover rounded-xl"
              sizes="(max-width: 640px) 100vw, 340px"
            />
            <figcaption className="text-sm text-slate-500 mt-1.5">{g.cap}</figcaption>
          </figure>
        ))}
      </div>

      <h2>Keunggulan Travel HiAce Curup–Bandung</h2>
      <ul>
        <li><strong>Jadwal rutin</strong> — 2 kali seminggu, bisa direncanakan jauh hari</li>
        <li><strong>Tarif jelas</strong> — Rp 800.000/orang, admin menjelaskan yang termasuk sebelum Anda membayar</li>
        <li><strong>Dijemput di Curup</strong> — kirim titik jemput lewat WhatsApp</li>
        <li><strong>Kabin lega</strong> — atap tinggi, kursi bersabuk pengaman, TV dan audio</li>
        <li><strong>Pesan 24 jam</strong> — admin siap dihubungi kapan saja</li>
      </ul>

      <h2>Cara Memesan</h2>
      <ol>
        <li>Klik <strong>&quot;Pesan Sekarang&quot;</strong> atau hubungi admin: <a href="tel:+6285268645461">0852-6864-5461</a> / <a href="tel:+6282374497929">0823-7449-7929</a></li>
        <li>Informasikan tanggal berangkat dan jumlah penumpang</li>
        <li>Kirim titik penjemputan di Curup dan alamat tujuan di Bandung</li>
        <li>Admin mengonfirmasi kursi, jadwal, dan pembayaran</li>
      </ol>

      <h2>Pertanyaan yang Sering Diajukan</h2>
      {faq.map(([q, a]) => (
        <details key={q} className="mb-3 border border-slate-200 rounded-xl px-4 py-3">
          <summary className="font-semibold cursor-pointer">{q}</summary>
          <p className="mt-2 mb-0">{a}</p>
        </details>
      ))}

      <p className="text-sm text-slate-500 mt-8">
        Diperbarui 27 Oktober 2026 oleh tim Travel Bengkulu, BTN Air Bang Curup. Informasi tarif dan jadwal dikelola
        langsung oleh admin kami.
      </p>

      <section style={{marginTop: "2rem", padding: "1.25rem", background: "#f0f9f0", borderRadius: "8px", borderLeft: "4px solid #16a34a"}}>
        <h3 style={{marginBottom: "0.75rem", color: "#15803d", fontSize: "1rem", fontWeight: 700}}>Layanan &amp; Info Terkait Rute Curup</h3>
        <ul style={{listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
          <li><Link href="/travel-curup-bengkulu" style={{color: "#16a34a", textDecoration: "underline"}}>Travel Curup → Bengkulu</Link></li>
          <li><Link href="/travel-bengkulu-curup" style={{color: "#16a34a", textDecoration: "underline"}}>Travel Bengkulu → Curup</Link></li>
          <li><Link href="/rental-mobil-curup" style={{color: "#16a34a", textDecoration: "underline"}}>Rental Mobil Curup</Link></li>
          <li><Link href="/travel-curup-bandara-bengkulu" style={{color: "#16a34a", textDecoration: "underline"}}>Travel Curup–Bandara Bengkulu</Link></li>
          <li><Link href="/hotel-di-curup" style={{color: "#16a34a", textDecoration: "underline"}}>Hotel di Curup</Link></li>
          <li><Link href="/travel-bengkulu" style={{color: "#16a34a", textDecoration: "underline"}}>Semua Rute Travel Bengkulu</Link></li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
