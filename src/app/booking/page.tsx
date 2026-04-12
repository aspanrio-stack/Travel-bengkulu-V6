'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

function BookingForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    route: '',
    passengers: '1',
    paymentMethod: 'Tunai', // Default Tunai
    notes: '',
  });

  useEffect(() => {
    const routeParam = searchParams.get('route');
    if (routeParam) {
      setFormData((prev) => ({ ...prev, route: routeParam.replace('-', ' ') }));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format pesan WhatsApp
    const message = `Halo Travel Bengkulu, saya ingin pesan travel:%0A%0A` +
      `👤 Nama: ${formData.name}%0A` +
      `📱 WhatsApp: ${formData.phone}%0A` +
      `📅 Tanggal: ${formData.date}%0A` +
      `📍 Rute: ${formData.route}%0A` +
      `👥 Kursi: ${formData.passengers}%0A` +
      `💳 Pembayaran: ${formData.paymentMethod}%0A` +
      `📝 Catatan: ${formData.notes}%0A%0A` +
      (formData.paymentMethod === 'QRIS' 
        ? '*Mohon kirimkan kode QRIS untuk pembayaran.*' 
        : '*Saya akan bayar tunai saat penjemputan.*');

    window.open(`https://wa.me/6285268645461?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Detail Pemesanan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (Input Nama dan Nomor WA sama seperti sebelumnya) ... */}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Metode Pembayaran</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, paymentMethod: 'Tunai'})}
              className={`py-3 rounded-xl border-2 transition-all ${formData.paymentMethod === 'Tunai' ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-slate-100 text-slate-500'}`}
            >
              💵 Bayar Tunai
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, paymentMethod: 'QRIS'})}
              className={`py-3 rounded-xl border-2 transition-all ${formData.paymentMethod === 'QRIS' ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-slate-100 text-slate-500'}`}
            >
              📸 Bayar QRIS
            </button>
          </div>
        </div>

        {/* ... (Input Tanggal, Kursi, dan Catatan sama seperti sebelumnya) ... */}

        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
        >
          {formData.paymentMethod === 'QRIS' ? 'Pesan & Bayar QRIS' : 'Pesan Sekarang'}
        </button>
      </form>
    </div>
  );
}

// ... (BookingPage component tetap sama) ...
