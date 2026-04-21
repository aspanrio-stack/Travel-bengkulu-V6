import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Makanan Khas Curup Rejang Lebong – Kuliner Wajib Dicoba 2026',
  description:
    'Daftar makanan khas Curup Rejang Lebong yang wajib dicoba. Tempoyak, Lemea, Gulai Kemba Bawang, Pindang Patin, Kopi Arabika Curup. Panduan kuliner lengkap!',
  alternates: { canonical: 'https://bengkulutravel.com/makanan-khas-curup' },
};

const foods = [
  {
    name: 'Tempoyak',
    image: '/images/makanan/tempoyak.jpg',
    alt: 'Tempoyak - olahan durian fermentasi khas Rejang Lebong Curup',
    desc: 'Tempoyak adalah kuliner paling unik dan ikonik dari Curup dan Rejang Lebong. Terbuat dari daging buah durian matang yang difermentasi selama beberapa hari hingga menghasilkan cita rasa asam yang khas. Tempoyak biasanya dimasak bersama ikan patin atau udang sebagai lauk, atau dijadikan sambal yang menggugah selera. Bagi penggemar durian, Tempoyak adalah pengalaman rasa yang tak terlupakan!',
    dimana: 'Warung makan tradisional Curup, pasar tradisional Rejang Lebong, rumah makan khas Bengkulu',
  },
  {
    name: 'Lemea',
    image: '/images/makanan/lemea.jpg',
    alt: 'Lemea - makanan khas Rejang Lebong dari rebung bambu fermentasi',
    desc: 'Lemea adalah kuliner legendaris khas suku Rejang yang menjadi kebanggaan masyarakat Curup dan Rejang Lebong. Dibuat dari rebung bambu muda yang difermentasi dengan ikan air tawar, menghasilkan aroma yang khas dan cita rasa asam gurih yang sangat unik. Bagi yang belum pernah mencoba, Lemea memang memerlukan keberanian pertama — namun begitu ketagihan, Anda akan selalu rindu rasanya! Lemea biasanya dimasak sebagai lauk nasi dengan tambahan cabai dan bumbu rempah.',
    dimana: 'Warung makan tradisional Curup, pasar Rejang Lebong, acara adat suku Rejang',
  },
  {
    name: 'Gulai Kemba Bawang',
    image: '/images/makanan/gulai-kemba-bawang.jpg',
    alt: 'Gulai Kemba Bawang makanan khas Curup Rejang Lebong',
    desc: 'Gulai unik yang menggunakan batang dan daun bawang sebagai bahan utama. Dimasak dalam kuah santan kental yang kaya rempah khas Rejang. Meskipun bahan utamanya terkesan sederhana, cita rasanya sangat kompleks dan mengundang selera. Gulai Kemba Bawang adalah bukti bahwa kreativitas kuliner masyarakat Rejang Lebong mampu mengubah bahan-bahan sederhana menjadi hidangan yang istimewa.',
    dimana: 'Warung makan lokal Curup, acara adat dan pernikahan Rejang Lebong',
  },
  {
    name: 'Pindang Patin',
    image: '/images/makanan/pindang-patin.jpg',
    alt: 'Pindang Patin khas Curup Rejang Lebong',
    desc: 'Ikan patin segar dari sungai-sungai jernih di Rejang Lebong dimasak dengan bumbu pindang yang segar dan sedikit pedas. Kuahnya bening kekuningan dengan rasa asam segar dari belimbing wuluh dan tomat. Ikan patinnya lembut dan gurih, sangat cocok disantap bersama nasi hangat dan sambal. Pindang Patin khas Curup terkenal lebih segar karena menggunakan ikan hasil tangkapan langsung dari sungai setempat.',
    dimana: 'Restoran ikan segar di Curup, warung makan tepi sungai Rejang Lebong',
  },
  {
    name: 'Kopi Arabika Curup',
    image: '/images/makanan/kopi-arabika-curup.jpg',
    alt: 'Kopi Arabika Curup dari dataran tinggi Rejang Lebong',
    desc: 'Curup dan dataran tinggi Rejang Lebong adalah salah satu penghasil kopi arabika terbaik di Sumatera. Tumbuh di ketinggian di atas 1.000 meter, biji kopi arabika Curup memiliki karakter rasa yang kompleks — perpaduan asam segar, aroma floral, dan body yang medium. Secangkir kopi arabika Curup di pagi hari dengan udara sejuk pegunungan adalah pengalaman yang tidak akan pernah terlupakan.',
    dimana: 'Kedai kopi lokal Curup, toko oleh-oleh Rejang Lebong, Kebun Teh Kabawetan',
  },
  {
    name: 'Bolu Koja',
    image: '/images/makanan/bolu-koja.jpg',
    alt: 'Bolu Koja kue khas Curup Rejang Lebong',
    desc: 'Kue tradisional khas Rejang Lebong yang terbuat dari bahan-bahan alami dengan aroma pandan yang harum. Teksturnya lembut dan kenyal dengan rasa manis yang pas. Bolu Koja biasanya disajikan dalam acara-acara adat dan perayaan masyarakat Rejang. Kini Bolu Koja juga menjadi oleh-oleh populer yang banyak diburu wisatawan karena rasanya yang otentik dan kemasannya yang menarik.',
    dimana: 'Toko kue tradisional Curup, pasar Rejang Lebong, toko oleh-oleh',
  },
];

export default function MakananKhasCurup() {
  return (
    <ArticleLayout
      title="Makanan Khas Curup Rejang Lebong"
      description="Panduan lengkap kuliner khas Curup dan Rejang Lebong. Dari Tempoyak, Lemea, hingga Kopi Arabika Curup yang legendaris!"
      breadcrumbs={[
        { label: 'Makanan Khas Bengkulu', href: '/makanan-khas-bengkulu' },
        { label: 'Makanan Khas Curup' },
      ]}
      badge="🍽️ Kuliner Khas"
    >
      <p>
        <strong>Curup</strong>, ibukota Kabupaten Rejang Lebong, menyimpan kekayaan kuliner yang tidak kalah menggoda dibanding daerah lain di Bengkulu. Dengan kearifan lokal suku Rejang yang kaya budaya, <strong>makanan khas Curup Rejang Lebong</strong> menawarkan pengalaman rasa yang unik dan autentik — dari Tempoyak yang legendaris hingga Lemea yang penuh kejutan! Datang ke Curup tanpa mencicipi kuliner khasnya adalah sebuah kehilangan besar.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-amber-800 text-sm font-semibold mb-1">💡 Tips Wisata Kuliner Curup</p>
        <p className="text-amber-700 text-sm">
          Curup berjarak hanya 2–2,5 jam dari Kota Bengkulu. Gunakan layanan{' '}
          <Link href="/travel-bengkulu-curup" className="font-bold underline">travel Bengkulu–Curup</Link>{' '}
          kami (Rp 80.000) untuk perjalanan yang nyaman dan langsung diantar ke tujuan wisata kuliner Anda!
        </p>
      </div>

      <h2>Makanan Khas Curup Rejang Lebong yang Wajib Dicoba</h2>

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

      <h2>Rute Wisata Kuliner di Curup</h2>
      <p>
        Untuk pengalaman wisata kuliner terbaik di Curup, coba rute berikut:
      </p>
      <ol>
        <li><strong>Pagi hari</strong> — Sarapan di Pasar Tradisional Curup, cicipi Bolu Koja dan minum Kopi Arabika lokal</li>
        <li><strong>Siang hari</strong> — Makan siang dengan Pindang Patin atau Gulai Kemba Bawang di warung makan lokal</li>
        <li><strong>Sore hari</strong> — Kunjungi Kebun Teh Kabawetan, beli oleh-oleh Kopi Arabika dan Tempoyak kemasan</li>
        <li><strong>Malam hari</strong> — Nikmati makan malam dengan Lemea dan Tempoyak untuk pengalaman kuliner Rejang yang autentik</li>
      </ol>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-5 my-6">
        <h3 className="text-primary-800 font-bold text-lg mb-2">🚗 Perjalanan Nyaman Bengkulu–Curup</h3>
        <p className="text-slate-700 mb-1">
          Jangan biarkan urusan transportasi merepotkan wisata kuliner Anda! Kami menghadirkan layanan{' '}
          <Link href="/travel-bengkulu-curup" className="text-primary-600 font-semibold hover:underline">
            travel Bengkulu–Curup door to door
          </Link>{' '}
          yang nyaman. Cukup <strong>Rp 80.000 per orang</strong>, Anda dijemput dari pintu rumah di Bengkulu dan diantar langsung ke titik kuliner favorit di Curup. Armada Toyota Avanza, Innova, dan HiAce ber-AC siap mengantar!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link href="/travel-bengkulu-curup" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl transition-colors text-center text-sm">
            🎫 Pesan Travel Bengkulu → Curup (Rp 80.000)
          </Link>
          <Link href="/travel-curup-bengkulu" className="flex-1 bg-slate-700 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-xl transition-colors text-center text-sm">
            🎫 Pesan Travel Curup → Bengkulu (Rp 80.000)
          </Link>
        </div>
      </div>

      <h2>FAQ Makanan Khas Curup</h2>

      <h3>Apa makanan khas Curup Rejang Lebong yang paling unik?</h3>
      <p>
        <strong>Lemea</strong> adalah yang paling unik — rebung bambu fermentasi dengan ikan yang memiliki aroma dan rasa sangat khas. Tidak ada di tempat lain selain di wilayah Rejang Lebong. Tempoyak (durian fermentasi) juga sangat unik dan hanya ada di daerah ini.
      </p>

      <h3>Apakah Tempoyak dan Lemea bisa dibawa sebagai oleh-oleh?</h3>
      <p>
        Tempoyak dalam kemasan jar/botol bisa dibawa pulang dan tahan beberapa minggu di kulkas. Lemea lebih sulit dibawa karena aromanya yang kuat dan harus disimpan dengan benar. Sebaiknya nikmati langsung di tempat untuk pengalaman terbaik.
      </p>

      <h3>Bagaimana cara ke Curup dari Bengkulu untuk wisata kuliner?</h3>
      <p>
        Gunakan layanan{' '}
        <Link href="/travel-bengkulu-curup" className="text-primary-600 hover:underline">
          travel Bengkulu–Curup
        </Link>{' '}
        kami. Hanya Rp 80.000 per orang, dijemput dari Bengkulu dan diantar langsung ke Curup dalam 2–2,5 jam perjalanan yang nyaman.
      </p>
    </ArticleLayout>
  );
}
