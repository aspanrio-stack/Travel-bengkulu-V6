import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { SiloHero, SiloJsonLd, SiloFaq, SiloCta, SiloAnswer, SiloRelated } from '@/components/SiloBlocks';
import { getRouteById } from '@/lib/routes';
import { hiaceOg, hiaceUrl } from '@/lib/hiace-images';
import { BASE, rp, titik, infoBandung, PILAR, SILO_LINKS } from '@/lib/bandung-silo';

const URL = `${BASE}/bengkulu-bandung-berapa-jam`;
const bkl = infoBandung('bkl-bdg');
const bdg = infoBandung('bdg-bkl');
const bklCrp = getRouteById('bkl-crp')!.duration;

export const metadata: Metadata = {
  title: `Bengkulu Bandung Berapa Jam? Estimasi ${bkl.duration}`,
  description: `Bengkulu ke Bandung berapa jam? Naik travel Hiace via Tol Palembang sekitar ${bkl.duration}. Cek estimasi jam tiba, rute, faktor penentu, dan tips perjalanan jauh.`,
  alternates: { canonical: URL },
  openGraph: { title: 'Bengkulu Bandung Berapa Jam? | Travel Bengkulu', url: URL, locale: 'id_ID', type: 'article', images: [hiaceOg('bandung-malam')] },
  twitter: { card: 'summary_large_image', images: [hiaceUrl('bandung-malam', 'og')] },
};

const faq: [string, string][] = [
  ['Bengkulu ke Bandung berapa jam naik travel?', `Sekitar ${bkl.duration} naik Hiace via Curup, Tol Palembang, dan penyeberangan Bakauheni–Merak. Waktu ini sudah termasuk istirahat dan makan.`],
  [`Berangkat ${bkl.tiba[0].hari} pukul ${titik(bkl.jam)}, kapan tiba di Bandung?`, `Estimasi tiba ${bkl.tiba[0].text}. Ini perkiraan; jam aktual mengikuti kondisi jalan dan antrean pelabuhan.`],
  ['Berapa jam Bandung ke Bengkulu?', `Sekitar ${bdg.duration}. Hiace berangkat dari Bandung ${bdg.hariLabel} pukul ${titik(bdg.jam)} WIB.`],
  ['Dari Curup ke Bandung lebih cepat?', `Curup lebih dekat ke Bandung dibanding Kota Bengkulu, sehingga estimasinya ${infoBandung('crp-bdg').duration} dibanding ${bkl.duration} dari Kota Bengkulu.`],
  ['Apakah perjalanan berhenti untuk istirahat?', 'Ya. Hiace berhenti untuk istirahat, makan, dan ibadah. Lama istirahat ikut menentukan total waktu tempuh.'],
  ['Apa yang paling membuat waktu tempuh molor?', 'Antrean pelabuhan Bakauheni–Merak, kepadatan tol di akhir pekan dan musim libur, serta cuaca. Faktor-faktor ini tidak bisa dipastikan sebelum berangkat.'],
  ['Naik pesawat dari Bengkulu ke Bandung lebih cepat?', 'Waktu di udara lebih singkat, tetapi total waktu mencakup perjalanan ke bandara, check-in, dan menunggu. Jadwal, rute, dan harga penerbangan sering berubah, jadi cek langsung ke maskapai atau aplikasi tiket.'],
  ['Apakah perlu menginap di tengah jalan?', 'Tidak. Anda naik satu Hiace dari titik jemput sampai Bandung, tanpa ganti kendaraan.'],
];

export default function Page() {
  return (
    <ArticleLayout
      title={`Bengkulu Bandung Berapa Jam? Estimasi ${bkl.duration}`}
      description="Waktu tempuh Bengkulu ke Bandung lewat darat, estimasi jam tiba, rute, dan faktor yang memengaruhi lama perjalanan."
      breadcrumbs={[{ label: 'Travel Bengkulu', href: '/travel-bengkulu' }, { label: 'Travel Bengkulu Bandung', href: PILAR }, { label: 'Berapa Jam' }]}
      badge="🕐 Info Perjalanan"
      price={rp(bkl.price)}
    >
      <SiloJsonLd
        crumbs={[
          { name: 'Home', href: BASE },
          { name: 'Travel Bengkulu', href: `${BASE}/travel-bengkulu` },
          { name: 'Travel Bengkulu Bandung', href: `${BASE}${PILAR}` },
          { name: 'Bengkulu Bandung Berapa Jam', href: URL },
        ]}
        page={{ url: URL, name: 'Bengkulu Bandung Berapa Jam', image: 'bandung-malam' }}
        faq={faq}
      />
      <SiloHero k="bandung-malam" caption="Hiace saat penyeberangan malam Bakauheni–Merak dalam perjalanan ke Bandung." />

      <p>
        <strong>Bengkulu ke Bandung berapa jam?</strong> Lewat darat naik travel Hiace, perjalanannya sekitar{' '}
        <strong>{bkl.duration}</strong>. Rutenya melewati Curup, Lubuklinggau, Palembang, Tol Trans Sumatera, penyeberangan
        Bakauheni–Merak, lalu tol menuju Bandung.
      </p>

      <SiloAnswer>
        <strong>Jawaban singkat:</strong> {bkl.duration} dari Kota Bengkulu. Berangkat {bkl.tiba[0].hari} pukul {titik(bkl.jam)} WIB,
        estimasi tiba di Bandung {bkl.tiba[0].text}.
      </SiloAnswer>

      <h2>Estimasi Jam Tiba di Bandung</h2>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Berangkat dari Kota Bengkulu</th><th>Estimasi tiba di Bandung</th></tr></thead>
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
      <p className="text-sm text-slate-500">Perkiraan dari estimasi {bkl.duration}. Jam aktual bisa lebih cepat atau lambat.</p>

      <h2>Tahapan Rute Bengkulu ke Bandung</h2>
      <ol>
        <li><strong>Kota Bengkulu → Curup</strong> — penjemputan di Kota Bengkulu lalu naik ke Curup, sekitar {bklCrp}.</li>
        <li><strong>Curup → Lubuklinggau → Palembang</strong> — lewat Sekayu dan Prabumulih menuju Palembang.</li>
        <li><strong>Palembang → Bakauheni</strong> — masuk Tol Trans Sumatera ke arah Lampung.</li>
        <li><strong>Bakauheni → Merak</strong> — menyeberang dengan kapal, waktu antre bergantung kondisi pelabuhan.</li>
        <li><strong>Merak → Bandung</strong> — tol Jakarta–Cikampek dan Cipularang.</li>
      </ol>
      <p>
        Detail armada dan titik jemput ada di halaman <Link href={PILAR}>Travel Bengkulu Bandung</Link>.
      </p>

      <h2>Faktor yang Memengaruhi Lama Perjalanan</h2>
      <ul>
        <li><strong>Antrean pelabuhan</strong> — penyeberangan Bakauheni–Merak paling sulit diprediksi, terutama di musim libur.</li>
        <li><strong>Kepadatan tol</strong> — tol Jakarta–Cikampek dan Cipularang ramai di akhir pekan dan hari libur.</li>
        <li><strong>Cuaca dan kondisi jalan</strong> — hujan deras dan perbaikan jalan memperlambat laju.</li>
        <li><strong>Istirahat dan makan</strong> — Hiace berhenti untuk makan, ibadah, dan istirahat.</li>
      </ul>

      <h2>Travel Darat atau Pesawat?</h2>
      <p>
        Pesawat lebih singkat di udara, tetapi total waktu mencakup perjalanan ke bandara, check-in, dan menunggu. Jadwal,
        rute, dan harga penerbangan sering berubah, jadi cek langsung ke maskapai atau aplikasi tiket sebelum
        membandingkan.
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Aspek</th><th>Travel Hiace</th><th>Pesawat</th></tr></thead>
          <tbody>
            <tr><td>Waktu</td><td>{bkl.duration}</td><td>Lebih singkat di udara, plus waktu ke bandara dan check-in</td></tr>
            <tr><td>Penjemputan</td><td>Dijemput di alamat Anda</td><td>Anda menuju bandara sendiri</td></tr>
            <tr><td>Jadwal</td><td>{bkl.hariLabel} pukul {titik(bkl.jam)} WIB</td><td>Mengikuti maskapai, cek langsung</td></tr>
            <tr><td>Biaya</td><td>{rp(bkl.price)} per orang</td><td>Berubah menurut tanggal dan maskapai</td></tr>
            <tr><td>Ganti kendaraan</td><td>Tidak, satu Hiace sampai Bandung</td><td>Tergantung rute penerbangan</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Tips Perjalanan {bkl.duration}</h2>
      <ul>
        <li>Pakai pakaian nyaman dan bawa jaket tipis untuk jaga-jaga.</li>
        <li>Bawa bantal leher, power bank, dan obat pribadi.</li>
        <li>Siapkan uang tunai untuk makan dan toilet di titik istirahat.</li>
        <li>Pastikan titik jemput dan nomor WhatsApp Anda sudah dikirim ke admin.</li>
        <li>Pesan jauh hari agar kursi pada hari Rabu atau Jumat yang Anda inginkan aman.</li>
      </ul>

      <SiloCta text="Rencanakan keberangkatan Rabu atau Jumat" />

      <SiloFaq title="Pertanyaan tentang Waktu Tempuh Bengkulu Bandung" faq={faq} />
      <SiloRelated links={SILO_LINKS} exclude="/bengkulu-bandung-berapa-jam" />
    </ArticleLayout>
  );
}
