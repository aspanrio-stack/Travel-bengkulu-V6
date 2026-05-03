import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Bengkulu ke Lebong Berapa Jam? Ini Estimasi Waktu Tempuh Terbaru',
  description:
    'Perjalanan Bengkulu ke Lebong memakan waktu 3–4 jam via Bengkulu Utara. Cek estimasi lengkap, kondisi jalan, dan pesan travel door to door Rp 100.000!',
  alternates: { canonical: 'https://bengkulutravel.com/bengkulu-lebong-berapa-jam' },
};

export default function Page() {
  return (
    <ArticleLayout
      title="Bengkulu ke Lebong Berapa Jam?"
      description="Estimasi waktu tempuh perjalanan dari Bengkulu ke Kabupaten Lebong lengkap dengan informasi rute, kondisi jalan, dan tips agar perjalanan lebih nyaman."
      breadcrumbs={[
        { label: 'Travel Bengkulu Lebong', href: '/travel-bengkulu-lebong' },
        { label: 'Bengkulu ke Lebong Berapa Jam' },
      ]}
      badge="⏱️ Info Perjalanan"
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
        Salah satu pertanyaan yang paling sering muncul sebelum bepergian adalah: <strong>Bengkulu ke Lebong berapa jam?</strong> Wajar sekali, karena rute ini melewati kawasan pegunungan Bukit Barisan yang medannya cukup menantang. Dengan informasi yang tepat, Anda bisa merencanakan perjalanan lebih matang — mulai dari waktu berangkat, kebutuhan istirahat, hingga memilih moda transportasi yang paling sesuai.
      </p>

      <p>
        Artikel ini menyajikan estimasi waktu tempuh perjalanan <strong>Bengkulu–Lebong</strong> secara lengkap, disertai penjelasan faktor-faktor yang memengaruhi durasi perjalanan, kondisi jalan terkini, serta rekomendasi layanan travel yang bisa Anda percaya.
      </p>

      <h2>Estimasi Waktu Tempuh Bengkulu ke Lebong</h2>

      <p>
        Secara umum, perjalanan dari Kota Bengkulu menuju Kabupaten Lebong membutuhkan waktu sekitar <strong>3 hingga 4 jam</strong>. Estimasi ini berlaku untuk kondisi normal — tidak ada hujan lebat, tidak ada kemacetan panjang, dan jalan dalam kondisi baik. Rute yang paling umum digunakan adalah melalui Kabupaten Bengkulu Utara, khususnya melewati Kota Arga Makmur sebelum naik ke arah Muara Aman, ibu kota Kabupaten Lebong.
      </p>

      <table>
        <thead>
          <tr>
            <th>Kondisi Perjalanan</th>
            <th>Estimasi Waktu</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Normal (cuaca cerah, jalan lancar)</td><td><strong>3 – 3,5 jam</strong></td></tr>
          <tr><td>Musim hujan / jalan rusak sebagian</td><td><strong>3,5 – 4 jam</strong></td></tr>
          <tr><td>Akhir pekan / hari libur nasional</td><td><strong>4 – 4,5 jam</strong></td></tr>
          <tr><td>Menggunakan travel door to door</td><td><strong>3 – 4 jam</strong> (termasuk jemput penumpang)</td></tr>
        </tbody>
      </table>

      <p>
        Perlu dicatat bahwa jika Anda menggunakan layanan travel <em>door to door</em>, driver biasanya akan menjemput beberapa penumpang dari berbagai titik di Bengkulu terlebih dahulu sebelum berangkat. Proses penjemputan ini bisa menambah 15–30 menit dari waktu tempuh murni.
      </p>

      <h2>Faktor yang Memengaruhi Lama Perjalanan</h2>

      <p>
        Waktu tempuh Bengkulu–Lebong tidak selalu tetap. Ada beberapa variabel yang secara signifikan bisa memperpanjang atau mempersingkat durasi perjalanan Anda:
      </p>

      <h3>1. Kondisi Cuaca</h3>
      <p>
        Rute Bengkulu–Lebong melewati kawasan pegunungan yang sering diselimuti kabut dan hujan, terutama di sore dan malam hari. Ketika hujan deras, jalan menjadi licin dan jarak pandang berkurang, sehingga pengemudi harus menurunkan kecepatan demi keselamatan. Pada musim penghujan (Oktober–Maret), tambahkan sekitar 30–60 menit untuk antisipasi.
      </p>

      <h3>2. Kondisi Jalan</h3>
      <p>
        Sebagian rute menuju Lebong melewati jalan yang berbelok dan menanjak. Meski secara umum sudah beraspal, ada segmen tertentu yang kondisinya kurang mulus, terutama setelah musim hujan atau di sekitar area perbukitan. Pengemudi berpengalaman yang sudah hafal medan jelas akan lebih efisien dalam menavigasi jalur ini.
      </p>

      <h3>3. Waktu Keberangkatan</h3>
      <p>
        Keberangkatan di pagi hari (sekitar pukul 06.00–08.00) biasanya memberikan waktu tempuh paling singkat karena lalu lintas masih sepi. Sebaliknya, berangkat menjelang sore atau malam hari berpotensi memperlama perjalanan karena kondisi pencahayaan yang terbatas di jalur pegunungan.
      </p>

      <h3>4. Jumlah Penumpang dan Titik Jemput</h3>
      <p>
        Untuk layanan travel <em>door to door</em>, semakin banyak titik penjemputan yang harus dilalui driver, semakin lama total waktu perjalanan dari sudut pandang penumpang pertama. Biasanya, penumpang yang dijemput lebih awal adalah yang tinggal paling jauh dari jalur utama menuju Lebong.
      </p>

      <h3>5. Hari dan Musim Perjalanan</h3>
      <p>
        Pada momen tertentu seperti hari raya Lebaran, libur panjang sekolah, atau akhir pekan panjang, volume kendaraan di rute Bengkulu–Lebong meningkat drastis. Ini bisa menambah 30–90 menit dari waktu tempuh normal, terutama di titik-titik persimpangan padat.
      </p>

      <h2>Perbandingan Moda Transportasi Bengkulu–Lebong</h2>

      <table>
        <thead>
          <tr>
            <th>Moda Transportasi</th>
            <th>Waktu Tempuh</th>
            <th>Tarif Estimasi</th>
            <th>Kenyamanan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Travel Door to Door</td>
            <td>3–4 jam</td>
            <td>Rp 100.000/orang</td>
            <td>⭐⭐⭐⭐⭐ Sangat Nyaman</td>
          </tr>
          <tr>
            <td>Bus Umum / Damri</td>
            <td>4–5 jam</td>
            <td>Rp 60.000–80.000</td>
            <td>⭐⭐⭐ Standar</td>
          </tr>
          <tr>
            <td>Kendaraan Pribadi</td>
            <td>3–3,5 jam</td>
            <td>Biaya BBM + tol</td>
            <td>⭐⭐⭐⭐ Fleksibel</td>
          </tr>
          <tr>
            <td>Ojek Online / Konvensional</td>
            <td>Tidak tersedia rute ini</td>
            <td>—</td>
            <td>—</td>
          </tr>
        </tbody>
      </table>

      <p>
        Dari perbandingan di atas, <strong>layanan travel door to door</strong> menjadi pilihan paling populer bagi warga yang bepergian tanpa kendaraan pribadi. Selain waktu tempuh yang kompetitif, kenyamanan berupa penjemputan langsung dari rumah menjadi nilai tambah yang sulit ditandingi moda lain.
      </p>

      <h2>Tips Agar Perjalanan Bengkulu–Lebong Lebih Nyaman</h2>

      <ul>
        <li>
          <strong>Berangkat pagi hari</strong> — Waktu terbaik adalah pukul 06.00–07.00. Selain jalan lebih sepi, Anda juga terhindar dari kabut tebal yang kerap muncul di sore hari di kawasan perbukitan.
        </li>
        <li>
          <strong>Sarapan sebelum berangkat</strong> — Rute ini minim warung makan di tengah perjalanan. Pastikan perut sudah terisi agar tidak merasa mual di jalan yang berkelok.
        </li>
        <li>
          <strong>Siapkan obat anti-mabuk</strong> — Jalur menuju Lebong cukup banyak tikungan tajam. Bagi yang rentan mabuk perjalanan, konsumsi obat pencegah 30 menit sebelum berangkat.
        </li>
        <li>
          <strong>Bawa air minum yang cukup</strong> — Perjalanan 3–4 jam tanpa warung terdekat membuat Anda perlu menyiapkan air minum sendiri, terutama jika bepergian bersama anak-anak.
        </li>
        <li>
          <strong>Informasikan titik jemput dengan jelas</strong> — Saat memesan travel, berikan alamat lengkap beserta patokan jelas agar driver tidak perlu memutar arah dan membuang waktu.
        </li>
        <li>
          <strong>Pesan H-1 atau lebih awal</strong> — Terutama untuk perjalanan di musim liburan, pemesanan jauh hari memastikan Anda mendapat seat dan waktu jemput yang sesuai keinginan.
        </li>
      </ul>

      <h2>Kenapa Pilih Travel Dibanding Transportasi Umum?</h2>

      <p>
        Bagi sebagian orang, naik bus mungkin terasa lebih hemat di atas kertas. Namun jika dihitung secara menyeluruh, ada beberapa alasan mengapa layanan travel <em>door to door</em> sering menjadi pilihan lebih bijak untuk rute Bengkulu–Lebong:
      </p>

      <ul>
        <li>
          <strong>Tidak perlu ke terminal</strong> — Anda dijemput langsung dari rumah atau lokasi mana pun di Bengkulu. Tidak perlu repot menarik koper ke terminal Panorama atau mencari ojek ke titik keberangkatan bus.
        </li>
        <li>
          <strong>Diantar ke tujuan akhir</strong> — Travel door to door mengantarkan penumpang langsung ke alamat tujuan di Lebong, bukan hanya ke terminal atau titik pemberhentian umum.
        </li>
        <li>
          <strong>Armada lebih nyaman</strong> — Kendaraan yang digunakan umumnya Toyota Avanza, Innova, atau HiAce yang ber-AC dan lebih terawat dibanding bus umum.
        </li>
        <li>
          <strong>Lebih cepat</strong> — Travel tidak berhenti di setiap terminal atau titik pemberhentian sembarangan. Begitu semua penumpang terkumpul, perjalanan langsung dimulai.
        </li>
        <li>
          <strong>Tarif terjangkau dan transparan</strong> — Dengan harga <strong>Rp 100.000 per orang</strong>, tidak ada biaya tambahan yang mengejutkan di tengah jalan.
        </li>
      </ul>

      <h2>Jadwal dan Ketersediaan Travel Bengkulu–Lebong</h2>

      <p>
        Layanan travel Bengkulu–Lebong beroperasi setiap hari, termasuk hari Minggu dan hari libur nasional. Tidak ada jadwal keberangkatan yang kaku — sistem yang digunakan bersifat fleksibel, menyesuaikan dengan ketersediaan penumpang dan permintaan pada hari tersebut.
      </p>

      <p>
        Waktu keberangkatan yang paling sering tersedia adalah pagi hari sekitar pukul 07.00–09.00. Untuk keberangkatan sore atau malam hari, penumpang dianjurkan menghubungi admin terlebih dahulu untuk konfirmasi ketersediaan driver.
      </p>

      <table>
        <thead>
          <tr>
            <th>Informasi</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Rute</td><td><strong>Bengkulu → Lebong (Muara Aman)</strong></td></tr>
          <tr><td>Tarif</td><td><strong>Rp 100.000/orang</strong></td></tr>
          <tr><td>Waktu Tempuh</td><td>3–4 jam</td></tr>
          <tr><td>Via</td><td>Bengkulu Utara (Arga Makmur)</td></tr>
          <tr><td>Armada</td><td>Toyota Avanza, Innova, HiAce</td></tr>
          <tr><td>Sistem</td><td>Door to door (antar jemput)</td></tr>
          <tr><td>Jadwal</td><td>Setiap hari, fleksibel</td></tr>
          <tr><td>Pemesanan</td><td>Online / WhatsApp</td></tr>
        </tbody>
      </table>

      <h2>Cara Memesan Travel Bengkulu–Lebong</h2>

      <ol>
        <li>Klik tombol <strong>"Pesan Online!"</strong> di atas untuk mengisi formulir pemesanan</li>
        <li>Masukkan tanggal keberangkatan dan jumlah penumpang yang ikut</li>
        <li>Tuliskan alamat lengkap penjemputan beserta patokan yang mudah ditemukan driver</li>
        <li>Informasikan tujuan akhir di Lebong agar driver sudah siap rute yang akan dilalui</li>
        <li>Konfirmasi pesanan diterima — driver kami akan menghubungi Anda sebelum hari keberangkatan ✅</li>
      </ol>

      <h2>Pertanyaan Umum Seputar Perjalanan Bengkulu–Lebong</h2>

      <h3>Apakah ada rest area di sepanjang rute Bengkulu–Lebong?</h3>
      <p>
        Tidak ada rest area resmi seperti di jalan tol. Namun, pengemudi biasanya akan berhenti sebentar di warung makan atau SPBU di kawasan Arga Makmur jika diperlukan, terutama untuk rombongan dengan anak kecil atau lansia.
      </p>

      <h3>Berapa biaya parkir jika membawa kendaraan pribadi?</h3>
      <p>
        Rute Bengkulu–Lebong tidak melewati jalan tol berbayar, sehingga tidak ada biaya tol. Biaya yang perlu disiapkan hanya bahan bakar (sekitar 15–20 liter untuk PP) dan biaya parkir di tujuan jika ada.
      </p>

      <h3>Apakah aman bepergian malam hari?</h3>
      <p>
        Secara umum aman, namun tidak disarankan untuk pengemudi yang tidak hafal medan. Rute pegunungan ini minim penerangan dan beberapa segmen cukup sempit. Untuk keamanan maksimal, gunakan layanan travel dengan pengemudi berpengalaman.
      </p>

      <h3>Bisakah memesan travel untuk keesokan harinya?</h3>
      <p>
        Bisa. Pemesanan bisa dilakukan melalui form online atau WhatsApp kapan saja. Semakin cepat memesan, semakin besar peluang mendapatkan jam jemput sesuai keinginan Anda.
      </p>

      <h2>Layanan Terkait</h2>
      <ul>
        <li><Link href="/travel-bengkulu-lebong" className="text-primary-600 hover:underline">Travel Bengkulu Lebong — Informasi Lengkap</Link></li>
        <li><Link href="/travel-lebong-bengkulu" className="text-primary-600 hover:underline">Travel Lebong Bengkulu — Pesan dari Lebong</Link></li>
        <li><Link href="/bengkulu-lebong-lewat-mana" className="text-primary-600 hover:underline">Bengkulu ke Lebong Lewat Mana? Panduan Rute Terlengkap</Link></li>
        <li><Link href="/jarak-bengkulu-lebong" className="text-primary-600 hover:underline">Jarak Bengkulu ke Lebong — Berapa Kilometer?</Link></li>
        <li><Link href="/pesan" className="text-primary-600 hover:underline">Form Pemesanan Online</Link></li>
      </ul>

    </ArticleLayout>
  );
}
