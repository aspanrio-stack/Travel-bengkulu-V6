'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentContent() {
  const params = useSearchParams();
  const status = params.get('status');
  const orderId = params.get('order');
  const route = params.get('route');
  const date = params.get('date');
  const name = params.get('name');

  const isSuccess = status === 'success';
  const isPending = status === 'pending';

  return (
    <div className="min-h-screen pt-16 bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Status Header */}
          <div className={`p-8 text-center ${isSuccess ? 'bg-green-50' : isPending ? 'bg-amber-50' : 'bg-red-50'}`}>
            <div className="text-6xl mb-4">
              {isSuccess ? '🎉' : isPending ? '⏳' : '❌'}
            </div>
            <h1 className={`font-display text-2xl font-bold mb-2 ${
              isSuccess ? 'text-green-700' : isPending ? 'text-amber-700' : 'text-red-700'
            }`}>
              {isSuccess ? 'Pembayaran Berhasil!' : isPending ? 'Menunggu Pembayaran' : 'Pembayaran Gagal'}
            </h1>
            <p className={`text-sm ${isSuccess ? 'text-green-600' : isPending ? 'text-amber-600' : 'text-red-600'}`}>
              {isSuccess
                ? 'Tiket sudah dikirim ke email Anda. Driver akan menghubungi Anda sebelum keberangkatan.'
                : isPending
                ? 'Selesaikan pembayaran Anda. Tiket akan dikirim otomatis setelah pembayaran dikonfirmasi.'
                : 'Silakan coba lagi atau hubungi kami via WhatsApp.'}
            </p>
          </div>

          {/* Order Details */}
          <div className="p-6 space-y-4">
            {orderId && (
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 font-semibold mb-1">NOMOR PESANAN</p>
                <p className="font-mono font-bold text-slate-800 text-lg">{orderId}</p>
              </div>
            )}

            {(route || date || name) && (
              <div className="space-y-2">
                {name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Nama</span>
                    <span className="font-semibold text-slate-800">{name}</span>
                  </div>
                )}
                {route && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Rute</span>
                    <span className="font-semibold text-slate-800">{route}</span>
                  </div>
                )}
                {date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tanggal</span>
                    <span className="font-semibold text-slate-800">{date}</span>
                  </div>
                )}
              </div>
            )}

            {isSuccess && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm font-semibold mb-2">📋 Langkah Selanjutnya</p>
                <ul className="text-blue-700 text-sm space-y-1.5">
                  <li>✅ Cek email untuk tiket perjalanan</li>
                  <li>✅ Screenshot atau simpan nomor pesanan</li>
                  <li>✅ Siap 15 menit sebelum waktu jemput</li>
                  <li>✅ Driver akan hubungi via WhatsApp</li>
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/6285268645461?text=Halo%20saya%20ingin%20konfirmasi%20pesanan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Konfirmasi via WhatsApp
              </a>
              <Link
                href="/"
                className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-3 rounded-xl text-center transition-colors"
              >
                Kembali ke Beranda
              </Link>
              {!isSuccess && (
                <Link
                  href="/pesan"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl text-center transition-colors"
                >
                  Coba Pesan Lagi
                </Link>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Ada masalah? Email kami di{' '}
          <a href="mailto:cs@bengkulutravel.com" className="text-primary-600">cs@bengkulutravel.com</a>
        </p>
      </div>
    </div>
  );
}

export default function PembayaranPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
