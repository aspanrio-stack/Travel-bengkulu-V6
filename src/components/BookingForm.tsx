'use client';
import { useState } from 'react';
import { ROUTES, formatPrice } from '@/lib/routes';

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess: (result: unknown) => void;
        onPending: (result: unknown) => void;
        onError: (result: unknown) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

const today = new Date().toISOString().split('T')[0];

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    routeId: '',
    passengers: '1',
    name: '',
    phone: '',
    email: '',
    date: '',
    pickupAddress: '',
    dropoffAddress: '',
    paymentMethod: 'qris',
  });

  const selectedRoute = ROUTES.find(r => r.id === form.routeId);
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
  };

  const handleSubmit = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');

    try {
      // Load Midtrans Snap script
      if (!document.getElementById('midtrans-snap')) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.id = 'midtrans-snap';
          const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';
          script.src = isProduction
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js';
          script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Gagal load payment gateway'));
          document.head.appendChild(script);
        });
      }

      // Create transaction
      const res = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        throw new Error(data.error || 'Gagal membuat transaksi');
      }

      setLoading(false);

      // Open Midtrans Snap popup
      window.snap.pay(data.token, {
        onSuccess: async (result) => {
          console.log('Payment success:', result);
          // Kirim tiket via email
          await fetch('/api/send-ticket', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: data.order_id,
              name: form.name,
              phone: form.phone,
              email: form.email,
              route: data.route,
              date: form.date,
              passengers: form.passengers,
              amount: data.total_formatted,
              paymentType: form.paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank',
              pickup: form.pickupAddress,
              dropoff: form.dropoffAddress,
            }),
          });
          // Redirect ke halaman sukses
          window.location.href = `/pembayaran?status=success&order=${data.order_id}&route=${encodeURIComponent(data.route)}&date=${form.date}&name=${encodeURIComponent(form.name)}`;
        },
        onPending: (result) => {
          console.log('Payment pending:', result);
          window.location.href = `/pembayaran?status=pending&order=${data.order_id}`;
        },
        onError: (result) => {
          console.error('Payment error:', result);
          setError('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: () => {
          console.log('Payment popup closed');
        },
      });

    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan, coba lagi.');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

      {/* Progress Steps */}
      <div className="flex border-b border-slate-100">
        {[
          { num: 1, label: 'Pilih Rute' },
          { num: 2, label: 'Data & Bayar' },
        ].map((s) => (
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
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">-- Pilih Rute --</option>
                {ROUTES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.from} → {r.to} {r.via ? `(via ${r.via})` : ''} — {formatPrice(r.price)}/orang
                  </option>
                ))}
              </select>
            </div>

            {selectedRoute && (
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-primary-800">{selectedRoute.from} → {selectedRoute.to}</p>
                    <p className="text-sm text-primary-600">⏱ Estimasi {selectedRoute.duration}</p>
                    {selectedRoute.via && <p className="text-xs text-primary-500">Via {selectedRoute.via}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-primary-500">Per orang</p>
                    <p className="font-bold text-primary-700 text-lg">{formatPrice(selectedRoute.price)}</p>
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
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
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

        {/* STEP 2 — Data & Pembayaran */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Summary */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama sesuai KTP"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
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
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email <span className="text-slate-400 text-xs font-normal">(untuk terima tiket)</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@anda.com"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Alamat Penjemputan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="pickupAddress"
                value={form.pickupAddress}
                onChange={handleChange}
                rows={2}
                placeholder="Alamat lengkap tempat Anda ingin dijemput"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tujuan Pengantaran <span className="text-slate-400 text-xs font-normal">(opsional)</span>
              </label>
              <textarea
                name="dropoffAddress"
                value={form.dropoffAddress}
                onChange={handleChange}
                rows={2}
                placeholder="Alamat lengkap tujuan di kota tujuan"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Metode Pembayaran */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Metode Pembayaran <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'qris', label: 'QRIS', desc: 'GoPay, OVO, Dana, dll', icon: '📱' },
                  { value: 'bank_transfer', label: 'Transfer Bank', desc: 'BCA, BNI, BRI, Mandiri', icon: '🏦' },
                ].map(method => (
                  <label
                    key={method.value}
                    className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      form.paymentMethod === method.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={form.paymentMethod === method.value}
                      onChange={handleChange}
                      className="mt-1 accent-primary-600"
                    />
                    <div>
                      <p className="text-2xl mb-1">{method.icon}</p>
                      <p className="font-semibold text-slate-800 text-sm">{method.label}</p>
                      <p className="text-xs text-slate-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => { setStep(1); setError(''); }}
                className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-4 rounded-xl transition-colors"
              >
                ← Kembali
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-2 w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    🔒 Bayar {formatPrice(totalPrice)}
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs text-slate-400">
              🔒 Pembayaran diproses aman oleh Midtrans. Tiket dikirim otomatis ke email Anda setelah pembayaran berhasil.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
