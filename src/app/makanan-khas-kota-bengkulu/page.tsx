import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Makanan Khas Kota Bengkulu – 10 Kuliner Wajib Dicoba 2026',
  description:
    'Daftar makanan khas Kota Bengkulu yang wajib dicoba. Pendap, Bagar Hiu, Lempuk Durian, Bay Tat, dan kuliner legendaris lainnya. Panduan kuliner lengkap Bengkulu!',
  alternates: { canonical: 'https://bengkulutravel.com/makanan-khas-kota-bengkulu' },
};

const foods = [
  {
    name: 'Pendap',
    image: '/images/makanan/pendap.jpg',
    alt: 'Pendap - makanan khas Bengkulu dari ikan berbumbu daun talas',
    desc: 'Makanan khas Bengkulu paling ikonik. Ikan segar dibumbui rempah khas lalu dibungkus daun talas dan dikukus hingga matang sempurna. Aroma harum rempahnya langsung menggugah selera begitu dibuka. Pendap adalah warisan kuliner Bengkulu yang telah diwariskan turun-temurun dan wajib dicoba oleh setiap wisatawan.',
    dimana: 'Warung makan tradisional, Pasar Minggu Bengkulu, restoran masakan Melayu Bengkulu',
  },
  {
    name: 'Bagar Hiu',
    image: '/images/makanan/bagar-hiu.jpg',
    alt: 'Bagar Hiu - gulai ikan hiu khas Bengkulu',
    desc: 'Kuliner unik dan langka yang hanya ada di Bengkulu. Daging ikan hiu dimasak dengan bumbu kuning khas Melayu Bengkulu yang kaya rempah. Konon Bagar Hiu sudah ada sejak zaman penjajahan Belanda dan menjadi kegemaran para sultan Bengkulu. Rasanya gurih dengan aroma rempah yang kuat dan menggoda.',
    dimana: 'Rumah makan khas Bengkulu di pusat kota, festival kuliner Bengkulu',
  },
  {
    name: 'Lempuk Durian',
    image: '/images/makanan/lempuk-durian.jpg',
    alt: 'Lempuk Durian - oleh-oleh khas Bengkulu',
    desc: 'Oleh-oleh paling populer dari Bengkulu yang selalu habis diburu wisatawan. Dibuat dari durian pilihan berkualitas tinggi yang dimasak dengan gula hingga menjadi dodol padat bertekstur kenyal. Aromanya wangi khas durian, rasanya manis legit. Tersedia dalam berbagai ukuran kemasan yang praktis untuk dibawa pulang.',
    dimana: 'Toko oleh-oleh sepanjang Jalan Ahmad Yani, Pasar Panorama Bengkulu',
  },
  {
    name: 'Bay Tat',
    image: '/images/makanan/bay-tat.jpg',
    alt: 'Bay Tat - kue khas Bengkulu berbentuk bunga',
    desc: 'Kue tradisional khas Bengkulu dengan bentuk seperti bunga yang cantik. Terbuat dari adonan tepung dengan isian selai nanas atau durian yang manis. Bay Tat sudah menjadi bagian tak terpisahkan dari tradisi masyarakat Bengkulu, terutama saat hari raya dan acara adat. Teksturnya renyah di luar dan lembut di dalam.',
    dimana: 'Toko kue tradisional, pasar tradisional, dan toko oleh-oleh Bengkulu',
  },
  {
    name: 'Gulai Kemba Bawang',
    image: '/images/makanan/gulai-kemba-bawang.jpg',
    alt: 'Gulai Kemba Bawang makanan khas Bengkulu',
    desc: 'Gulai unik dengan bahan utama batang dan daun bawang yang dimasak dalam kuah santan kental berbumbu rempah. Meskipun bahan utamanya sederhana, cita rasanya sangat kaya dan kompleks. Gulai Kemba Bawang mencerminkan kreativitas kuliner masyarakat Bengkulu dalam mengolah bahan-bahan lokal menjadi hidangan istimewa.',
    dimana: 'Warung makan lokal, rumah tangga, acara adat Bengkulu',
  },
  {
    name: 'Kue Tat',
    image: '/images/makanan/kue-tat.jpg',
    alt: 'Kue Tat khas Bengkulu',
    desc: 'Kue lebaran khas Bengkulu yang selalu hadir di meja tamu saat Idul Fitri. Teksturnya renyah dengan isian selai nanas yang manis asam segar. Setiap keluarga di Bengkulu memiliki resep kue tat turun-temurun yang sedikit berbeda satu sama lain, menjadikannya kuliner yang penuh kenangan dan keakraban.',
    dimana: 'Toko kue, pasar kue tradisional, dan rumah-rumah warga saat lebaran',
  },
];

export default function MakananKhasKotaBengkulu() {
  return (
    <ArticleLayout
      title="Makanan Khas Kota Bengkulu"
      description="Panduan lengkap kuliner khas Kota Bengkulu yang wajib dicoba. Dari Pendap hingga Lempuk Durian, semua ada di sini!"
      breadcrumbs={[
        { label: 'Makanan Khas Bengkulu', href: '/makanan-khas-bengkulu' },
        { label: 'Makanan Khas Kota Bengkulu' },
      ]}
      badge="🍽️ Kuliner Khas"
    >
      <p>
        <strong>Kota Bengkulu</strong> bukan hanya kaya akan sejarah dan keindahan alam, tetapi juga menyimpan kekayaan kuliner yang luar biasa. <strong>Makanan khas Kota Bengkulu</strong> mencerminkan perpaduan budaya Melayu, Rejang, dan pengaruh peradaban masa kolonial yang menghasilkan cita rasa unik dan tak tertandingi. Jika Anda berkunjung ke Bengkulu, rugi rasanya kalau tidak mencicipi kuliner-kuliner ikonik ini!
      </p>

      <h2>10 Makanan Khas Kota Bengkulu yang Wajib Dicoba</h2>

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

      <h2>Tips Wisata Kuliner di Kota Bengkulu</h2>
      <ul>
        <li><strong>Waktu terbaik</strong> — Pagi hari untuk sarapan di pasar tradisional, sore hari untuk jajan di pinggir Pantai Panjang</li>
        <li><strong>Pasar Panorama</strong> — surganya kuliner murah dan autentik di Bengkulu</li>
        <li><strong>Beli oleh-oleh Lempuk Durian</strong> di toko resmi agar terjamin kualitasnya</li>
        <li><strong>Cicipi Bay Tat</strong> langsung dari pembuatnya untuk rasa terbaik</li>
        <li><strong>Siapkan budget</strong> Rp 50.000–150.000 per orang sudah cukup untuk kenyang menikmati kuliner Bengkulu</li>
      </ul>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 my-6">
        <h3 className="text-primary-800 font-bold text-lg mb-2">🚗 Mau Wisata Kuliner ke Curup atau Lebong?</h3>
        <p className="text-slate-700 mb-4">
          Setiap daerah di Bengkulu punya kuliner khasnya sendiri yang tak kalah lezat! Jelajahi makanan khas Curup dan Lebong dengan mudah menggunakan layanan travel kami yang nyaman dan terjangkau. Dijemput dari titik mana saja di Kota Bengkulu!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/travel-bengkulu-curup" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl transition-colors text-center text-sm">
            🎫 Travel ke Curup — Rp 80.000
          </Link>
          <Link href="/travel-bengkulu-lebong" className="flex-1 bg-primary-700 hover:bg-primary-800 text-white font-bold px-5 py-3 rounded-xl transition-colors text-center text-sm">
            🎫 Travel ke Lebong — Rp 100.000
          </Link>
        </div>
      </div>

      <h2>FAQ Makanan Khas Bengkulu</h2>

      <h3>Apa makanan khas Bengkulu yang paling terkenal?</h3>
      <p>
        <strong>Pendap</strong> adalah makanan khas Bengkulu yang paling ikonik dan terkenal. Ikan berbumbu rempah yang dibungkus daun talas ini menjadi simbol kuliner Bengkulu yang wajib dicoba setiap wisatawan.
      </p>

      <h3>Oleh-oleh makanan khas Bengkulu apa yang tahan lama?</h3>
      <p>
        <strong>Lempuk Durian</strong> dan <strong>Bay Tat / Kue Tat</strong> adalah oleh-oleh makanan khas Bengkulu yang paling populer dan tahan cukup lama untuk dibawa pulang ke luar kota.
      </p>

      <h3>Di mana tempat makan khas Bengkulu yang enak dan murah?</h3>
      <p>
        Pasar Panorama dan kawasan Pasar Minggu Bengkulu adalah surga kuliner murah dan autentik. Untuk pengalaman lebih lengkap, kunjungi warung-warung makan lokal di sekitar Pantai Panjang.
      </p>
    </ArticleLayout>
  );
}
