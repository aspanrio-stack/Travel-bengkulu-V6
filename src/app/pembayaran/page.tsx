'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import QRISCheckout from '@/components/QRISCheckout';
import { ROUTES, formatPrice } from '@/lib/routes';

function PembayaranContent() {
  const params = useSearchParams();

  const routeId    = params.get('rute') || '';
  const name       = params.get('name') || '';
  const phone      = params.get('phone') || '';
  const date       = params.get('date') || '';
  const passengers = params.get('passengers') || '1';
  const pickup     = params.get('pickup') || '';

  const route          = ROUTES.find(r => r.id === routeId);
  const hargaPerOrang  = route?.price || 0;
  const jumlah         = parseInt(passengers);
  const totalHarga     = hargaPerOrang * jumlah;

  if (!route || !totalHarga) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">❌</p>
          <h1 className="font-bold text-slate-800 text-xl mb-2">Data Pesanan Tidak Ditemukan</h1>
          <p className="text-slate-500 text-sm mb-6">Silakan kembali ke form pemesanan.</p>
          <Link href="/pesan" className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl transition-colors inline-block">
            ← Kembali ke Form Pesan
          </Link>
        </div>
      </div>
    );
  }

  const detailPesanan = [
    `${route.from} → ${route.to}`,
    date && `📅 ${date}`,
    `👤 ${passengers} penumpang`,
    name && `Nama: ${name}`,
    pickup && `Jemput: ${pickup}`,
  ].filter(Boolean).join(' · ');

  return (
    <div className="min-h-screen pt-16 bg-slate-50">
      <div className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-10">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Selesaikan Pembayaran</h1>
          <p className="text-primary-200 text-sm">Scan QR Code menggunakan e-wallet atau mobile banking</p>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="max-w-md mx-auto px-4 mt-6 mb-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Ringkasan Pesanan</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Rute</span>
              <span className="font-semibold text-slate-800">{route.from} → {route.to}</span>
            </div>
            {date && <div className="flex justify-between"><span className="text-slate-500">Tanggal</span><span className="font-semibold">{date}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Penumpang</span><span className="font-semibold">{passengers} orang</span></div>
            {name && <div className="flex justify-between"><span className="text-slate-500">Nama</span><span className="font-semibold">{name}</span></div>}
            {phone && <div className="flex justify-between"><span className="text-slate-500">No. HP</span><span className="font-semibold">{phone}</span></div>}
            {pickup && <div className="flex justify-between"><span className="text-slate-500">Jemput di</span><span className="font-semibold text-right max-w-[60%]">{pickup}</span></div>}
            <div className="border-t border-dashed pt-2 mt-2 flex justify-between">
              <span className="text-slate-500">{passengers} × {formatPrice(hargaPerOrang)}</span>
              <span className="font-bold text-primary-700">{formatPrice(totalHarga)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* QRIS Checkout */}
      <div className="max-w-md mx-auto px-4 pb-12">
        <QRISCheckout
          hargaProduk={totalHarga}
          namaProduk={`Travel ${route.from} → ${route.to}`}
          detail={detailPesanan}
          nomorWA="6285268645461"
        />
      </div>
    </div>
  );
}

export default function PembayaranPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    }>
      <PembayaranContent />
    </Suspense>
  );
}
