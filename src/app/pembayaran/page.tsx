'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import QRISCheckout from '@/components/QRISCheckout';
import { ROUTES, formatPrice } from '@/lib/routes';

function PembayaranContent() {
  const params = useSearchParams();

  // ── Ambil semua data dari URL params ──
  const routeId    = params.get('rute') || '';
  const name       = params.get('name') || '';
  const phone      = params.get('phone') || '';
  const email      = params.get('email') || '';
  const date       = params.get('date') || '';
  const passengers = params.get('passengers') || '1';
  const pickup     = params.get('pickup') || '';
  const dropoff    = params.get('dropoff') || '';

  // ── Kalkulasi harga ──
  const route         = ROUTES.find(r => r.id === routeId);
  const hargaPerOrang = route?.price || 0;
  const jumlah        = parseInt(passengers);
  const totalHarga    = hargaPerOrang * jumlah;

  // ── State simpan pesanan ──
  const [orderId, setOrderId]       = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const savedRef = useRef(false); // Cegah double-save

  // ── Simpan pesanan ke Redis saat halaman pertama dibuka ──
  useEffect(() => {
    // Jangan simpan jika data tidak lengkap atau sudah disimpan
    if (!route || !totalHarga || !name || !phone || savedRef.current) return;
    savedRef.current = true;
    setSaveStatus('saving');

    fetch('/api/admin/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email,
        routeId,
        route: `${route.from} → ${route.to}`,
        date,
        passengers,
        pickup,
        dropoff,
        harga: hargaPerOrang,
        kodeUnik: 0,   // akan diupdate oleh QRISCheckout saat generate
        total: totalHarga,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.orderId) {
          setOrderId(data.orderId);
          setSaveStatus('saved');
        } else {
          setSaveStatus('error');
        }
      })
      .catch(() => setSaveStatus('error'));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Error: data tidak lengkap ──
  if (!route || !totalHarga) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-5xl mb-4">❌</p>
          <h1 className="font-bold text-slate-800 text-xl mb-2">Data Pesanan Tidak Ditemukan</h1>
          <p className="text-slate-500 text-sm mb-6">Silakan kembali ke form pemesanan dan isi ulang data.</p>
          <Link href="/pesan"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl transition-colors inline-block">
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

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-10">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
            Selesaikan Pembayaran
          </h1>
          <p className="text-primary-200 text-sm">
            Scan QR Code menggunakan e-wallet atau mobile banking
          </p>
        </div>
      </div>

      {/* ── Status simpan pesanan ── */}
      {orderId && saveStatus === 'saved' && (
        <div className="max-w-md mx-auto px-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="text-green-500 text-lg">✅</span>
            <div>
              <p className="text-green-700 text-xs font-semibold">Pesanan tercatat</p>
              <p className="text-green-600 text-xs font-mono">ID: {orderId}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Ringkasan Pesanan ── */}
      <div className="max-w-md mx-auto px-4 mt-4 mb-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">
            Ringkasan Pesanan
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Rute</span>
              <span className="font-semibold text-slate-800">{route.from} → {route.to}</span>
            </div>
            {date && (
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal</span>
                <span className="font-semibold">{date}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Penumpang</span>
              <span className="font-semibold">{passengers} orang</span>
            </div>
            {name && (
              <div className="flex justify-between">
                <span className="text-slate-500">Nama</span>
                <span className="font-semibold">{name}</span>
              </div>
            )}
            {phone && (
              <div className="flex justify-between">
                <span className="text-slate-500">No. HP</span>
                <span className="font-semibold">{phone}</span>
              </div>
            )}
            {pickup && (
              <div className="flex justify-between">
                <span className="text-slate-500">Jemput di</span>
                <span className="font-semibold text-right max-w-[60%]">{pickup}</span>
              </div>
            )}
            {dropoff && (
              <div className="flex justify-between">
                <span className="text-slate-500">Antar ke</span>
                <span className="font-semibold text-right max-w-[60%]">{dropoff}</span>
              </div>
            )}
            <div className="border-t border-dashed pt-2 mt-2 flex justify-between">
              <span className="text-slate-500">{passengers} × {formatPrice(hargaPerOrang)}</span>
              <span className="font-bold text-primary-700">{formatPrice(totalHarga)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── QRIS Checkout ── */}
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
