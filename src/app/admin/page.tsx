'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/lib/orders';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const map = {
    pending:   { label: 'Menunggu',     cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    success:   { label: 'Dikonfirmasi', cls: 'bg-green-100 text-green-700 border-green-200' },
    cancelled: { label: 'Dibatalkan',   cls: 'bg-red-100 text-red-700 border-red-200' },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  if (!digits.startsWith('62')) digits = '62' + digits;
  return digits;
}

function waLink(phone: string) {
  return `https://wa.me/${normalizePhone(phone)}`;
}

function waTemplateLink(order: Order): string {
  const dep = (order as Order & { departureTime?: string }).departureTime;
  const lines = [
    `Assalamualaikum / Halo *${order.name}*,`,
    '',
    `Berikut detail pesanan Anda di *Travel Bengkulu*:`,
    '',
    `🚗 Rute     : ${order.route}`,
    `📅 Tanggal  : ${order.date}`,
    dep ? `🕐 Jam      : ${dep}` : '',
    `👥 Penumpang: ${order.passengers} orang`,
    `📍 Jemput   : ${order.pickup}`,
    order.dropoff ? `🏁 Tujuan   : ${order.dropoff}` : '',
    `💰 Total    : ${formatRp(order.total)}`,
    `No. Pesanan : *${order.id}*`,
    '',
    order.status === 'success'
      ? `Status: *Pembayaran Dikonfirmasi ✅*`
      : `Status: *Menunggu Konfirmasi ⏳*`,
    '',
    `Terima kasih telah mempercayai Travel Bengkulu 🙏`,
  ].filter(Boolean).join('\n');
  return `https://wa.me/${normalizePhone(order.phone)}?text=${encodeURIComponent(lines)}`;
}

// ─────────────────────────────────────────────
// KWITANSI — Types & Helpers
// ─────────────────────────────────────────────
type Layanan    = 'rental' | 'rental_sopir' | 'all_in';
type Pembayaran = 'tunai' | 'transfer';
type Perusahaan = 'bengkulutravel' | 'kgtransport';

interface KwitansiForm {
  nomorKwitansi:  string;
  perusahaan:     Perusahaan;
  namaPenerima:   string;
  alamatPenerima: string;
  noHp:           string;
  layanan:        Layanan;
  tarif:          string;
  jumlahHari:     string;
  tanggal:        string;
  pembayaran:     Pembayaran;
  catatan:        string;
  email:          string;
  showEmail:      boolean;
}

function generateNomorKwitansi(): string {
  const now  = new Date();
  const yy   = String(now.getFullYear()).slice(2);
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `KWT-${yy}${mm}${dd}-${rand}`;
}

function labelLayanan(layanan: Layanan): string {
  return { rental: 'Rental Mobil', rental_sopir: 'Rental Mobil + Sopir', all_in: 'All In (Mobil + Sopir + Bensin)' }[layanan];
}

// ─────────────────────────────────────────────
// KWITANSI TAB COMPONENT
// ─────────────────────────────────────────────
function KwitansiTab({ setToast }: { setToast: (msg: string) => void }) {
  const today = new Date().toISOString().slice(0, 10);

  const makeDefault = (): KwitansiForm => ({
    nomorKwitansi:  generateNomorKwitansi(),
    perusahaan:     'bengkulutravel',
    namaPenerima:   '',
    alamatPenerima: '',
    noHp:           '',
    layanan:        'rental_sopir',
    tarif:          '',
    jumlahHari:     '1',
    tanggal:        today,
    pembayaran:     'tunai',
    catatan:        '',
    email:          '',
    showEmail:      false,
  });

  const [form, setForm]       = useState<KwitansiForm>(makeDefault());
  const [loading, setLoading] = useState<'print' | 'send' | null>(null);

  const tarif = parseFloat(form.tarif) || 0;
  const hari  = parseInt(form.jumlahHari) || 1;
  const total = tarif * hari;

  const set = (key: keyof KwitansiForm, val: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const resetForm = () => setForm(makeDefault());

  const handleSubmit = async (action: 'print' | 'send') => {
    if (!form.namaPenerima || !form.noHp || !tarif) {
      setToast('❌ Lengkapi nama penerima, no. HP dan tarif terlebih dahulu');
      return;
    }
    if (action === 'send' && !form.email) {
      setToast('❌ Masukkan email penerima untuk mengirim kwitansi');
      return;
    }

    setLoading(action);
    try {
      const res = await fetch('/api/admin/kwitansi', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          nomorKwitansi: form.nomorKwitansi,
          perusahaan:    form.perusahaan,
          penerima: {
            nama:   form.namaPenerima,
            alamat: form.alamatPenerima,
            noHp:   form.noHp,
          },
          layanan:    form.layanan,
          tarif,
          jumlahHari: hari,
          tanggal:    form.tanggal,
          pembayaran: form.pembayaran,
          catatan:    form.catatan || undefined,
          email:      action === 'send' ? form.email : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (action === 'print' && data.pdf) {
        const bytes = Uint8Array.from(atob(data.pdf), c => c.charCodeAt(0));
        const blob  = new Blob([bytes], { type: 'application/pdf' });
        const url   = URL.createObjectURL(blob);
        const a     = document.createElement('a');
        a.href      = url;
        a.download  = data.filename || `Kwitansi-${form.nomorKwitansi}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        setToast('🖨️ PDF berhasil diunduh, silakan cetak');
      } else {
        setToast(`📧 ${data.message}`);
      }

      // Generate nomor baru setelah berhasil
      set('nomorKwitansi', generateNomorKwitansi());

    } catch (err) {
      setToast(`❌ ${err instanceof Error ? err.message : 'Gagal generate kwitansi'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Header card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">🧾 Buat Kwitansi Manual</h2>
            <p className="text-blue-200 text-xs mt-0.5">Isi form, lalu cetak atau kirim via email</p>
          </div>
          <button
            onClick={resetForm}
            className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            ↺ Reset Form
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* 1. Pilih Perusahaan */}
          <section>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">1. Header Kwitansi</p>
            <div className="grid grid-cols-2 gap-3">
              {(['bengkulutravel', 'kgtransport'] as Perusahaan[]).map(p => (
                <button
                  key={p}
                  onClick={() => set('perusahaan', p)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all text-left ${
                    form.perusahaan === p
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="block font-bold">
                    {p === 'bengkulutravel' ? '🌐 BengkuluTravel.com' : '🚗 KG Transport'}
                  </span>
                  <span className="text-xs font-normal text-slate-400">
                    BTN Air Bang, Curup, Rejang Lebong
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Nomor Kwitansi */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">No. Kwitansi</span>
            <span className="font-mono text-sm font-bold text-blue-700 flex-1">{form.nomorKwitansi}</span>
            <button
              onClick={() => set('nomorKwitansi', generateNomorKwitansi())}
              className="text-xs text-slate-400 hover:text-blue-600 transition-colors"
              title="Generate ulang nomor"
            >
              🔄
            </button>
          </div>

          {/* 2. Data Penerima */}
          <section>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">2. Data Penerima</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nama lengkap penerima *"
                value={form.namaPenerima}
                onChange={e => set('namaPenerima', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Alamat penerima"
                value={form.alamatPenerima}
                onChange={e => set('alamatPenerima', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="tel"
                placeholder="No. HP / WhatsApp *"
                value={form.noHp}
                onChange={e => set('noHp', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </section>

          {/* 3. Isi Kwitansi */}
          <section>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">3. Isi Kwitansi</p>

            {/* Jenis layanan */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {([
                ['rental',       '🚗', 'Rental Mobil'],
                ['rental_sopir', '👨', 'Rental + Sopir'],
                ['all_in',       '⛽', 'All In'],
              ] as [Layanan, string, string][]).map(([val, icon, label]) => (
                <button
                  key={val}
                  onClick={() => set('layanan', val)}
                  className={`py-2.5 px-2 rounded-xl border-2 text-xs font-semibold transition-all flex flex-col items-center gap-0.5 ${
                    form.layanan === val
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Tarif & Hari */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1 font-medium">Tarif per Hari (Rp) *</label>
                <input
                  type="number"
                  placeholder="Contoh: 350000"
                  value={form.tarif}
                  onChange={e => set('tarif', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1 font-medium">Jumlah Hari</label>
                <input
                  type="number"
                  value={form.jumlahHari}
                  onChange={e => set('jumlahHari', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  min="1"
                />
              </div>
            </div>

            {/* Preview total */}
            {total > 0 && (
              <div className="bg-blue-600 text-white rounded-xl px-4 py-3 flex justify-between items-center">
                <span className="text-sm font-semibold">
                  {labelLayanan(form.layanan)} × {hari} hari
                </span>
                <span className="text-lg font-bold">{formatRp(total)}</span>
              </div>
            )}
          </section>

          {/* 4. Tanggal & Pembayaran */}
          <section>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">4. Tanggal & Pembayaran</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1 font-medium">Tanggal</label>
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={e => set('tanggal', e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1 font-medium">Jenis Pembayaran</label>
                <div className="flex gap-2 h-[42px]">
                  {(['tunai', 'transfer'] as Pembayaran[]).map(p => (
                    <button
                      key={p}
                      onClick={() => set('pembayaran', p)}
                      className={`flex-1 rounded-xl border-2 text-sm font-semibold transition-all ${
                        form.pembayaran === p
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      {p === 'tunai' ? '💵 Tunai' : '🏦 Transfer'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Catatan */}
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Catatan (opsional)</label>
            <input
              type="text"
              placeholder="Keterangan tambahan..."
              value={form.catatan}
              onChange={e => set('catatan', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* 5. Aksi */}
          <section className="pt-2 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit('print')}
                disabled={!!loading}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors"
              >
                {loading === 'print'
                  ? <span className="animate-pulse">Generating...</span>
                  : '🖨️ Cetak PDF'
                }
              </button>
              <button
                onClick={() => set('showEmail', !form.showEmail)}
                disabled={!!loading}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-60 ${
                  form.showEmail
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-50 text-blue-700 border-2 border-blue-200 hover:border-blue-400'
                }`}
              >
                📧 Kirim Email
              </button>
            </div>

            {/* Input email (muncul saat klik Kirim Email) */}
            {form.showEmail && (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email penerima *"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className="flex-1 border-2 border-blue-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  autoFocus
                />
                <button
                  onClick={() => handleSubmit('send')}
                  disabled={!!loading || !form.email}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-5 rounded-xl text-sm transition-colors"
                >
                  {loading === 'send' ? '...' : 'Kirim'}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Preview ringkasan */}
      {form.namaPenerima && total > 0 && (
        <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700 mb-2">📋 Ringkasan Kwitansi</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span>Dari</span>
            <span className="font-semibold text-slate-800 text-right">
              {form.perusahaan === 'bengkulutravel' ? 'BengkuluTravel.com' : 'KG Transport'}
            </span>
            <span>Untuk</span>
            <span className="font-semibold text-slate-800 text-right">{form.namaPenerima}</span>
            <span>Layanan</span>
            <span className="font-semibold text-slate-800 text-right">{labelLayanan(form.layanan)}</span>
            <span>Durasi</span>
            <span className="font-semibold text-slate-800 text-right">{hari} hari</span>
            <span>Bayar</span>
            <span className="font-semibold text-slate-800 text-right capitalize">{form.pembayaran}</span>
            <span className="font-bold text-slate-700">Total</span>
            <span className="font-bold text-blue-700 text-right">{formatRp(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN DASHBOARD (Main)
// ─────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();

  // State pesanan
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [confirming, setConfirming] = useState<string | null>(null);
  const [toast, setToast]           = useState('');
  const [filter, setFilter]         = useState<'all' | 'pending' | 'success'>('all');
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState<Order | null>(null);
  const [sendingInvoice, setSendingInvoice] = useState<string | null>(null);

  // ← TAB STATE (baru)
  const [activeTab, setActiveTab] = useState<'pesanan' | 'kwitansi'>('pesanan');

  // ── Ambil semua pesanan ──
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setError('Gagal memuat data pesanan');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // ── Konfirmasi pembayaran ──
  const handleConfirm = async (orderId: string) => {
    if (!confirm(`Konfirmasi pembayaran pesanan ${orderId}?\n\nTiket + PDF akan dikirim ke email pelanggan (jika ada).`)) return;
    setConfirming(orderId);
    try {
      const res = await fetch('/api/admin/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'success' } : o));
      if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status: 'success' } : null);

      setToast(`✅ ${data.message}`);
      setTimeout(() => setToast(''), 4000);

      if (data.waLink) {
        setTimeout(() => { window.open(data.waLink, '_blank'); }, 600);
      }
    } catch (err) {
      setToast(`❌ ${err instanceof Error ? err.message : 'Gagal konfirmasi'}`);
      setTimeout(() => setToast(''), 4000);
    } finally {
      setConfirming(null);
    }
  };

  // ── Kirim Invoice ──
  const handleSendInvoice = async (orderId: string, email: string | undefined) => {
    if (!email) {
      setToast('❌ Pelanggan tidak punya email, invoice tidak bisa dikirim');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    if (!confirm(`Kirim invoice ke ${email}?`)) return;

    setSendingInvoice(orderId);
    try {
      const res = await fetch('/api/admin/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setToast(`📧 ${data.message}`);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      setToast(`❌ ${err instanceof Error ? err.message : 'Gagal kirim invoice'}`);
      setTimeout(() => setToast(''), 4000);
    } finally {
      setSendingInvoice(null);
    }
  };

  // ── Logout ──
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // ── Filter & Search ──
  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.name.toLowerCase().includes(q) ||
      o.phone.includes(q) || o.route.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  // ── Stats ──
  const stats = {
    total:   orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    success: orders.filter(o => o.status === 'success').length,
    revenue: orders.filter(o => o.status === 'success').reduce((s, o) => s + o.harga, 0),
    qris:    orders.filter(o => o.paymentMethod === 'qris').length,
    tunai:   orders.filter(o => o.paymentMethod === 'tunai').length,
  };

  // ── Toast helper (untuk KwitansiTab) ──
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HEADER ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-none">Travel Bengkulu</p>
              <p className="text-slate-400 text-xs">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'pesanan' && (
              <button
                onClick={fetchOrders}
                className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Refresh"
              >
                🔄
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* ── JUDUL & TAB NAVIGASI (selalu tampil) ── */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="mb-4 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            Dashboard Admin Travel Bengkulu
          </h1>
          <p className="text-slate-400 text-sm mt-1 italic">karya Dekcik</p>
        </div>
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('pesanan')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
              activeTab === 'pesanan'
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'
            }`}
          >
            📋 Pesanan
          </button>
          <button
            onClick={() => setActiveTab('kwitansi')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
              activeTab === 'kwitansi'
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'
            }`}
          >
            🧾 Kwitansi
          </button>
        </div>
      </div>

      {/* ── KONTEN PESANAN ── */}
      {activeTab === 'pesanan' && (
        <div className="max-w-7xl mx-auto px-4 pb-6">

          {/* Catatan Admin */}
          <div className="mb-6 bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">📋</span>
              <div>
                <p className="font-bold text-amber-800 text-sm mb-2">Catatan untuk Admin — Kak DAYAT</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2 text-sm text-amber-900">
                    <span className="text-red-500 font-bold mt-0.5">⚠️</span>
                    <span>
                      <strong>Jangan tekan tombol Konfirmasi</strong> sebelum pembayaran masuk, karena tiket akan terkirim otomatis ke pelanggan kak.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-amber-900">
                    <span className="text-blue-500 font-bold mt-0.5">📧</span>
                    <span>
                      Tekan tombol <strong>Invoice</strong> saja jika sudah terima order.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {[
              { label: 'Total Pesanan', value: stats.total,            icon: '📋', color: 'text-slate-800' },
              { label: 'Menunggu',      value: stats.pending,           icon: '⏳', color: 'text-amber-600' },
              { label: 'Terkonfirmasi', value: stats.success,           icon: '✅', color: 'text-green-600' },
              { label: 'Pendapatan',    value: formatRp(stats.revenue), icon: '💰', color: 'text-primary-600' },
              { label: 'Via QRIS',      value: stats.qris,              icon: '📱', color: 'text-blue-600' },
              { label: 'Via Tunai',     value: stats.tunai,             icon: '💵', color: 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className={`font-bold text-xl ${s.color}`}>{s.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter & Search */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="🔍 Cari nama, HP, rute, atau ID..."
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex gap-2 shrink-0">
              {(['all', 'pending', 'success'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f === 'all' ? 'Semua' : f === 'pending' ? '⏳ Pending' : '✅ Sukses'}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              ⚠️ {error}
              <button onClick={fetchOrders} className="ml-auto text-red-600 hover:underline font-semibold">Coba lagi</button>
            </div>
          )}

          {/* Tabel Pesanan */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-sm">
                Daftar Pesanan <span className="text-slate-400 font-normal">({filtered.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Memuat pesanan...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-slate-500 text-sm">Belum ada pesanan</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        {['ID', 'Nama & HP', 'Email', 'Rute & Jam', 'Tanggal', 'Total Bayar', 'Status', 'Aksi'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filtered.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                              {order.id}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-800">{order.name}</p>
                            <a
                              href={waLink(order.phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-semibold mt-0.5"
                              title="Hubungi via WhatsApp"
                            >
                              💬 {order.phone}
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            {order.email ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                  ✅ Ada
                                </span>
                                <span className="text-xs text-slate-500 truncate max-w-[120px]" title={order.email}>
                                  {order.email}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-300 italic">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-slate-700">{order.route}</p>
                            <p className="text-slate-400 text-xs">{order.passengers} penumpang</p>
                            {(order as Order & { departureTime?: string }).departureTime && (
                              <p className="text-primary-600 text-xs font-semibold">
                                🕐 {(order as Order & { departureTime?: string }).departureTime}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600 text-xs">{order.date}</td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-primary-700">{formatRp(order.total)}</p>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              order.paymentMethod === 'tunai'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {order.paymentMethod === 'tunai' ? '💵 Tunai' : '📱 QRIS'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              <button
                                onClick={() => setSelected(order)}
                                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors font-medium"
                              >
                                Detail
                              </button>
                              <a
                                href={waTemplateLink(order)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold inline-flex items-center gap-1"
                                title={`WhatsApp ${order.phone}`}
                              >
                                💬 WA
                              </a>
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleConfirm(order.id)}
                                  disabled={confirming === order.id}
                                  className="text-xs bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold"
                                >
                                  {confirming === order.id ? '...' : '✅ Konfirmasi'}
                                </button>
                              )}
                              {order.email && (
                                <button
                                  onClick={() => handleSendInvoice(order.id, order.email)}
                                  disabled={sendingInvoice === order.id}
                                  className="text-xs bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold"
                                  title={`Kirim invoice ke ${order.email}`}
                                >
                                  {sendingInvoice === order.id ? '...' : '📧 Invoice'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-slate-100">
                  {filtered.map(order => (
                    <div key={order.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-slate-800">{order.name}</p>
                          <a
                            href={waTemplateLink(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-semibold"
                          >
                            💬 {order.phone}
                          </a>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-slate-700 mb-0.5">📍 {order.route}</p>
                      {(order as Order & { departureTime?: string }).departureTime && (
                        <p className="text-xs text-primary-600 font-semibold mb-0.5">
                          🕐 {(order as Order & { departureTime?: string }).departureTime}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mb-3">📅 {order.date} · {order.passengers} orang</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-primary-700">{formatRp(order.total)}</p>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          <button
                            onClick={() => setSelected(order)}
                            className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-medium"
                          >
                            Detail
                          </button>
                          <a
                            href={waTemplateLink(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold inline-flex items-center gap-1"
                          >
                            💬 WA
                          </a>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleConfirm(order.id)}
                              disabled={confirming === order.id}
                              className="text-xs bg-primary-600 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg font-semibold"
                            >
                              {confirming === order.id ? '...' : '✅ Konfirmasi'}
                            </button>
                          )}
                          {order.email && (
                            <button
                              onClick={() => handleSendInvoice(order.id, order.email)}
                              disabled={sendingInvoice === order.id}
                              className="text-xs bg-blue-500 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg font-semibold"
                            >
                              {sendingInvoice === order.id ? '...' : '📧 Invoice'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      )}

      {/* ── KONTEN KWITANSI (baru) ── */}
      {activeTab === 'kwitansi' && (
        <KwitansiTab setToast={showToast} />
      )}

      {/* ── MODAL DETAIL PESANAN ── */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}>

            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800">Detail Pesanan</h3>
                <p className="text-xs text-slate-400 font-mono">{selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>

            <div className="p-5 space-y-4">
              <StatusBadge status={selected.status} />

              {[
                { label: 'Nama',          value: selected.name },
                { label: 'No. HP',        value: selected.phone },
                { label: 'Email',         value: selected.email || '—' },
                { label: 'Rute',          value: selected.route },
                { label: 'Jam Berangkat', value: (selected as Order & { departureTime?: string }).departureTime || '—' },
                { label: 'Tanggal',       value: selected.date },
                { label: 'Penumpang',     value: `${selected.passengers} orang` },
                { label: 'Jemput di',     value: selected.pickup },
                { label: 'Antar ke',      value: selected.dropoff || '—' },
                { label: 'Harga',         value: formatRp(selected.harga) },
                { label: 'Kode Unik',     value: `+${selected.kodeUnik}` },
                { label: 'Total Bayar',   value: formatRp(selected.total) },
                { label: 'Metode Bayar',  value: selected.paymentMethod === 'tunai' ? '💵 Tunai' : '📱 QRIS' },
                { label: 'Waktu Pesan',   value: new Date(selected.createdAt).toLocaleString('id-ID') },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm py-1 border-b border-slate-50 last:border-0">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[60%]">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="p-5 pt-0 flex flex-wrap gap-2">
              <a
                href={waTemplateLink(selected)}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center text-sm transition-colors"
              >
                💬 WA + Pesan Otomatis
              </a>
              {selected.status === 'pending' && (
                <button
                  onClick={() => { handleConfirm(selected.id); setSelected(null); }}
                  disabled={confirming === selected.id}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  ✅ Konfirmasi & Kirim Tiket
                </button>
              )}
              {selected.email && (
                <button
                  onClick={() => { handleSendInvoice(selected.id, selected.email); setSelected(null); }}
                  disabled={sendingInvoice === selected.id}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  📧 Kirim Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl transition-all ${
          toast.startsWith('✅') || toast.startsWith('📧') || toast.startsWith('🖨️')
            ? 'bg-green-600'
            : 'bg-red-600'
        }`}>
          {toast}
        </div>
      )}
    </div>
  );
}
