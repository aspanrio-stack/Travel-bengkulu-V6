'use client';

/**
 * KwitansiTab — Tab form kwitansi manual untuk Dashboard Admin
 *
 * Cara integrasi ke page.tsx:
 * 1. Import komponen ini:
 *    import { KwitansiTab } from './KwitansiTab';
 *
 * 2. Tambah state tab di AdminDashboard:
 *    const [activeTab, setActiveTab] = useState<'pesanan' | 'kwitansi'>('pesanan');
 *
 * 3. Di JSX header, tambah tombol tab:
 *    <button onClick={() => setActiveTab('pesanan')} className={activeTab==='pesanan' ? 'tab-active' : 'tab'}>Pesanan</button>
 *    <button onClick={() => setActiveTab('kwitansi')} className={activeTab==='kwitansi' ? 'tab-active' : 'tab'}>🧾 Kwitansi</button>
 *
 * 4. Tampilkan kondisional:
 *    {activeTab === 'pesanan' && <...existing pesanan JSX...>}
 *    {activeTab === 'kwitansi' && <KwitansiTab setToast={setToast} />}
 *
 * Lokasi file: app/admin/KwitansiTab.tsx
 */

import { useState, useCallback } from 'react';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatRp(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(n);
}

function generateNomorKwitansi(): string {
  const now  = new Date();
  const yy   = String(now.getFullYear()).slice(2);
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `KWT-${yy}${mm}${dd}-${rand}`;
}

type Layanan    = 'rental' | 'rental_sopir' | 'all_in';
type Pembayaran = 'tunai' | 'transfer';
type Perusahaan = 'bengkulutravel' | 'kgtransport';

interface KwitansiForm {
  nomorKwitansi: string;
  perusahaan:    Perusahaan;
  namaPenerima:  string;
  alamatPenerima:string;
  noHp:          string;
  layanan:       Layanan;
  tarif:         string;   // string agar bisa input kosong
  jumlahHari:    string;
  tanggal:       string;
  pembayaran:    Pembayaran;
  catatan:       string;
  email:         string;
  showEmail:     boolean;
}

// ─────────────────────────────────────────────
// Komponen utama
// ─────────────────────────────────────────────
export function KwitansiTab({ setToast }: { setToast: (msg: string) => void }) {
  const today = new Date().toISOString().slice(0, 10);

  const defaultForm: KwitansiForm = {
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
  };

  const [form, setForm]       = useState<KwitansiForm>(defaultForm);
  const [loading, setLoading] = useState<'print' | 'send' | null>(null);

  const tarif     = parseFloat(form.tarif.replace(/\D/g, '')) || 0;
  const hari      = parseInt(form.jumlahHari) || 1;
  const total     = tarif * hari;

  const set = (key: keyof KwitansiForm, val: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const resetForm = useCallback(() => {
    setForm({ ...defaultForm, nomorKwitansi: generateNomorKwitansi() });
  }, []); // eslint-disable-line

  // ── Submit ──
  const handleSubmit = async (action: 'print' | 'send') => {
    if (!form.namaPenerima || !form.noHp || !tarif) {
      setToast('❌ Lengkapi data penerima dan tarif terlebih dahulu');
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
        // Download PDF di browser
        const bytes  = Uint8Array.from(atob(data.pdf), c => c.charCodeAt(0));
        const blob   = new Blob([bytes], { type: 'application/pdf' });
        const url    = URL.createObjectURL(blob);
        const a      = document.createElement('a');
        a.href       = url;
        a.download   = data.filename || `Kwitansi-${form.nomorKwitansi}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        setToast('🖨️ PDF berhasil diunduh, silakan cetak');
      } else {
        setToast(`📧 ${data.message}`);
      }

      // Reset nomor setelah sukses
      set('nomorKwitansi', generateNomorKwitansi());

    } catch (err) {
      setToast(`❌ ${err instanceof Error ? err.message : 'Gagal generate kwitansi'}`);
    } finally {
      setLoading(null);
    }
  };

  // ─────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">

      {/* ── Card utama ── */}
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
            ↺ Reset
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* ── 1. Header / Perusahaan ── */}
          <section>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              1. Header Kwitansi
            </label>
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

          {/* ── 2. Data Penerima ── */}
          <section>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              2. Data Penerima
            </label>
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

          {/* ── 3. Isi Kwitansi ── */}
          <section>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              3. Isi Kwitansi
            </label>

            {/* Jenis layanan */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {([
                ['rental',       '🚗 Rental Mobil'],
                ['rental_sopir', '🚗👨 + Sopir'],
                ['all_in',       '⛽ All In'],
              ] as [Layanan, string][]).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => set('layanan', val)}
                  className={`py-2.5 px-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                    form.layanan === val
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
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
                <span className="text-sm font-semibold">Total</span>
                <span className="text-lg font-bold">{formatRp(total)}</span>
              </div>
            )}
          </section>

          {/* ── 4. Tanggal & Pembayaran ── */}
          <section>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              4. Tanggal & Pembayaran
            </label>
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
                      className={`flex-1 rounded-xl border-2 text-sm font-semibold transition-all capitalize ${
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

          {/* ── Catatan (opsional) ── */}
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

          {/* ── 5. Aksi: Cetak / Kirim ── */}
          <section className="pt-2 space-y-3">
            <div className="flex gap-3">
              {/* Cetak */}
              <button
                onClick={() => handleSubmit('print')}
                disabled={!!loading}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors"
              >
                {loading === 'print' ? (
                  <span className="animate-pulse">Generating...</span>
                ) : (
                  <>🖨️ Cetak PDF</>
                )}
              </button>

              {/* Kirim */}
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

            {/* Input email (muncul jika "Kirim" dipilih) */}
            {form.showEmail && (
              <div className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
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

      {/* ── Preview info ── */}
      {form.namaPenerima && total > 0 && (
        <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4 text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700 mb-2">📋 Ringkasan Kwitansi</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span>Dari</span><span className="font-semibold text-slate-800 text-right">
              {form.perusahaan === 'bengkulutravel' ? 'BengkuluTravel.com' : 'KG Transport'}
            </span>
            <span>Untuk</span><span className="font-semibold text-slate-800 text-right">{form.namaPenerima}</span>
            <span>Layanan</span><span className="font-semibold text-slate-800 text-right">
              {form.layanan === 'rental' ? 'Rental Mobil'
                : form.layanan === 'rental_sopir' ? 'Rental + Sopir'
                : 'All In'}
            </span>
            <span>Durasi</span><span className="font-semibold text-slate-800 text-right">{hari} hari</span>
            <span>Bayar</span><span className="font-semibold text-slate-800 text-right capitalize">{form.pembayaran}</span>
            <span className="font-bold text-slate-700">Total</span>
            <span className="font-bold text-blue-700 text-right">{formatRp(total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
