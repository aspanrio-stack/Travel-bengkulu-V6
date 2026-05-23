'use client';
import { useState } from 'react';
import {
  RENTAL_PRICES,
  VEHICLE_LABELS,
  RENTAL_TYPE_LABELS,
  AREA_LABELS,
  type RentalVehicle,
  type RentalType,
  type RentalArea,
} from '@/lib/rental-config';

const today = new Date().toISOString().split('T')[0];

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function diffDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  const d = Math.round((b - a) / 86_400_000);
  return d > 0 ? d : 0;
}

export default function RentalForm() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    vehicle: '' as RentalVehicle | '',
    rentalType: '' as RentalType | '',
    area: 'dalam_kota' as RentalArea,
    startDate: '',
    endDate: '',
    pickupTime: '08:00',
    pickupAddress: '',
    notes: '',
    name: '',
    phone: '',
    email: '',
  });
  const [wantEmail, setWantEmail] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'tunai' | 'qris'>('tunai');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // ── Hitung harga ──
  const days = diffDays(form.startDate, form.endDate);

  const pricePerDay = (() => {
    if (!form.vehicle || !form.rentalType) return 0;
    if (form.rentalType === 'lepas_kunci') {
      return RENTAL_PRICES.lepas_kunci.dalam_kota[form.vehicle as 'avanza' | 'innova'] ?? 0;
    }
    return RENTAL_PRICES.with_driver[form.area][form.vehicle as 'avanza' | 'innova' | 'hiace'];
  })();

  const driverFeePerDay = (() => {
    if (form.rentalType !== 'with_driver') return 0;
    return RENTAL_PRICES.driver_fee[form.area];
  })();

  const totalPrice = (pricePerDay + driverFeePerDay) * (days || 1);
  const fullPhone = form.phone ? '+62' + form.phone.replace(/^0+/, '') : '';

  // HiAce tidak tersedia untuk lepas kunci
  const isHiAceLepasKunci = form.vehicle === 'hiace' && form.rentalType === 'lepas_kunci';

  // ── Validasi ──
  const validateStep1 = () => {
    if (!form.vehicle) return 'Pilih armada kendaraan';
    if (!form.rentalType) return 'Pilih jenis sewa';
    if (isHiAceLepasKunci) return 'HiAce tidak tersedia untuk Lepas Kunci';
    if (!form.startDate) return 'Pilih tanggal mulai sewa';
    if (!form.endDate) return 'Pilih tanggal selesai sewa';
    if (form.endDate <= form.startDate) return 'Tanggal selesai harus setelah tanggal mulai';
    if (!form.pickupTime) return 'Pilih jam pengambilan';
    if (!form.pickupAddress.trim()) return 'Alamat pengambilan harus diisi';
    return '';
  };

  const validateStep2 = () => {
    if (!form.name.trim()) return 'Nama tidak boleh kosong';
    if (!form.phone.trim()) return 'Nomor HP tidak boleh kosong';
    if (form.phone.length < 8) return 'Nomor HP tidak valid';
    if (wantEmail && !form.email.trim()) return 'Isi alamat email atau hilangkan centang';
    return '';
  };

  const goToStep2 = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setStep(2); setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Submit tunai via WA ──
  const handleKirimWA = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }

    setSubmitting(true);
    try {
      await fetch('/api/rental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: fullPhone,
          email: wantEmail ? form.email : '',
          vehicle: form.vehicle,
          rentalType: form.rentalType,
          area: form.rentalType === 'lepas_kunci' ? 'dalam_kota' : form.area,
          startDate: form.startDate,
          endDate: form.endDate,
          days,
          pickupTime: form.pickupTime,
          pickupAddress: form.pickupAddress,
          notes: form.notes,
          pricePerDay,
          driverFeePerDay,
          totalPrice,
          paymentMethod: 'tunai',
        }),
      });
    } catch (e) { console.error('Gagal simpan rental tunai:', e); }

    const vehicleLabel = VEHICLE_LABELS[form.vehicle as RentalVehicle];
    const rentalLabel  = RENTAL_TYPE_LABELS[form.rentalType as RentalType];
    const areaLabel    = form.rentalType === 'with_driver' ? AREA_LABELS[form.area] : '';

    const msg = [
      '🚗 *PEMESANAN RENTAL MOBIL*',
      '─────────────────────────',
      `*Kendaraan:* ${vehicleLabel}`,
      `*Jenis Sewa:* ${rentalLabel}${areaLabel ? ` - ${areaLabel}` : ''}`,
      `*Tanggal Mulai:* ${form.startDate}`,
      `*Tanggal Selesai:* ${form.endDate}`,
      `*Durasi:* ${days} hari`,
      `*Jam Ambil:* ${form.pickupTime} WIB`,
      `*Lokasi:* ${form.pickupAddress}`,
      form.notes ? `*Catatan:* ${form.notes}` : '',
      '─────────────────────────',
      `*Nama:* ${form.name}`,
      `*No. HP:* ${fullPhone}`,
      wantEmail && form.email ? `*Email:* ${form.email}` : '',
      '─────────────────────────',
      `*Harga Sewa:* ${formatRp(pricePerDay)}/hari`,
      form.rentalType === 'with_driver' ? `*Jasa Sopir:* ${formatRp(driverFeePerDay)}/hari` : '',
      `*Total (${days} hari):* ${formatRp(totalPrice)}`,
      `*Pembayaran:* Tunai`,
      '─────────────────────────',
      '_Mohon konfirmasi ketersediaan unit. Terima kasih!_',
    ].filter(Boolean).join('%0A');

    window.open(`https://wa.me/6282374497929?text=${msg}`, '_blank');
    setSubmitting(false);
  };

  // ── Submit QRIS ──
  const handleBayarQRIS = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }

    const params = new URLSearchParams();
    params.set('type', 'rental');
    params.set('vehicle', form.vehicle);
    params.set('rentalType', form.rentalType);
    params.set('area', form.rentalType === 'lepas_kunci' ? 'dalam_kota' : form.area);
    params.set('startDate', form.startDate);
    params.set('endDate', form.endDate);
    params.set('days', String(days));
    params.set('pickupTime', form.pickupTime);
    params.set('pickupAddress', form.pickupAddress);
    if (form.notes) params.set('notes', form.notes);
    params.set('name', form.name);
    params.set('phone', fullPhone);
    if (wantEmail && form.email) params.set('email', form.email);
    params.set('pricePerDay', String(pricePerDay));
    params.set('driverFeePerDay', String(driverFeePerDay));
    params.set('total', String(totalPrice));
    params.set('paymentMethod', 'qris');

    window.location.href = `/pembayaran?${params.toString()}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

      {/* Progress Steps */}
      <div className="flex border-b border-slate-100">
        {[{ num: 1, label: 'Detail Rental' }, { num: 2, label: 'Data & Konfirmasi' }].map((s) => (
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

        {/* ── STEP 1: Detail Rental ── */}
        {step === 1 && (
          <div className="space-y-5">

            {/* Pilih Armada */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Pilih Armada <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['avanza', 'innova', 'hiace'] as RentalVehicle[]).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { setForm(p => ({ ...p, vehicle: v })); setError(''); }}
                    className={`border-2 rounded-xl p-3 text-center transition-all ${
                      form.vehicle === v
                        ? 'border-primary-600 bg-primary-50 text-primary-800'
                        : 'border-slate-200 hover:border-primary-300 text-slate-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">🚗</div>
                    <p className="font-bold text-sm">{VEHICLE_LABELS[v].split(' ')[1]}</p>
                    <p className="text-xs text-slate-400">Toyota</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Jenis Sewa */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Jenis Sewa <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['with_driver', 'lepas_kunci'] as RentalType[]).map(rt => (
                  <button
                    key={rt}
                    type="button"
                    onClick={() => { setForm(p => ({ ...p, rentalType: rt })); setError(''); }}
                    className={`border-2 rounded-xl p-4 text-left transition-all ${
                      form.rentalType === rt
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-slate-200 hover:border-primary-300'
                    }`}
                  >
                    <p className="font-bold text-sm text-slate-800">
                      {rt === 'with_driver' ? '👨‍✈️' : '🔑'} {RENTAL_TYPE_LABELS[rt]}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {rt === 'with_driver'
                        ? 'Sudah termasuk sopir profesional'
                        : 'Bawa sendiri, SIM A wajib'}
                    </p>
                    {rt === 'lepas_kunci' && form.vehicle === 'hiace' && (
                      <p className="text-xs text-red-500 mt-1 font-semibold">⚠ Tidak tersedia untuk HiAce</p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Area (hanya jika with_driver) */}
            {form.rentalType === 'with_driver' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Area Perjalanan <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['dalam_kota', 'luar_kota'] as RentalArea[]).map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setForm(p => ({ ...p, area: a })); setError(''); }}
                      className={`border-2 rounded-xl p-4 text-left transition-all ${
                        form.area === a
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-slate-200 hover:border-primary-300'
                      }`}
                    >
                      <p className="font-bold text-sm text-slate-800">
                        {a === 'dalam_kota' ? '🏙️' : '🗺️'} {AREA_LABELS[a]}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {a === 'dalam_kota' ? 'Dalam wilayah kota' : 'Lintas kota / kabupaten'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Estimasi Harga */}
            {form.vehicle && form.rentalType && !isHiAceLepasKunci && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-slate-700">Estimasi Harga/Hari</p>
                <div className="flex justify-between text-slate-600">
                  <span>Sewa {VEHICLE_LABELS[form.vehicle as RentalVehicle]}</span>
                  <span className="font-semibold">{formatRp(pricePerDay)}</span>
                </div>
                {form.rentalType === 'with_driver' && (
                  <div className="flex justify-between text-slate-600">
                    <span>Jasa Sopir ({AREA_LABELS[form.area]})</span>
                    <span className="font-semibold">{formatRp(driverFeePerDay)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-primary-700 border-t border-slate-200 pt-2">
                  <span>Total/Hari</span>
                  <span>{formatRp(pricePerDay + driverFeePerDay)}</span>
                </div>
              </div>
            )}

            {isHiAceLepasKunci && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                ⚠️ HiAce tidak tersedia untuk sewa Lepas Kunci. Silakan pilih Dengan Sopir, atau pilih kendaraan lain.
              </div>
            )}

            {/* Tanggal */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  min={today}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tanggal Selesai <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  min={form.startDate || today}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Ringkasan durasi */}
            {days > 0 && (
              <div className="bg-slate-800 rounded-xl p-4 flex justify-between items-center">
                <span className="text-slate-300 text-sm">{days} hari × {formatRp(pricePerDay + driverFeePerDay)}/hari</span>
                <span className="text-white font-bold text-xl">{formatRp((pricePerDay + driverFeePerDay) * days)}</span>
              </div>
            )}

            {/* Jam Pengambilan */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Jam Pengambilan <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="pickupTime"
                value={form.pickupTime}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Lokasi Pengambilan */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Lokasi Pengambilan / Pengantaran Unit <span className="text-red-500">*</span>
              </label>
              <textarea
                name="pickupAddress"
                value={form.pickupAddress}
                onChange={handleChange}
                rows={2}
                placeholder="Contoh: Jl. Veteran No. 12, Bengkulu (unit diantar ke lokasi Anda)"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">KTP akan diminta saat unit diserahkan</p>
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Catatan Tambahan <span className="text-slate-400 font-normal text-xs">Opsional</span>
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Contoh: butuh kursi bayi, rute perjalanan, dll."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

            <button
              onClick={goToStep2}
              disabled={!form.vehicle || !form.rentalType || isHiAceLepasKunci}
              className="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              Lanjut Isi Data →
            </button>
          </div>
        )}

        {/* ── STEP 2: Data & Konfirmasi ── */}
        {step === 2 && (
          <div className="space-y-5">

            {/* Ringkasan */}
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <p className="text-xs text-primary-500 font-semibold mb-2">RINGKASAN PESANAN RENTAL</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-700">Kendaraan</span>
                  <span className="font-bold text-primary-800">{VEHICLE_LABELS[form.vehicle as RentalVehicle]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">Jenis Sewa</span>
                  <span className="font-semibold text-primary-800">
                    {RENTAL_TYPE_LABELS[form.rentalType as RentalType]}
                    {form.rentalType === 'with_driver' ? ` · ${AREA_LABELS[form.area]}` : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">Durasi</span>
                  <span className="font-semibold text-primary-800">{form.startDate} s/d {form.endDate} ({days} hari)</span>
                </div>
                <div className="flex justify-between font-bold text-primary-700 border-t border-primary-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-xl">{formatRp(totalPrice)}</span>
                </div>
              </div>
            </div>

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
                placeholder="Nama lengkap pemesan"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* No HP */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                No. HP / WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 border border-r-0 border-slate-200 rounded-l-xl bg-slate-50 text-slate-600 font-semibold text-sm select-none">
                  +62
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="8xxxxxxxxxx"
                  className="flex-1 border border-slate-200 rounded-r-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Tanpa angka 0 di depan</p>
            </div>

            {/* Email opsional */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
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
                  <p className="font-semibold text-slate-700 text-sm">Kirim invoice & kwitansi ke email</p>
                  <p className="text-slate-400 text-xs mt-0.5">Opsional — dikirim setelah admin konfirmasi</p>
                </div>
              </label>
              {wantEmail && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="contoh@email.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    autoFocus
                  />
                  <p className="text-xs text-primary-600 mt-2 flex items-center gap-1.5">
                    <span>📧</span> Invoice & kwitansi dikirim setelah pembayaran dikonfirmasi admin
                  </p>
                </div>
              )}
            </div>

            {/* Pilihan Pembayaran */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Pilih Metode Pembayaran</p>

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

              <button
                onClick={handleKirimWA}
                disabled={submitting}
                className="w-full bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <span className="text-2xl">💵</span>
                <div className="text-left">
                  <p className="font-bold">Bayar Tunai / DP via WA</p>
                  <p className="text-xs text-green-100">Konfirmasi via WhatsApp · Bayar saat pengambilan</p>
                </div>
              </button>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

            <button
              onClick={() => { setStep(1); setError(''); }}
              className="w-full border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              ← Kembali
            </button>

            <p className="text-center text-xs text-slate-400">
              🔒 Data Anda aman · Unit akan diantarkan ke lokasi Anda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
