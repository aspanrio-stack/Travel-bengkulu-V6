import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Jarak Bengkulu ke Lebong Berapa Km? Panduan Lengkap 2025',
  description:
    'Jarak Bengkulu ke Lebong sekitar 150 km via Bengkulu Utara. Cek detail jarak per segmen, biaya BBM, waktu tempuh, dan pesan travel door to door Rp 100.000!',
  alternates: { canonical: 'https://bengkulutravel.com/jarak-bengkulu-lebong' },
};

export default function Page() {
  return (
    <ArticleLayout
      title="Jarak Bengkulu ke Lebong"
      description="Informasi lengkap jarak tempuh perjalanan Bengkulu–Lebong dalam kilometer, detail per segmen, estimasi biaya BBM, dan pilihan transportasi terbaik menuju Kabupaten Lebong."
      breadcrumbs={[
        { label: 'Travel Bengkulu Lebong', href: '/travel-bengkulu-lebong' },
        { label: 'Jarak Bengkulu ke Lebong' },
      ]}
      badge="📍 Info Jarak"
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
        Sebelum merencanakan perjalanan, salah satu informasi paling mendasar yang dibutuhkan adalah <strong>jarak Bengkulu ke Lebong berapa kilometer</strong>. Dengan mengetahui jarak yang sesungguhnya, Anda bisa memperkirakan durasi perjalanan, kebutuhan bahan bakar jika membawa kendaraan sendiri, hingga menentukan jenis transportasi yang paling efisien dan nyaman.
      </p>

      <p>
        Artikel ini menyajikan informasi jarak Bengkulu–Lebong secara mendetail, dibagi per segmen perjalanan, dilengkapi estimasi biaya, waktu tempuh, dan perbandingan moda transportasi yang tersedia.
      </p>

      <h2>Jarak Bengkulu ke Lebong: Ringkasan Cepat</h2>

      <table>
        <thead>
          <tr>
            <th>Informasi</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Total Jarak (via darat)</td><td><strong>±150 km</strong></td></tr>
          <tr><td>Rute Yang Dilalui</td><td>Bengkulu → Bengkulu Utara → Muara Aman</td></tr>
          <tr><td>Waktu Tempuh</td><td>3–4 jam (kondisi normal)</td></tr>
          <tr><td>Jenis Jalan</td><td>Jalan aspal (provinsi + kabupaten)</td></tr>
          <tr><td>Ada Jalan Tol?</td><td>Tidak ada</td></tr>
          <tr><td>Jarak Udara (garis lurus)</td><td>±90 km (tidak bisa dilalui langsung)</td></tr>
        </tbody>
      </table>

      <p>
        Jarak tempuh via darat yang mencapai <strong>±150 kilometer</strong> ini lebih panjang dibanding jarak garis lurus (sekitar 90 km) karena rute yang ada mengharuskan kendaraan memutar mengikuti jalan yang tersedia, terutama melewati Kabupaten Bengkulu Utara sebelum naik ke kawasan pegunungan menuju Lebong.
      </p>

      <h2>Jarak Per Segmen Perjalanan</h2>

      <p>
        Agar gambaran perjalanan lebih jelas, berikut rincian jarak di setiap segmen yang dilalui dari Bengkulu menuju Muara Aman (ibu kota Kabupaten Lebong):
      </p>

      <table>
        <thead>
          <tr>
            <th>Segmen</th>
            <th>Dari</th>
            <th>Ke</th>
            <th>Jarak</th>
            <th>Waktu Tempuh</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Kota Bengkulu</td>
            <td>Arga Makmur (Bengkulu Utara)</td>
            <td>±70 km</td>
            <td>1,5–2 jam</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Arga Makmur</td>
            <td>Simpang Masuk Lebong</td>
            <td>±40 km</td>
            <td>45–60 menit</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Simpang Lebong</td>
            <td>Muara Aman (Pusat Kota Lebong)</td>
            <td>±40 km</td>
            <td>45–70 menit</td>
          </tr>
          <tr>
            <td colSpan={2}><strong>Total</strong></td>
            <td><strong>Bengkulu → Muara Aman</strong></td>
            <td><strong>±150 km</strong></td>
            <td><strong>3–4 jam</strong></td>
          </tr>
        </tbody>
      </table>

      <p>
        Perlu diingat bahwa jarak 150 km ini dihitung dari pusat Kota Bengkulu menuju pusat Kota Muara Aman. Jika titik keberangkatan atau tujuan Anda berbeda (misalnya dari pinggiran kota Bengkulu, atau ke kecamatan tertentu di Lebong), maka jarak aktualnya bisa lebih atau kurang dari angka di atas.
      </p>

      <h2>Estimasi Biaya BBM untuk Perjalanan Pribadi</h2>

      <p>
        Bagi Anda yang berencana mengemudi sendiri menggunakan kendaraan pribadi, berikut estimasi kasar konsumsi bahan bakar dan biayanya untuk perjalanan satu arah Bengkulu–Lebong (±150 km):
      </p>

      <table>
        <thead>
          <tr>
            <th>Jenis Kendaraan</th>
            <th>Konsumsi BBM (per km)</th>
            <th>Kebutuhan BBM (150 km)</th>
            <th>Estimasi Biaya (Pertalite)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Motor</td>
            <td>1 liter / 40 km</td>
            <td>±3,75 liter</td>
            <td>±Rp 37.500</td>
          </tr>
          <tr>
            <td>Mobil Sedan / City Car</td>
            <td>1 liter / 15 km</td>
            <td>±10 liter</td>
            <td>±Rp 100.000</td>
          </tr>
          <tr>
            <td>MPV (Avanza, Xenia)</td>
            <td>1 liter / 12 km</td>
            <td>±12,5 liter</td>
            <td>±Rp 125.000</td>
          </tr>
          <tr>
            <td>SUV / Mobil Besar</td>
            <td>1 liter / 10 km</td>
            <td>±15 liter</td>
            <td>±Rp 150.000</td>
          </tr>
        </tbody>
      </table>

      <p>
        Catatan: Estimasi di atas dihitung menggunakan harga Pertalite sekitar Rp 10.000/liter sebagai referensi. Konsumsi BBM aktual bisa lebih tinggi karena rute pegunungan yang banyak tanjakan akan membuat mesin bekerja lebih keras.
      </p>

      <p>
        Menariknya, jika dibandingkan dengan biaya travel door to door hanya <strong>Rp 100.000 per orang</strong>, menggunakan layanan travel bisa menjadi pilihan yang lebih hemat sekaligus jauh lebih nyaman — terutama jika Anda bepergian sendiri atau berdua.
      </p>

      <h2>Perbandingan: Kendaraan Pribadi vs Travel</h2>

      <table>
        <thead>
          <tr>
            <th>Aspek</th>
            <th>Kendaraan Pribadi</th>
            <th>Travel Door to Door</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Biaya (1 orang)</td>
            <td>Rp 100.000–150.000 (BBM saja)</td>
            <td><strong>Rp 100.000 (flat, semua sudah termasuk)</strong></td>
          </tr>
          <tr>
            <td>Biaya (2 orang)</td>
            <td>Rp 100.000–150.000 (dibagi 2)</td>
            <td>Rp 200.000 total</td>
          </tr>
          <tr>
            <td>Perlu mengemudi</td>
            <td>Ya (melelahkan di jalur pegunungan)</td>
            <td>Tidak — bisa istirahat sepanjang jalan</td>
          </tr>
          <tr>
            <td>Risiko tersesat</td>
            <td>Ada, terutama untuk pemula</td>
            <td>Nol — driver hafal rute</td>
          </tr>
          <tr>
            <td>Penjemputan</td>
            <td>Dari garasi sendiri</td>
            <td>Dari rumah / lokasi mana pun</td>
          </tr>
          <tr>
            <td>Pengantaran</td>
            <td>Harus parkir sendiri di tujuan</td>
            <td>Diantar langsung ke tujuan</td>
          </tr>
          <tr>
            <td>Kondisi kendaraan</td>
            <td>Tergantung kondisi mobil pribadi</td>
            <td>Armada terawat dan ber-AC</td>
          </tr>
        </tbody>
      </table>

      <h2>Faktor yang Membuat Jarak Terasa Lebih Jauh atau Lebih Dekat</h2>

      <p>
        Jarak 150 km adalah angka tetap, namun pengalaman perjalanan bisa terasa sangat berbeda tergantung sejumlah faktor. Berikut yang paling berpengaruh:
      </p>

      <h3>Kualitas Jalan</h3>
      <p>
        Di jalur lintas Bengkulu–Bengkulu Utara, kualitas jalan umumnya cukup baik dan mulus, sehingga kecepatan rata-rata kendaraan bisa terjaga. Namun begitu memasuki kawasan pegunungan menuju Muara Aman, jalan menyempit, banyak tikungan tajam, dan tanjakan curam membuat kecepatan harus diturunkan. Secara psikologis, 40 km di jalur pegunungan bisa terasa dua kali lebih panjang dari 70 km di jalan lurus.
      </p>

      <h3>Cuaca dan Musim</h3>
      <p>
        Hujan lebat di kawasan pegunungan bisa memperlambat perjalanan secara signifikan. Selain membuat jalan licin, curah hujan tinggi juga meningkatkan risiko material longsor atau banjir di beberapa titik tertentu. Pada musim kemarau, kondisi jalan jauh lebih bersahabat dan perjalanan terasa lebih singkat.
      </p>

      <h3>Kondisi Kendaraan</h3>
      <p>
        Kendaraan dengan kondisi prima, terutama rem yang terawat dan ban yang masih bagus, akan membuat perjalanan lebih cepat dan aman. Kendaraan yang kurang terawat akan memaksa pengemudi lebih berhati-hati dan memperlambat laju perjalanan.
      </p>

      <h3>Waktu Keberangkatan</h3>
      <p>
        Keberangkatan pagi hari antara pukul 06.00–08.00 umumnya memberikan perjalanan tercepat karena lalu lintas belum padat. Sebaliknya, berangkat di sore hari saat kondisi mulai remang-remang di area pegunungan cenderung membuat pengemudi lebih berhati-hati dan memperpanjang waktu tempuh.
      </p>

      <h2>Jarak dari Bengkulu ke Titik-Titik Penting di Kabupaten Lebong</h2>

      <p>
        Kabupaten Lebong memiliki beberapa kecamatan yang lokasinya berbeda-beda dari Muara Aman. Berikut estimasi jarak dari Kota Bengkulu ke beberapa titik tujuan populer di Lebong:
      </p>

      <table>
        <thead>
          <tr>
            <th>Tujuan di Lebong</th>
            <th>Estimasi Jarak dari Bengkulu</th>
            <th>Estimasi Waktu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Muara Aman (Pusat Kota)</td>
            <td>±150 km</td>
            <td>3–4 jam</td>
          </tr>
          <tr>
            <td>Danau Tes</td>
            <td>±145 km</td>
            <td>3–3,5 jam</td>
          </tr>
          <tr>
            <td>Tes (Kec. Lebong Selatan)</td>
            <td>±140 km</td>
            <td>3–3,5 jam</td>
          </tr>
          <tr>
            <td>Rimbo Pengadang</td>
            <td>±155 km</td>
            <td>3,5–4 jam</td>
          </tr>
          <tr>
            <td>Topos (Kec. Lebong Utara)</td>
            <td>±170 km</td>
            <td>4–5 jam</td>
          </tr>
        </tbody>
      </table>

      <p>
        Untuk tujuan di luar Muara Aman, pastikan Anda menginformasikan lokasi pasti saat melakukan pemesanan travel agar driver bisa mempersiapkan rute dan estimasi biaya yang akurat.
      </p>

      <h2>Kenapa Jarak Lebong Lebih Jauh dari yang Diperkirakan?</h2>

      <p>
        Banyak orang terkejut ketika mengetahui bahwa perjalanan Bengkulu–Lebong membutuhkan waktu 3–4 jam meski jarak garis lurusnya "hanya" sekitar 90 km. Ada beberapa penjelasan untuk hal ini:
      </p>

      <ul>
        <li>
          <strong>Tidak ada jalan langsung</strong> — Secara geografis, Lebong terletak di sisi timur pegunungan Bukit Barisan, sementara Bengkulu di sisi barat. Tidak ada jalan yang menembus pegunungan secara langsung, sehingga kendaraan harus memutar melalui Bengkulu Utara.
        </li>
        <li>
          <strong>Medan berkelok dan menanjak</strong> — Jalan yang meliuk-liuk mengikuti kontur pegunungan secara otomatis memperpanjang total jarak tempuh dibanding jarak lurus.
        </li>
        <li>
          <strong>Batas kecepatan efektif</strong> — Di jalur pegunungan, kecepatan aman rata-rata hanya sekitar 30–50 km/jam, jauh di bawah kecepatan yang bisa dicapai di jalan lurus dan mulus.
        </li>
        <li>
          <strong>Tidak ada jalan tol</strong> — Berbeda dengan rute antar kota besar yang sudah terkoneksi jalan tol, rute Bengkulu–Lebong sepenuhnya menggunakan jalan biasa tanpa akses tol.
        </li>
      </ul>

      <h2>Apakah Ada Rencana Pembangunan Jalan Baru?</h2>

      <p>
        Pemerintah daerah dan pusat memang terus mendorong peningkatan konektivitas di wilayah Bengkulu, termasuk rute menuju Lebong. Namun hingga saat ini, jalur via Bengkulu Utara masih menjadi satu-satunya rute darat yang layak dan aktif digunakan. Perbaikan dan peningkatan kualitas jalan di segmen-segmen tertentu terus dilakukan secara bertahap.
      </p>

      <h2>Tips Sebelum Menempuh Perjalanan Bengkulu–Lebong</h2>

      <ul>
        <li>
          <strong>Pastikan kendaraan dalam kondisi prima</strong> — Periksa rem, ban, air radiator, dan oli sebelum berangkat. Tanjakan panjang menuju Lebong akan menguji kondisi kendaraan lebih keras dari biasanya.
        </li>
        <li>
          <strong>Isi penuh tangki bahan bakar di Bengkulu atau Arga Makmur</strong> — SPBU semakin terbatas setelah melewati Arga Makmur menuju Lebong.
        </li>
        <li>
          <strong>Bawa bekal makanan dan minuman</strong> — Warung makan di sepanjang jalur pegunungan sangat terbatas, terutama di segmen terakhir menuju Muara Aman.
        </li>
        <li>
          <strong>Unduh peta offline</strong> — Sinyal internet di beberapa titik jalur pegunungan bisa tidak stabil. Unduh peta Google Maps offline untuk wilayah ini sebelum berangkat.
        </li>
        <li>
          <strong>Pertimbangkan menggunakan travel</strong> — Jika tidak ingin repot dengan semua persiapan di atas, menggunakan layanan travel door to door adalah solusi paling praktis dan tetap terjangkau hanya <strong>Rp 100.000 per orang</strong>.
        </li>
      </ul>

      <h2>Informasi Lengkap Travel Bengkulu–Lebong</h2>

      <table>
        <thead>
          <tr>
            <th>Informasi</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Rute</td><td><strong>Bengkulu → Lebong (Muara Aman)</strong></td></tr>
          <tr><td>Jarak</td><td><strong>±150 km</strong></td></tr>
          <tr><td>Tarif Travel</td><td><strong>Rp 100.000/orang</strong></td></tr>
          <tr><td>Waktu Tempuh</td><td>3–4 jam</td></tr>
          <tr><td>Via</td><td>Bengkulu Utara (Arga Makmur)</td></tr>
          <tr><td>Armada</td><td>Toyota Avanza, Innova, HiAce</td></tr>
          <tr><td>Sistem</td><td>Door to door</td></tr>
          <tr><td>Jadwal</td><td>Setiap hari, fleksibel</td></tr>
        </tbody>
      </table>

      <h2>Cara Memesan Travel Bengkulu–Lebong</h2>

      <ol>
        <li>Klik tombol <strong>"Pesan Online!"</strong> di atas untuk mengakses formulir pemesanan</li>
        <li>Isi tanggal keberangkatan yang diinginkan</li>
        <li>Cantumkan jumlah penumpang dan alamat lengkap penjemputan</li>
        <li>Informasikan tujuan spesifik di Lebong (kecamatan atau desa tujuan)</li>
        <li>Admin mengkonfirmasi pesanan — driver siap menjemput tepat waktu ✅</li>
      </ol>

      <h2>Pertanyaan Umum Seputar Jarak Bengkulu–Lebong</h2>

      <h3>Apakah jarak 150 km ini sudah termasuk rute dalam kota?</h3>
      <p>
        Jarak ±150 km dihitung dari pusat Kota Bengkulu menuju pusat Kota Muara Aman. Jika titik awal atau akhir perjalanan Anda berbeda (misalnya dari kelurahan tertentu di pinggir kota, atau menuju desa di luar Muara Aman), total jarak bisa sedikit berbeda.
      </p>

      <h3>Apakah ada jalan pintas yang lebih pendek?</h3>
      <p>
        Secara praktis belum ada. Jalur via Bengkulu Utara adalah satu-satunya rute darat yang bisa dilalui kendaraan penumpang dengan aman. Jalur-jalur alternatif yang ada saat ini umumnya hanya dapat dilalui kendaraan off-road atau kendaraan roda dua.
      </p>

      <h3>Berapa kali pengisian BBM yang dibutuhkan PP?</h3>
      <p>
        Untuk kendaraan MPV dengan tangki standar 40–50 liter, sekali pengisian penuh biasanya cukup untuk perjalanan pulang-pergi (±300 km) dengan sisa cadangan yang aman. Namun untuk antisipasi, isi ulang di Arga Makmur saat perjalanan ke Lebong atau saat kembali ke Bengkulu.
      </p>

      <h3>Berapa lama waktu tempuh jika menggunakan motor?</h3>
      <p>
        Dengan motor, waktu tempuh bisa sedikit lebih cepat di jalur datar (karena lebih lincah melewati kemacetan), namun lebih lambat di jalur pegunungan karena harus lebih berhati-hati. Estimasi total waktu dengan motor adalah <strong>2,5 hingga 3,5 jam</strong>, tergantung kondisi jalan dan pengalaman pengendara.
      </p>

      <h2>Layanan Terkait</h2>
      <ul>
        <li><Link href="/travel-bengkulu-lebong" className="text-primary-600 hover:underline">Travel Bengkulu Lebong — Informasi Lengkap</Link></li>
        <li><Link href="/travel-lebong-bengkulu" className="text-primary-600 hover:underline">Travel Lebong Bengkulu — Pesan dari Lebong</Link></li>
        <li><Link href="/bengkulu-lebong-berapa-jam" className="text-primary-600 hover:underline">Bengkulu ke Lebong Berapa Jam? Estimasi Waktu Tempuh</Link></li>
        <li><Link href="/bengkulu-lebong-lewat-mana" className="text-primary-600 hover:underline">Bengkulu ke Lebong Lewat Mana? Panduan Rute</Link></li>
        <li><Link href="/pesan" className="text-primary-600 hover:underline">Form Pemesanan Online</Link></li>
      </ul>

    </ArticleLayout>
  );
}
