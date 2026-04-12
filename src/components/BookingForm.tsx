'use client';
import { useState, useEffect, useRef } from 'react';
import { ROUTES, formatPrice, Route } from '@/lib/routes';

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

interface TicketData {
  orderId: string;
  name: string;
  phone: string;
  route: string;
  date: string;
  passengers: string;
  amount: string;
  pickup: string;
  dropoff: string;
  paymentType: string;
}

function TicketPopup({ ticket, onClose }: { ticket: TicketData; onClose: () => void }) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const content = `
TIKET PERJALANAN - TRAVEL BENGKULU
=====================================
No. Pesanan : ${ticket.orderId}
=====================================
Nama        : ${ticket.name}
No. HP      : ${ticket.phone}
Rute        : ${ticket.route}
Tanggal     : ${ticket.date}
Penumpang   : ${ticket.passengers} orang
Jemput di   : ${ticket.pickup}
Antar ke    : ${ticket.dropoff || '-'}
Total       : ${ticket.amount}
Pembayaran  : ${ticket.paymentType}
=====================================
Tunjukkan tiket ini kepada driver.
Driver akan menghubungi Anda sebelum berangkat.

Kontak: 0852-6864-5461
cs@bengkulutravel.com
bengkulutravel.com
=====================================
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tiket-${ticket.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleScreenshot = async () => {
    if (!ticketRef.current) return;
    try {
      // Gunakan browser share API jika tersedia (mobile)
      if (navigator.share) {
        await navigator.share({
          title: `Tiket Travel Bengkulu - ${ticket.orderId}`,
          text: `Tiket perjalanan ${ticket.route} tanggal ${ticket.date}. No pesanan: ${ticket.orderId}`,
        });
      } else {
        // Fallback: print/save as PDF
        window.print();
      }
    } catch {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-br from-primary-800 to-primary-600 rounded-t-2xl p-6 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h2 className="text-white font-bold text-xl">Travel Bengkulu</h2>
          <p className="text-primary-200 text-sm">Tiket Perjalanan Resmi</p>
        </div>

        {/* Ticket Content */}
        <div ref={ticketRef} className="p-6 space-y-4">
          {/* Status */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-green-700 font-bold text-lg">✅ Pembayaran Berhasil!</p>
            <p className="text-green-600 text-sm">Tiket Anda sudah dikonfirmasi</p>
          </div>

          {/* Order ID */}
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 font-semibold tracking-widest mb-1">NOMOR PESANAN</p>
            <p className="font-mono font-bold text-slate-800 text-xl">{ticket.orderId}</p>
          </div>

          {/* Detail */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 space-y-2">
            <p className="text-xs text-primary-600 font-semibold tracking-widest mb-2">DETAIL PERJALANAN</p>
            <div className="text-center mb-3">
              <p className="font-bold text-primary-800 text-lg">{ticket.route}</p>
            </div>
            {[
              { label: 'Tanggal', value: ticket.date },
              { label: 'Penumpang', value: `${ticket.passengers} orang` },
              { label: 'Jemput di', value: ticket.pickup },
              { label: 'Antar ke', value: ticket.dropoff || '-' },
            ].map(row => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-slate-500">{row.label}</span>
                <span className="font-semibold text-slate-800 text-right max-w-[60%]">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Penumpang */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p className="text-xs text-slate-500 font-semibold tracking-widest mb-2">DATA PENUMPANG</p>
            {[
              { label: 'Nama', value: ticket.name },
              { label: 'No. HP', value: ticket.phone },
            ].map(row => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-slate-500">{row.label}</span>
                <span className="font-semibold text-slate-800">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-primary-700 rounded-xl p-4 text-center">
            <p className="text-primary-200 text-xs font-semibold mb-1">TOTAL DIBAYAR</p>
            <p className="text-white font-bold text-2xl">{ticket.amount}</p>
            <p className="text-primary-300 text-xs mt-1">{ticket.paymentType}</p>
          </div>

          {/* Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 font-semibold text-sm mb-2">📋 Penting!</p>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• Tunjukkan tiket ini kepada driver</li>
              <li>• Siap 15 menit sebelum waktu jemput</li>
              <li>• Driver akan hubungi via WhatsApp</li>
              <li>• Kontak: <strong>0852-6864-5461</strong></li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleDownload}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            ⬇️ Download Tiket
          </button>
          <button
            onClick={handleScreenshot}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            📸 Bagikan / Screenshot
          </button>
          <a
            href={`https://wa.me/6285268645461?text=Halo%20saya%20sudah%20bayar%20dengan%20no%20pesanan%20${ticket.orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            💬 Konfirmasi ke Driver
          </a>
          <button
            onClick={onClose}
            className="w-full border border-slate-200 text-slate-500 py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

const today = new Date().toISOString().split('T')[0];

interface BookingFormProps {
  preselectedRouteId?: string;
}

export default function BookingForm({ preselectedRouteId }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState<TicketData | null>(null);

  const [form, setForm] = useState({
    routeId: preselectedRouteId || '',
    passengers: '1',
    name: '',
    phone: '',
    email: '',
    date: '',
    pickupAddress: '',
    dropoffAddress: '',
    paymentMethod: 'qris',
  });

  // Jika ada preselected route, langsung ke step 2
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
  };

  const handleTunai = () => {
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

  const handleSubmit = async () => {
    const err = validateStep2();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');

    try {
      // Load Midtrans Snap
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

      const res = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.error || 'Gagal membuat transaksi');

      setLoading(false);

      window.snap.pay(data.token, {
        onSuccess: async () => {
          // Kirim email jika ada
          if (form.email) {
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
          } else {
            // Kirim notif admin saja
            await fetch('/api/send-ticket', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.order_id,
                name: form.name,
                phone: form.phone,
                email: null,
                route: data.route,
                date: form.date,
                passengers: form.passengers,
                amount: data.total_formatted,
                paymentType: form.paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank',
                pickup: form.pickupAddress,
                dropoff: form.dropoffAddress,
              }),
            });
          }

          // Tampilkan tiket popup
          setTicket({
            orderId: data.order_id,
            name: form.name,
            phone: form.phone,
            route: data.route,
            date: form.date,
            passengers: form.passengers,
            amount: data.total_formatted,
            pickup: form.pickupAddress,
            dropoff: form.dropoffAddress,
            paymentType: form.paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank',
          });
        },
        onPending: () => {
          window.location.href = `/pembayaran?status=pending&order=${data.order_id}`;
        },
        onError: () => {
          setError('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: () => {
          // User menutup popup tanpa bayar
        },
      });

    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan, coba lagi.');
    }
  };

  return (
    <>
      {ticket && <TicketPopup ticket={ticket} onClose={() => setTicket(null)} />}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Progress */}
        <div className="flex border-b border-slate-100">
          {[{ num: 1, label: 'Pilih Rute' }, { num: 2, label: 'Data & Bayar' }].map((s) => (
            <button
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                step === s.num ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                  : step > s.num ? 'text-primary-600 cursor-pointer hover:bg-primary-50'
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

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
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
                    placeholder="Nama"
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

              {/* Email - OPSIONAL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email{' '}
                  <span className="text-slate-400 text-xs font-normal bg-slate-100 px-2 py-0.5 rounded-full ml-1">
                    Opsional — untuk kirim tiket ke email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Kosongkan jika tidak punya email"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  💡 Tiket tetap muncul di layar setelah bayar meski tanpa email
                </p>
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
                  placeholder="Contoh: Jl. Veteran No. 12, Curup, Rejang Lebong"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

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

              {/* Metode Pembayaran */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Metode Pembayaran <span className="text-red-500">*</span>
                </label>
                {/* Baris 1: QRIS & Transfer Bank */}
                <div className="grid grid-cols-2 gap-3 mb-3">
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
                {/* Baris 2: Bayar Tunai — full width */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all w-full ${
                    form.paymentMethod === 'tunai'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="tunai"
                    checked={form.paymentMethod === 'tunai'}
                    onChange={handleChange}
                    className="accent-green-600"
                  />
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Bayar Tunai</p>
                    <p className="text-xs text-slate-500">Bayar langsung ke driver saat dijemput · Konfirmasi via WhatsApp dulu</p>
                  </div>
                </label>
              </div>

              {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep(1); setError(''); }}
                  className="flex-none border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-4 px-6 rounded-xl transition-colors"
                >
                  ← Kembali
                </button>

                {form.paymentMethod === 'tunai' ? (
                  <button
                    onClick={handleTunai}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Konfirmasi via WhatsApp
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Memproses...
                      </>
                    ) : `🔒 Bayar ${formatPrice(totalPrice)}`}
                  </button>
                )}
              </div>

              {form.paymentMethod === 'tunai' ? (
                <p className="text-center text-xs text-slate-400">
                  💵 Bayar langsung ke driver saat dijemput · Konfirmasi dulu via WhatsApp
                </p>
              ) : (
                <p className="text-center text-xs text-slate-400">
                  🔒 Pembayaran aman via Midtrans · Tiket muncul otomatis setelah bayar
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
