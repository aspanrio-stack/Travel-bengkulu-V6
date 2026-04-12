'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

// 1. Pisahkan komponen Form agar bisa dibungkus Suspense dengan benar
function BookingFormContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    route: '',
    passengers: '1',
    paymentMethod: 'Tunai',
    notes: '',
  });

  useEffect(() => {
    const routeParam = searchParams.get('route');
    const serviceParam = searchParams.get('service');
    if (routeParam) {
      setFormData((prev) => ({ ...prev, route: routeParam.replace(/-/g, ' ') }));
    } else if (serviceParam) {
      setFormData((prev) => ({ ...prev, route: serviceParam.replace(/-/g, ' ') }));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Detail Pemesanan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Contoh: Budi Santoso"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
            <input
              required
              type="tel"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="0812xxxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Rute / Layanan</label>
          <select
            value={formData.route}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
          >
            <option value="">-- Pilih Rute --</option>
            <option value="Bengkulu Palembang">Bengkulu ↔ Palembang</option>
            <option value="Palembang Bengkulu">Palembang ↔ Bengkulu</option>
            <option value="Bengkulu Jambi">Bengkulu ↔ Jambi</option>
            <option value="Jambi Bengkulu">Jambi ↔ Bengkulu</option>
            <option value="Bengkulu Curup">Bengkulu ↔ Curup</option>
            <option value="Rental Mobil">Rental Mobil</option>
            <option value="Antar Jemput Bandara">Antar Jemput Bandara</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Metode Pembayaran</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, paymentMethod: 'Tunai'})}
              className={`py-3 rounded-xl border-2 transition-all font-medium ${formData.paymentMethod === 'Tunai' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500'}`}
            >
              💵 Bayar Tunai
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, paymentMethod: 'QRIS'})}
              className={`py-3 rounded-xl border-2 transition-all font-medium ${formData.paymentMethod === 'QRIS' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500'}`}
            >
              📸 Bayar QRIS
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal Keberangkatan</label>
            <input
              required
              type="date"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Jumlah Penumpang</label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={formData.passengers}
              onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Jemput / Catatan</label>
          <textarea
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            rows={3}
            placeholder="Tuliskan alamat lengkap penjemputan..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
        >
          {formData.paymentMethod === 'QRIS' ? 'Pesan & Minta QRIS' : 'Konfirmasi via WhatsApp'}
        </button>
      </form>
    </div>
  );
}

// 2. Export default harus berupa fungsi komponen yang bersih
export default function BookingPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Booking Travel Online</h1>
        <p className="text-slate-500 text-lg">Layanan antar jemput door-to-door Bengkulu.</p>
      </div>
      
      {/* Penting: useSearchParams HARUS di dalam Suspense di Next.js 13/14 */}
      <Suspense fallback={
        <div className="max-w-2xl mx-auto p-10 text-center bg-white rounded-2xl shadow-sm">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Memuat formulir...</p>
        </div>
      }>
        <BookingFormContent />
      </Suspense>
    </main>
  );
}
