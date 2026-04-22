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
  const [showReset, setShowReset]   = useState(false);
  const [resetMode, setResetMode]   = useState<'archive' | 'clear'>('archive');
  const [resetText, setResetText]   = useState('');
  const [resetting, setResetting]   = useState(false);
  const [storage, setStorage]       = useState<{ totalOrders: number; usedMemory: string; archives: Record<string, number> } | null>(null);

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

  useEffect(() => { fetchOrders(); fetchStorage(); }, [fetchOrders]);

  // ── Ambil info storage Redis ──
  const fetchStorage = async () => {
    try {
      const res = await fetch('/api/admin/reset');
      if (res.ok) {
        const data = await res.json();
        setStorage(data);
      }
    } catch { /* abaikan error storage */ }
  };

  // ── Reset data ──
  const handleReset = async () => {
    if (resetText !== 'RESET KONFIRMASI') {
      setToast('❌ Teks konfirmasi salah!');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    setResetting(true);
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: resetMode, confirmText: resetText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrders([]);
      setShowReset(false);
      setResetText('');
      fetchStorage();
      setToast(`✅ ${data.message}`);
      setTimeout(() => setToast(''), 5000);
    } catch (err) {
      setToast(`❌ ${err instanceof Error ? err.message : 'Gagal reset'}`);
      setTimeout(() => setToast(''), 4000);
    } finally {
      setResetting(false);
    }
  };

  // ── Konfirmasi pembayaran ──
  const handleConfirm = async (orderId: string) => {
    if (!confirm(`Konfirmasi pembayaran pesanan ${orderId}?\n\nTiket akan dikirim ke email pelanggan.`)) return;
    setConfirming(orderId);
    try {
      const res = await fetch('/api/admin/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Update state lokal
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'success' } : o));
      if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status: 'success' } : null);

      setToast(`✅ ${data.message}`);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      setToast(`❌ ${err instanceof Error ? err.message : 'Gagal konfirmasi'}`);
      setTimeout(() => setToast(''), 4000);
    } finally {
      setConfirming(null);
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
            {storage && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                💾 {storage.usedMemory}
              </span>
            )}
            <button
              onClick={fetchOrders}
              className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Refresh"
            >
              🔄
            </button>
            <button
              onClick={() => { setShowReset(true); setResetText(''); }}
              className="text-sm text-slate-500 hover:text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors font-medium"
              title="Reset Data"
            >
              🗃️ Reset
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
                      {['ID', 'Nama & HP', 'Email', 'Rute', 'Tanggal', 'Total Bayar', 'Status', 'Aksi'].map(h => (
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
                          <p className="text-slate-400 text-xs">{order.phone}</p>
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelected(order)}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors font-medium"
                            >
                              Detail
                            </button>
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleConfirm(order.id)}
                                disabled={confirming === order.id}
                                className="text-xs bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold"
                              >
                                {confirming === order.id ? '...' : '✅ Konfirmasi'}
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
                        <p className="text-slate-500 text-xs">{order.phone}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-slate-700 mb-1">📍 {order.route}</p>
                    <p className="text-xs text-slate-400 mb-2">📅 {order.date} · {order.passengers} orang</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-primary-700">{formatRp(order.total)}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(order)}
                          className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-medium"
                        >
                          Detail
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleConfirm(order.id)}
                            disabled={confirming === order.id}
                            className="text-xs bg-green-500 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg font-semibold"
                          >
                            {confirming === order.id ? '...' : '✅ Konfirmasi'}
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

      {/* ── MODAL RESET DATA ── */}
      {showReset && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowReset(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>

            <div className="bg-orange-50 border-b border-orange-200 p-5">
              <h3 className="font-bold text-orange-800 text-lg flex items-center gap-2">
                🗃️ Reset Data Pesanan
              </h3>
              <p className="text-orange-600 text-sm mt-1">
                Gunakan fitur ini untuk membersihkan data setiap bulan.
              </p>
            </div>

            <div className="p-5 space-y-4">

              {/* Info arsip yang ada */}
              {storage && Object.keys(storage.archives).length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">📦 Arsip Tersimpan</p>
                  {Object.entries(storage.archives).map(([key, count]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-slate-600 font-mono">{key}</span>
                      <span className="text-slate-800 font-semibold">{count} pesanan</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pilih mode */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">Mode Reset:</p>
                <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${resetMode === 'archive' ? 'border-primary-500 bg-primary-50' : 'border-slate-200'}`}>
                  <input type="radio" name="resetMode" value="archive"
                    checked={resetMode === 'archive'}
                    onChange={() => setResetMode('archive')}
                    className="mt-0.5 accent-primary-600" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">📦 Arsipkan & Bersihkan</p>
                    <p className="text-slate-500 text-xs">Data dipindah ke arsip bulan ini (tersimpan 1 tahun) lalu tabel aktif dibersihkan. Direkomendasikan!</p>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${resetMode === 'clear' ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}>
                  <input type="radio" name="resetMode" value="clear"
                    checked={resetMode === 'clear'}
                    onChange={() => setResetMode('clear')}
                    className="mt-0.5 accent-red-600" />
                  <div>
                    <p className="font-semibold text-red-700 text-sm">🗑️ Hapus Permanen</p>
                    <p className="text-slate-500 text-xs">Data dihapus selamanya, tidak bisa dikembalikan. Gunakan hanya jika perlu.</p>
                  </div>
                </label>
              </div>

              {/* Konfirmasi teks */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-1.5">
                  Ketik <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-red-600">RESET KONFIRMASI</span> untuk lanjut:
                </p>
                <input
                  type="text"
                  value={resetText}
                  onChange={e => setResetText(e.target.value)}
                  placeholder="RESET KONFIRMASI"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Total pesanan yang akan direset */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-amber-800 text-sm">
                  ⚠️ <strong>{orders.length} pesanan</strong> akan {resetMode === 'archive' ? 'diarsipkan dan dibersihkan' : 'dihapus permanen'}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 flex gap-3">
              <button onClick={() => setShowReset(false)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm">
                Batal
              </button>
              <button
                onClick={handleReset}
                disabled={resetting || resetText !== 'RESET KONFIRMASI'}
                className={`flex-1 font-bold py-3 rounded-xl transition-colors text-sm text-white disabled:opacity-50 ${
                  resetMode === 'clear' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'
                }`}>
                {resetting ? '⏳ Memproses...' : resetMode === 'archive' ? '📦 Arsipkan & Bersihkan' : '🗑️ Hapus Permanen'}
              </button>
            </div>
          </div>
        </div>
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
                { label: 'Nama', value: selected.name },
                { label: 'No. HP', value: selected.phone },
                { label: 'Email', value: selected.email || '—' },
                { label: 'Rute', value: selected.route },
                { label: 'Tanggal', value: selected.date },
                { label: 'Penumpang', value: `${selected.passengers} orang` },
                { label: 'Jemput di', value: selected.pickup },
                { label: 'Antar ke', value: selected.dropoff || '—' },
                { label: 'Harga', value: formatRp(selected.harga) },
                { label: 'Kode Unik', value: `+${selected.kodeUnik}` },
                { label: 'Total Bayar', value: formatRp(selected.total) },
                { label: 'Metode Bayar', value: selected.paymentMethod === 'tunai' ? '💵 Tunai' : '📱 QRIS' },
              { label: 'Waktu Pesan', value: new Date(selected.createdAt).toLocaleString('id-ID') },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-sm py-1 border-b border-slate-50 last:border-0">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[60%]">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="p-5 pt-0 flex gap-3">
              <a
                href={`https://wa.me/${selected.phone.replace(/\D/g,'')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-center text-sm transition-colors"
              >
                💬 WhatsApp
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
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-xl transition-all ${
          toast.startsWith('✅') ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast}
        </div>
      )}
    </div>
  );
}
