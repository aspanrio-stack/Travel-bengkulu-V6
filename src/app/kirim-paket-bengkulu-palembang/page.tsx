import type { Metadata } from 'next';
import ArticleLayout from '@/components/ArticleLayout';

export const metadata: Metadata = {
  title: 'Kirim Paket Bengkulu Palembang – Cepat, Aman & Terpercaya',
  description:
    'Layanan pengiriman paket barang Bengkulu–Palembang. Paket diantar door to door bersama armada travel kami. Aman, cepat, dan harga terjangkau. Hubungi kami!',
  alternates: { canonical: 'https://bengkulutravel.com/kirim-paket-bengkulu-palembang' },
};

export default function KirimPaketBengkuluPalembang() {
  return (
    <ArticleLayout
      title="Kirim Paket Bengkulu Palembang"
      description="Jasa pengiriman paket dan barang dari Bengkulu ke Palembang menggunakan armada travel kami."
      breadcrumbs={[{ label: 'Kirim Paket Bengkulu Palembang' }]}
      badge="📦 Pengiriman Barang"
      price="Hubungi Kami"
    >
      <p>
        Selain layanan travel penumpang, kami juga melayani <strong>pengiriman paket dan barang dari Bengkulu ke Palembang</strong> (dan sebaliknya). Paket Anda akan dikirim bersama armada travel kami yang berangkat setiap hari, sehingga lebih cepat sampai dibandingkan pengiriman ekspedisi biasa.
      </p>

      <h2>Keunggulan Kirim Paket via Travel</h2>
      <ul>
        <li><strong>Lebih Cepat</strong> – Paket dikirim langsung bersama armada yang berangkat hari itu juga</li>
        <li><strong>Door to Door</strong> – Paket bisa dijemput dari alamat pengirim dan diantar ke alamat penerima</li>
        <li><strong>Aman</strong> – Pengawasan langsung selama perjalanan, tidak seperti ekspedisi yang melalui banyak tangan</li>
        <li><strong>Fleksibel</strong> – Cocok untuk paket kecil hingga barang berukuran sedang</li>
        <li><strong>Terpercaya</strong> – Dipercaya oleh banyak pelanggan untuk mengirim berbagai jenis barang</li>
      </ul>

      <h2>Jenis Paket yang Bisa Dikirim</h2>
      <ul>
        <li>Paket dokumen dan surat penting</li>
        <li>Produk UMKM dan kuliner oleh-oleh</li>
        <li>Pakaian, tekstil, dan fashion item</li>
        <li>Elektronik dan gadget (dengan packaging yang aman)</li>
        <li>Makanan kering dan produk sembako</li>
        <li>Barang rumah tangga berukuran sedang</li>
      </ul>

      <h2>Tarif Pengiriman</h2>
      <p>
        Tarif pengiriman paket kami bervariasi tergantung dari <strong>berat, ukuran, dan jenis barang</strong>. Untuk mendapatkan penawaran harga terbaik, silakan hubungi kami via WhatsApp dengan menyebutkan detail paket yang akan dikirim.
      </p>

      <h2>Cara Mengirim Paket</h2>
      <ol>
        <li>Hubungi kami via WhatsApp: <strong>0852-6864-5461</strong></li>
        <li>Informasikan jenis barang, berat, dan dimensi paket</li>
        <li>Beritahukan alamat pengirim dan penerima</li>
        <li>Kami berikan estimasi biaya dan jadwal pengiriman</li>
        <li>Paket dijemput atau diantar ke lokasi kami</li>
        <li>Paket dikirim bersama armada travel berikutnya</li>
      </ol>

      <h2>Tips Pengemasan Paket</h2>
      <ul>
        <li>Gunakan kardus atau bubble wrap untuk barang pecah belah</li>
        <li>Beri label nama dan nomor telepon penerima dengan jelas</li>
        <li>Segel paket dengan lakban yang kuat</li>
        <li>Untuk barang berharga, informasikan isi paket kepada kami untuk penanganan khusus</li>
      </ul>

      <h2>Jadwal Pengiriman</h2>
      <p>
        Pengiriman dilakukan setiap hari mengikuti jadwal keberangkatan travel. Paket yang diserahkan sebelum pukul 09.00 WIB akan dikirim di hari yang sama (tergantung ketersediaan armada). Hubungi kami untuk jadwal pengiriman terkini.
      </p>
    </ArticleLayout>
  );
}
