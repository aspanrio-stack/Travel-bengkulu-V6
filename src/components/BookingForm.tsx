'use client';
import { useState, useEffect, useRef } from 'react';
import { ROUTES, formatPrice, formatDepartureTime, getTimeInfo, getRoutePrice, isDepartureDay, Route } from '@/lib/routes';
import LocationPicker from '@/components/LocationPicker';
import SavedAddressBox from '@/components/SavedAddressBox';
import LoginPrompt, { type AuthStatus } from '@/components/LoginPrompt';

const REQUIRE_LOGIN = process.env.NEXT_PUBLIC_REQUIRE_LOGIN_TO_BOOK === 'true';

// QRIS sedang gangguan → ubah ke true untuk mengaktifkan kembali tombol Bayar via QRIS
const QRIS_ENABLED = false;

interface BookingFormProps {
  preselectedRouteId?: string;
  preselectedPassengers?: number;
  preselectedTime?: string;
}

const today = new Date().toISOString().split('T')[0];

export default function BookingForm({ preselectedRouteId, preselectedPassengers, preselectedTime }: BookingFormProps) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sukses, setSukses] = useState<{ orderId: string; paymentMethod: string } | null>(null);

  // ── BARU: state lokasi GPS ──
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [form, setForm] = useState({
    routeId: preselectedRouteId || '',
    passengers: String(Math.min(13, Math.max(1, preselectedPassengers || 1))),
    name: '',
    phone: '',
    date: '',
    departureTime: '',
    flightInfo: '',
    pickupAddress: '',
    dropoffAddress: '',
    email: '',
  });

  const [pickedFrom, setPickedFrom] = useState('');
  const [wantEmail, setWantEmail] = useState(false);
  const saveAddressRef = useRef<null | (() => Promise<void>)>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const blocked = REQUIRE_LOGIN && authStatus === 'out';

  // Prefill dari akun (hanya jika kolom masih kosong)
  const prefillUser = (u: { name: string; email: string }) =>
    setForm(prev => ({ ...prev, name: prev.name || u.name, email: prev.email || u.email }));

  useEffect(() => {
    if (preselectedRouteId) {
      const valid = preselectedTime && ROUTES.find(r => r.id === preselectedRouteId)?.departureTimes?.includes(preselectedTime);
      setForm(prev => ({ ...prev, routeId: preselectedRouteId, departureTime: valid ? preselectedTime! : '', flightInfo: '' }));
    }
  }, [preselectedRouteId, preselectedTime]);

  const selectedRoute: Route | undefined = ROUTES.find(r => r.id === form.routeId);

  // ── Dari & Tujuan (routeId diturunkan dari keduanya) ──
  const fromOptions = Array.from(new Set(ROUTES.map(r => r.from)));
  const fromCity = selectedRoute?.from ?? pickedFrom;
  const toOptions = ROUTES.filter(r => r.from === fromCity).map(r => r.to);
  const toCity = selectedRoute?.to ?? '';

  const setRoute = (routeId: string) =>
    setForm(prev => ({ ...prev, routeId, departureTime: '', flightInfo: '' }));

  const handleFromChange = (city: string) => {
    setPickedFrom(city);
    const options = ROUTES.filter(r => r.from === city);
    // Jika hanya ada satu tujuan, langsung pilih; jika tidak, reset tujuan
    setRoute(options.length === 1 ? options[0].id : '');
    setError('');
  };

  const handleToChange = (city: string) => {
    const r = ROUTES.find(x => x.from === fromCity && x.to === city);
    setRoute(r ? r.id : '');
    setError('');
  };

  const handleSwap = () => {
    if (!selectedRoute) return;
    const reverse = ROUTES.find(r => r.from === selectedRoute.to && r.to === selectedRoute.from);
    if (reverse) { setPickedFrom(reverse.from); setRoute(reverse.id); }
  };
  const hasReverse = !!selectedRoute && ROUTES.some(r => r.from === selectedRoute.to && r.to === selectedRoute.from);
  const fullPhone = form.phone ? '+62' + form.phone.replace(/^0+/, '') : '';
  const unitPrice = getRoutePrice(selectedRoute, form.departureTime);
  const totalPrice = selectedRoute ? unitPrice * parseInt(form.passengers) : 0;

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
    if (!isDepartureDay(selectedRoute, form.date)) return `Rute ini hanya berangkat hari ${selectedRoute?.departureDaysLabel ?? 'tertentu'}. Pilih tanggal yang sesuai.`;
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

  const validateAll = () => validateStep1() || validateStep2();

  const selectedTimeInfo = form.departureTime ? getTimeInfo(selectedRoute, form.departureTime) : undefined;
  const departureTimeLabel = (() => {
    if (hasFixedTimes && form.departureTime) return `Pukul ${formatDepartureTime(form.departureTime)}${selectedTimeInfo ? ` · ${selectedTimeInfo.car}` : ''}`;
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
    departureTime: form.departureTime
      ? `${form.departureTime}${selectedTimeInfo ? ` (${selectedTimeInfo.car})` : ''}`
      : form.flightInfo || '',
    passengers: form.passengers,
    pickup: form.pickupAddress,
    dropoff: form.dropoffAddress,
    harga: unitPrice,
    kodeUnik: 0,
    total: totalPrice,
    paymentMethod,
    // Kirim koordinat GPS jika user mengizinkan (null jika tidak)
    gpsLat: gpsLocation?.lat ?? null,
    gpsLng: gpsLocation?.lng ?? null,
  });

  // ── TUNAI: simpan ke DB lalu langsung redirect ke WA admin ──
  const handleKonfirmasi = async () => {
    const err = validateAll();
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

      await saveAddressRef.current?.(); // simpan alamat (jika dicentang & login)

      // Buat pesan WA otomatis ke admin
      const orderId = data.orderId || '-';
      const dep = form.departureTime
        ? `\nJam: ${formatDepartureTime(form.departureTime)}${selectedTimeInfo ? `\nArmada: ${selectedTimeInfo.car}` : ''}`
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
      window.location.href = `https://wa.me/6282374497929?text=${encodeURIComponent(msgAdmin)}`;

    } catch {
      setError('Gagal menghubungi server. Periksa koneksi internet Anda.');
      setSubmitting(false);
    }
  };

  // ── QRIS ──
  const handleBayarQRIS = async () => {
    const err = validateAll();
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

      await saveAddressRef.current?.();

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

      <div className="p-6 md:p-8">

        <div className="space-y-5">

          <LoginPrompt
            status={authStatus}
            onStatus={setAuthStatus}
            onUser={prefillUser}
            nextUrl={`/pesan?rute=${form.routeId}`}
            required={REQUIRE_LOGIN}
          />

            <div>
              <div className="flex items-end gap-2">
                <div className="flex-1 min-w-0">
                  <label htmlFor="fromCity" className="block text-sm font-semibold text-slate-700 mb-2">
                    Dari <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="fromCity"
                    value={fromCity}
                    onChange={e => handleFromChange(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">-- Kota asal --</option>
                    {fromOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSwap}
                  disabled={!hasReverse}
                  aria-label="Tukar kota asal dan tujuan"
                  className="shrink-0 mb-0.5 w-10 h-12 rounded-xl border border-slate-200 text-primary-700 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ⇄
                </button>

                <div className="flex-1 min-w-0">
                  <label htmlFor="toCity" className="block text-sm font-semibold text-slate-700 mb-2">
                    Tujuan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="toCity"
                    value={toCity}
                    onChange={e => handleToChange(e.target.value)}
                    disabled={!fromCity}
                    className="w-full border border-slate-200 rounded-xl px-3 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">{fromCity ? '-- Kota tujuan --' : 'Pilih asal dulu'}</option>
                    {toOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {selectedRoute && (
                <div className="mt-2 flex items-center justify-between px-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <span>⏱</span> {selectedRoute.duration}
                    {selectedRoute.via && <span className="ml-1 text-slate-400">· via {selectedRoute.via}</span>}
                  </span>
                  <span className="text-xs font-semibold text-primary-700">
                    {formatPrice(unitPrice)}/orang
                  </span>
                </div>
              )}
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
                        <option key={t} value={t}>🕐 {formatDepartureTime(t)}{getTimeInfo(selectedRoute, t) ? ` · ${getTimeInfo(selectedRoute, t)!.car}` : ''}{getTimeInfo(selectedRoute, t)?.price ? ` · ${formatPrice(getTimeInfo(selectedRoute, t)!.price!)}` : ''}</option>
                      ))}
                    </select>
                    {selectedTimeInfo?.notice && (
                      <div role="alert" className="mt-2 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-start gap-2">
                        <span className="text-amber-500 shrink-0 mt-0.5">⚠️</span>
                        <p className="text-sm text-amber-800 font-medium">{selectedTimeInfo.notice}</p>
                      </div>
                    )}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tanggal Berangkat <span className="text-red-500">*</span>
                </label>
                <input type="date" name="date" value={form.date} min={today} onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                {selectedRoute?.departureDaysLabel && (
                  <p className="text-xs text-primary-600 mt-1.5">📅 Berangkat setiap hari {selectedRoute.departureDaysLabel}.</p>
                )}
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

            <SavedAddressBox
              address={form.pickupAddress}
              phone={form.phone}
              saverRef={saveAddressRef}
              onPick={a => setForm(prev => ({ ...prev, pickupAddress: a.address, phone: a.phone || prev.phone }))}
            />

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
              <p className="text-sm font-semibold text-slate-700">Metode Pembayaran</p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 text-sm text-amber-800">
                <span className="shrink-0 mt-0.5">ℹ️</span>
                <span>Pembayaran QRIS sedang gangguan. Untuk sementara, bayar tunai langsung ke driver saat dijemput.</span>
              </div>

              <div className="w-full border-2 border-primary-600 bg-primary-50 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">💵</span>
                <div className="flex-1 text-left">
                  <p className="font-bold text-primary-800">Tunai ke Driver</p>
                  <p className="text-xs text-primary-700">Bayar langsung saat dijemput</p>
                </div>
                <span className="text-primary-700 font-bold text-lg" aria-hidden="true">✓</span>
              </div>

              <button onClick={handleBayarQRIS} disabled={!QRIS_ENABLED || submitting || blocked}
                aria-disabled={!QRIS_ENABLED}
                className="w-full bg-slate-100 border border-slate-200 enabled:bg-primary-600 enabled:border-primary-600 enabled:text-white text-slate-600 disabled:cursor-not-allowed font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-3">
                <span className="text-2xl grayscale opacity-60" aria-hidden="true">📱</span>
                <div className="text-left">
                  <p className="font-bold">Bayar via QRIS</p>
                  <p className="text-xs font-semibold text-red-700">Sedang gangguan</p>
                </div>
              </button>

              {selectedRoute && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-800">Total Pembayaran</p>
                  <div className="flex items-end justify-between gap-3">
                    <span className="text-sm text-slate-600">{formatPrice(unitPrice)} × {form.passengers} orang</span>
                    <span className="text-2xl font-extrabold text-primary-700">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              )}

              <button onClick={handleKonfirmasi} disabled={submitting || blocked}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-lg py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary-700/40 ring-2 ring-primary-300 ring-offset-2">
                {submitting ? (
                  <span className="animate-pulse">Memproses pesanan...</span>
                ) : (
                  <>
                    <span className="text-2xl" aria-hidden="true">✅</span>
                    <div className="text-left">
                      <p className="font-extrabold leading-tight">Konfirmasi Pesanan</p>
                      <p className="text-xs font-medium text-primary-100">Bayar tunai saat dijemput</p>
                    </div>
                    <span className="text-xl" aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

            <p className="text-center text-xs text-slate-400">
              🔒 Data Anda aman · Driver akan menghubungi setelah konfirmasi
            </p>
        </div>
      </div>
    </div>
  );
}
