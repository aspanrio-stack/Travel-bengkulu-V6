import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { SiloJsonLd, SiloFaq, SiloCta, SiloAnswer, SiloRelated } from '@/components/SiloBlocks';
import { BASE, rp, titik, infoBandung, ARAH_BANDUNG, PILAR, SILO_LINKS } from '@/lib/bandung-silo';

const URL = `${BASE}/ongkos-travel-bengkulu-bandung`;
const bkl = infoBandung('bkl-bdg');
const arah = ARAH_BANDUNG.map((a) => ({ ...a, i: infoBandung(a.id) }));
const hitung = [1, 2, 3, 4].map((n) => ({ n, total: n * bkl.price }));
const perJam = { min: Math.round(bkl.price / 38 / 1000) * 1000, max: Math.round(bkl.price / 32 / 1000) * 1000 };

export const metadata: Metadata = {
  title: `Ongkos Travel Bengkulu Bandung 2026: ${rp(bkl.price)}`,
  description: `Ongkos travel Bengkulu Bandung 2026: Hiace ${rp(bkl.price)} per orang, sama dari Kota Bengkulu dan Curup. Ada contoh hitungan biaya 1–4 orang. WA 0852-6864-5461.`,
  alternates: { canonical: URL },
  openGraph: { title: 'Ongkos Travel Bengkulu Bandung 2026 | Travel Bengkulu', url: URL, locale: 'id_ID', type: 'article' },
};

const faq: [string, string][] = [
  ['Berapa ongkos travel Bengkulu Bandung?', `Tarif Hiace dari Kota Bengkulu ke Bandung ${rp(bkl.price)} per orang.`],
  ['Tarif per orang atau per mobil?', 'Tarif dihitung per orang, bukan per mobil. Total biaya mengikuti jumlah kursi yang Anda pesan.'],
  ['Apakah tarif dari Curup ke Bandung sama?', `Ya, Curup ke Bandung juga ${rp(infoBandung('crp-bdg').price)} per orang. Bedanya hanya jam jemput: Curup pukul ${titik(infoBandung('crp-bdg').jam)}, Kota Bengkulu pukul ${titik(bkl.jam)}.`],
  ['Berapa ongkos Bandung ke Bengkulu?', `Bandung ke Kota Bengkulu ${rp(infoBandung('bdg-bkl').price)} per orang, berangkat ${infoBandung('bdg-bkl').hariLabel} pukul ${titik(infoBandung('bdg-bkl').jam)} WIB.`],
  ['Apakah ada tarif anak atau rombongan?', 'Hubungi admin untuk menanyakan ketentuan penumpang anak dan rombongan, termasuk sisa kursi pada tanggal yang Anda inginkan.'],
  ['Apakah ada biaya tambahan di luar tarif?', 'Rincian tarif dan hal yang termasuk dijelaskan admin sebelum Anda membayar. Siapkan juga uang pribadi untuk makan saat istirahat di perjalanan.'],
  ['Bagaimana cara membayar?', 'Pembayaran bisa tunai atau QRIS. Konfirmasi kursi dan pembayaran dilakukan lewat admin.'],
  ['Kenapa tarif Bengkulu Bandung lebih tinggi dari rute lain?', `Perjalanan memakan ${bkl.duration} dan melewati dua pulau lewat penyeberangan Bakauheni–Merak, jauh lebih panjang daripada rute antarkota di Sumatera.`],
];

export default function Page() {
  return (
    <ArticleLayout
      title={`Ongkos Travel Bengkulu Bandung 2026: Hiace ${rp(bkl.price)}`}
      description="Tarif travel Bengkulu–Bandung per orang, perbandingan semua arah, contoh hitungan biaya, dan hal yang perlu disiapkan sebelum berangkat."
      breadcrumbs={[{ label: 'Travel Bengkulu', href: '/travel-bengkulu' }, { label: 'Travel Bengkulu Bandung', href: PILAR }, { label: 'Ongkos' }]}
      badge="💰 Info Tarif 2026"
      price={rp(bkl.price)}
    >
      <SiloJsonLd
        crumbs={[
          { name: 'Home', href: BASE },
          { name: 'Travel Bengkulu', href: `${BASE}/travel-bengkulu` },
          { name: 'Travel Bengkulu Bandung', href: `${BASE}${PILAR}` },
          { name: 'Ongkos Travel Bengkulu Bandung', href: URL },
        ]}
        faq={faq}
      />

      <p>
        <strong>Ongkos travel Bengkulu Bandung</strong> adalah <strong>{rp(bkl.price)} per orang</strong> naik Hiace, dengan
        penjemputan di Kota Bengkulu. Tarif yang sama berlaku untuk penumpang dari Curup. Halaman ini merinci tarif tiap arah,
        contoh total biaya, dan hal yang perlu disiapkan.
      </p>

      <SiloAnswer>
        <strong>Jawaban singkat:</strong> {rp(bkl.price)} per orang, berangkat {bkl.hariLabel} pukul {titik(bkl.jam)} WIB dari
        Kota Bengkulu. Perjalanan {bkl.duration}.
      </SiloAnswer>

      <h2>Tarif Travel Bandung per Arah</h2>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Arah</th><th>Tarif per orang</th><th>Jadwal</th><th></th></tr></thead>
          <tbody>
            {arah.map((a) => (
              <tr key={a.id}>
                <td><Link href={a.href} className="font-semibold text-primary-700 hover:underline">{a.label}</Link></td>
                <td><strong>{rp(a.i.price)}</strong></td>
                <td>{a.i.hariLabel}, {titik(a.i.jam)} WIB</td>
                <td><Link href={`/pesan?rute=${a.id}`} className="font-semibold text-primary-700 hover:underline">Pesan →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">Semua arah memakai tarif yang sama. Jam berbeda karena titik jemput berbeda.</p>

      <h2>Contoh Hitungan Biaya Bengkulu ke Bandung</h2>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Jumlah penumpang</th><th>Total tarif Hiace</th></tr></thead>
          <tbody>
            {hitung.map((h) => (
              <tr key={h.n}>
                <td>{h.n} orang</td>
                <td><strong>{rp(h.total)}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Untuk rombongan lebih dari 4 orang, tanyakan sisa kursi ke admin sebelum memesan agar semua penumpang bisa
        berangkat di keberangkatan yang sama.
      </p>

      <h2>Apa yang Menentukan Tarif</h2>
      <ul>
        <li><strong>Jumlah penumpang</strong> — tarif dihitung per orang, jadi total mengikuti jumlah kursi.</li>
        <li><strong>Rute</strong> — Bengkulu, Curup, dan Bandung memakai tarif yang sama di semua arah.</li>
        <li><strong>Armada</strong> — tarif {rp(bkl.price)} berlaku untuk Toyota Hiace dengan sabuk pengaman, TV, dan audio.</li>
      </ul>

      <h2>Seberapa Besar Tarifnya Dibanding Lama Perjalanan</h2>
      <p>
        Perjalanan Bengkulu ke Bandung memakan {bkl.duration}. Jika tarif {rp(bkl.price)} dibagi lama di jalan, nilainya
        kira-kira {rp(perJam.min)} sampai {rp(perJam.max)} per jam, untuk perjalanan yang dijemput di alamat dan tidak
        berganti kendaraan di tengah jalan. Waktu tempuh lengkap ada di halaman{' '}
        <Link href="/bengkulu-bandung-berapa-jam">Bengkulu Bandung berapa jam</Link>.
      </p>

      <h2>Biaya di Luar Tarif yang Perlu Disiapkan</h2>
      <ul>
        <li>Uang pribadi untuk makan dan minum saat istirahat di rumah makan.</li>
        <li>Uang tunai kecil untuk toilet, ibadah, dan keperluan kecil di perjalanan.</li>
      </ul>
      <p>Tanyakan rincian yang termasuk tarif kepada admin sebelum membayar.</p>

      <h2>Membandingkan dengan Bus dan Pesawat</h2>
      <p>
        Tarif bus dan tiket pesawat ditentukan masing-masing perusahaan dan berubah menurut kelas, tanggal, dan musim, jadi
        angkanya tidak kami tampilkan di sini. Perbandingan cara naik, penjemputan, dan jadwal ada di halaman{' '}
        <Link href="/bus-bengkulu-bandung">bus Bengkulu Bandung vs travel Hiace</Link>.
      </p>

      <SiloCta text="Cek jadwal dan sisa kursi sebelum memesan" />

      <SiloFaq title="Pertanyaan tentang Ongkos Travel Bengkulu Bandung" faq={faq} />
      <SiloRelated links={SILO_LINKS} exclude="/ongkos-travel-bengkulu-bandung" />
    </ArticleLayout>
  );
}
