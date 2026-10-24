import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan',
  description: 'Syarat dan ketentuan penggunaan layanan BengkuluTravel.com: pemesanan, pembayaran, pembatalan, dan penggunaan akun.',
  alternates: { canonical: 'https://bengkulutravel.com/syarat-ketentuan' },
};

export default function SyaratKetentuan() {
  return (
    <LegalPage title="Syarat & Ketentuan" updated="Oktober 2026">
      <p>Dengan menggunakan situs dan layanan BengkuluTravel.com, Anda menyetujui syarat berikut.</p>

      <h2>Layanan</h2>
      <p>Kami menyediakan layanan travel antar kota, rental mobil, antar-jemput bandara, dan pengiriman paket. Rute, tarif, dan jadwal yang tampil di situs dapat berubah; pesanan baru dianggap pasti setelah dikonfirmasi oleh admin kami.</p>

      <h2>Pemesanan dan pembayaran</h2>
      <ul>
        <li>Pemesanan dapat dilakukan tanpa akun. Akun bersifat opsional untuk menyimpan riwayat dan alamat.</li>
        <li>Pembayaran dapat dilakukan melalui QRIS atau tunai kepada driver sesuai pilihan yang tersedia saat pemesanan.</li>
        <li>Pastikan nama, nomor WhatsApp, alamat jemput, dan tanggal yang Anda isi sudah benar.</li>
      </ul>

      <h2>Perubahan dan pembatalan</h2>
      <p>Untuk mengubah atau membatalkan pesanan, hubungi admin melalui <a href="https://wa.me/6282374497929">WhatsApp</a> sesegera mungkin sebelum jadwal keberangkatan. Ketentuan pengembalian dana mengikuti kesepakatan dengan admin untuk pesanan yang bersangkutan.</p>

      <h2>Akun pengguna</h2>
      <p>Anda bertanggung jawab menjaga kerahasiaan kata sandi dan seluruh aktivitas pada akun Anda. Kami berhak menonaktifkan akun yang disalahgunakan.</p>

      <h2>Batas tanggung jawab</h2>
      <p>Kami berusaha menjalankan layanan tepat waktu, namun keterlambatan dapat terjadi karena kondisi jalan, cuaca, atau keadaan di luar kendali kami.</p>

      <h2>Perubahan syarat</h2>
      <p>Syarat ini dapat diperbarui sewaktu-waktu. Penggunaan layanan setelah pembaruan berarti Anda menyetujui syarat yang berlaku.</p>

      <h2>Kontak</h2>
      <p>Pertanyaan dapat disampaikan melalui <a href="https://wa.me/6282374497929">WhatsApp</a>. Lihat juga <a href="/kebijakan-privasi">Kebijakan Privasi</a> kami.</p>
    </LegalPage>
  );
}
