import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { SiloJsonLd, SiloFaq, SiloCta, SiloAnswer, SiloRelated } from '@/components/SiloBlocks';
import { BASE, rp, titik, infoBandung, ARAH_BANDUNG, PILAR, SILO_LINKS } from '@/lib/bandung-silo';

const URL = `${BASE}/jadwal-travel-bengkulu-bandung`;
const bkl = infoBandung('bkl-bdg');
const crp = infoBandung('crp-bdg');
const bdg = infoBandung('bdg-bkl');
const arah = ARAH_BANDUNG.map((a) => ({ ...a, i: infoBandung(a.id) }));

export const metadata: Metadata = {
  title: `Jadwal Travel Bengkulu Bandung, ${bkl.hariLabel.replace(' dan ', ' & ')} ${titik(bkl.jam)}`,
  description: `Jadwal travel Bengkulu Bandung: Hiace berangkat ${bkl.hariLabel} pukul ${titik(bkl.jam)} WIB dari Kota Bengkulu. Jadwal Curup dan Bandung juga ada. WA 0852-6864-5461.`,
  alternates: { canonical: URL },
  openGraph: { title: 'Jadwal Travel Bengkulu Bandung | Travel Bengkulu', url: URL, locale: 'id_ID', type: 'article' },
};

const faq: [string, string][] = [
  ['Hari apa travel Bengkulu Bandung berangkat?', `Setiap ${bkl.hariLabel}. Dari Kota Bengkulu Hiace berangkat pukul ${titik(bkl.jam)} WIB.`],
  ['Jam berapa dijemput di Kota Bengkulu?', `Keberangkatan dari Kota Bengkulu pukul ${titik(bkl.jam)} WIB. Titik dan jam jemput pastinya dikonfirmasi admin saat Anda memesan.`],
  ['Berapa jadwal dari Curup ke Bandung?', `Curup ke Bandung berangkat ${crp.hariLabel} pukul ${titik(crp.jam)} WIB.`],
  ['Jam berapa travel dari Bandung ke Bengkulu?', `Dari Bandung, Hiace berangkat ${bdg.hariLabel} pukul ${titik(bdg.jam)} WIB menuju Curup dan Kota Bengkulu.`],
  ['Apakah ada keberangkatan setiap hari?', `Tidak. Keberangkatan rutin hanya ${bkl.hariLabel}. Jika Anda butuh hari lain, tanyakan ke admin.`],
  ['Kapan sebaiknya memesan kursi?', 'Sebaiknya jauh hari sebelum tanggal berangkat, terutama untuk musim libur, agar kursi di hari Rabu atau Jumat yang Anda inginkan tersedia.'],
  ['Apakah jadwal bisa berubah?', 'Bisa pada hari tertentu. Konfirmasi ketersediaan kursi dan jam lewat WhatsApp atau form pemesanan sebelum berangkat.'],
  ['Berapa lama perjalanan dari jam berangkat sampai tiba?', `Estimasi ${bkl.duration} dari Kota Bengkulu. Rinciannya ada di halaman Bengkulu Bandung berapa jam.`],
];

export default function Page() {
  return (
    <ArticleLayout
      title={`Jadwal Travel Bengkulu Bandung: ${bkl.hariLabel} Pukul ${titik(bkl.jam)} WIB`}
      description="Jadwal keberangkatan Hiace Bengkulu–Bandung, Curup–Bandung, dan Bandung–Bengkulu lengkap dengan estimasi jam tiba."
      breadcrumbs={[{ label: 'Travel Bengkulu', href: '/travel-bengkulu' }, { label: 'Travel Bengkulu Bandung', href: PILAR }, { label: 'Jadwal' }]}
      badge="🗓️ Jadwal Terbaru"
      price={rp(bkl.price)}
    >
      <SiloJsonLd
        crumbs={[
          { name: 'Home', href: BASE },
          { name: 'Travel Bengkulu', href: `${BASE}/travel-bengkulu` },
          { name: 'Travel Bengkulu Bandung', href: `${BASE}${PILAR}` },
          { name: 'Jadwal Travel Bengkulu Bandung', href: URL },
        ]}
        faq={faq}
      />

      <p>
        <strong>Jadwal travel Bengkulu Bandung</strong>: Hiace berangkat <strong>setiap {bkl.hariLabel}</strong>. Dari Kota
        Bengkulu pukul <strong>{titik(bkl.jam)} WIB</strong>, dari Curup pukul <strong>{titik(crp.jam)} WIB</strong>, dan dari
        Bandung pukul <strong>{titik(bdg.jam)} WIB</strong>.
      </p>

      <SiloAnswer>
        <strong>Jawaban singkat:</strong> {bkl.hariLabel}, pukul {titik(bkl.jam)} WIB dari Kota Bengkulu. Tarif {rp(bkl.price)} per
        orang, estimasi perjalanan {bkl.duration}.
      </SiloAnswer>

      <h2>Jadwal Semua Arah</h2>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Arah</th><th>Hari</th><th>Jam berangkat</th><th></th></tr></thead>
          <tbody>
            {arah.map((a) => (
              <tr key={a.id}>
                <td><Link href={a.href} className="font-semibold text-primary-700 hover:underline">{a.label}</Link></td>
                <td>{a.i.hariLabel}</td>
                <td><strong>{titik(a.i.jam)} WIB</strong></td>
                <td><Link href={`/pesan?rute=${a.id}&jam=${a.i.jam}`} className="font-semibold text-primary-700 hover:underline">Pesan →</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">Jam berbeda karena titik jemput berbeda. Tarif semua arah {rp(bkl.price)} per orang.</p>

      <h2>Estimasi Jam Tiba dari Kota Bengkulu</h2>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Berangkat</th><th>Estimasi tiba di Bandung</th></tr></thead>
          <tbody>
            {bkl.tiba.map((t) => (
              <tr key={t.hari}>
                <td><strong>{t.hari} {titik(bkl.jam)} WIB</strong></td>
                <td>{t.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Perkiraan dari estimasi {bkl.duration}. Antrean pelabuhan dan kondisi jalan memengaruhi jam tiba. Penjelasan
        lengkapnya di halaman <Link href="/bengkulu-bandung-berapa-jam">Bengkulu Bandung berapa jam</Link>.
      </p>

      <h2>Cara Memesan Kursi</h2>
      <ol>
        <li><strong>Pilih tanggal</strong> — pilih Rabu atau Jumat yang sesuai rencana Anda.</li>
        <li><strong>Isi form pesan</strong> — pilih rute, jam, dan jumlah penumpang.</li>
        <li><strong>Kirim titik jemput</strong> — alamat jemput dan alamat tujuan Anda.</li>
        <li><strong>Admin konfirmasi</strong> — kursi, jadwal, dan pembayaran dikonfirmasi admin.</li>
        <li><strong>Berangkat</strong> — siap di titik jemput sesuai jam yang disepakati.</li>
      </ol>

      <SiloCta text="Cek sisa kursi untuk Rabu atau Jumat ini" href={`/pesan?rute=bkl-bdg&jam=${bkl.jam}`} />

      <h2>Catatan Jadwal</h2>
      <ul>
        <li>Keberangkatan rutin hanya {bkl.hariLabel}. Hari lain tidak tersedia kecuali dikonfirmasi admin.</li>
        <li>Jadwal bisa berubah pada hari tertentu, jadi konfirmasi kursi sebelum berangkat.</li>
        <li>Ongkos dan hitungan biaya ada di <Link href="/ongkos-travel-bengkulu-bandung">ongkos travel Bengkulu Bandung</Link>.</li>
      </ul>

      <SiloFaq title="Pertanyaan tentang Jadwal Travel Bengkulu Bandung" faq={faq} />
      <SiloRelated links={SILO_LINKS} exclude="/jadwal-travel-bengkulu-bandung" />
    </ArticleLayout>
  );
}
