'use client';

import { useEffect } from 'react';

// /admin/login tidak lagi dipakai sebagai form login (password sudah
// dinonaktifkan). Redirect pakai window.location (full page load),
// BUKAN router.replace() — navigasi client-side Next.js sempat macet
// di tengah jalan. window.location paling sederhana dan tidak
// bergantung pada RSC/router internal Next.js sama sekali.
export default function AdminLoginRedirect() {
  useEffect(() => {
    window.location.href = '/admin';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-400 text-sm">
        Mengarahkan ke dashboard…{' '}
        <a href="/admin" className="text-blue-600 underline">
          Klik di sini kalau tidak otomatis
        </a>
      </p>
    </div>
  );
}
