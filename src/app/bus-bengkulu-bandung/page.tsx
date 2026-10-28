import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';
import { SiloHero, SiloJsonLd, SiloFaq, SiloCta, SiloAnswer, SiloRelated } from '@/components/SiloBlocks';
import { hiaceOg, hiaceUrl } from '@/lib/hiace-images';
import { BASE, rp, titik, infoBandung, PILAR, SILO_LINKS } from '@/lib/bandung-silo';

const URL = `${BASE}/bus-bengkulu-bandung`;
const bkl = infoBandung('bkl-bdg');

export const metadata: Metadata = {
  title: 'Bus Bengkulu Bandung vs Travel Hiace',
  description: `Bus Bengkulu Bandung atau travel Hiace? Bandingkan cara naik, penjemputan, dan jadwal. Travel Hiace ${rp(bkl.price)}, ${bkl.hariLabel} pukul ${titik(bkl.jam)}. Cek dulu.`,
  alternates: { canonical: URL },
  openGraph: { title: 'Bus Bengkulu Bandung vs Travel Hiace | Travel Bengkulu', url: URL, locale: 'id_ID', type: 'article', images: [hiaceOg('bandung-malam')] },
  twitter: { card: 'summary_large_image', images: [hiaceUrl('bandung-malam', 'og')] },
};

const faq: [string, string][] = [
  ['Apa beda bus dan travel Bengkulu Bandung?', 'Bus antarprovinsi biasanya berangkat dari terminal atau agen dengan armada besar. Travel Hiace menjemput penumpang di alamat dan memakai kendaraan yang lebih kecil dengan jadwal tetap.'],
  ['Apakah travel Hiace Bengkulu Bandung berupa bus?', `Bukan. Layanan kami memakai Toyota Hiace dengan sabuk pengaman, TV, dan audio, bukan bus besar. Tarif ${rp(bkl.price)} per orang.`],
  ['Berapa harga tiket bus Bengkulu Bandung?', 'Tarif bus ditetapkan masing-masing perusahaan dan berubah menurut kelas serta musim. Tanyakan langsung ke loket atau agen resmi perusahaan yang Anda pilih. Kami tidak menampilkan tarif perusahaan lain agar informasinya tidak keliru.'],
  ['Mana yang lebih cepat, bus atau travel?', `Kecepatan bergantung pada rute, jumlah pemberhentian, dan kondisi jalan. Travel Hiace kami memakan ${bkl.duration} dengan satu kendaraan dari titik jemput sampai Bandung.`],
  ['Kapan sebaiknya memilih travel Hiace?', 'Jika Anda ingin dijemput di alamat, tidak ingin berganti kendaraan, dan jadwal Rabu atau Jumat cocok dengan rencana Anda.'],
  ['Kapan sebaiknya memilih bus?', `Jika hari berangkat Anda tidak jatuh pada ${bkl.hariLabel}, cek jadwal bus atau pilihan lain yang tersedia di hari tersebut.`],
  ['Apakah bisa dijemput di rumah?', 'Ya, penjemputan di Kota Bengkulu dengan titik yang disepakati saat Anda memesan.'],
  ['Bagaimana cara memesan travel Hiace?', 'Lewat form pesan di website ini atau WhatsApp admin. Admin mengonfirmasi kursi, jadwal, dan pembayaran.'],
];

export default function Page() {
  return (
    <ArticleLayout
      title="Bus Bengkulu Bandung vs Travel Hiace: Mana yang Cocok?"
      description="Perbedaan bus dan travel Hiace untuk perjalanan Bengkulu–Bandung: cara naik, penjemputan, jadwal, dan hal yang perlu dicek sebelum memilih."
      breadcrumbs={[{ label: 'Travel Bengkulu', href: '/travel-bengkulu' }, { label: 'Travel Bengkulu Bandung', href: PILAR }, { label: 'Bus vs Travel' }]}
      badge="🚌 Perbandingan"
      price={rp(bkl.price)}
    >
      <SiloJsonLd
        crumbs={[
          { name: 'Home', href: BASE },
          { name: 'Travel Bengkulu', href: `${BASE}/travel-bengkulu` },
          { name: 'Travel Bengkulu Bandung', href: `${BASE}${PILAR}` },
          { name: 'Bus Bengkulu Bandung vs Travel Hiace', href: URL },
        ]}
        page={{ url: URL, name: 'Bus Bengkulu Bandung vs Travel Hiace', image: 'bandung-malam' }}
        faq={faq}
      />
      <SiloHero k="bandung-malam" caption="Travel Hiace Bengkulu–Bandung dengan jemput di alamat." />

      <p>
        Mencari <strong>bus Bengkulu Bandung</strong>? Ada dua cara umum menempuh rute ini lewat darat: naik bus
        antarprovinsi, atau naik <strong>travel Hiace</strong> yang menjemput di alamat. Kami melayani travel Hiace, jadi
        halaman ini menjelaskan perbedaannya secara jujur agar Anda bisa memilih sesuai kebutuhan.
      </p>

      <SiloAnswer>
        <strong>Ringkasnya:</strong> pilih travel Hiace jika ingin dijemput dan jadwal {bkl.hariLabel} cocok. Cek bus atau
        pilihan lain jika Anda perlu berangkat di hari berbeda.
      </SiloAnswer>

      <h2>Perbandingan Bus dan Travel Hiace</h2>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Aspek</th><th>Bus antarprovinsi</th><th>Travel Hiace kami</th></tr></thead>
          <tbody>
            <tr><td>Titik naik</td><td>Terminal atau agen</td><td>Dijemput di alamat</td></tr>
            <tr><td>Armada</td><td>Bus besar</td><td>Toyota Hiace, kabin lega, TV, audio</td></tr>
            <tr><td>Jadwal</td><td>Mengikuti perusahaan, tanyakan agen</td><td>{bkl.hariLabel} pukul {titik(bkl.jam)} WIB</td></tr>
            <tr><td>Tarif</td><td>Mengikuti perusahaan dan kelas</td><td><strong>{rp(bkl.price)}</strong> per orang</td></tr>
            <tr><td>Durasi</td><td>Tanyakan perusahaan</td><td>{bkl.duration}</td></tr>
            <tr><td>Pemesanan</td><td>Loket, agen, atau aplikasi perusahaan</td><td>Form online atau WhatsApp admin</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Soal Harga Tiket Bus per Perusahaan</h2>
      <p>
        Banyak orang mencari harga tiket bus per perusahaan, misalnya Putra Rafflesia. Tarif tiap perusahaan berbeda, berubah
        menurut kelas dan musim, dan hanya perusahaan itu yang tahu angka terbarunya. Karena itu kami tidak menampilkan
        tarif bus di sini. Tanyakan langsung ke loket atau agen resmi sebelum memutuskan.
      </p>

      <h2>Kapan Travel Hiace Lebih Pas</h2>
      <ul>
        <li>Anda ingin dijemput di alamat, bukan datang ke terminal.</li>
        <li>Anda ingin satu kendaraan sampai Bandung tanpa berganti.</li>
        <li>Jadwal {bkl.hariLabel} sesuai dengan rencana keberangkatan Anda.</li>
        <li>Anda bepergian bersama keluarga atau teman dan ingin duduk dalam satu kendaraan.</li>
      </ul>

      <h2>Kapan Sebaiknya Cek Pilihan Lain</h2>
      <ul>
        <li>Hari berangkat Anda bukan {bkl.hariLabel}.</li>
        <li>Anda butuh jadwal yang lebih sering atau lebih fleksibel.</li>
        <li>Kursi pada tanggal pilihan Anda sudah penuh.</li>
      </ul>

      <h2>Detail Travel Hiace Bengkulu Bandung</h2>
      <p>
        Informasi lengkap layanan ada di halaman <Link href={PILAR}>Travel Bengkulu Bandung</Link>. Jadwal tiap arah ada di{' '}
        <Link href="/jadwal-travel-bengkulu-bandung">jadwal travel Bengkulu Bandung</Link>, tarif dan hitungan biaya di{' '}
        <Link href="/ongkos-travel-bengkulu-bandung">ongkos travel Bengkulu Bandung</Link>, dan lama perjalanan di{' '}
        <Link href="/bengkulu-bandung-berapa-jam">Bengkulu Bandung berapa jam</Link>.
      </p>

      <SiloCta text="Cocok dengan jadwalnya? Cek sisa kursi sekarang" />

      <SiloFaq title="Pertanyaan tentang Bus dan Travel Bengkulu Bandung" faq={faq} />
      <SiloRelated links={SILO_LINKS} exclude="/bus-bengkulu-bandung" />
    </ArticleLayout>
  );
}
