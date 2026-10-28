import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { BASE, rp, jamPadang, tarifTujuanPadang } from '@/lib/padang-silo';

const URL = `${BASE}/ongkos-travel-bengkulu-padang`;
const bkl = jamPadang('bkl-pdg');
const pdg = jamPadang('pdg-bkl');
const tarif = tarifTujuanPadang();
const murah = tarif.filter((t) => t.hiace < bkl.hiaceHarga).map((t) => t.nama);

export const metadata: Metadata = {
  title: `Ongkos Travel Bengkulu Padang 2026: Hiace ${rp(bkl.hiaceHarga)}`,
  description: `Ongkos travel Bengkulu Padang 2026: Hiace ${rp(bkl.hiaceHarga)} per orang, mobil random ${rp(bkl.randomHarga)}. Tarif ke Bukit Tinggi, Solok, Bangko, dan Muara Bungo. WA 0852-6864-5461.`,
  alternates: { canonical: URL },
  openGraph: { title: 'Ongkos Travel Bengkulu Padang 2026 | Travel Bengkulu', url: URL, locale: 'id_ID', type: 'article' },
};

const hitung = [1, 2, 4].map((n) => ({ n, hiace: n * bkl.hiaceHarga, random: n * bkl.randomHarga }));

const faq: [string, string][] = [
  ['Berapa ongkos travel Bengkulu Padang?', `Tarif Hiace dari Kota Bengkulu ke Padang ${rp(bkl.hiaceHarga)} per orang. Mobil random ${rp(bkl.randomHarga)} per orang, bukan Hiace.`],
  ['Tarif per orang atau per mobil?', 'Tarif dihitung per orang, bukan per mobil.'],
  ['Kenapa mobil random lebih murah?', 'Mobil random bukan Hiace dan jenis kendaraannya tidak ditentukan, sehingga tarifnya Rp 50.000 lebih murah dari Hiace.'],
  ['Berapa tarif Bengkulu ke Bukit Tinggi dan Solok?', `Hiace ke Bukit Tinggi dan Solok ${rp(tarif.find((t) => t.nama === 'Bukit Tinggi')!.hiace)} per orang. Mobil random ${rp(tarif.find((t) => t.nama === 'Bukit Tinggi')!.random)}.`],
  ['Berapa tarif Bengkulu ke Bangko atau Muara Bungo?', `Hiace ke Bangko, Sarolangun, Muara Bungo, dan Singkut ${rp(tarif.find((t) => t.nama === 'Bangko')!.hiace)} per orang. Mobil random ${rp(tarif.find((t) => t.nama === 'Bangko')!.random)}.`],
  ['Apakah tarif dari Curup sama?', 'Ya, tarif dari Curup mengikuti tarif yang sama dengan dari Kota Bengkulu. Lihat halaman Curup ke Padang untuk jadwal dari Curup.'],
  ['Berapa ongkos Padang ke Bengkulu?', `Hiace ${rp(pdg.hiaceHarga)} per orang dan mobil random ${rp(pdg.randomHarga)} per orang.`],
  ['Apakah ada biaya tambahan?', 'Rincian tarif dan hal yang termasuk dijelaskan admin sebelum Anda membayar. Pembayaran bisa tunai atau QRIS.'],
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Travel Bengkulu Padang', item: `${BASE}/travel-bengkulu-padang` },
      { '@type': 'ListItem', position: 3, name: 'Ongkos Travel Bengkulu Padang', item: URL },
    ] },
    { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ],
};

export default function Page() {
  return (
    <ArticleLayout
      title={`Ongkos Travel Bengkulu Padang 2026: Hiace ${rp(bkl.hiaceHarga)}`}
      description="Tarif travel Bengkulu–Padang per orang dan per tujuan, perbandingan Hiace dengan mobil random, serta contoh hitungan biaya."
      breadcrumbs={[{ label: 'Travel Bengkulu Padang', href: '/travel-bengkulu-padang' }, { label: 'Ongkos Travel Bengkulu Padang' }]}
      badge="💰 Info Tarif 2026"
      price={rp(bkl.hiaceHarga)}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p>
        <strong>Ongkos travel Bengkulu Padang</strong> adalah <strong>{rp(bkl.hiaceHarga)} per orang</strong> untuk Hiace
        dan <strong>{rp(bkl.randomHarga)} per orang</strong> untuk mobil random (bukan Hiace). Tarif ke kota di jalur, seperti
        Bukit Tinggi, Solok, Bangko, dan Muara Bungo, tertera di tabel berikut.
      </p>

      <h2>Tarif dari Kota Bengkulu per Tujuan</h2>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Tujuan</th><th>Hiace</th><th>Mobil random</th></tr></thead>
          <tbody>
            {tarif.map((t) => (
              <tr key={t.nama}>
                <td><strong>Bengkulu → {t.nama}</strong></td>
                <td>{rp(t.hiace)}</td>
                <td>{rp(t.random)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">Tarif per orang. Dari Curup, tarifnya sama.</p>

      <h2>Tarif dari Padang ke Bengkulu</h2>
      <p>
        Arah sebaliknya, Padang ke Kota Bengkulu, Hiace <strong>{rp(pdg.hiaceHarga)}</strong> dan mobil random{' '}
        <strong>{rp(pdg.randomHarga)}</strong> per orang. Jadwal dan jemputnya ada di halaman{' '}
        <Link href="/travel-padang-bengkulu">Travel Padang Bengkulu</Link>.
      </p>

      <h2>Contoh Hitungan Biaya Bengkulu ke Padang</h2>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Jumlah penumpang</th><th>Semua Hiace</th><th>Semua mobil random</th></tr></thead>
          <tbody>
            {hitung.map((h) => (
              <tr key={h.n}>
                <td>{h.n} orang</td>
                <td><strong>{rp(h.hiace)}</strong></td>
                <td>{rp(h.random)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Apa yang Menentukan Tarif</h2>
      <ul>
        <li><strong>Kota tujuan</strong> — tarif Hiace ke {murah.join(', ')} Rp 50.000 lebih rendah dari tarif ke Padang.</li>
        <li><strong>Jenis armada</strong> — Hiace tarif penuh, mobil random Rp 50.000 lebih murah dan bukan Hiace.</li>
        <li><strong>Jumlah penumpang</strong> — tarif dihitung per orang, jadi total biaya mengikuti jumlah kursi.</li>
      </ul>

      <h2>Cara Menghemat Ongkos</h2>
      <ul>
        <li>Pilih mobil random pukul {bkl.random.replace(':', '.')} jika tidak mementingkan Hiace.</li>
        <li>Turun di kota yang tepat. Jika tujuan Anda Bangko atau Muara Bungo, jangan membayar tarif sampai Padang.</li>
        <li>Pesan bersama keluarga atau teman dalam satu keberangkatan agar kursi terjamin.</li>
      </ul>

      <div className="my-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-emerald-900 font-semibold">Cek jam dan sisa kursi sebelum memesan</div>
        <Link href="/pesan?rute=bkl-pdg" className="shrink-0 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
          🎫 Pesan Sekarang
        </Link>
      </div>

      <h2>Pertanyaan tentang Ongkos Travel Bengkulu Padang</h2>
      {faq.map(([q, a]) => (
        <details key={q} className="mb-3 rounded-2xl border border-slate-200 bg-stone-50 px-5 py-3 open:bg-white">
          <summary className="cursor-pointer font-semibold text-slate-800">{q}</summary>
          <div className="mt-2 text-slate-600">{a}</div>
        </details>
      ))}

      <h2>Layanan Terkait</h2>
      <ul>
        <li><Link href="/travel-bengkulu-padang" className="text-primary-600 hover:underline">Travel Bengkulu Padang Hiace (jemput di Kota Bengkulu)</Link></li>
        <li><Link href="/jadwal-travel-bengkulu-padang" className="text-primary-600 hover:underline">Jadwal Travel Bengkulu Padang</Link></li>
        <li><Link href="/travel-curup-padang" className="text-primary-600 hover:underline">Travel Curup Padang</Link></li>
        <li><Link href="/travel-bengkulu" className="text-primary-600 hover:underline">Semua Rute Travel dari Bengkulu</Link></li>
      </ul>
    </ArticleLayout>
  );
}
