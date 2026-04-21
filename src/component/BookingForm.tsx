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
  });

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

  const handleKirimWA = () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    if (!selectedRoute) return;

    const msg = [
      '🚗 *PEMESANAN TRAVEL BENGKULU*',
      '─────────────────────────',
      `*Rute:* ${selectedRoute.from} → ${selectedRoute.to}${selectedRoute.via ? ` (via ${selectedRoute.via})` : ''}`,
      `*Tanggal:* ${form.date}`,
      `*Penumpang:* ${form.passengers} orang`,
      '─────────────────────────',
      `*Nama:* ${form.name}`,
      `*No. HP:* ${form.phone}`,
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

            {/* Info pembayaran tunai */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <span className="text-2xl">💵</span>
              <div>
                <p className="font-semibold text-amber-800 text-sm">Pembayaran Tunai</p>
                <p className="text-amber-700 text-xs mt-0.5">
                  Bayar langsung ke driver saat dijemput. Setelah konfirmasi via WhatsApp, driver akan menghubungi Anda untuk detail keberangkatan.
                </p>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

            {/* Tombol */}
            <div className="flex gap-3">
              <button
                onClick={() => { setStep(1); setError(''); }}
                className="flex-none border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                ← Kembali
              </button>
              <button
                onClick={handleKirimWA}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Konfirmasi via WhatsApp
              </button>
            </div>

            <p className="text-center text-xs text-slate-400">
              💬 Pesan Anda akan dikirim otomatis ke WhatsApp kami · Driver akan menghubungi Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
