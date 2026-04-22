'use client';
import { useState, useEffect } from 'react';
import { ROUTES, formatPrice, Route } from '@/lib/routes';

interface BookingFormProps {
  preselectedRouteId?: string;
}

const today = new Date().toISOString().split('T')[0];

export default function BookingForm({ preselectedRouteId }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    routeId: preselectedRouteId || '',
    passengers: '1',
    name: '',
    phone: '',
    date: '',
    pickupAddress: '',
    dropoffAddress: '',
    email: '',
  });

  // Toggle checkbox email
  const [wantEmail, setWantEmail] = useState(false);

  useEffect(() => {
    if (preselectedRouteId) {
      setForm(prev => ({ ...prev, routeId: preselectedRouteId }));
    }
  }, [preselectedRouteId]);

  const selectedRoute: Route | undefined = ROUTES.find(r => r.id === form.routeId);
  const totalPrice = selectedRoute ? selectedRoute.price * parseInt(form.passengers) : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!form.routeId) return 'Pilih rute perjalanan';
    if (!form.date) return 'Pilih tanggal keberangkatan';
    if (form.date < today) return 'Tanggal tidak boleh di masa lalu';
    return '';
  };

  const validateStep2 = () => {
    if (!form.name.trim()) return 'Nama tidak boleh kosong';
    if (!form.phone.trim()) return 'Nomor HP tidak boleh kosong';
    if (form.phone.length < 10) return 'Nomor HP tidak valid';
    if (!form.pickupAddress.trim()) return 'Alamat penjemputan harus diisi';
    return '';
  };

  const goToStep2 = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setStep(2);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Arahkan ke halaman pembayaran QRIS
  const handleBayarQRIS = () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    if (!selectedRoute) return;

    // Kirim semua data ke halaman pembayaran via URL params
    const params = new URLSearchParams();
    params.set('rute', form.routeId);
    params.set('name', form.name);
    params.set('phone', form.phone);
    params.set('date', form.date);
    params.set('passengers', form.passengers);
    params.set('pickup', form.pickupAddress);
    if (form.dropoffAddress) params.set('dropoff', form.dropoffAddress);
    if (wantEmail && form.email) params.set('email', form.email);
    params.set('paymentMethod', 'qris');

    window.location.href = `/pembayaran?${params.toString()}`;
  };

  const handleKirimWA = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    if (!selectedRoute) return;

    // Simpan pesanan tunai ke Redis untuk rekap admin
    try {
      await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: wantEmail ? form.email : '',
          routeId: form.routeId,
          route: `${selectedRoute.from} → ${selectedRoute.to}`,
          date: form.date,
          passengers: form.passengers,
          pickup: form.pickupAddress,
          dropoff: form.dropoffAddress,
          harga: selectedRoute.price,
          kodeUnik: 0,
          total: totalPrice,
          paymentMethod: 'tunai',
        }),
      });
    } catch (e) {
      console.error('Gagal simpan pesanan tunai:', e);
      // Tetap lanjut buka WhatsApp meski simpan gagal
    }

    const msg = [
      '🚗 *PEMESANAN TRAVEL BENGKULU*',
      '─────────────────────────',
      `*Rute:* ${selectedRoute.from} → ${selectedRoute.to}${selectedRoute.via ? ` (via ${selectedRoute.via})` : ''}`,
      `*Tanggal:* ${form.date}`,
      `*Penumpang:* ${form.passengers} orang`,
      '─────────────────────────',
      `*Nama:* ${form.name}`,
      `*No. HP:* ${form.phone}`,
      wantEmail && form.email ? `*Email:* ${form.email}` : '',
      `*Jemput di:* ${form.pickupAddress}`,
      form.dropoffAddress ? `*Antar ke:* ${form.dropoffAddress}` : '',
      '─────────────────────────',
      `*Total:* ${formatPrice(totalPrice)}`,
      `*Pembayaran:* Tunai (bayar ke driver)`,
      '─────────────────────────',
      '_Mohon konfirmasi ketersediaan dan jadwal penjemputan. Terima kasih!_',
    ].filter(Boolean).join('%0A');

    window.open(`https://wa.me/6285268645461?text=${msg}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

      {/* Progress Steps */}
      <div className="flex border-b border-slate-100">
        {[{ num: 1, label: 'Pilih Rute' }, { num: 2, label: 'Data & Konfirmasi' }].map((s) => (
          <button
            key={s.num}
            onClick={() => s.num < step && setStep(s.num)}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              step === s.num
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                : step > s.num
                ? 'text-primary-600 cursor-pointer hover:bg-primary-50'
                : 'text-slate-400 cursor-not-allowed'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= s.num ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > s.num ? '✓' : s.num}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">

        {/* STEP 1 — Pilih Rute */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Rute Perjalanan <span className="text-red-500">*</span>
              </label>
              <select
                name="routeId"
                value={form.routeId}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">-- Pilih Rute --</option>
                {ROUTES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.from} → {r.to}{r.via ? ` (via ${r.via})` : ''} — {formatPrice(r.price)}/orang
                  </option>
                ))}
              </select>
            </div>

            {selectedRoute && (
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-primary-800">{selectedRoute.from} → {selectedRoute.to}</p>
                    <p className="text-sm text-primary-600">⏱ {selectedRoute.duration}</p>
                    {selectedRoute.via && <p className="text-xs text-primary-500">Via {selectedRoute.via}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-primary-500">Per orang</p>
                    <p className="font-bold text-primary-700 text-xl">{formatPrice(selectedRoute.price)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tanggal Berangkat <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  min={today}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Jumlah Penumpang <span className="text-red-500">*</span>
                </label>
                <select
                  name="passengers"
                  value={form.passengers}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13].map(n => (
                    <option key={n} value={n}>{n} orang</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedRoute && (
              <div className="bg-slate-800 rounded-xl p-4 flex justify-between items-center">
                <span className="text-slate-300 text-sm">{form.passengers} orang × {formatPrice(selectedRoute.price)}</span>
                <span className="text-white font-bold text-xl">{formatPrice(totalPrice)}</span>
              </div>
            )}

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

            <button
              onClick={goToStep2}
              disabled={!form.routeId}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              Lanjut Isi Data →
            </button>
          </div>
        )}

        {/* STEP 2 — Data & Konfirmasi */}
        {step === 2 && (
          <div className="space-y-5">

            {/* Ringkasan */}
            {selectedRoute && (
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                <p className="text-xs text-primary-500 font-semibold mb-1">RINGKASAN PESANAN</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-primary-800">{selectedRoute.from} → {selectedRoute.to}</p>
                    <p className="text-sm text-primary-600">{form.date} · {form.passengers} penumpang</p>
                  </div>
                  <p className="font-bold text-primary-700 text-xl">{formatPrice(totalPrice)}</p>
                </div>
              </div>
            )}

            {/* Nama */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nama"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* No HP */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                No. HP / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Alamat Jemput */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Alamat Penjemputan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="pickupAddress"
                value={form.pickupAddress}
                onChange={handleChange}
                rows={2}
                placeholder="Contoh: Jl. Veteran No. 12, Curup, Rejang Lebong"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Tujuan */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tujuan Pengantaran{' '}
                <span className="text-slate-400 text-xs font-normal">Opsional</span>
              </label>
              <textarea
                name="dropoffAddress"
                value={form.dropoffAddress}
                onChange={handleChange}
                rows={2}
                placeholder="Alamat tujuan di kota tujuan (kosongkan jika belum tahu)"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Email opsional dengan checkbox */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Checkbox toggle */}
              <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    checked={wantEmail}
                    onChange={e => setWantEmail(e.target.checked)}
                    className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">
                    Kirim kwitansi / tiket ke email
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Opsional — bukti pembayaran akan dikirim setelah admin konfirmasi
                  </p>
                </div>
              </label>

              {/* Input email — muncul saat checkbox dicentang */}
              {wantEmail && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="contoh@email.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                    autoFocus
                  />
                  <p className="text-xs text-primary-600 mt-2 flex items-center gap-1.5">
                    <span>📧</span>
                    Tiket perjalanan akan dikirim ke email ini setelah pembayaran dikonfirmasi admin
                  </p>
                </div>
              )}
            </div>

            {/* Pilihan Pembayaran */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Pilih Metode Pembayaran</p>

              {/* QRIS */}
              <button
                onClick={handleBayarQRIS}
                className="w-full bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <span className="text-2xl">📱</span>
                <div className="text-left">
                  <p className="font-bold">Bayar via QRIS</p>
                  <p className="text-xs text-primary-200">GoPay · OVO · Dana · ShopeePay · Bank</p>
                </div>
              </button>

              {/* Tunai */}
              <button
                onClick={handleKirimWA}
                className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <span className="text-2xl">💵</span>
                <div className="text-left">
                  <p className="font-bold">Bayar Tunai ke Driver</p>
                  <p className="text-xs text-green-100">Konfirmasi via WhatsApp · Bayar saat dijemput</p>
                </div>
              </button>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

            {/* Kembali */}
            <button
              onClick={() => { setStep(1); setError(''); }}
              className="w-full border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              ← Kembali Pilih Rute
            </button>

            <p className="text-center text-xs text-slate-400">
              🔒 Data Anda aman · Driver akan menghubungi setelah konfirmasi
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
