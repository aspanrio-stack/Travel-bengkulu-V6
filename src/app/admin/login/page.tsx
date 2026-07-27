'use client';

// PENTING: auto-redirect DIMATIKAN sementara. Ternyata /admin sendiri
// redirect balik ke /admin/login di level server (dikonfirmasi lewat
// Vercel logs — respons 307), yang sumbernya belum ketemu. Auto-redirect
// di sini bikin loop cepat tanpa henti (307 ↔ 304 berulang). Sampai
// sumber redirect /admin → /admin/login ditemukan, halaman ini cuma
// menampilkan link manual, tidak mencoba redirect otomatis.
export default function AdminLoginRedirect() {
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
