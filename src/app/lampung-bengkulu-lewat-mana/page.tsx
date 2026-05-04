import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Lampung Bengkulu Lewat Mana? Ini Jalur Paling Enak 2026',
  description:
    'Mau ke Bengkulu dari Lampung tapi bingung lewat mana? Panduan lengkap jalur via Liwa-Krui vs jalur alternatif, titik menarik, dan tips perjalanan 2026.',
  alternates: { canonical: 'https://bengkulutravel.com/lampung-bengkulu-lewat-mana' },
};

export default function LampungBengkuluLewatMana() {
  return (
    <ArticleLayout
      title="Lampung Bengkulu Lewat Mana? Ini Jalur Paling Enak 2026"
      description="Panduan rute perjalanan Lampung ke Bengkulu: perbandingan jalur, daya tarik pemandangan, dan rekomendasi jalur terbaik untuk perjalanan nyaman."
      breadcrumbs={[
        { label: 'Travel Lampung Bengkulu', href: '/travel-lampung-bengkulu' },
        { label: 'Lampung Bengkulu Lewat Mana' },
      ]}
      badge="🗺️ Panduan Rute"
      price="Rp 300.000"
    >
      {/* CTA */}
      <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-primary-800 font-semibold text-sm">
          Sudah tahu rutenya? Langsung pesan travel door to door Lampung–Bengkulu sekarang!
        </p>
        <Link
          href="/pesan?rute=lmp-bkl"
          className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm"
        >
          🎫 Pesan Sekarang
        </Link>
      </div>

      {/* ===== ARTIKEL ===== */}

      <p>
        "<strong>Lampung Bengkulu lewat mana?</strong>" — Ini salah satu pertanyaan yang paling
        sering muncul di forum perjalanan dan grup komunitas traveler Sumatera. Wajar saja, karena
        tidak seperti perjalanan antar kota yang sudah punya jalur tol, rute Lampung–Bengkulu masih
        melewati jalan lintas provinsi yang punya beberapa pilihan jalur dengan karakteristik yang
        berbeda-beda.
      </p>

      <p>
        Di artikel ini, kami akan membahas tuntas semua opsi jalur yang bisa kamu tempuh dari Lampung
        menuju Bengkulu, apa kelebihan dan kekurangan masing-masing, dan mana yang paling
        direkomendasikan oleh para pengemudi travel berpengalaman di 2026.
      </p>

      <h2>Gambaran Umum: Mengapa Rute Ini Tidak Sesimpel yang Dibayangkan?</h2>

      <p>
        Lampung dan Bengkulu sama-sama terletak di Pulau Sumatera, namun keduanya dipisahkan oleh
        rangkaian Bukit Barisan — pegunungan yang membentang sepanjang sisi barat Sumatera.
        Kondisi geografis inilah yang membuat pilihan rute menjadi penting: kamu harus melewati atau
        menyusuri pegunungan ini dengan cara yang berbeda tergantung jalur yang dipilih.
      </p>

      <p>
        Tidak ada jalan tol yang langsung menghubungkan Lampung dan Bengkulu per 2026. Semua jalur
        adalah jalan nasional atau jalan provinsi yang melintasi medan campuran: perkotaan, pedesaan,
        pegunungan, dan pesisir pantai.
      </p>

      <h2>Jalur Utama: Via Liwa – Krui (Rekomendasi Utama)</h2>

      <p>
        Kalau kamu bertanya kepada pengemudi travel mana jalur terbaik Lampung ke Bengkulu, hampir
        semua akan menjawab: <strong>lewat Liwa dan Krui</strong>. Ini bukan tanpa alasan — jalur
        ini memang menjadi pilihan utama berdasarkan tiga faktor kunci: kondisi jalan, efisiensi
        waktu, dan pengalaman perjalanan.
      </p>

      <h3>Rute Lengkap via Liwa-Krui:</h3>
      <p>
        Bandar Lampung → Gedong Tataan → Pringsewu → Liwa (Lampung Barat) → Krui → Biha →
        Bangkunat → Manna (Bengkulu Selatan) → Kota Bengkulu
      </p>

      <table>
        <thead>
          <tr>
            <th>Segmen</th>
            <th>Jarak</th>
            <th>Kondisi Jalan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bandar Lampung → Liwa</td>
            <td>±170 km</td>
            <td>Aspal baik, ada tanjakan di kawasan Bukit Barisan</td>
          </tr>
          <tr>
            <td>Liwa → Krui</td>
            <td>±60 km</td>
            <td>Mulus, sebagian menyusuri pantai</td>
          </tr>
          <tr>
            <td>Krui → Manna</td>
            <td>±200 km</td>
            <td>Aspal umumnya baik, beberapa titik masih dalam perbaikan</td>
          </tr>
          <tr>
            <td>Manna → Kota Bengkulu</td>
            <td>±130 km</td>
            <td>Relatif baik, jalur lintas pantai barat</td>
          </tr>
        </tbody>
      </table>

      <h3>Mengapa Jalur Ini Paling Enak?</h3>

      <p>
        Ada beberapa alasan konkret mengapa rute Liwa-Krui dijuluki jalur paling enak oleh para
        pelancong rute Lampung–Bengkulu:
      </p>

      <ul>
        <li>
          <strong>Pemandangan spektakuler</strong> — Dari Liwa hingga Krui, kamu akan menyaksikan
          perpaduan pegunungan dan samudra yang jarang ada tandingannya di Sumatera. Di beberapa
          titik, jalan hampir berbatasan langsung dengan pantai sehingga deburan ombak Samudra Hindia
          bisa terdengar jelas dari dalam mobil.
        </li>
        <li>
          <strong>Kondisi jalan lebih terprediksi</strong> — Dibanding jalur-jalur alternatif,
          kondisi jalan di rute ini lebih konsisten dan lebih mudah diprediksi oleh pengemudi
          berpengalaman.
        </li>
        <li>
          <strong>Fasilitas lengkap di sepanjang rute</strong> — Ada SPBU, warung makan, minimarket,
          dan masjid di berbagai titik sepanjang rute ini, sehingga kebutuhan selama perjalanan
          mudah terpenuhi.
        </li>
        <li>
          <strong>Lebih aman dari longsor</strong> — Meski masih ada risiko di beberapa titik
          pegunungan, rute ini relatif lebih terhindar dari bencana longsor besar dibanding jalur
          alternatif yang lebih dalam ke kawasan pegunungan.
        </li>
      </ul>

      <h2>Jalur Alternatif: Via Bintuhan – Manna</h2>

      <p>
        Selain jalur Liwa-Krui, ada satu jalur alternatif yang kadang digunakan, terutama oleh
        mereka yang berangkat dari sisi timur atau tengah Lampung. Jalur ini masuk melalui Bintuhan
        (Kaur) dan Manna sebelum akhirnya menuju Kota Bengkulu.
      </p>

      <p>
        Namun perlu diketahui, jalur ini umumnya lebih panjang dari segi waktu tempuh dan melewati
        beberapa segmen jalan yang kondisinya kurang konsisten dibanding rute utama. Beberapa
        komunitas pengemudi menyarankan untuk menghindari jalur ini saat musim hujan karena risiko
        banjir dan jalan licin yang lebih tinggi.
      </p>

      <h2>Jalur via Lubuklinggau (Melalui Sumatera Selatan)</h2>

      <p>
        Ini adalah jalur yang lebih jarang digunakan untuk tujuan efisiensi, tapi kadang dipilih
        karena alasan tertentu — misalnya ada keperluan singgah di Palembang atau Lubuklinggau.
        Rute ini memutar melalui jalur lintas timur Sumatera, masuk ke Sumatera Selatan, lalu
        kembali ke Bengkulu dari arah timur.
      </p>

      <p>
        Waktu tempuhnya jauh lebih panjang — bisa mencapai 15–18 jam — dan tidak efisien untuk
        perjalanan langsung Lampung–Bengkulu. Jalur ini lebih cocok bagi yang memang ingin
        menjelajah beberapa kota sekaligus.
      </p>

      <h2>Perbandingan Tiga Jalur Utama</h2>

      <table>
        <thead>
          <tr>
            <th>Jalur</th>
            <th>Waktu Tempuh</th>
            <th>Kondisi Jalan</th>
            <th>Pemandangan</th>
            <th>Rekomendasi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Via Liwa-Krui</td>
            <td>11–13 jam</td>
            <td>⭐⭐⭐⭐</td>
            <td>⭐⭐⭐⭐⭐</td>
            <td>✅ Terbaik</td>
          </tr>
          <tr>
            <td>Via Bintuhan-Manna</td>
            <td>13–16 jam</td>
            <td>⭐⭐⭐</td>
            <td>⭐⭐⭐</td>
            <td>⚠️ Alternatif</td>
          </tr>
          <tr>
            <td>Via Lubuklinggau</td>
            <td>15–18 jam</td>
            <td>⭐⭐⭐⭐</td>
            <td>⭐⭐</td>
            <td>❌ Tidak Efisien</td>
          </tr>
        </tbody>
      </table>

      <h2>Daya Tarik di Sepanjang Rute Liwa-Krui</h2>

      <p>
        Salah satu keistimewaan jalur Liwa-Krui adalah banyaknya spot menarik yang bisa kamu nikmati
        sepanjang perjalanan — bahkan dari dalam mobil sekalipun. Ini menjadikan perjalanan panjang
        terasa lebih bermakna dan tidak sekadar "duduk dan menunggu tiba".
      </p>

      <h3>Taman Nasional Bukit Barisan Selatan</h3>
      <p>
        Saat melewati kawasan antara Lampung Barat dan Pesisir Barat, kamu akan melalui area
        penyangga Taman Nasional Bukit Barisan Selatan — salah satu dari tiga taman nasional di
        Lampung. Di kawasan ini kamu bisa melihat hutan tropis lebat di kanan jalan, dan sesekali
        ada monyet ekor panjang yang nongkrong di tepi jalan.
      </p>

      <h3>Pantai Krui dan Sekitarnya</h3>
      <p>
        Krui adalah ibu kota Kabupaten Pesisir Barat yang belakangan naik daun sebagai destinasi
        surfing dunia. Ombaknya yang konsisten menarik peselancar dari berbagai penjuru dunia. Meski
        kamu tidak bisa berhenti lama (kecuali memang berencana singgah), melihat landscape pantai
        Krui dari jalan sudah cukup memukau.
      </p>

      <h3>Kebun Kopi Lampung Barat</h3>
      <p>
        Lampung Barat adalah salah satu penghasil kopi Robusta terbesar di Indonesia. Di sepanjang
        jalan menuju Liwa, kamu akan melewati area kebun kopi yang luas. Saat musim panen sekitar
        Juli–September, kebun-kebun ini terlihat sangat indah dengan buah kopi yang menghijau dan
        memerah.
      </p>

      <h3>Puncak Bukit Barisan</h3>
      <p>
        Di beberapa titik puncak di kawasan pegunungan, pemandangan ke arah laut bisa sangat
        dramatis — hamparan biru samudra di kejauhan dengan latar langit yang bersih. Banyak
        penumpang yang spontan meminta pengemudi berhenti sebentar di spot ini untuk mengabadikan
        momen.
      </p>

      <h2>Hal-hal yang Perlu Diperhatikan di Rute Ini</h2>

      <p>
        Meskipun jalur Liwa-Krui adalah yang terbaik, ada beberapa hal penting yang perlu kamu
        ketahui sebelum memulai perjalanan:
      </p>

      <ul>
        <li>
          <strong>Sinyal ponsel tidak merata</strong> — Di kawasan pegunungan dan beberapa titik di
          antara Krui dan Manna, sinyal seluler bisa hilang total selama beberapa waktu. Pastikan
          semua komunikasi penting sudah dilakukan sebelum memasuki titik-titik ini.
        </li>
        <li>
          <strong>Bensin penuh sebelum melewati Liwa</strong> — SPBU di beberapa segmen antara Liwa
          dan Manna tidak selalu tersedia 24 jam. Lebih aman mengisi BBM penuh di Liwa sebelum
          melanjutkan perjalanan.
        </li>
        <li>
          <strong>Kondisi jalan malam hari</strong> — Tikungan dan tanjakan di kawasan pegunungan
          lebih menantang saat malam. Pastikan pengemudi yang kamu percayai betul-betul hapal jalur
          ini, bukan hanya mengandalkan GPS.
        </li>
        <li>
          <strong>Musim hujan perlu ekstra hati-hati</strong> — Antara November hingga Februari,
          intensitas hujan di kawasan Bukit Barisan bisa sangat tinggi. Kabut tebal dan jalan licin
          menjadi risiko nyata yang harus diantisipasi.
        </li>
      </ul>

      <h2>Mengapa Memilih Layanan Travel Profesional?</h2>

      <p>
        Setelah tahu jalur mana yang paling enak, pertanyaan berikutnya adalah: bagaimana cara
        terbaik untuk menempuh jalur tersebut? Jawabannya bagi banyak orang adalah menggunakan
        layanan travel profesional.
      </p>

      <p>
        Ada beberapa alasan kuat di balik pilihan ini. Pertama, pengemudi kami sudah melewati rute
        ini ratusan kali — mereka tahu persis tikungan berbahaya, kapan harus melambat, dan di mana
        harus berhenti. Kedua, kamu tidak perlu memikirkan soal navigasi, BBM, atau kondisi teknis
        kendaraan. Kamu cukup duduk, menikmati pemandangan, dan tiba di tujuan dengan selamat.
      </p>

      <p>
        Ketiga, dari segi ekonomis, tarif flat{' '}
        <strong>Rp 300.000 per orang</strong> jauh lebih masuk akal dibanding biaya kendaraan
        pribadi yang jika dihitung total — termasuk BBM, makan, dan biaya tak terduga — bisa
        mencapai dua kali lipat atau lebih.
      </p>

      <h2>Kesimpulan: Lampung ke Bengkulu Paling Enak Lewat Mana?</h2>

      <p>
        Dari semua jalur yang tersedia, <strong>rute via Liwa dan Krui adalah yang paling
        direkomendasikan</strong> untuk perjalanan Lampung ke Bengkulu di 2026. Jalur ini menawarkan
        kombinasi terbaik antara waktu tempuh, kondisi jalan, fasilitas di sepanjang rute, dan tentu
        saja pemandangan yang tidak akan kamu lupakan.
      </p>

      <p>
        Bagi yang ingin perjalanan yang nyaman tanpa perlu repot, gunakan layanan travel door to door
        kami. Dengan tarif terjangkau dan pengemudi berpengalaman, kamu bisa menikmati keindahan
        rute Liwa-Krui sambil duduk santai hingga tiba di Bengkulu.
      </p>

      {/* FAQ */}
      <h2>FAQ – Pertanyaan Seputar Rute Lampung–Bengkulu</h2>

      <h3>Lampung ke Bengkulu lewat mana yang tercepat?</h3>
      <p>
        Jalur via Liwa (Lampung Barat) dan Krui (Pesisir Barat) adalah yang tercepat dan paling
        banyak digunakan oleh armada travel profesional.
      </p>

      <h3>Apakah ada jalan tol Lampung–Bengkulu?</h3>
      <p>
        Per 2026, belum ada jalan tol yang langsung menghubungkan Lampung dan Bengkulu. Semua
        perjalanan masih menggunakan jalan nasional.
      </p>

      <h3>Apakah jalur Liwa-Krui aman untuk malam hari?</h3>
      <p>
        Aman jika menggunakan pengemudi yang berpengalaman dan hapal jalur. Kami sangat menyarankan
        tidak mencoba melewati jalur ini sendiri di malam hari tanpa pengetahuan medan yang cukup.
      </p>

      <h3>Berapa jarak Lampung ke Bengkulu via Liwa?</h3>
      <p>
        Total jarak sekitar 560–580 km, tergantung titik keberangkatan di Bandar Lampung dan titik
        tujuan di Kota Bengkulu.
      </p>

      {/* Internal Links */}
      <h2>Layanan Terkait</h2>
      <ul>
        <li>
          <Link href="/travel-bengkulu-lampung" className="text-primary-600 hover:underline">
            Travel Bengkulu → Lampung (Rute Balik)
          </Link>
        </li>
        <li>
          <Link href="/travel-lampung-bengkulu" className="text-primary-600 hover:underline">
            Informasi Travel Lampung–Bengkulu
          </Link>
        </li>
        <li>
          <Link href="/pesan?rute=lmp-bkl" className="text-primary-600 hover:underline">
            Pesan Sekarang via WhatsApp
          </Link>
        </li>
      </ul>
    </ArticleLayout>
  );
}
