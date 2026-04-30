'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/lib/orders';

// ── Helpers ────────────────────────────────────────────────────────
function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(n);
}

function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  if (!digits.startsWith('62')) digits = '62' + digits;
  return digits;
}

// ── Status Badge ───────────────────────────────────────────────────
function StatusBadge({ status }: { status: Order['status'] }) {
  if (status === 'success') return (
    <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full border border-green-500/30">
      ✓ LUNAS
    </span>
  );
  if (status === 'cancelled') return (
    <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 text-xs font-bold px-2.5 py-1 rounded-full border border-red-500/30">
      ✕ BATAL
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2.5 py-1 rounded-full border border-yellow-500/30">
      ⏳ MENUNGGU
    </span>
  );
}

// ── WA Template Links ──────────────────────────────────────────────
function waTemplateLink(order: Order): string {
  const dep = (order as Order & { departureTime?: string }).departureTime;
  const lines = [
    `Assalamualaikum / Halo *${order.name}*,`,
    ``,
    `Berikut detail pesanan Anda di *Travel Bengkulu*:`,
    ``,
    `🚗 Rute     : ${order.route}`,
    `📅 Tanggal  : ${order.date}`,
    dep ? `🕐 Jam      : ${dep}` : '',
    `👥 Penumpang: ${order.passengers} orang`,
    `📍 Jemput   : ${order.pickup}`,
    order.dropoff ? `🏁 Tujuan   : ${order.dropoff}` : '',
    `💰 Total    : ${formatRp(order.total)}`,
    `No. Pesanan : *${order.id}*`,
    ``,
    order.status === 'success'
      ? `Status: *Pembayaran Dikonfirmasi ✅*`
      : `Status: *Menunggu Konfirmasi ⏳*`,
    ``,
    `Terima kasih telah mempercayai Travel Bengkulu 🙏`,
  ].filter(Boolean).join('\n');
  return `https://wa.me/${normalizePhone(order.phone)}?text=${encodeURIComponent(lines)}`;
}

// ── Icon WhatsApp SVG ──────────────────────────────────────────────
function WaIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Order Card ─────────────────────────────────────────────────────
function OrderCard({ order, onRefresh }: { order: Order; onRefresh: () => void }) {
  const [confirming, setConfirming]         = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [toast, setToast]                   = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleConfirm = async () => {
    if (!confirm(`Konfirmasi pembayaran pesanan ${order.id}?\n\nTiket PDF akan dikirim ke email pelanggan.`)) return;
    setConfirming(true);
    try {
      const res  = await fetch('/api/admin/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('✅ Dikonfirmasi, tiket terkirim');
      onRefresh();
    } catch (err) {
      showToast(`❌ ${err instanceof Error ? err.message : 'Gagal'}`);
    } finally {
      setConfirming(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!order.email) { showToast('⚠️ Email tidak tersedia'); return; }
    setSendingInvoice(true);
    try {
      const res  = await fetch('/api/admin/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(`📧 Invoice dikirim ke ${order.email}`);
    } catch (err) {
      showToast(`❌ ${err instanceof Error ? err.message : 'Gagal'}`);
    } finally {
      setSendingInvoice(false);
    }
  };

  const dep = (order as Order & { departureTime?: string }).departureTime;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative hover:border-sky-500/30 transition-all duration-200">
      {/* Toast per-card */}
      {toast && (
        <div className="absolute top-3 right-3 bg-slate-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg z-10 animate-in fade-in duration-200">
          {toast}
        </div>
      )}

      {/* Baris atas */}
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-sky-400 text-xs font-bold">{order.id}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-white font-semibold">{order.name}</p>
          {order.phone && (
            <a
              href={`https://wa.me/${normalizePhone(order.phone)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-slate-400 hover:text-green-400 text-xs mt-0.5 transition-colors inline-flex items-center gap-1"
            >
              <WaIcon /> {order.phone}
            </a>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-white font-bold text-lg">{formatRp(order.total)}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            order.paymentMethod === 'tunai'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            {order.paymentMethod === 'tunai' ? '💵 TUNAI' : '📱 QRIS'}
          </span>
        </div>
      </div>

      {/* Detail */}
      <div className="bg-white/5 rounded-lg px-3 py-2.5 mb-4 text-xs text-slate-300 space-y-1">
        <p>🚗 {order.route}</p>
        <p>📅 {order.date}{dep ? ` · 🕐 ${dep}` : ''}</p>
        <p>👥 {order.passengers} penumpang · Jemput: {order.pickup}</p>
        {order.dropoff && <p>🏁 Tujuan: {order.dropoff}</p>}
        {order.email && <p>📧 {order.email}</p>}
      </div>

      {/* Tombol aksi */}
      <div className="flex flex-wrap gap-2">
        {order.status === 'pending' && (
          <button
            onClick={handleConfirm} disabled={confirming}
            className="inline-flex items-center gap-1.5 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs px-3 py-1.5 font-semibold transition-all disabled:opacity-50"
          >
            {confirming ? '⏳' : '✅'} Konfirmasi Lunas
          </button>
        )}
        <button
          onClick={handleSendInvoice} disabled={sendingInvoice || !order.email}
          className="inline-flex items-center gap-1.5 bg-sky-500/20 hover:bg-sky-500/40 text-sky-400 border border-sky-500/30 rounded-lg text-xs px-3 py-1.5 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title={!order.email ? 'Email tidak tersedia' : ''}
        >
          {sendingInvoice ? '⏳' : '📄'} Email Invoice
        </button>
        <a
          href={waTemplateLink(order)}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs px-3 py-1.5 font-semibold transition-all"
        >
          <WaIcon /> WA Pelanggan
        </a>
      </div>
    </div>
  );
}

// ── Tab: Orders ────────────────────────────────────────────────────
function OrdersTab() {
  const router = useRouter();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<'all' | 'pending' | 'success'>('all');
  const [search, setSearch]   = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  // Auto-refresh setiap 30 detik
  useEffect(() => {
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.name.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.route.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const stats = {
    total:   orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    success: orders.filter(o => o.status === 'success').length,
    revenue: orders.filter(o => o.status === 'success').reduce((s, o) => s + o.harga, 0),
    qris:    orders.filter(o => o.paymentMethod === 'qris').length,
    tunai:   orders.filter(o => o.paymentMethod === 'tunai').length,
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Total Pesanan', value: String(stats.total),          icon: '📋', color: 'text-white' },
          { label: 'Menunggu',      value: String(stats.pending),        icon: '⏳', color: 'text-yellow-400' },
          { label: 'Dikonfirmasi',  value: String(stats.success),        icon: '✅', color: 'text-green-400' },
          { label: 'Pendapatan',    value: formatRp(stats.revenue),      icon: '💰', color: 'text-sky-400' },
          { label: 'Via QRIS',      value: String(stats.qris),           icon: '📱', color: 'text-blue-400' },
          { label: 'Via Tunai',     value: String(stats.tunai),          icon: '💵', color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-1">{s.icon} {s.label}</p>
            <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Catatan Admin */}
      <div className="mb-5 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <p className="font-bold text-amber-400 text-sm mb-2">📋 Catatan — Kak DAYAT</p>
        <div className="space-y-1 text-xs text-amber-200/80">
          <p><span className="text-red-400">⚠️</span> <strong>Jangan tekan Konfirmasi</strong> sebelum pembayaran masuk — tiket otomatis terkirim ke pelanggan.</p>
          <p><span className="text-sky-400">📧</span> Tekan <strong>Email Invoice</strong> setelah menerima order untuk kirim tagihan.</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex rounded-xl overflow-hidden border border-white/20">
          {(['all', 'pending', 'success'] as const).map(f => (
            <button
              key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-sky-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Semua' : f === 'pending' ? '⏳ Menunggu' : '✅ Lunas'}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Cari nama / ID / rute / HP..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          onClick={fetchOrders}
          className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg border border-white/20 transition-all"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Daftar */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-4xl mb-3 animate-pulse">⏳</div>
          <p>Memuat pesanan...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white/5 rounded-2xl border border-white/10">
          <div className="text-4xl mb-3">📭</div>
          <p className="font-medium">Tidak ada pesanan</p>
          <p className="text-xs mt-1">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} onRefresh={fetchOrders} />
          ))}
        </div>
      )}

      {/* Panduan */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-slate-400">
        <p className="font-semibold text-slate-300 mb-2">📌 Panduan Tombol:</p>
        <div className="space-y-1">
          <p><span className="text-yellow-400">✅ Konfirmasi Lunas</span> — Ubah status ke Lunas, tiket PDF otomatis terkirim ke email pelanggan.</p>
          <p><span className="text-sky-400">📄 Email Invoice</span> — Kirim invoice ke email pelanggan.</p>
          <p><span className="text-emerald-400">WA Pelanggan</span> — Buka WhatsApp dengan template pesan detail pesanan.</p>
        </div>
      </div>
    </>
  );
}

// ── Tab: Kwitansi (placeholder — gunakan KwitansiTab.tsx yang sudah dibuat) ──
function KwitansiTabPlaceholder() {
  return (
    <div className="text-center py-20 text-slate-500 bg-white/5 rounded-2xl border border-white/10">
      <div className="text-4xl mb-3">🧾</div>
      <p className="font-medium text-slate-300">Tab Kwitansi</p>
      <p className="text-xs mt-1">Import komponen KwitansiTab dari file terpisah</p>
      <p className="text-xs mt-0.5 text-slate-600 font-mono">import KwitansiTab from &apos;./KwitansiTab&apos;</p>
    </div>
  );
}

// ── Tab: Update Tarif (placeholder — sesuaikan dengan RatesTab yang sudah ada) ──
function RatesTabPlaceholder() {
  return (
    <div className="text-center py-20 text-slate-500 bg-white/5 rounded-2xl border border-white/10">
      <div className="text-4xl mb-3">💰</div>
      <p className="font-medium text-slate-300">Tab Update Tarif</p>
      <p className="text-xs mt-1">Sambungkan ke komponen tarif yang sudah ada</p>
    </div>
  );
}

// ── Main AdminDashboard ────────────────────────────────────────────
type ActiveTab = 'orders' | 'kwitansi' | 'tarif';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab]         = useState<ActiveTab>('orders');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [globalToast, setGlobalToast]     = useState('');

  const handleLogout = async () => {
    setLogoutLoading(true);
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'orders',   label: 'Pesanan',      icon: '📋' },
    { id: 'kwitansi', label: 'Kwitansi',     icon: '🧾' },
    { id: 'tarif',    label: 'Update Tarif', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">🚗 Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Travel Bengkulu — Panel Manajemen</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout} disabled={logoutLoading}
              className="text-sm bg-red-600/30 hover:bg-red-600/60 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg border border-red-500/30 transition-all disabled:opacity-50"
            >
              {logoutLoading ? '⏳' : '🚪'} Keluar
            </button>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="flex rounded-xl overflow-hidden border border-white/20 mb-6 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === 'orders'   && <OrdersTab />}
        {activeTab === 'kwitansi' && <KwitansiTabPlaceholder />}
        {activeTab === 'tarif'    && <RatesTabPlaceholder />}

      </div>

      {/* ── Global Toast ── */}
      {globalToast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl ${
          globalToast.startsWith('❌') ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {globalToast}
        </div>
      )}
    </div>
  );
}
