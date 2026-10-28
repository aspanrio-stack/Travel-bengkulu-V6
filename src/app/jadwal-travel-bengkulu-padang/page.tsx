import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { BASE, rp, titik, jamPadang } from '@/lib/padang-silo';

const URL = `${BASE}/jadwal-travel-bengkulu-padang`;
const bkl = jamPadang('bkl-pdg');
const crp = jamPadang('crp-pdg');
const pdgBkl = jamPadang('pdg-bkl');

export const metadata: Metadata = {
  title: `Jadwal Travel Bengkulu Padang: Hiace ${titik(bkl.hiace)}, Mobil Random ${titik(bkl.random)}`,
  description: `Jadwal travel Bengkulu Padang terbaru: Hiace berangkat ${titik(bkl.hiace)} dan mobil random ${titik(bkl.random)} dari Kota Bengkulu. Jadwal dari Padang dan Curup juga ada. Cek kursi via WA 0852-6864-5461.`,
  alternates: { canonical: URL },
  openGraph: { title: 'Jadwal Travel Bengkulu Padang | Travel Bengkulu', url: URL, locale: 'id_ID', type: 'article' },
};

const ROWS = [
  { id: 'bkl-pdg', label: 'Kota Bengkulu → Padang', href: '/travel-bengkulu-padang' },
  { id: 'pdg-bkl', label: 'Padang → Kota Bengkulu', href: '/travel-padang-bengkulu' },
  { id: 'crp-pdg', label: 'Curup → Padang', href: '/travel-curup-padang' },
  { id: 'pdg-crp', label: 'Padang → Curup', href: '/travel-padang-curup' },
].map((r) => ({ ...r, j: jamPadang(r.id) }));

const faq: [string, string][] = [
  ['Jam berapa travel Bengkulu Padang berangkat?', `Dari Kota Bengkulu, Hiace berangkat pukul ${titik(bkl.hiace)} WIB dan mobil random pukul ${titik(bkl.random)} WIB. Dari Padang ke Bengkulu, Hiace berangkat pukul ${titik(pdgBkl.hiace)} WIB dan mobil random pukul ${titik(pdgBkl.random)} WIB.`],
  ['Apa bedanya Hiace dan mobil random?', `Hiace memakai tarif penuh dengan kabin lega, TV, dan audio. Mobil random bukan Hiace dan tarifnya Rp 50.000 lebih murah. Jenis kendaraan random tidak ditentukan.`],
  ['Apakah saya dijemput di rumah di Kota Bengkulu?', 'Ya, penjemputan di Kota Bengkulu disepakati dengan admin saat pemesanan. Setelah dijemput, mobil naik lewat Curup dan Lubuklinggau menuju Padang.'],
  ['Berapa lama perjalanan Bengkulu ke Padang?', `Perkiraan ${bkl.duration}, tergantung kondisi jalan, cuaca, dan lalu lintas. Berangkat siang hari, Anda umumnya tiba keesokan harinya.`],
  ['Bagaimana memastikan kursi di jam yang saya pilih?', 'Isi form pemesanan dan pilih jam, atau hubungi admin di 0852-6864-5461. Admin mengonfirmasi hari keberangkatan dan sisa kursi sebelum Anda membayar.'],
  ['Saya berada di Curup, jam berapa berangkatnya?', `Dari Curup, Hiace berangkat pukul ${titik(crp.hiace)} dan mobil random pukul ${titik(crp.random)}. Detailnya ada di halaman Curup ke Padang.`],
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Travel Bengkulu Padang', item: `${BASE}/travel-bengkulu-padang` },
      { '@type': 'ListItem', position: 3, name: 'Jadwal Travel Bengkulu Padang', item: URL },
    ] },
    { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ],
};

export default function Page() {
  return (
    <ArticleLayout
      title="Jadwal Travel Bengkulu Padang: Jam Berangkat Hiace & Mobil Random"
      description="Jam keberangkatan travel Bengkulu–Padang dari Kota Bengkulu, Padang, dan Curup, lengkap dengan tarif per armada."
      breadcrumbs={[{ label: 'Travel Bengkulu Padang', href: '/travel-bengkulu-padang' }, { label: 'Jadwal Travel Bengkulu Padang' }]}
      badge="🕐 Jadwal Terbaru"
      price={rp(bkl.hiaceHarga)}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p>
        <strong>Jadwal travel Bengkulu Padang</strong> dari Kota Bengkulu: <strong>Hiace pukul {titik(bkl.hiace)} WIB</strong>{' '}
        dan <strong>mobil random pukul {titik(bkl.random)} WIB</strong>. Dari Padang ke Bengkulu, Hiace berangkat pukul{' '}
        {titik(pdgBkl.hiace)} dan mobil random pukul {titik(pdgBkl.random)}. Hari keberangkatan dan sisa kursi dikonfirmasi admin saat pemesanan.
      </p>

      <h2>Jam Keberangkatan Semua Arah</h2>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Rute</th><th>Hiace</th><th>Mobil random</th><th></th></tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.label}</strong></td>
                <td>{titik(r.j.hiace)} WIB · {rp(r.j.hiaceHarga)}</td>
                <td>{titik(r.j.random)} WIB · {rp(r.j.randomHarga)}</td>
                <td><Link href={r.href} className="font-semibold text-primary-700 hover:underline">Detail →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">Tarif per orang. Mobil random bukan Hiace dan Rp 50.000 lebih murah.</p>

      <h2>Pilih Hiace atau Mobil Random?</h2>
      <div className="grid gap-4 sm:grid-cols-2 not-prose">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="font-bold text-emerald-900">🚐 Hiace, pukul {titik(bkl.hiace)}</div>
          <div className="mt-2 text-sm leading-relaxed text-emerald-900">
            Tarif {rp(bkl.hiaceHarga)} dari Kota Bengkulu. Kabin lega dengan sabuk pengaman, TV, dan audio.
          </div>
          <Link href={`/pesan?rute=bkl-pdg&jam=${bkl.hiace}`} className="mt-4 inline-flex rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
            Pesan Hiace {titik(bkl.hiace)}
          </Link>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="font-bold text-amber-900">🚗 Mobil random, pukul {titik(bkl.random)}</div>
          <div className="mt-2 text-sm leading-relaxed text-amber-900">
            Tarif {rp(bkl.randomHarga)} dari Kota Bengkulu. Bukan Hiace, jenis kendaraan tidak ditentukan.
          </div>
          <Link href={`/pesan?rute=bkl-pdg&jam=${bkl.random}`} className="mt-4 inline-flex rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600">
            Pesan Mobil Random {titik(bkl.random)}
          </Link>
        </div>
      </div>

      <h2>Perkiraan Lama Perjalanan</h2>
      <p>
        Bengkulu ke Padang diperkirakan <strong>{bkl.duration}</strong> dan Curup ke Padang <strong>{crp.duration}</strong>,
        tergantung kondisi jalan, cuaca, dan lalu lintas. Karena berangkat siang hari, penumpang umumnya tiba pada keesokan harinya.
        Jalurnya naik lewat Curup dan Lubuklinggau, bukan lewat Mukomuko.
      </p>

      <h2>Cara Memastikan Kursi di Jam Pilihan Anda</h2>
      <ol>
        <li>Buka <Link href="/pesan?rute=bkl-pdg">form pemesanan</Link> dan pilih rute serta jam keberangkatan.</li>
        <li>Isi jumlah penumpang dan alamat jemput di Kota Bengkulu.</li>
        <li>Admin mengonfirmasi hari, jam, dan sisa kursi lewat WhatsApp <a href="tel:+6285268645461">0852-6864-5461</a>.</li>
        <li>Bayar tunai atau QRIS, lalu siap dijemput sesuai jam yang disepakati.</li>
      </ol>

      <h2>Pertanyaan tentang Jadwal Travel Bengkulu Padang</h2>
      {faq.map(([q, a]) => (
        <details key={q} className="mb-3 rounded-2xl border border-slate-200 bg-stone-50 px-5 py-3 open:bg-white">
          <summary className="cursor-pointer font-semibold text-slate-800">{q}</summary>
          <div className="mt-2 text-slate-600">{a}</div>
        </details>
      ))}

      <h2>Layanan Terkait</h2>
      <ul>
        <li><Link href="/travel-bengkulu-padang" className="text-primary-600 hover:underline">Travel Bengkulu Padang Hiace (jemput di Kota Bengkulu)</Link></li>
        <li><Link href="/ongkos-travel-bengkulu-padang" className="text-primary-600 hover:underline">Ongkos Travel Bengkulu Padang per Tujuan</Link></li>
        <li><Link href="/travel-curup-padang" className="text-primary-600 hover:underline">Travel Curup Padang (berangkat langsung dari Curup)</Link></li>
        <li><Link href="/travel-padang-bengkulu" className="text-primary-600 hover:underline">Travel Padang Bengkulu (rute balik)</Link></li>
        <li><Link href="/travel-bengkulu" className="text-primary-600 hover:underline">Semua Rute Travel dari Bengkulu</Link></li>
      </ul>
    </ArticleLayout>
  );
}
