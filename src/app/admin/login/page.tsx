'use client';

import { useEffect } from 'react';

// /admin/login tidak lagi dipakai sebagai form login. Auto-redirect ke
// /admin — aman sekarang karena gerbang cookie admin_session di
// src/proxy.ts (middleware) sudah dinonaktifkan, jadi /admin tidak lagi
// melempar balik ke sini.
export default function AdminLoginRedirect() {
  useEffect(() => {
    window.location.href = '/admin';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-400 text-sm">
        <a href="/admin" className="text-blue-600 underline">
          Buka dashboard
        </a>
      </p>
    </div>
  );
}
