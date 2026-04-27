'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/lib/orders';

// Format Rupiah
function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

// Badge status pesanan
function StatusBadge({ status }: { status: Order['status'] }) {
  const map = {
    pending:   { label: 'Menunggu',    cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    success:   { label: 'Dikonfirmasi', cls: 'bg-green-100 text-green-700 border-green-200' },
    cancelled: { label: 'Dibatalkan',  cls: 'bg-red-100 text-red-700 border-red-200' },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

/** Normalkan nomor HP ke format internasional 62xxx untuk wa.me */
function normalizePhone(phone: string): string {
  // Hapus semua karakter selain angka
  let digits = phone.replace(/\D/g, '');
  // Jika diawali 0, ganti dengan 62
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  // Jika belum diawali 62, tambahkan
  if (!digits.startsWith('62')) digits = '62' + digits;
  return digits;
}

/** Buka WhatsApp ke nomor pemesan (chat kosong) */
function waLink(phone: string) {
  return `https://wa.me/${normalizePhone(phone)}`;
}

/** Buka WhatsApp dengan template pesan detail pesanan */
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

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [confirming, setConfirming] = useState<string | null>(null);
  const [toast, setToast]           = useState('');
  const [filter, setFilter]         = useState<'all' | 'pending' | 'success'>('all');
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState<Order | null>(null);
  const [sendingInvoice, setSendingInvoice] = useState<string | null>(null);

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

      // Buka WhatsApp dengan template pesan konfirmasi otomatis
      if (data.waLink) {
        setTimeout(() => {
          window.open(data.waLink, '_blank');
        }, 600);
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
            <button
              onClick={fetchOrders}
              className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Refresh"
            >
              🔄
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Total Pesanan', value: stats.total, icon: '📋', color: 'text-slate-800' },
            { label: 'Menunggu', value: stats.pending, icon: '⏳', color: 'text-amber-600' },
            { label: 'Terkonfirmasi', value: stats.success, icon: '✅', color: 'text-green-600' },
            { label: 'Pendapatan', value: formatRp(stats.revenue), icon: '💰', color: 'text-primary-600' },
            { label: 'Via QRIS', value: stats.qris, icon: '📱', color: 'text-blue-600' },
            { label: 'Via Tunai', value: stats.tunai, icon: '💵', color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className={`font-bold text-xl ${s.color}`}>{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── FILTER & SEARCH ── */}
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

        {/* ── ERROR ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
            ⚠️ {error}
            <button onClick={fetchOrders} className="ml-auto text-red-600 hover:underline font-semibold">Coba lagi</button>
          </div>
        )}

        {/* ── TABEL PESANAN ── */}
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
                          {/* ── Tombol WA langsung di baris tabel ── */}
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
                          {/* Tampilkan jam keberangkatan jika ada */}
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
                            {/* Tombol WA konfirmasi langsung */}
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
                        {/* ── Tombol WA di mobile card ── */}
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
                        <
