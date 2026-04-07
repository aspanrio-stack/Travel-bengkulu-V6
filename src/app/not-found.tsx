import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-slate-50">
      <div className="text-center px-4">
        <div className="text-8xl mb-6">🚗</div>
        <h1 className="font-display text-5xl font-bold text-slate-800 mb-3">404</h1>
        <h2 className="text-xl font-semibold text-slate-600 mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan. Silakan kembali ke halaman utama.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Kembali ke Beranda
          </Link>
          <a
            href="https://wa.me/6285268645461"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa"
          >
            Hubungi Kami
          </a>
        </div>
      </div>
    </div>
  );
}
