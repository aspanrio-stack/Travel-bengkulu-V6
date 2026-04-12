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
    notes: '',
  });

  // Mengambil data rute dari URL (misal: ?route=Bengkulu-Palembang)
  useEffect(() => {
    const routeParam = searchParams.get('route');
    const serviceParam = searchParams.get('service');
    if (routeParam) {
      setFormData((prev) => ({ ...prev, route: routeParam.replace('-', ' ') }));
    } else if (serviceParam) {
      setFormData((prev) => ({ ...prev, route: serviceParam.replace('-', ' ') }));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format pesan WhatsApp
    const message = `Halo Travel Bengkulu, saya ingin pesan travel:%0A%0A` +
      `Nama: ${formData.name}%0A` +
      `WhatsApp: ${formData.phone}%0A` +
      `Tanggal: ${formData.date}%0A` +
      `Rute/Layanan: ${formData.route}%0A` +
      `Jumlah Kursi: ${formData.passengers}%0A` +
      `Catatan: ${formData.notes}`;

    window.open(`https://wa.me/6285268645461?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Detail Pemesanan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="Contoh: Budi Santoso"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
            <input
              required
              type="tel"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="0812xxxx"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Pilih Rute / Layanan</label>
          <select
            value={formData.route}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
          >
            <option value="">-- Pilih Rute --</option>
            <option value="Bengkulu Palembang">Bengkulu ↔ Palembang</option>
            <option value="Bengkulu Jambi">Bengkulu ↔ Jambi</option>
            <option value="Bengkulu Curup">Bengkulu ↔ Curup</option>
            <option value="Rental Mobil">Rental Mobil</option>
            <option value="Antar Jemput Bandara">Antar Jemput Bandara</option>
            <option value="Kirim Paket">Kirim Paket</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tanggal Keberangkatan</label>
            <input
              required
              type="date"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Jumlah Penumpang</label>
            <input
              type="number"
              min="1"
              value={formData.passengers}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Jemput / Catatan</label>
          <textarea
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            rows={3}
            placeholder="Tuliskan alamat lengkap penjemputan..."
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          Konfirmasi via WhatsApp
        </button>
      </form>
    </div>
  );
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Booking Travel Online</h1>
        <p className="text-slate-500">Isi form di bawah ini, admin kami akan segera menghubungi Anda.</p>
      </div>
      
      {/* Suspense diperlukan karena kita menggunakan useSearchParams */}
      <Suspense fallback={<div className="text-center">Memuat form...</div>}>
        <BookingForm />
      </Suspense>
    </main>
  );
}
