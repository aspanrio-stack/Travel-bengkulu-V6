'use client';
// src/app/admin/RatesTab.tsx
//
// Tab "Update Tarif" — setara dengan RatesTab pada dashboard RPM Travel.
// Admin bisa ubah harga tiap rute travel & paket sewa langsung dari browser,
// tanpa sentuh kode. Data disimpan ke Redis via POST /api/admin/rates.

import { useState, useEffect, useCallback } from 'react';
import type { PriceItem } from '@/lib/rates';

// lib/orders.ts imports ioredis at module scope, so it can't be imported
// from a client component (breaks the browser bundle: ioredis needs Node's
// tls/net). Keep a local formatter here instead, same as RPM's RatesTab.
function formatRp(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(amount);
}

// ── Input harga dengan format ribuan otomatis ──────────────────
function HargaInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  const [raw, setRaw] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setRaw(String(value));
  }, [value, focused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    setRaw(digits);
    onChange(digits === '' ? 0 : parseInt(digits, 10));
  };

  const display = focused ? raw : value === 0 ? '' : value.toLocaleString('id-ID');

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-slate-400 text-sm font-medium select-none">Rp</span>
      <input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        value={display}
        onFocus={() => { setFocused(true); setRaw(String(value)); }}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        placeholder="0"
        className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800
                   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      />
    </div>
  );
}

// ── Satu baris tarif ────────────────────────────────────────────
function PriceRow({
  item,
  index,
  onChange,
  isDirty,
}: {
  item: PriceItem;
  index: number;
  onChange: (index: number, harga: number) => void;
  isDirty: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_180px] gap-3 items-center
                  p-4 rounded-xl border transition-all
                  ${isDirty
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'}`}
    >
      {/* Info rute/paket */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              item.kategori === 'sewa'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {item.kategori === 'sewa' ? '🚐 Sewa' : '🚌 Travel'}
          </span>
          {isDirty && (
            <span className="text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300 px-2 py-0.5 rounded-full">
              ✏️ Diubah
            </span>
          )}
        </div>
        <p className="text-slate-800 font-semibold text-sm mt-1 truncate">{item.label}</p>
        {item.keterangan && (
          <p className="text-slate-400 text-xs mt-0.5 truncate">{item.keterangan}</p>
        )}
      </div>

      {/* Satuan */}
      <span className="text-slate-400 text-sm text-right sm:text-center whitespace-nowrap hidden sm:block">
        {item.satuanLabel}
      </span>

      {/* Input harga */}
      <div>
        <HargaInput value={item.harga} onChange={(v) => onChange(index, v)} />
        <p className="text-slate-400 text-xs mt-1 text-right">
          = {formatRp(item.harga)}{item.satuanLabel}
        </p>
      </div>
    </div>
  );
}

// ── Main RatesTab ──────────────────────────────────────────────
export default function RatesTab({ setToast }: { setToast: (msg: string) => void }) {
  const [items, setItems]       = useState<PriceItem[]>([]);
  const [original, setOriginal] = useState<PriceItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [filter, setFilter]     = useState<'all' | 'travel' | 'sewa'>('all');

  // ── Fetch tarif dari API ───────────────────────────────────
  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/rates');
      const data = await res.json();
      setItems(data.rates ?? []);
      setOriginal(data.rates ?? []);
    } catch {
      setToast('❌ Gagal memuat tarif');
    } finally {
      setLoading(false);
    }
  }, [setToast]);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  // ── Update harga satu item ─────────────────────────────────
  const handleChange = (index: number, harga: number) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], harga };
      return next;
    });
  };

  // ── Reset ke nilai semula ──────────────────────────────────
  const handleReset = () => {
    setItems(original.map((p) => ({ ...p })));
    setToast('↩️ Semua tarif direset ke nilai tersimpan');
  };

  // ── Simpan ke server ───────────────────────────────────────
  const handleSave = async () => {
    const zeroPriced = items.filter((p) => p.harga === 0);
    if (zeroPriced.length > 0) {
      setToast(`⚠️ Harga tidak boleh Rp 0: ${zeroPriced.map((p) => p.label).join(', ')}`);
      return;
    }

    if (!confirm('Simpan perubahan tarif? Harga baru langsung tampil di dashboard.')) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/rates', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ rates: items }),
      });
      if (res.ok) {
        setOriginal(items.map((p) => ({ ...p })));
        setToast('✅ Tarif berhasil disimpan!');
      } else {
        const err = await res.json();
        setToast(`❌ ${err.error ?? 'Gagal menyimpan'}`);
      }
    } catch {
      setToast('❌ Koneksi bermasalah, coba lagi');
    } finally {
      setSaving(false);
    }
  };

  // ── Cek perubahan ──────────────────────────────────────────
  const dirtyIndices = new Set(
    items
      .map((p, i) => (p.harga !== original[i]?.harga ? i : -1))
      .filter((i) => i >= 0)
  );
  const hasDirty = dirtyIndices.size > 0;

  const filteredIndices = items
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => (filter === 'all' ? true : p.kategori === filter))
    .map(({ i }) => i);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 pb-6">

      {/* Header tab */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-5">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-white font-bold text-lg">💰 Update Tarif</h2>
            <p className="text-blue-200 text-xs mt-0.5">
              Ubah harga tiap rute travel & paket sewa. Klik Simpan agar langsung tampil.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={!hasDirty || saving}
              className="text-sm bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed
                         text-white px-4 py-2 rounded-xl border border-white/20 transition-all"
            >
              ↩️ Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!hasDirty || saving}
              className="text-sm font-bold bg-white hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed
                         text-blue-700 px-5 py-2 rounded-xl transition-all"
            >
              {saving ? 'Menyimpan...' : `💾 Simpan Tarif${hasDirty ? ` (${dirtyIndices.size})` : ''}`}
            </button>
          </div>
        </div>
      </div>

      {/* Banner perubahan belum disimpan */}
      {hasDirty && (
        <div className="mb-4 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
          ⚠️ Ada <strong>{dirtyIndices.size} item</strong> yang belum disimpan.
          Klik <strong>Simpan Tarif</strong> agar perubahan berlaku.
        </div>
      )}

      {/* Filter kategori */}
      <div className="flex gap-2 mb-5">
        {(['all', 'travel', 'sewa'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
              filter === f
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'
            }`}
          >
            {f === 'all' ? '📋 Semua' : f === 'travel' ? '🚌 Travel' : '🚐 Sewa'}
          </button>
        ))}
      </div>

      {/* Daftar tarif */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-3xl mb-3 animate-pulse">⏳</div>
          <p className="text-sm">Memuat data tarif...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIndices.map((realIndex) => (
            <PriceRow
              key={items[realIndex].id}
              item={items[realIndex]}
              index={realIndex}
              onChange={handleChange}
              isDirty={dirtyIndices.has(realIndex)}
            />
          ))}
        </div>
      )}

      {/* Panduan */}
      {!loading && (
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-600 mb-2">📌 Cara mengubah tarif:</p>
          <p>1. Klik kolom harga pada rute/paket yang ingin diubah</p>
          <p>2. Ketik harga baru (angka saja, tanpa titik/koma)</p>
          <p>3. Klik tombol <strong className="text-slate-700">💾 Simpan Tarif</strong></p>
          <p className="text-amber-600 mt-2">
            ⚠️ Harga di sini merapikan tampilan dashboard. Form pemesanan di website masih
            memakai harga tetap di routes.ts / rental-config.ts sampai disambungkan ke tarif ini.
          </p>
        </div>
      )}
    </div>
  );
}
