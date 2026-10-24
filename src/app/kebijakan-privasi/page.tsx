import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan privasi BengkuluTravel.com: data apa yang kami kumpulkan, untuk apa digunakan, dan bagaimana Anda dapat meminta penghapusannya.',
  alternates: { canonical: 'https://bengkulutravel.com/kebijakan-privasi' },
};

export default function KebijakanPrivasi() {
  return (
    <LegalPage title="Kebijakan Privasi" updated="Oktober 2026">
      <p>BengkuluTravel.com (&ldquo;kami&rdquo;) menyediakan layanan travel antar kota, rental mobil, antar-jemput bandara, dan pengiriman paket di wilayah Bengkulu dan sekitarnya. Halaman ini menjelaskan data yang kami kumpulkan dan cara kami menggunakannya.</p>

      <h2>Data yang kami kumpulkan</h2>
      <ul>
        <li><strong>Data pemesanan:</strong> nama, nomor WhatsApp/telepon, alamat jemput, rute, tanggal, jumlah penumpang, dan metode pembayaran. Email diisi jika Anda ingin menerima invoice.</li>
        <li><strong>Data akun (opsional):</strong> jika Anda masuk atau mendaftar, kami menyimpan email, serta nama dan foto profil bila Anda masuk dengan Google. Kami hanya meminta informasi profil dasar, bukan data lain dari akun Google Anda.</li>
        <li><strong>Alamat tersimpan (opsional):</strong> alamat, label, dan nomor telepon yang Anda pilih untuk disimpan agar tidak perlu diisi ulang.</li>
        <li><strong>Data teknis:</strong> data kunjungan standar yang dicatat server hosting, seperti alamat IP dan jenis perangkat, untuk keamanan dan pemeliharaan situs.</li>
      </ul>

      <h2>Untuk apa data digunakan</h2>
      <ul>
        <li>Memproses, mengonfirmasi, dan menjalankan pesanan Anda.</li>
        <li>Menghubungi Anda melalui WhatsApp atau email terkait pesanan dan invoice.</li>
        <li>Menampilkan riwayat pesanan dan alamat tersimpan di halaman profil Anda.</li>
        <li>Menjaga keamanan dan kelancaran situs.</li>
      </ul>

      <h2>Penyedia layanan yang kami gunakan</h2>
      <p>Untuk menjalankan layanan, data Anda diproses oleh penyedia berikut sesuai fungsinya: Supabase (login dan alamat tersimpan), Vercel (hosting situs), Redis (penyimpanan data pesanan), Resend (pengiriman email invoice), dan Fonnte (pengiriman notifikasi WhatsApp). Kami tidak menjual data pribadi Anda.</p>

      <h2>Keamanan</h2>
      <p>Alamat tersimpan dilindungi sehingga setiap akun hanya dapat melihat dan mengubah data miliknya sendiri. Meski demikian, tidak ada sistem yang sepenuhnya bebas risiko.</p>

      <h2>Hak Anda</h2>
      <p>Anda dapat meminta akses, perbaikan, atau penghapusan data akun dan alamat tersimpan Anda. Alamat tersimpan dapat dihapus sendiri dari halaman Profil. Untuk permintaan lain, hubungi kami melalui <a href="https://wa.me/6282374497929">WhatsApp</a>.</p>

      <h2>Perubahan kebijakan</h2>
      <p>Kebijakan ini dapat diperbarui. Tanggal pembaruan terakhir tercantum di bagian atas halaman.</p>

      <h2>Kontak</h2>
      <p>Pertanyaan tentang privasi dapat disampaikan melalui <a href="https://wa.me/6282374497929">WhatsApp</a>.</p>
    </LegalPage>
  );
}
