import { redirect } from 'next/navigation';

// /admin/login tidak lagi dipakai sebagai form login (password sudah
// dinonaktifkan) — versi dashboard lama yang sebelumnya ada di sini
// sudah tidak dipakai (tidak ada tab Kwitansi/Update Tarif). Redirect
// ke /admin supaya URL lama ini tetap membuka dashboard yang aktif.
export default function AdminLoginRedirect() {
  redirect('/admin');
}
