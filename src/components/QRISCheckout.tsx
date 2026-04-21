'use client';

/**
 * QRISCheckout.tsx
 * Komponen checkout dengan sistem Manual Dynamic QRIS.
 *
 * Alur kerja:
 * 1. Ambil QRIS statis dari environment variable
 * 2. Generate kode unik 3 digit (tetap selama sesi)
 * 3. Hitung total = harga + kode unik
 * 4. Sisipkan total ke QRIS statis → QRIS dinamis
 * 5. Tampilkan QR Code + instruksi pembayaran
 * 6. Tombol konfirmasi → WhatsApp admin
 */

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  generateQRISDinamis,
  generateKodeUnik,
  formatRupiah,
  hitungCRC16,
} from '@/lib/qrisGenerator';

// ─────────────────────────────────────────────
// TIPE DATA PROPS
// ─────────────────────────────────────────────
interface QRISCheckoutProps {
  /** Harga produk/layanan sebelum kode unik */
  hargaProduk: number;
  /** Nama produk untuk ditampilkan di UI */
  namaProduk: string;
  /** Detail tambahan (rute, tanggal, dll) */
  detail?: string;
  /** Nomor WA admin (tanpa +) */
  nomorWA?: string;
}

export default function QRISCheckout({
  hargaProduk,
  namaProduk,
  detail,
  nomorWA = '6285268645461',
}: QRISCheckoutProps) {

  // ─────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────

  /** Kode unik 3 digit — dibuat sekali, tidak berubah */
  const [kodeUnik, setKodeUnik] = useState<number>(0);

  /** String QRIS dinamis hasil generate */
  const [qrisDinamis, setQrisDinamis] = useState<string>('');

  /** Status error jika QRIS gagal di-generate */
  const [error, setError] = useState<string>('');

  /** Status timer countdown 15 menit */
  const [sisaWaktu, setSisaWaktu] = useState<number>(15 * 60);

  /** Status sudah salin nomor rekening/QRIS */
  const [sudahSalin, setSudahSalin] = useState(false);

  // ─────────────────────────────────────────────
  // KALKULASI HARGA
  // ─────────────────────────────────────────────
  const totalBayar = hargaProduk + kodeUnik;

  // ─────────────────────────────────────────────
  // EFFECT 1: Generate kode unik & QRIS saat mount
  // useEffect dengan [] memastikan hanya jalan sekali
  // ─────────────────────────────────────────────
  useEffect(() => {
    // Ambil QRIS statis dari environment variable
    const qrisStatis = process.env.NEXT_PUBLIC_QRIS_STATIC || '';

    if (!qrisStatis) {
      setError('QRIS statis belum dikonfigurasi. Hubungi admin.');
      return;
    }

    // Generate kode unik 3 digit (100–999)
    const kodeUnikBaru = generateKodeUnik();
    setKodeUnik(kodeUnikBaru);

    // Hitung total pembayaran
    const totalBaru = hargaProduk + kodeUnikBaru;

    try {
      // Generate QRIS dinamis dengan total baru
      const qrisBaru = generateQRISDinamis(qrisStatis, totalBaru);
      setQrisDinamis(qrisBaru);
    } catch (err) {
      console.error('Gagal generate QRIS:', err);
      setError('Gagal memuat QRIS. Silakan hubungi admin via WhatsApp.');
    }
  }, [hargaProduk]); // Regenerate jika harga berubah

  // ─────────────────────────────────────────────
  // EFFECT 2: Countdown timer 15 menit
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (sisaWaktu <= 0) return;
    const timer = setInterval(() => {
      setSisaWaktu(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [sisaWaktu]);

  // ─────────────────────────────────────────────
  // HELPER: Format timer MM:SS
  // ─────────────────────────────────────────────
  const formatTimer = (detik: number): string => {
    const m = Math.floor(detik / 60).toString().padStart(2, '0');
    const s = (detik % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ─────────────────────────────────────────────
  // HANDLER: Tombol Konfirmasi Pembayaran via WA
  // ─────────────────────────────────────────────
  const handleKonfirmasiWA = () => {
    const pesan = [
      `Halo Admin Travel Bengkulu 🙏`,
      ``,
      `Saya telah melakukan pembayaran sebesar *${formatRupiah(totalBayar)}* via QRIS.`,
      ``,
      `📋 *Detail Pesanan:*`,
      `• Layanan: ${namaProduk}`,
      detail ? `• ${detail}` : '',
      `• Harga: ${formatRupiah(hargaProduk)}`,
      `• Kode Unik: ${kodeUnik}`,
      `• Total Bayar: *${formatRupiah(totalBayar)}*`,
      ``,
      `Mohon segera diproses. Terima kasih! 🙏`,
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');
  };

  // ─────────────────────────────────────────────
  // HANDLER: Salin total ke clipboard
  // ─────────────────────────────────────────────
  const handleSalin = () => {
    navigator.clipboard.writeText(totalBayar.toString()).then(() => {
      setSudahSalin(true);
      setTimeout(() => setSudahSalin(false), 2000);
    });
  };

  // ─────────────────────────────────────────────
  // RENDER: Error state
  // ─────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-red-700 font-semibold">{error}</p>
        <a
          href={`https://wa.me/${nomorWA}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-xl transition-colors"
        >
          <WAIcon /> Hubungi Admin
        </a>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // RENDER: Loading state
  // ─────────────────────────────────────────────
  if (!qrisDinamis) {
    return (
      <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Memuat QRIS pembayaran...</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // RENDER: Timer habis
  // ─────────────────────────────────────────────
  if (sisaWaktu <= 0) {
    return (
      <div className="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
        <p className="text-4xl mb-3">⏰</p>
        <h3 className="font-bold text-amber-800 text-lg mb-2">QR Code Kedaluwarsa</h3>
        <p className="text-amber-700 text-sm mb-4">
          Sesi pembayaran telah berakhir. Muat ulang halaman untuk mendapatkan kode baru.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          🔄 Muat Ulang
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // RENDER: Tampilan utama checkout
  // ─────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-lg overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 px-6 py-5 text-center">
          <p className="text-primary-200 text-xs font-semibold uppercase tracking-widest mb-1">
            Pembayaran QRIS
          </p>
          <h2 className="text-white font-display font-bold text-xl leading-tight">
            {namaProduk}
          </h2>
          {detail && (
            <p className="text-primary-200 text-sm mt-1">{detail}</p>
          )}
          {/* Timer */}
          <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-bold ${
            sisaWaktu < 120
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-white/20 text-white'
          }`}>
            ⏱ Berlaku: {formatTimer(sisaWaktu)}
          </div>
        </div>

        {/* ── Rincian Harga ── */}
        <div className="px-6 pt-5 pb-4 space-y-2.5">

          {/* Harga Produk */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Harga Layanan</span>
            <span className="font-semibold text-slate-700">{formatRupiah(hargaProduk)}</span>
          </div>

          {/* Kode Unik — diberi warna berbeda sebagai penanda */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 flex items-center gap-1.5">
              Kode Unik
              <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-medium">
                Verifikasi
              </span>
            </span>
            <span className="font-bold text-amber-600 text-base tracking-widest">
              +{kodeUnik}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-slate-200 pt-2.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800">Total Pembayaran</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary-700 text-2xl">
                  {formatRupiah(totalBayar)}
                </span>
                {/* Tombol salin */}
                <button
                  onClick={handleSalin}
                  title="Salin nominal"
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"
                >
                  {sudahSalin ? '✅' : '📋'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── QR Code ── */}
        <div className="px-6 pb-4 flex flex-col items-center">
          <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm inline-block mb-3">
            <QRCodeSVG
              value={qrisDinamis}
              size={220}
              level="M"
              includeMargin={false}
            />
          </div>
          <p className="text-xs text-slate-400 text-center">
            Scan dengan aplikasi e-wallet atau mobile banking Anda
          </p>
          {/* Logo bank yang didukung */}
          <div className="flex gap-2 mt-2 flex-wrap justify-center">
            {['GoPay', 'OVO', 'Dana', 'ShopeePay', 'BCA', 'BRI', 'Mandiri'].map(bank => (
              <span key={bank} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                {bank}
              </span>
            ))}
          </div>
        </div>

        {/* ── Instruksi Penting ── */}
        <div className="mx-6 mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 font-bold text-sm mb-1.5">⚠️ Perhatian Penting!</p>
          <p className="text-amber-700 text-xs leading-relaxed">
            Mohon transfer tepat <strong>hingga 3 digit terakhir</strong> sesuai nominal di atas
            (<strong>{formatRupiah(totalBayar)}</strong>) agar sistem dapat
            memverifikasi pesanan Anda secara manual. Nominal berbeda akan
            mempersulit konfirmasi.
          </p>
        </div>

        {/* ── Tombol Konfirmasi WA ── */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleKonfirmasiWA}
            className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base shadow-sm"
          >
            <WAIcon />
            Konfirmasi Pembayaran via WhatsApp
          </button>

          <p className="text-center text-xs text-slate-400">
            Setelah transfer, klik tombol di atas untuk konfirmasi ke admin kami.
            Pesanan akan diproses dalam <strong>5–15 menit</strong>.
          </p>
        </div>

      </div>

      {/* ── Catatan di luar card ── */}
      <div className="mt-4 text-center text-xs text-slate-400 space-y-1">
        <p>🔒 Pembayaran aman · QRIS resmi terdaftar Bank Indonesia</p>
        <p>Butuh bantuan? <a href={`https://wa.me/${nomorWA}`} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Hubungi admin</a></p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ICON: WhatsApp SVG
// ─────────────────────────────────────────────
function WAIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
