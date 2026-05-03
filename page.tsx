import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Bengkulu ke Lebong Lewat Mana? Panduan Rute & Jalur Terlengkap',
  description:
    'Rute Bengkulu ke Lebong melewati Bengkulu Utara (Arga Makmur). Panduan lengkap jalur, kondisi jalan, titik penting, dan travel door to door Rp 100.000!',
  alternates: { canonical: 'https://bengkulutravel.com/bengkulu-lebong-lewat-mana' },
};

export default function Page() {
  return (
    <ArticleLayout
      title="Bengkulu ke Lebong Lewat Mana?"
      description="Panduan rute perjalanan dari Bengkulu menuju Kabupaten Lebong secara lengkap — jalur utama, titik penting, kondisi jalan, dan alternatif rute yang perlu Anda ketahui."
      breadcrumbs={[
        { label: 'Travel Bengkulu Lebong', href: '/travel-bengkulu-lebong' },
        { label: 'Bengkulu ke Lebong Lewat Mana' },
      ]}
      badge="🗺️ Panduan Rute"
      price="Rp 100.000"
    >

      {/* ===== KOTAK PEMESANAN UTAMA ===== */}
      <div className="mb-8 rounded-2xl overflow-hidden border-2 border-primary-500 shadow-lg">

        {/* Header kotak */}
        <div className="bg-primary-600 px-5 py-3 flex items-center gap-2">
          <span className="text-xl">🎫</span>
          <p className="text-white font-bold text-base tracking-wide uppercase">
            Mau Pesan Travel Bengkulu–Lebong? Pesan di Sini!
          </p>
        </div>

        {/* Isi kotak */}
        <div className="bg-primary-50 px-5 py-5 flex flex-col gap-4">

          {/* Tombol Pesan Online */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-primary-200 rounded-xl p-4">
            <div>
              <p className="font-bold text-primary-800 text-base">
                🖥️ Pesan Online — Isi Form &amp; Konfirmasi Otomatis
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                Isi form online, admin akan langsung mengkonfirmasi pesananmu secara otomatis.
              </p>
            </div>
            <Link
              href="/pesan?rute=bkl-lbg"
              className="shrink-0 bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-extrabold px-7 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm whitespace-nowrap"
            >
              🎫 Pesan Online!
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-primary-200" />
            <span className="text-xs text-primary-500 font-semibold uppercase tracking-widest">atau</span>
            <div className="flex-1 h-px bg-primary-200" />
          </div>

          {/* Tombol WhatsApp */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-green-200 rounded-xl p-4">
            <div>
              <p className="font-bold text-green-800 text-base">
                💬 Butuh Bantuan? Hubungi Admin
              </p>
              <p className="text-sm text-gray-600 mt-0.5">
                Tanya rute, jadwal, atau kendala pemesanan — admin siap membantu.
              </p>
            </div>
            <a
              href="https://wa.me/6285268645461?text=Halo%20admin%2C%20saya%20ingin%20bertanya%20tentang%20travel%20Bengkulu%20Lebong"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-green-500 hover:bg-green-600 active:scale-95 text-white font-extrabold px-7 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.546 5.877L.057 23.882a.5.5 0 0 0 .615.612l6.094-1.592A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 0 1-5.031-1.384l-.36-.214-3.733.976.999-3.648-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
              </svg>
              Hubungi Admin
            </a>
          </div>

          {/* Catatan kecil */}
          <p className="text-xs text-primary-600 text-center font-medium">
            ✅ Pesan via form online — konfirmasi otomatis &nbsp;|&nbsp; 🕐 Admin aktif setiap hari
          </p>
        </div>
      </div>
      {/* ===== END KOTAK PEMESANAN ===== */}

      <p>
        Sebelum berangkat, banyak calon penumpang bertanya: <strong>Bengkulu ke Lebong lewat mana?</strong> Pertanyaan ini sangat masuk akal, mengingat Kabupaten Lebong terletak di pegunungan Bukit Barisan yang aksesnya tidak semudah perjalanan ke kota-kota besar lainnya. Mengetahui rute dengan tepat akan membantu Anda memperkirakan waktu perjalanan, menyiapkan kondisi fisik, dan memilih moda transportasi yang paling sesuai.
      </p>

      <p>
        Artikel ini membahas secara lengkap <strong>jalur utama</strong> yang dilalui dalam perjalanan Bengkulu–Lebong, titik-titik penting di sepanjang rute, kondisi jalan yang bisa Anda antisipasi, serta tips memilih transportasi yang aman dan nyaman.
      </p>

      <h2>Rute Utama: Bengkulu → Bengkulu Utara → Lebong</h2>

      <p>
        Jalur resmi dan paling umum yang digunakan untuk perjalanan dari Bengkulu menuju Kabupaten Lebong adalah melalui <strong>Kabupaten Bengkulu Utara</strong>, khususnya melewati Kota Arga Makmur sebagai titik persimpangan sebelum naik ke arah Lebong. Rute ini merupakan satu-satunya akses jalan darat yang layak dan paling banyak digunakan oleh kendaraan umum maupun pribadi.
      </p>

      <p>
        Secara sederhana, rute yang dilalui adalah sebagai berikut:
      </p>

      <table>
        <thead>
          <tr>
            <th>Urutan</th>
            <th>Titik / Wilayah</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><strong>Kota Bengkulu</strong></td>
            <td>Titik keberangkatan. Bisa dari berbagai titik di Bengkulu.</td>
          </tr>
          <tr>
            <td>2</td>
            <td><strong>Simpang Tiga / Jalan Raya Bengkulu Utara</strong></td>
            <td>Keluar dari kota Bengkulu menuju arah utara.</td>
          </tr>
          <tr>
            <td>3</td>
            <td><strong>Kab. Bengkulu Tengah</strong></td>
            <td>Melewati wilayah Bengkulu Tengah sebelum masuk ke Bengkulu Utara.</td>
          </tr>
          <tr>
            <td>4</td>
            <td><strong>Arga Makmur (Ibu Kota Bengkulu Utara)</strong></td>
            <td>Kota terbesar di jalur ini. Titik strategis untuk istirahat atau beli makanan.</td>
          </tr>
          <tr>
            <td>5</td>
            <td><strong>Simpang menuju Lebong</strong></td>
            <td>Persimpangan penting: belok ke arah timur menuju perbukitan Lebong.</td>
          </tr>
          <tr>
            <td>6</td>
            <td><strong>Jalur Pegunungan Bukit Barisan</strong></td>
            <td>Rute menanjak, berkelok, dan melewati hutan lindung. Pemandangan indah.</td>
          </tr>
          <tr>
            <td>7</td>
            <td><strong>Muara Aman (Ibu Kota Lebong)</strong></td>
            <td>Titik tujuan akhir. Pusat pemerintahan dan aktivitas Kabupaten Lebong.</td>
          </tr>
        </tbody>
      </table>

      <h2>Detail Segmen Perjalanan</h2>

      <h3>Segmen 1: Kota Bengkulu – Arga Makmur (±70 km)</h3>
      <p>
        Segmen pertama dimulai dari pusat Kota Bengkulu menuju Kota Arga Makmur, ibu kota Kabupaten Bengkulu Utara. Jarak segmen ini sekitar 70 kilometer dan dapat ditempuh dalam waktu <strong>1,5 hingga 2 jam</strong> dalam kondisi normal.
      </p>
      <p>
        Kondisi jalan di segmen ini relatif baik karena merupakan jalur lintas provinsi yang cukup ramai. Permukaan aspal pada umumnya mulus dan lebar jalan mencukupi untuk dua jalur. Titik-titik yang perlu diwaspadai adalah persimpangan di kawasan Bengkulu Tengah yang kadang padat di jam sibuk.
      </p>

      <h3>Segmen 2: Arga Makmur – Simpang Lebong (±40 km)</h3>
      <p>
        Setelah melewati Arga Makmur, perjalanan berlanjut ke arah timur menuju persimpangan masuk Kabupaten Lebong. Segmen ini berjarak sekitar 40 kilometer dan membutuhkan waktu sekitar <strong>45 menit hingga 1 jam</strong>.
      </p>
      <p>
        Jalan di segmen ini mulai terasa berubah — dari jalan lurus yang relatif datar, berangsur-angsur berubah menjadi lebih berbukit dan berliku. Lebar jalan sedikit menyempit di beberapa titik, namun masih aman untuk kendaraan jenis MPV atau minibus.
      </p>

      <h3>Segmen 3: Simpang Lebong – Muara Aman (±35–40 km)</h3>
      <p>
        Inilah segmen paling menantang sekaligus paling indah dalam perjalanan Bengkulu–Lebong. Rute ini memasuki kawasan pegunungan Bukit Barisan dengan tanjakan cukup curam, tikungan tajam, dan jalan yang menyempit di beberapa titik.
      </p>
      <p>
        Meski kondisinya menantang, pemandangan yang tersaji sepanjang jalur ini luar biasa: hamparan hutan hijau, jurang di sisi jalan, dan pada titik tertentu Anda bisa melihat panorama lembah yang memukau. Waktu tempuh segmen ini adalah <strong>45 menit hingga 1 jam lebih</strong>, tergantung kondisi cuaca dan kepadatan kendaraan.
      </p>

      <h2>Kondisi Jalan Bengkulu–Lebong</h2>

      <p>
        Memahami kondisi jalan adalah kunci untuk merencanakan perjalanan yang aman. Berikut gambaran umum kondisi jalan di masing-masing bagian rute:
      </p>

      <table>
        <thead>
          <tr>
            <th>Segmen</th>
            <th>Kondisi Jalan</th>
            <th>Catatan Khusus</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bengkulu – Bengkulu Tengah</td>
            <td>✅ Baik dan lebar</td>
            <td>Lalu lintas padat di pagi dan sore hari</td>
          </tr>
          <tr>
            <td>Bengkulu Tengah – Arga Makmur</td>
            <td>✅ Cukup baik</td>
            <td>Ada beberapa titik perbaikan jalan berkala</td>
          </tr>
          <tr>
            <td>Arga Makmur – Simpang Lebong</td>
            <td>⚠️ Bervariasi</td>
            <td>Jalan mulai menyempit, perlu kehati-hatian</td>
          </tr>
          <tr>
            <td>Simpang Lebong – Muara Aman</td>
            <td>⚠️ Menantang</td>
            <td>Tanjakan curam, tikungan tajam, rawan longsor saat hujan</td>
          </tr>
        </tbody>
      </table>

      <h2>Titik-Titik Penting di Sepanjang Rute</h2>

      <h3>🏪 Arga Makmur — Titik Istirahat Ideal</h3>
      <p>
        Kota Arga Makmur adalah lokasi terbaik untuk beristirahat, membeli makanan, atau mengisi bahan bakar sebelum melanjutkan perjalanan ke Lebong. Di sini Anda akan menemukan berbagai warung makan, minimarket, SPBU, dan fasilitas umum lainnya. Setelah melewati kota ini, fasilitas di tepi jalan semakin terbatas.
      </p>

      <h3>⛽ SPBU Terakhir Sebelum Lebong</h3>
      <p>
        Pastikan kendaraan Anda sudah terisi penuh bahan bakar sebelum meninggalkan kawasan Arga Makmur. SPBU di jalur menuju Lebong sangat terbatas, dan di beberapa segmen pegunungan, Anda tidak akan menemukan pom bensin dalam jarak yang cukup jauh.
      </p>

      <h3>🌄 Titik Pandang Pegunungan</h3>
      <p>
        Di beberapa titik dalam segmen pegunungan menuju Muara Aman, terdapat area pinggir jalan yang bisa digunakan sebagai tempat berhenti sejenak untuk menikmati panorama. Pemandangan lembah dan hutan tropis dari ketinggian ini menjadi salah satu momen yang paling diingat banyak penumpang.
      </p>

      <h3>🏙️ Muara Aman — Tujuan Akhir</h3>
      <p>
        Muara Aman adalah ibu kota Kabupaten Lebong sekaligus pusat kehidupan warganya. Di sinilah sebagian besar penumpang akan turun, baik untuk keperluan keluarga, pekerjaan, maupun wisata ke kawasan Danau Tes yang terkenal.
      </p>

      <h2>Apakah Ada Rute Alternatif Selain Via Bengkulu Utara?</h2>

      <p>
        Pertanyaan ini sering muncul, terutama dari penumpang yang ingin mencari jalur yang lebih cepat atau lebih singkat. Jawabannya adalah: <strong>secara praktis, saat ini tidak ada rute alternatif yang signifikan lebih baik dari jalur via Bengkulu Utara</strong>.
      </p>

      <p>
        Memang secara geografis ada jalur lain yang menghubungkan Lebong dengan daerah-daerah sekitarnya, namun jalur-jalur tersebut umumnya lebih kondusif untuk kendaraan khusus atau hanya bisa dilalui dengan motor trail. Untuk kendaraan penumpang standar seperti MPV atau minibus, <strong>jalur via Bengkulu Utara (Arga Makmur) adalah satu-satunya pilihan yang aman dan layak</strong>.
      </p>

      <h2>Kenapa Menggunakan Travel Lebih Dianjurkan untuk Rute Ini?</h2>

      <p>
        Rute Bengkulu–Lebong memiliki karakteristik yang cukup spesifik: medan berbukit, jalan yang menyempit di beberapa segmen, dan minim fasilitas di tengah perjalanan. Inilah mengapa menggunakan layanan travel dengan pengemudi berpengalaman jauh lebih disarankan dibanding mengemudi sendiri, terutama bagi yang belum pernah melewati jalur ini sebelumnya.
      </p>

      <ul>
        <li>
          <strong>Pengemudi hafal medan</strong> — Driver travel kami sudah ratusan kali melewati jalur Bengkulu–Lebong. Mereka tahu persis di mana saja titik rawan, kapan harus melambat, dan bagaimana antisipasi jika ada halangan di jalan.
        </li>
        <li>
          <strong>Armada sesuai medan</strong> — Kendaraan Toyota Avanza, Innova, dan HiAce yang kami gunakan sudah teruji untuk medan pegunungan. Kondisinya dirawat secara berkala untuk keamanan penumpang.
        </li>
        <li>
          <strong>Tidak perlu khawatir parkir atau BBM</strong> — Semua urusan teknis perjalanan ditangani driver. Anda tinggal duduk, menikmati perjalanan, dan tiba di tujuan dengan selamat.
        </li>
        <li>
          <strong>Door to door tanpa ribet</strong> — Tidak perlu ke terminal, tidak perlu transit. Dijemput dari rumah, diantar hingga tujuan akhir di Lebong.
        </li>
      </ul>

      <h2>Informasi Perjalanan Travel Bengkulu–Lebong</h2>

      <table>
        <thead>
          <tr>
            <th>Informasi</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Rute</td><td><strong>Bengkulu → Lebong (via Bengkulu Utara)</strong></td></tr>
          <tr><td>Tarif</td><td><strong>Rp 100.000/orang</strong></td></tr>
          <tr><td>Jarak Tempuh</td><td>±150 km</td></tr>
          <tr><td>Waktu Tempuh</td><td>3–4 jam</td></tr>
          <tr><td>Jalur Utama Via</td><td>Bengkulu Tengah → Arga Makmur → Simpang Lebong → Muara Aman</td></tr>
          <tr><td>Armada</td><td>Toyota Avanza, Innova, HiAce</td></tr>
          <tr><td>Sistem</td><td>Door to door</td></tr>
          <tr><td>Jadwal</td><td>Setiap hari, fleksibel</td></tr>
        </tbody>
      </table>

      <h2>Cara Memesan Travel Bengkulu–Lebong</h2>

      <ol>
        <li>Klik tombol <strong>"Pesan Online!"</strong> di atas dan isi formulir pemesanan</li>
        <li>Cantumkan tanggal berangkat, jumlah penumpang, dan titik penjemputan</li>
        <li>Informasikan tujuan akhir di Lebong (misalnya: Muara Aman pusat, atau desa tertentu)</li>
        <li>Admin akan mengkonfirmasi pesanan dan memberikan informasi driver sebelum hari keberangkatan</li>
        <li>Driver menjemput tepat waktu sesuai jadwal yang disepakati ✅</li>
      </ol>

      <h2>Pertanyaan Umum Seputar Rute Bengkulu–Lebong</h2>

      <h3>Apakah jalur Bengkulu–Lebong aman untuk perjalanan malam?</h3>
      <p>
        Perjalanan malam di jalur ini membutuhkan kehati-hatian ekstra karena minimnya penerangan jalan, terutama di segmen pegunungan. Untuk keamanan optimal, kami menyarankan keberangkatan di pagi atau siang hari. Namun jika terpaksa, pastikan menggunakan jasa travel dengan pengemudi yang sudah berpengalaman di rute ini.
      </p>

      <h3>Apakah ada potensi longsor di jalur ini?</h3>
      <p>
        Di musim hujan, beberapa titik di segmen pegunungan (mendekati Muara Aman) memang rawan longsor atau material jatuh dari tebing. Driver berpengalaman akan memantau kondisi ini dan mengambil keputusan terbaik untuk keselamatan penumpang. Selalu pantau informasi terkini kondisi jalan sebelum berangkat.
      </p>

      <h3>Berapa lama dari Arga Makmur ke Muara Aman?</h3>
      <p>
        Dari Kota Arga Makmur menuju Muara Aman, waktu tempuh berkisar antara <strong>1,5 hingga 2 jam</strong>, tergantung kondisi jalan dan cuaca. Segmen ini adalah bagian paling menantang sekaligus paling indah dari keseluruhan rute.
      </p>

      <h3>Apakah ada sinyal HP di sepanjang rute?</h3>
      <p>
        Sinyal seluler cukup baik di area Bengkulu, Bengkulu Tengah, dan Arga Makmur. Namun di kawasan pegunungan mendekati Muara Aman, sinyal bisa melemah atau bahkan hilang di beberapa titik. Siapkan hiburan offline jika Anda membutuhkan koneksi internet yang stabil.
      </p>

      <h2>Layanan Terkait</h2>
      <ul>
        <li><Link href="/travel-bengkulu-lebong" className="text-primary-600 hover:underline">Travel Bengkulu Lebong — Informasi Lengkap</Link></li>
        <li><Link href="/travel-lebong-bengkulu" className="text-primary-600 hover:underline">Travel Lebong Bengkulu — Pesan dari Lebong</Link></li>
        <li><Link href="/bengkulu-lebong-berapa-jam" className="text-primary-600 hover:underline">Bengkulu ke Lebong Berapa Jam? Estimasi Waktu Tempuh</Link></li>
        <li><Link href="/jarak-bengkulu-lebong" className="text-primary-600 hover:underline">Jarak Bengkulu ke Lebong — Berapa Kilometer?</Link></li>
        <li><Link href="/pesan" className="text-primary-600 hover:underline">Form Pemesanan Online</Link></li>
      </ul>

    </ArticleLayout>
  );
}
