'use client';
import { useState, useEffect } from 'react';
import { ROUTES, formatPrice, formatDepartureTime, Route } from '@/lib/routes';
import LocationPicker from '@/components/LocationPicker';

interface BookingFormProps {
  preselectedRouteId?: string;
}

const today = new Date().toISOString().split('T')[0];

export default function BookingForm({ preselectedRouteId }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sukses, setSukses] = useState<{ orderId: string; paymentMethod: string } | null>(null);

  // ── BARU: state lokasi GPS ──
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [form, setForm] = useState({
    routeId: preselectedRouteId || '',
    passengers: '1',
    name: '',
    phone: '',
    date: '',
    departureTime: '',
    flightInfo: '',
    pickupAddress: '',
    dropoffAddress: '',
    email: '',
  });

  const [wantEmail, setWantEmail] = useState(false);

  useEffect(() => {
    if (preselectedRouteId) {
      setForm(prev => ({ ...prev, routeId: preselectedRouteId, departureTime: '', flightInfo: '' }));
    }
  }, [preselectedRouteId]);

  const selectedRoute: Route | undefined = ROUTES.find(r => r.id === form.routeId);
  const fullPhone = form.phone ? '+62' + form.phone.replace(/^0+/, '') : '';
  const totalPrice = selectedRoute ? selectedRoute.price * parseInt(form.passengers) : 0;

  const hasFixedTimes = selectedRoute && selectedRoute.departureTimes && selectedRoute.departureTimes.length > 0;
  const isAirportRoute = selectedRoute && (selectedRoute.id === 'crp-bnd' || selectedRoute.id === 'bnd-crp');
  const isFlexibleRoute = selectedRoute && !hasFixedTimes && !isAirportRoute;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'routeId' ? { departureTime: '', flightInfo: '' } : {}),
    }));
    setError('');
  };

  const validateStep1 = () => {
    if (!form.routeId) return 'Pilih rute perjalanan';
    if (!form.date) return 'Pilih tanggal keberangkatan';
    if (form.date < today) return 'Tanggal tidak boleh di masa lalu';
    if (hasFixedTimes && !form.departureTime) return 'Pilih jam keberangkatan';
    if (isAirportRoute && !form.flightInfo.trim()) {
      return selectedRoute?.id === 'crp-bnd'
        ? 'Masukkan jam / nomor penerbangan keberangkatan'
        : 'Masukkan jam / nomor penerbangan kedatangan';
    }
    return '';
  };

  const validateStep2 = () => {
    if (!form.name.trim()) return 'Nama tidak boleh kosong';
    if (!form.phone.trim()) return 'Nomor HP tidak boleh kosong';
    if (form.phone.length < 8) return 'Nomor HP tidak valid';
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

  const departureTimeLabel = (() => {
    if (hasFixedTimes && form.departureTime) return `Pukul ${formatDepartureTime(form.departureTime)}`;
    if (isAirportRoute && form.flightInfo) return form.flightInfo;
    if (isFlexibleRoute) return 'Konfirmasi via WhatsApp';
    return '';
  })();

  // ── DIMODIFIKASI: tambah gpsLocation ke payload ──
  const buildOrderPayload = (paymentMethod: 'tunai' | 'qris') => ({
    name: form.name,
    phone: fullPhone,
    email: wantEmail ? form.email : '',
    routeId: form.routeId,
    route: `${selectedRoute!.from} → ${selectedRoute!.to}`,
    date: form.date,
    departureTime: form.departureTime || form.flightInfo || '',
    passengers: form.passengers,
    pickup: form.pickupAddress,
    dropoff: form.dropoffAddress,
    harga: selectedRoute!.price,
    kodeUnik: 0,
    total: totalPrice,
    paymentMethod,
    // Kirim koordinat GPS jika user mengizinkan (null jika tidak)
    gpsLat: gpsLocation?.lat ?? null,
    gpsLng: gpsLocation?.lng ?? null,
  });

  // ── TUNAI: simpan ke DB lalu langsung redirect ke WA admin ──
  const handleKirimWA = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    if (!selectedRoute) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildOrderPayload('tunai')),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan. Silakan coba lagi.');
        return;
      }

      // Buat pesan WA otomatis ke admin
      const orderId = data.orderId || '-';
      const dep = form.departureTime
        ? `\nJam: ${formatDepartureTime(form.departureTime)}`
        : form.flightInfo
        ? `\nPenerbangan: ${form.flightInfo}`
        : '';

      const msgAdmin = [
        `Halo Admin Travel Bengkulu 👋`,
        ``,
        `Saya ingin memesan travel dengan pembayaran *Tunai ke Driver*.`,
        ``,
        `*Detail Pesanan:*`,
        `🚗 Rute: ${selectedRoute.from} → ${selectedRoute.to}`,
        `📅 Tanggal: ${form.date}${dep}`,
        `👥 Penumpang: ${form.passengers} orang`,
        `📍 Jemput di: ${form.pickupAddress}`,
        form.dropoffAddress ? `🏁 Antar ke: ${form.dropoffAddress}` : '',
        ``,
        `*Data Pemesan:*`,
        `👤 Nama: ${form.name}`,
        `📞 No. HP: ${fullPhone}`,
        wantEmail && form.email ? `📧 Email: ${form.email}` : '',
        ``,
        `💰 Total: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalPrice)}`,
        `💳 Pembayaran: Tunai ke Driver`,
        `🔖 No. Pesanan: *${orderId}*`,
        ``,
        `Mohon dikonfirmasi ketersediaan dan jadwal keberangkatan. Terima kasih!`,
      ].filter(Boolean).join('\n');

      // Redirect ke WA admin (nomor utama)
      window.location.href = `https://wa.me/6285268645461?text=${encodeURIComponent(msgAdmin)}`;

    } catch {
      setError('Gagal menghubungi server. Periksa koneksi internet Anda.');
      setSubmitting(false);
    }
  };

  // ── QRIS ──
  const handleBayarQRIS = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    if (!selectedRoute) return;

    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildOrderPayload('qris')),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan. Silakan coba lagi.');
        return;
      }

      const params = new URLSearchParams();
      params.set('orderId', data.orderId);
      params.set('rute', form.routeId);
      params.set('name', form.name);
      params.set('phone', fullPhone);
      params.set('date', form.date);
      params.set('passengers', form.passengers);
      params.set('pickup', form.pickupAddress);
      if (form.dropoffAddress) params.set('dropoff', form.dropoffAddress);
      if (wantEmail && form.email) params.set('email', form.email);
      if (form.departureTime) params.set('departureTime', form.departureTime);
      if (form.flightInfo) params.set('flightInfo', form.flightInfo);
      params.set('paymentMethod', 'qris');

      window.location.href = `/pembayaran?${params.toString()}`;
    } catch {
      setError('Gagal menghubungi server. Periksa koneksi internet Anda.');
      setSubmitting(false);
    }
  };

  // ── HALAMAN SUKSES ──
  if (sukses) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Terima Kasih!</h2>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Pesanan Anda telah kami terima. Anda akan segera mendapatkan notifikasi konfirmasi via WhatsApp.
          <br />
          <span className="text-sm text-slate-400 mt-1 block">
            Hubungi kami jika Anda tidak mendapatkan konfirmasi WhatsApp dalam 5 menit.
          </span>
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-left">
          <p className="text-sm font-semibold text-green-800 mb-1">📱 Notifikasi WhatsApp</p>
          <p className="text-sm text-green-700">
            Konfirmasi otomatis dikirim ke <strong>{fullPhone}</strong>
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-left text-sm">
          <p className="font-semibold text-slate-700">
            🔖 No. Pesanan: <span className="font-mono text-primary-700">{sukses.orderId}</span>
          </p>
          <p className="text-slate-400 text-xs mt-1">Simpan nomor ini sebagai bukti pemesanan.</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left text-sm">
          <p className="font-semibold text-amber-800 mb-1">💵 Pembayaran Tunai</p>
          <p className="text-amber-700">Pembayaran dilakukan langsung ke driver saat penjemputan.</p>
        </div>

        <a
          href={`https://wa.me/6285268645461`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mb-3 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
        >
          💬 Hubungi Kami via WhatsApp
        </a>

        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-primary-700 hover:bg-primary-800 text-white font-bold py-3 rounded-xl transition-colors text-sm"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

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
              step >= s.num ? 'bg-primary-700 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > s.num ? '✓' : s.num}
            </span>
            {s.label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">

        {/* STEP 1 */}
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

              {selectedRoute && (
                <div className="mt-2 flex items-center justify-between px-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <span>⏱</span> {selectedRoute.duration}
                    {selectedRoute.via && <span className="ml-1 text-slate-400">· via {selectedRoute.via}</span>}
                  </span>
                  <span className="text-xs font-semibold text-primary-700">
                    {formatPrice(selectedRoute.price)}/orang
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tanggal Berangkat <span className="text-red-500">*</span>
                </label>
                <input type="date" name="date" value={form.date} min={today} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Jumlah Penumpang <span className="text-red-500">*</span>
                </label>
                <select name="passengers" value={form.passengers} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13].map(n => (
                    <option key={n} value={n}>{n} orang</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedRoute && (
              <>
                {hasFixedTimes && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Jam Keberangkatan <span className="text-red-500">*</span>
                    </label>
                    <select name="departureTime" value={form.departureTime} onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">-- Pilih Jam --</option>
                      {selectedRoute.departureTimes!.map(t => (
                        <option key={t} value={t}>🕐 {formatDepartureTime(t)}</option>
                      ))}
                    </select>
                    {selectedRoute.departureNote && (
                      <p className="text-xs text-primary-600 mt-1.5 flex items-start gap-1">
                        <span className="mt-0.5">ℹ️</span>{selectedRoute.departureNote}
                      </p>
                    )}
                  </div>
                )}
                {isAirportRoute && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {selectedRoute.id === 'crp-bnd'
                        ? <>Jam / Nomor Penerbangan <span className="text-slate-400 font-normal text-xs">(keberangkatan)</span></>
                        : <>Jam / Nomor Penerbangan <span className="text-slate-400 font-normal text-xs">(kedatangan)</span></>
                      }
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input type="text" name="flightInfo" value={form.flightInfo} onChange={handleChange}
                      placeholder={selectedRoute.id === 'crp-bnd' ? 'Contoh: GA 123 pukul 13.00' : 'Contoh: JT 456 tiba pukul 15.30'}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                )}
                {isFlexibleRoute && selectedRoute.departureNote && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2">
                    <span className="text-blue-500 shrink-0 mt-0.5">ℹ️</span>
                    <p className="text-sm text-blue-700">{selectedRoute.departureNote}</p>
                  </div>
                )}
              </>
            )}

            {selectedRoute && (
              <div className="bg-slate-800 rounded-xl p-4 flex justify-between items-center">
                <span className="text-slate-300 text-sm">{form.passengers} orang × {formatPrice(selectedRoute.price)}</span>
                <span className="text-white font-bold text-xl">{formatPrice(totalPrice)}</span>
              </div>
            )}

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

            <button onClick={goToStep2} disabled={!form.routeId}
              className="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg">
              Lanjut Isi Data →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5">

            {selectedRoute && (
              <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                <p className="text-xs text-primary-500 font-semibold mb-1">RINGKASAN PESANAN</p>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-primary-800">{selectedRoute.from} → {selectedRoute.to}</p>
                    <p className="text-sm text-primary-600">{form.date} · {form.passengers} penumpang</p>
                    {departureTimeLabel && <p className="text-sm text-primary-600">🕐 {departureTimeLabel}</p>}
                  </div>
                  <p className="font-bold text-primary-700 text-xl">{formatPrice(totalPrice)}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nama <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama lengkap pemesan"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">No. HP / WhatsApp <span className="text-red-500">*</span></label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-3 border border-r-0 border-slate-200 rounded-l-xl bg-slate-50 text-slate-600 font-semibold text-sm select-none">+62</span>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="8xxxxxxxxxx"
                  className="flex-1 border border-slate-200 rounded-r-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <p className="text-xs text-slate-400 mt-1">Contoh: 81234567890 (tanpa angka 0 di depan)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Penjemputan <span className="text-red-500">*</span></label>
              <textarea name="pickupAddress" value={form.pickupAddress} onChange={handleChange} rows={2}
                placeholder="Contoh: Jl. Veteran No. 12, Curup, Rejang Lebong"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>

            {/* ── BARU: Location Picker GPS ── */}
            <LocationPicker onChange={setGpsLocation} />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tujuan Pengantaran <span className="text-slate-400 text-xs font-normal">Opsional</span>
              </label>
              <textarea name="dropoffAddress" value={form.dropoffAddress} onChange={handleChange} rows={2}
                placeholder="Alamat tujuan di kota tujuan (kosongkan jika belum tahu)"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors">
                <div className="mt-0.5">
                  <input type="checkbox" checked={wantEmail} onChange={e => setWantEmail(e.target.checked)}
                    className="w-4 h-4 accent-primary-600 rounded cursor-pointer" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">Kirim kwitansi / tiket ke email</p>
                  <p className="text-slate-400 text-xs mt-0.5">Opsional — bukti pembayaran akan dikirim setelah admin konfirmasi</p>
                </div>
              </label>
              {wantEmail && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="contoh@email.com" autoFocus
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  <p className="text-xs text-primary-600 mt-2 flex items-center gap-1.5">
                    <span>📧</span> Tiket dikirim ke email ini setelah pembayaran dikonfirmasi admin
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Pilih Metode Pembayaran</p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2 text-sm text-blue-700">
                <span className="shrink-0 mt-0.5">ℹ️</span>
                <span>Untuk QRIS, tiket dikirim otomatis setelah admin verifikasi pembayaran. Untuk tunai, Anda langsung terhubung ke WhatsApp admin.</span>
              </div>

              <button onClick={handleBayarQRIS} disabled={submitting}
                className="w-full bg-primary-600 hover:bg-primary-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm">
                <span className="text-2xl">📱</span>
                <div className="text-left">
                  <p className="font-bold">Bayar via QRIS</p>
                  <p className="text-xs text-primary-200">GoPay · OVO · Dana · ShopeePay · Bank</p>
                </div>
              </button>

              <button onClick={handleKirimWA} disabled={submitting}
                className="w-full bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm">
                {submitting ? (
                  <span className="animate-pulse">Memproses & Membuka WhatsApp...</span>
                ) : (
                  <>
                    <span className="text-2xl">💬</span>
                    <div className="text-left">
                      <p className="font-bold">Pesan via WhatsApp (Tunai)</p>
                      <p className="text-xs text-green-100">Langsung terhubung ke admin · Bayar saat dijemput</p>
                    </div>
                  </>
                )}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

            <button onClick={() => { setStep(1); setError(''); }} disabled={submitting}
              className="w-full border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 font-semibold py-3 rounded-xl transition-colors text-sm">
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
