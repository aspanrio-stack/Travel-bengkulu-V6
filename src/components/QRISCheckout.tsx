'use client';

/**
 * QRISCheckout.tsx
 * Desain menyerupai stiker QRIS resmi Indonesia:
 * - Header putih dengan logo QRIS dan GPN
 * - Border merah tebal
 * - QR Code besar di tengah
 * - Footer merah dengan nominal kontras
 */

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { generateQRISDinamis, generateKodeUnik, formatRupiah } from '@/lib/qrisGenerator';

interface QRISCheckoutProps {
  hargaProduk: number;
  namaProduk: string;
  detail?: string;
  nomorWA?: string;
}

export default function QRISCheckout({
  hargaProduk,
  namaProduk,
  detail,
  nomorWA = '6285268645461',
}: QRISCheckoutProps) {

  const [kodeUnik, setKodeUnik]       = useState<number>(0);
  const [qrisDinamis, setQrisDinamis] = useState<string>('');
  const [error, setError]             = useState<string>('');
  const [sisaWaktu, setSisaWaktu]     = useState<number>(15 * 60);
  const [sudahSalin, setSudahSalin]   = useState(false);

  const totalBayar = hargaProduk + kodeUnik;

  // Generate kode unik & QRIS saat mount
  useEffect(() => {
    const qrisStatis = process.env.NEXT_PUBLIC_QRIS_STATIC || '';
    if (!qrisStatis) {
      setError('QRIS belum dikonfigurasi. Hubungi admin.');
      return;
    }
    const kode = generateKodeUnik();
    setKodeUnik(kode);
    try {
      setQrisDinamis(generateQRISDinamis(qrisStatis, hargaProduk + kode));
    } catch {
      setError('Gagal memuat QRIS. Hubungi admin via WhatsApp.');
    }
  }, [hargaProduk]);

  // Countdown 15 menit
  useEffect(() => {
    if (sisaWaktu <= 0) return;
    const t = setInterval(() => setSisaWaktu(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [sisaWaktu]);

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const d = (s % 60).toString().padStart(2, '0');
    return `${m}:${d}`;
  };

  const handleSalin = () => {
    navigator.clipboard.writeText(totalBayar.toString()).then(() => {
      setSudahSalin(true);
      setTimeout(() => setSudahSalin(false), 2000);
    });
  };

  const handleKonfirmasiWA = () => {
    const pesan = [
      'Halo Admin Travel Bengkulu 🙏',
      '',
      `Saya sudah transfer *${formatRupiah(totalBayar)}* via QRIS.`,
      '',
      '📋 *Detail Pesanan:*',
      `• Layanan: ${namaProduk}`,
      detail ? `• ${detail}` : '',
      `• Harga: ${formatRupiah(hargaProduk)}`,
      `• Kode Unik: +${kodeUnik}`,
      `• Total: *${formatRupiah(totalBayar)}*`,
      '',
      'Mohon segera diproses. Terima kasih! 🙏',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, '_blank');
  };

  // ── Error ──
  if (error) {
    return (
      <div className="max-w-sm mx-auto border-4 border-red-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-red-600 py-3 text-center text-white font-bold text-sm tracking-wide">
          QRIS TRAVEL BENGKULU
        </div>
        <div className="bg-white p-6 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="text-red-700 font-semibold text-sm mb-4">{error}</p>
          <a href={`https://wa.me/${nomorWA}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm">
            <WAIcon /> Hubungi Admin
          </a>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (!qrisDinamis) {
    return (
      <div className="max-w-sm mx-auto border-4 border-red-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-red-600 py-3 text-center text-white font-bold text-sm tracking-wide">
          QRIS TRAVEL BENGKULU
        </div>
        <div className="bg-white p-10 text-center">
          <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Memuat QRIS...</p>
        </div>
      </div>
    );
  }

  // ── Timer habis ──
  if (sisaWaktu <= 0) {
    return (
      <div className="max-w-sm mx-auto border-4 border-red-600 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-red-600 py-3 text-center text-white font-bold text-sm">QRIS KEDALUWARSA</div>
        <div className="bg-white p-6 text-center">
          <p className="text-5xl mb-3">⏰</p>
          <p className="text-slate-600 text-sm mb-4">Sesi berakhir. Muat ulang untuk kode baru.</p>
          <button onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
            🔄 Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  // ── Tampilan Utama: Stiker QRIS Resmi ──
  return (
    <div className="max-w-sm mx-auto space-y-4">

      {/* KARTU STIKER QRIS */}
      <div className="border-[5px] border-red-600 rounded-2xl overflow-hidden shadow-2xl bg-white">

        {/* ── HEADER: Logo QRIS + Timer + Logo GPN ── */}
        <div className="bg-white px-4 pt-3 pb-2 flex items-center justify-between gap-2">
          {/* Logo QRIS */}
          <div className="relative h-9 w-32 shrink-0">
            <Image
              src="/images/qris-logo.png"
              alt="QRIS"
              fill
              className="object-contain object-left"
              sizes="128px"
              priority
            />
          </div>

          {/* Timer tengah */}
          <div className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
            sisaWaktu < 120
              ? 'bg-red-100 text-red-600 animate-pulse'
              : 'bg-slate-100 text-slate-500'
          }`}>
            ⏱ {formatTimer(sisaWaktu)}
          </div>

          {/* Logo GPN */}
          <div className="relative h-9 w-12 shrink-0">
            <Image
              src="/images/gpn-logo.png"
              alt="GPN"
              fill
              className="object-contain object-right"
              sizes="48px"
              priority
            />
          </div>
        </div>

        {/* ── GARIS MERAH TIPIS PEMISAH HEADER ── */}
        <div className="h-0.5 bg-red-600 mx-0" />

        {/* ── NAMA MERCHANT ── */}
        <div className="bg-white text-center px-4 pt-3 pb-1">
          <p className="font-bold text-slate-900 text-sm leading-snug uppercase tracking-wide">
            {namaProduk}
          </p>
          {detail && (
            <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{detail}</p>
          )}
        </div>

        {/* ── QR CODE ── */}
        <div className="bg-white flex justify-center items-center px-6 py-4">
          {/* Frame hitam tipis di sekitar QR seperti stiker fisik */}
          <div className="border border-slate-200 rounded-lg p-2 bg-white shadow-sm">
            <QRCodeSVG
              value={qrisDinamis}
              size={210}
              level="M"
              includeMargin={false}
              style={{ display: 'block' }}
            />
          </div>
        </div>

        {/* ── INSTRUKSI SCAN ── */}
        <div className="text-center px-4 pb-3">
          <p className="text-slate-500 text-xs font-medium">
            Scan menggunakan e-wallet atau m-banking
          </p>
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {['GoPay', 'OVO', 'Dana', 'ShopeePay', 'BCA', 'BRI', 'Mandiri', 'BNI'].map(b => (
              <span key={b}
                className="text-[10px] bg-slate-50 border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded-full">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* ── GARIS MERAH TIPIS PEMISAH FOOTER ── */}
        <div className="h-0.5 bg-red-600" />

        {/* ── FOOTER MERAH: Nominal Pembayaran ── */}
        <div className="bg-red-600 px-5 py-4">

          {/* Rincian di atas */}
          <div className="flex justify-between items-center text-xs text-red-200 mb-1.5">
            <span>Harga Layanan</span>
            <span className="font-medium">{formatRupiah(hargaProduk)}</span>
          </div>
          <div className="flex justify-between items-center text-xs mb-3">
            <span className="text-red-200 flex items-center gap-1.5">
              Kode Unik
              <span className="bg-red-700 text-red-100 text-[10px] px-1.5 py-0.5 rounded-full">
                Verifikasi
              </span>
            </span>
            <span className="font-bold text-yellow-300 text-sm tracking-widest">+{kodeUnik}</span>
          </div>

          {/* Garis putih tipis */}
          <div className="border-t border-red-500 mb-3" />

          {/* Nominal utama — besar dan kontras */}
          <div className="text-center">
            <p className="text-red-200 text-[10px] font-semibold uppercase tracking-[0.15em] mb-1">
              Total Pembayaran
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-white font-black text-3xl tracking-tight drop-shadow-sm">
                {formatRupiah(totalBayar)}
              </p>
              <button
                onClick={handleSalin}
                title="Salin nominal"
                className="bg-red-500 hover:bg-red-400 active:scale-95 text-white p-1.5 rounded-lg transition-all"
              >
                <span className="text-sm leading-none">{sudahSalin ? '✅' : '📋'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── PERINGATAN KODE UNIK ── */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
        <p className="text-amber-800 font-bold text-sm mb-1">⚠️ Perhatian!</p>
        <p className="text-amber-700 text-xs leading-relaxed">
          Transfer <strong>tepat</strong>{' '}
          <strong className="text-amber-900">{formatRupiah(totalBayar)}</strong>{' '}
          termasuk 3 digit kode unik{' '}
          <strong className="text-amber-900 tracking-widest">+{kodeUnik}</strong>{' '}
          agar pesanan Anda dapat diverifikasi. Nominal berbeda menyulitkan konfirmasi.
        </p>
      </div>

      {/* ── TOMBOL KONFIRMASI WA ── */}
      <button
        onClick={handleKonfirmasiWA}
        className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2.5 text-base shadow-md"
      >
        <WAIcon />
        Konfirmasi Pembayaran via WhatsApp
      </button>

      <p className="text-center text-xs text-slate-400 leading-relaxed">
        Setelah transfer, klik tombol di atas. Pesanan diproses{' '}
        <strong>5–15 menit</strong> setelah konfirmasi.
        <br />
        <a href={`https://wa.me/${nomorWA}`} target="_blank" rel="noopener noreferrer"
          className="text-primary-500 hover:underline">
          Butuh bantuan? Hubungi admin
        </a>
      </p>

    </div>
  );
}

function WAIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
