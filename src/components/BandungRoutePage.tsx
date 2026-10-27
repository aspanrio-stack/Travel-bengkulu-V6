import Link from 'next/link';
import Image from 'next/image';
import ArticleLayout from '@/components/ArticleLayout';
import type { BandungRoute } from '@/lib/bandung-routes';

const BASE = 'https://bengkulutravel.com';
const IMG_DIR = '/images/curup-bandung';

const INTERIOR = [
  { src: 'interior-hiace-karaoke-tv.webp', w: 750, h: 1000, alt: 'Interior Hiace dengan TV, speaker, dan lampu LED biru', cap: 'Kabin dengan TV, speaker, dan lampu LED.' },
  { src: 'kursi-hiace-penumpang.webp', w: 750, h: 1000, alt: 'Kursi penumpang Hiace dengan sabuk pengaman', cap: 'Kursi penumpang dengan sabuk pengaman.' },
  { src: 'kabin-hiace-lega.webp', w: 712, h: 1000, alt: 'Kabin Hiace atap tinggi dengan ruang gerak lega', cap: 'Atap tinggi dan ruang gerak lega.' },
];

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export default function BandungRoutePage({ r }: { r: BandungRoute }) {
  const url = `${BASE}/${r.slug}`;
  const nama = `${r.from} ${r.to}`;
  const harga = rp(r.price);
  const heroIsMalam = r.heroSrc.includes('malam');
  const extra = heroIsMalam
    ? { src: 'hiace-curup-bandung-hero.webp', w: 750, h: 1000, alt: `Hiace hitam armada travel ${nama} di atas kapal`, cap: 'Armada Hiace di atas kapal penyeberangan.' }
    : { src: 'hiace-curup-bandung-malam.webp', w: 562, h: 1000, alt: `Hiace putih armada travel ${nama} saat penyeberangan malam`, cap: 'Armada saat penyeberangan malam.' };
  const galeri = [...INTERIOR, extra];

  const faq: [string, string][] = [
    [`Berapa tarif travel ${nama}?`, `Tarif travel Hiace ${nama} adalah ${harga} per orang.`],
    ['Kapan jadwal keberangkatannya?', 'Berangkat 2 kali seminggu. Hubungi admin untuk hari, jam, dan sisa kursi terbaru.'],
    [`Lewat mana rute travel ${nama}?`, r.jalur],
    ['Berapa lama perjalanannya?', `Estimasi ${r.duration} termasuk penyeberangan Bakauheni–Merak, istirahat, dan makan. Waktu aktual bisa berubah karena kondisi jalan, antrean pelabuhan, dan cuaca.`],
    ['Bagaimana cara memesan?', 'Lewat form online di website ini atau WhatsApp admin.'],
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Travel Bengkulu', item: `${BASE}/travel-bengkulu` },
          { '@type': 'ListItem', position: 3, name: `${r.from}–${r.to}`, item: url },
        ],
      },
      {
        '@type': 'Service',
        name: `Travel Hiace ${r.from} ke ${r.to}`,
        serviceType: 'Travel antar kota',
        url,
        image: `${BASE}${IMG_DIR}/${r.heroSrc}`,
        provider: { '@id': `${BASE}/#organization` },
        areaServed: [{ '@type': 'City', name: r.from }, { '@type': 'City', name: r.to }],
        offers: { '@type': 'Offer', price: String(r.price), priceCurrency: 'IDR', availability: 'https://schema.org/InStock', url },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };

  return (
    <ArticleLayout
      title={r.h1}
      description={r.lead}
      breadcrumbs={[{ label: 'Travel Bengkulu', href: '/travel-bengkulu' }, { label: `${r.from}–${r.to}` }]}
      badge="🚐 Rute Baru · Via Tol"
      price={harga}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
        <Image
          src={`${IMG_DIR}/${r.heroSrc}`}
          alt={r.heroAlt}
          fill
          priority
          className={heroIsMalam ? 'object-cover object-[50%_65%]' : 'object-cover object-bottom'}
          sizes="(max-width: 1024px) 100vw, 700px"
        />
      </div>

      <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-primary-800 font-semibold text-sm">Berangkat 2x seminggu. Isi form untuk cek kursi.</p>
        <Link href={`/pesan?rute=${r.routeId}`} className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
          🎫 Pesan Sekarang
        </Link>
      </div>

      <p>
        <strong>Travel {nama} Hiace</strong> melayani perjalanan dari {r.from} langsung ke {r.tujuan} lewat{' '}
        <strong>Tol Palembang</strong> dengan armada <strong>Toyota Hiace</strong>. Tarif <strong>{harga} per orang</strong>,
        berangkat <strong>2 kali seminggu</strong>. Banyak penumpang memilih Hiace karena kabinnya lebih lega dan nyaman
        untuk perjalanan jauh.
      </p>

      <h2>Tarif dan Informasi Perjalanan</h2>
      <table>
        <thead><tr><th>Informasi</th><th>Detail</th></tr></thead>
        <tbody>
          <tr><td>Rute</td><td><strong>{r.from} → {r.to}</strong> via Tol Palembang</td></tr>
          <tr><td>Tarif</td><td><strong>{harga}/orang</strong></td></tr>
          <tr><td>Jadwal</td><td>2 kali seminggu (hari &amp; jam: konfirmasi admin)</td></tr>
          <tr><td>Estimasi waktu</td><td>{r.duration}, tergantung jalan, antrean pelabuhan, dan cuaca</td></tr>
          <tr><td>Armada</td><td>Toyota Hiace, sabuk pengaman, TV &amp; audio</td></tr>
          <tr><td>Penjemputan</td><td>{r.jemput}, titik disepakati saat pesan</td></tr>
        </tbody>
      </table>

      <h2>Rute Perjalanan {r.from} ke {r.to} via Tol Palembang</h2>
      <p>{r.jalur}</p>
      <p>
        Sopir berhenti di rumah makan dan SPBU untuk istirahat, makan, dan ibadah agar penumpang tidak kelelahan.
        Lihat juga rute searah: {r.related.slice(0, 2).map((x, i) => (
          <span key={x.href}>{i > 0 && ' dan '}<Link href={x.href}>{x.label}</Link></span>
        ))}.
      </p>

      <h2>Galeri Armada Hiace</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {galeri.map((g) => (
          <figure key={g.src} className="m-0">
            <Image src={`${IMG_DIR}/${g.src}`} alt={g.alt} width={g.w} height={g.h} loading="lazy" className="w-full h-64 object-cover rounded-xl" sizes="(max-width: 640px) 100vw, 340px" />
            <figcaption className="text-sm text-slate-500 mt-1.5">{g.cap}</figcaption>
          </figure>
        ))}
      </div>

      <h2>Kenapa Pilih Travel Hiace {nama}</h2>
      <ul>
        <li><strong>Hiace kabin lega</strong> — atap tinggi, kursi bersabuk pengaman, TV dan audio</li>
        <li><strong>Via tol</strong> — rute Palembang–Lampung lewat Tol Trans Sumatera</li>
        <li><strong>Jadwal rutin</strong> — 2 kali seminggu, bisa direncanakan jauh hari</li>
        <li><strong>Tarif jelas</strong> — {harga}/orang, admin menjelaskan yang termasuk sebelum Anda membayar</li>
        <li><strong>Pesan 24 jam</strong> — admin siap dihubungi kapan saja</li>
      </ul>

      <h2>Cara Memesan</h2>
      <ol>
        <li>Klik <strong>&quot;Pesan Sekarang&quot;</strong> atau hubungi admin: <a href="tel:+6285268645461">0852-6864-5461</a> / <a href="tel:+6282374497929">0823-7449-7929</a></li>
        <li>Informasikan tanggal berangkat dan jumlah penumpang</li>
        <li>Kirim titik penjemputan di {r.from} dan alamat tujuan di {r.tujuan}</li>
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
        Diperbarui 27 Oktober 2026 oleh tim Travel Bengkulu, BTN Air Bang Curup. Informasi tarif dan jadwal dikelola langsung oleh admin kami.
      </p>

      <section style={{marginTop: '2rem', padding: '1.25rem', background: '#f0f9f0', borderRadius: '8px', borderLeft: '4px solid #16a34a'}}>
        <h3 style={{marginBottom: '0.75rem', color: '#15803d', fontSize: '1rem', fontWeight: 700}}>Rute &amp; Info Terkait</h3>
        <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
          {r.related.map((x) => (
            <li key={x.href}><Link href={x.href} style={{color: '#16a34a', textDecoration: 'underline'}}>{x.label}</Link></li>
          ))}
        </ul>
      </section>
    </ArticleLayout>
  );
}
