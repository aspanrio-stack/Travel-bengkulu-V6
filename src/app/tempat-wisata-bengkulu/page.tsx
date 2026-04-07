import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Tempat Wisata di Bengkulu – 15 Destinasi Terbaik Wajib Dikunjungi',
  description:
    'Daftar tempat wisata terbaik di Bengkulu. Dari pantai eksotis, sejarah, hingga wisata alam. Panduan lengkap wisata Bengkulu untuk liburan keluarga.',
  alternates: { canonical: 'https://bengkulutravel.com/tempat-wisata-bengkulu' },
};

export default function TempatWisataBengkulu() {
  return (
    <ArticleLayout
      title="Tempat Wisata di Bengkulu"
      description="Panduan lengkap destinasi wisata terbaik di Bengkulu yang wajib Anda kunjungi."
      breadcrumbs={[{ label: 'Artikel' }, { label: 'Tempat Wisata Bengkulu' }]}
      badge="📍 Panduan Wisata"
    >
      <p>
        Bengkulu adalah provinsi di pesisir barat Sumatera yang menyimpan kekayaan alam dan budaya yang luar biasa. Dari pantai yang belum terjamah, peninggalan sejarah kolonial, hingga keindahan alam pegunungan — Bengkulu layak menjadi destinasi wisata pilihan Anda berikutnya.
      </p>

      <h2>1. Pantai Panjang Bengkulu</h2>
      <p>
        <strong>Pantai Panjang</strong> adalah ikon wisata Bengkulu. Membentang sepanjang lebih dari 7 km, pantai ini memiliki pasir putih halus dan ombak yang cukup besar. Tersedia berbagai fasilitas seperti warung makan, area bermain, dan penginapan di sekitarnya.
      </p>

      <h2>2. Benteng Marlborough</h2>
      <p>
        Benteng Marlborough adalah salah satu benteng peninggalan kolonial Inggris yang masih berdiri kokoh di Indonesia. Dibangun pada tahun 1714, benteng ini menyimpan sejarah panjang Bengkulu dan menjadi salah satu daya tarik wisata sejarah paling populer.
      </p>

      <h2>3. Rumah Pengasingan Bung Karno</h2>
      <p>
        Presiden pertama RI, Ir. Soekarno, pernah diasingkan di Bengkulu pada tahun 1938–1942. Rumah pengasingannya kini menjadi museum yang bisa dikunjungi oleh siapa saja. Di sini pula Bung Karno bertemu dengan Fatmawati yang kelak menjadi ibu negara.
      </p>

      <h2>4. Danau Dendam Tak Sudah</h2>
      <p>
        Danau unik ini memiliki nama yang menarik perhatian dan diselimuti berbagai legenda rakyat Bengkulu. Terletak tidak jauh dari pusat kota, danau ini dikelilingi hutan dan menjadi habitat berbagai jenis burung migran.
      </p>

      <h2>5. Taman Nasional Kerinci Seblat (TNKS)</h2>
      <p>
        Sebagian wilayah TNKS masuk ke Provinsi Bengkulu. Kawasan ini adalah rumah bagi harimau sumatera, beruang madu, dan berbagai satwa langka lainnya. Cocok untuk wisata alam dan petualangan.
      </p>

      <h2>6. Bukit Kaba</h2>
      <p>
        Gunung berapi aktif yang terletak di Kabupaten Rejang Lebong ini sangat populer di kalangan pendaki. Dari puncaknya, Anda bisa menyaksikan kawah belerang yang spektakuler dan pemandangan alam sekitarnya yang memukau.
      </p>

      <h2>7. Kebun Teh Kabawetan</h2>
      <p>
        Hamparan kebun teh hijau yang luas di dataran tinggi Kepahiang ini menawarkan pemandangan yang sangat fotogenik. Udara sejuk dan suasana yang tenang membuatnya cocok untuk relaksasi dan foto-foto.
      </p>

      <h2>8. Pulau Tikus</h2>
      <p>
        Pulau kecil yang terletak sekitar 9 km dari lepas pantai Bengkulu ini menawarkan snorkeling dan diving dengan terumbu karang yang masih alami. Akses ke pulau menggunakan perahu dari dermaga Bengkulu.
      </p>

      <h2>9. Air Terjun Suban</h2>
      <p>
        Terletak di Curup, air terjun Suban memiliki kolam alami di bawahnya yang bisa digunakan untuk berenang. Suasananya sejuk dan asri, dikelilingi pohon-pohon rindang.
      </p>

      <h2>10. Masjid Jamik Bengkulu</h2>
      <p>
        Masjid bersejarah yang dibangun pada masa penjajahan Belanda ini masih berdiri megah dan menjadi salah satu landmark kota Bengkulu. Arsitekturnya memadukan gaya Melayu dan kolonial yang unik.
      </p>

      <h2>Tips Berwisata ke Bengkulu</h2>
      <ul>
        <li>Waktu terbaik berkunjung: April–Oktober (musim kemarau)</li>
        <li>Gunakan travel atau rental mobil untuk kemudahan eksplorasi</li>
        <li>Bawa perlengkapan anti-nyamuk jika mengunjungi area pantai atau hutan</li>
        <li>Cicipi kuliner khas Bengkulu seperti lemang, pempek celako, dan ikan asin</li>
        <li>Beli oleh-oleh kain besurek khas Bengkulu</li>
      </ul>

      <h2>Butuh Transportasi di Bengkulu?</h2>
      <p>
        Untuk menjelajahi berbagai tempat wisata di Bengkulu dengan nyaman, Anda bisa menggunakan layanan travel dan rental mobil kami. Kami siap mengantarkan Anda ke berbagai destinasi wisata di Bengkulu dan sekitarnya.
      </p>
    </ArticleLayout>
  );
}
