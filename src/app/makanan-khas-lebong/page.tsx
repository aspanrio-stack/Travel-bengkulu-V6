import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Makanan Khas Lebong – Kuliner Unik Muara Aman Wajib Dicoba 2025',
  description:
    'Daftar makanan khas Lebong Muara Aman yang wajib dicoba. Kopi Robusta Lebong, Madu Hutan, Gulai Ikan Sungai, dan kuliner otentik suku Rejang. Info lengkap di sini!',
  alternates: { canonical: 'https://bengkulutravel.com/makanan-khas-lebong' },
};

const foods = [
  {
    name: 'Kopi Robusta Lebong',
    image: '/images/makanan/kopi-robusta-lebong.jpg',
    alt: 'Kopi Robusta Lebong dari perkebunan dataran tinggi Bengkulu',
    desc: 'Kopi Robusta Lebong adalah kebanggaan terbesar Kabupaten Lebong. Ditanam di ketinggian dataran tinggi Bengkulu dengan tanah vulkanik yang subur, biji kopi robusta Lebong menghasilkan cita rasa yang bold, kuat, dan penuh karakter. Pahitnya pas, aromanya harum seperti cokelat dan karamel. Para pecinta kopi menyebut Kopi Robusta Lebong sebagai salah satu robusta terbaik di Sumatera. Wajib beli sebagai oleh-oleh!',
    dimana: 'Kedai kopi lokal Muara Aman, toko oleh-oleh Lebong, perkebunan kopi di sekitar Lebong',
  },
  {
    name: 'Madu Hutan Lebong',
    image: '/images/makanan/madu-hutan-lebong.jpg',
    alt: 'Madu Hutan Lebong asli dari lebah liar hutan Bengkulu',
    desc: 'Lebong adalah salah satu penghasil madu hutan terbaik di Bengkulu. Dihasilkan oleh lebah liar yang mengumpulkan nektar dari beragam bunga hutan tropis di kawasan Taman Nasional Kerinci Seblat. Madu Hutan Lebong berwarna keemasan gelap dengan rasa manis yang kompleks — ada sentuhan bunga liar dan sedikit asam yang menyegarkan. Khasiatnya untuk kesehatan sudah terbukti dan dipercaya secara turun-temurun.',
    dimana: 'Pasar tradisional Muara Aman, toko oleh-oleh Lebong, langsung dari petani madu',
  },
  {
    name: 'Gulai Ikan Sungai Ketahun',
    image: '/images/makanan/gulai-ikan-sungai.jpg',
    alt: 'Gulai Ikan Sungai Ketahun khas Lebong Bengkulu',
    desc: 'Sungai Ketahun yang mengalir jernih di Lebong menghasilkan ikan-ikan segar berkualitas tinggi. Ikan sungai — seperti ikan semah, ikan keling, dan ikan baung — dimasak dengan bumbu gulai khas suku Rejang yang kaya rempah dan santan. Kesegaran ikan sungai Ketahun yang tidak berbau tanah menghasilkan gulai dengan cita rasa yang bersih, gurih, dan lezat. Ini adalah hidangan yang mencerminkan kekayaan alam Lebong yang sesungguhnya.',
    dimana: 'Warung makan tepi sungai di Lebong, rumah makan tradisional Muara Aman',
  },
  {
    name: 'Tempoyak Lebong',
    image: '/images/makanan/tempoyak.jpg',
    alt: 'Tempoyak khas Lebong dari durian fermentasi',
    desc: 'Sama seperti Curup, masyarakat Lebong juga memiliki tradisi membuat Tempoyak dari durian lokal yang terkenal manis dan berkualitas. Namun Tempoyak Lebong memiliki karakter tersendiri karena menggunakan durian varietas lokal dataran tinggi yang rasanya lebih pekat dan aromanya lebih harum. Biasanya dimasak dengan ikan sungai Ketahun yang segar, menghasilkan perpaduan rasa yang sempurna dan autentik.',
    dimana: 'Warung makan tradisional Lebong, rumah-rumah warga saat musim durian',
  },
  {
    name: 'Keripik Rebung Lebong',
    image: '/images/makanan/keripik-rebung.jpg',
    alt: 'Keripik Rebung Bambu khas Lebong Bengkulu',
    desc: 'Oleh-oleh ringan khas Lebong yang unik dan digemari wisatawan. Rebung bambu muda dari hutan-hutan Lebong dipotong tipis lalu dikeringkan dan digoreng hingga renyah. Rasanya gurih dengan aroma bambu yang khas, tersedia dalam beberapa varian rasa seperti original, pedas, dan balado. Keripik Rebung Lebong menjadi pilihan oleh-oleh yang praktis, tahan lama, dan mencerminkan kekayaan alam hutan Lebong.',
    dimana: 'Toko oleh-oleh Lebong, pasar Muara Aman, Puskesmas oleh-oleh Lebong',
  },
  {
    name: 'Lemea Lebong',
    image: '/images/makanan/lemea.jpg',
    alt: 'Lemea khas Lebong dari rebung fermentasi dan ikan',
    desc: 'Seperti halnya di Curup, Lemea juga menjadi kuliner istimewa di Lebong. Versi Lebong memiliki keunikan tersendiri karena menggunakan rebung dari hutan bambu Lebong yang lebih muda dan segar, serta ikan sungai Ketahun yang lezat. Lemea Lebong adalah representasi sempurna dari kearifan lokal suku Rejang dalam memanfaatkan kekayaan alam sekitar untuk menciptakan kuliner yang kaya cita rasa dan penuh nilai budaya.',
    dimana: 'Warung makan tradisional Lebong, acara adat suku Rejang di Muara Aman',
  },
];

export default function MakananKhasLebong() {
  return (
    <ArticleLayout
      title="Makanan Khas Lebong (Muara Aman)"
      description="Panduan lengkap kuliner khas Kabupaten Lebong. Kopi Robusta, Madu Hutan, Gulai Ikan Sungai Ketahun, dan cita rasa autentik suku Rejang!"
      breadcrumbs={[
        { label: 'Makanan Khas Bengkulu', href: '/makanan-khas-bengkulu' },
        { label: 'Makanan Khas Lebong' },
      ]}
      badge="🍽️ Kuliner Khas"
    >
      <p>
        <strong>Kabupaten Lebong</strong> dengan ibukotanya Muara Aman menyimpan kekayaan kuliner yang masih sangat autentik dan belum banyak dikenal wisatawan luar. Inilah yang menjadikan <strong>makanan khas Lebong</strong> begitu istimewa — Anda benar-benar merasakan cita rasa asli yang belum tersentuh modernisasi. Dari Kopi Robusta terbaik hingga Madu Hutan yang murni, kuliner Lebong adalah petualangan rasa yang sesungguhnya!
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-amber-800 text-sm font-semibold mb-1">💡 Tips Wisata Kuliner Lebong</p>
        <p className="text-amber-700 text-sm">
          Lebong berjarak 3–4 jam dari Bengkulu via Bengkulu Utara. Gunakan layanan{' '}
          <Link href="/travel-bengkulu-lebong" className="font-bold underline">travel Bengkulu–Lebong</Link>{' '}
          kami (Rp 100.000) agar perjalanan kuliner Anda nyaman dan bebas repot!
        </p>
      </div>

      <h2>Makanan Khas Lebong yang Wajib Dicoba</h2>

      {foods.map((food, i) => (
        <div key={food.name} className="mb-10">
          <h3>{i + 1}. {food.name}</h3>
          <div className="relative w-full h-56 md:h-72 rounded-xl overflow-hidden mb-4 bg-slate-100">
            <Image
              src={food.image}
              alt={food.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </div>
          <p>{food.desc}</p>
          <p className="text-sm text-slate-500 mt-2">
            📍 <strong>Dimana mencicipi:</strong> {food.dimana}
          </p>
        </div>
      ))}

      <h2>Oleh-oleh Khas Lebong yang Wajib Dibawa Pulang</h2>
      <table>
        <thead>
          <tr>
            <th>Oleh-oleh</th>
            <th>Keunggulan</th>
            <th>Ketahanan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kopi Robusta Lebong</td>
            <td>Rasa bold khas dataran tinggi</td>
            <td>6–12 bulan</td>
          </tr>
          <tr>
            <td>Madu Hutan Lebong</td>
            <td>100% alami, berkhasiat tinggi</td>
            <td>1–2 tahun</td>
          </tr>
          <tr>
            <td>Keripik Rebung</td>
            <td>Unik, ringan, mudah dibawa</td>
            <td>1–3 bulan</td>
          </tr>
          <tr>
            <td>Tempoyak kemasan</td>
            <td>Cita rasa autentik Rejang</td>
            <td>2–4 minggu (kulkas)</td>
          </tr>
        </tbody>
      </table>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 my-6">
        <h3 className="text-primary-800 font-bold text-lg mb-2">🚗 Wisata Kuliner Lebong Makin Mudah!</h3>
        <p className="text-slate-700 mb-4">
          Jangan biarkan jarak menghalangi Anda menikmati kelezatan kuliner Lebong yang autentik! Dengan layanan{' '}
          <Link href="/travel-bengkulu-lebong" className="text-primary-600 font-semibold hover:underline">
            travel Bengkulu–Lebong
          </Link>{' '}
          kami, perjalanan 3–4 jam terasa nyaman dan menyenangkan. Hanya <strong>Rp 100.000 per orang</strong>, dijemput dari rumah Anda di Bengkulu dan diantar langsung ke Muara Aman Lebong. Pulangnya tinggal bawa oleh-oleh Kopi Robusta dan Madu Hutan yang sudah menunggu!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/travel-bengkulu-lebong" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl transition-colors text-center text-sm">
            🎫 Pesan Travel Bengkulu → Lebong (Rp 100.000)
          </Link>
          <Link href="/travel-lebong-bengkulu" className="flex-1 bg-slate-700 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl transition-colors text-center text-sm">
            🎫 Pesan Travel Lebong → Bengkulu (Rp 100.000)
          </Link>
        </div>
      </div>

      <h2>FAQ Makanan Khas Lebong</h2>

      <h3>Apa oleh-oleh khas Lebong yang paling populer?</h3>
      <p>
        <strong>Kopi Robusta Lebong</strong> dan <strong>Madu Hutan Lebong</strong> adalah oleh-oleh paling populer dan banyak diburu wisatawan. Keduanya adalah produk alami berkualitas tinggi yang mencerminkan kekayaan alam Lebong.
      </p>

      <h3>Apakah ada kuliner khas Lebong yang tidak ada di daerah lain?</h3>
      <p>
        <strong>Gulai Ikan Sungai Ketahun</strong> adalah yang paling eksklusif karena menggunakan ikan dari Sungai Ketahun yang hanya ada di Lebong. Kopi Robusta Lebong juga memiliki karakter rasa tersendiri yang berbeda dari kopi daerah lain.
      </p>

      <h3>Bagaimana cara ke Lebong untuk wisata kuliner?</h3>
      <p>
        Gunakan layanan{' '}
        <Link href="/travel-bengkulu-lebong" className="text-primary-600 hover:underline">
          travel Bengkulu–Lebong
        </Link>{' '}
        kami dengan tarif Rp 100.000 per orang. Dijemput dari Bengkulu, tiba di Lebong dalam 3–4 jam dengan nyaman!
      </p>

      <h3>Kapan musim durian di Lebong untuk menikmati Tempoyak segar?</h3>
      <p>
        Musim durian di Lebong biasanya berlangsung antara <strong>November hingga Februari</strong>. Di luar musim ini, Tempoyak tersedia dalam bentuk kemasan yang bisa dibeli di pasar tradisional Lebong.
      </p>
    </ArticleLayout>
  );
}
