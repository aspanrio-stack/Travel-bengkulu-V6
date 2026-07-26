'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// /admin/login tidak lagi dipakai sebagai form login (password sudah
// dinonaktifkan). Redirect di sisi browser (client-side), BUKAN HTTP
// redirect — supaya tidak ada kemungkinan sama sekali bentrok dengan
// aturan redirect lain di next.config.js / vercel.json / cache edge.
export default function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-400 text-sm">Mengarahkan ke dashboard…</p>
    </div>
  );
}
