import Link from 'next/link';
import type { CSSProperties, ReactElement } from 'react';

/**
 * Section E-Ticketing untuk beranda Travel Bengkulu.
 * Server component (tanpa JS tambahan di browser). Mockup tiket dibuat dengan
 * HTML/CSS/SVG (bukan gambar) supaya ringan dan tajam di semua layar.
 */

const steps = [
  { no: '1', icon: '📝', title: 'Pesan Online', desc: 'Pilih rute, isi data penumpang, dan kirim pesanan dari HP Anda.' },
  { no: '2', icon: '💳', title: 'Bayar Tunai / QRIS', desc: 'Pilih cara bayar yang paling nyaman untuk Anda.' },
  { no: '3', icon: '✅', title: 'Admin Konfirmasi Lunas', desc: 'Pembayaran kami cek dan konfirmasi dengan cepat.' },
  { no: '4', icon: '🎫', title: 'E-Tiket + QR ke Email', desc: 'Tiket PDF resmi dengan QR verifikasi tiba otomatis di email.' },
];

const perks = [
  { icon: '⚡', title: 'Otomatis ke Email', desc: 'Tiket PDF langsung masuk begitu pembayaran dikonfirmasi.' },
  { icon: '🔍', title: 'QR Anti-Palsu', desc: 'Pindai QR untuk memastikan tiket asli, statusnya langsung tampil.' },
  { icon: '🏢', title: 'Bukti Sah Perjalanan', desc: 'Rapi dan resmi, cocok untuk laporan atau reimburse kantor.' },
  { icon: '🗓️', title: 'Bisa Dicek 3 Bulan', desc: 'Data verifikasi tersimpan 3 bulan sejak tiket terbit.' },
];

/** QR dekoratif (pola tetap) - hanya ilustrasi, bukan QR sungguhan */
function FakeQr() {
  const n = 21;
  const cells: ReactElement[] = [];
  const inFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x > n - 8 && y < 7) || (x < 7 && y > n - 8);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (inFinder(x, y)) continue;
      if ((x * 7 + y * 13 + x * y) % 5 < 2) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
      }
    }
  }
  const finder = (ox: number, oy: number) => (
    <g key={`f-${ox}-${oy}`}>
      <rect x={ox} y={oy} width="7" height="7" />
      <rect x={ox + 1} y={oy + 1} width="5" height="5" fill="#fff" />
      <rect x={ox + 2} y={oy + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="h-full w-full" fill="#134e4a" shapeRendering="crispEdges" aria-hidden="true">
      {cells}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}

function TicketMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary-200/60 via-primary-50 to-amber-100/70 blur-2xl" />

      <div className="-rotate-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-primary-900/15 transition-transform duration-500 hover:rotate-0">
        {/* header tiket */}
        <div className="flex items-start justify-between bg-gradient-to-r from-primary-800 to-primary-600 px-4 py-3 text-white">
          <div>
            <p className="font-display text-lg font-bold leading-none">Travel Bengkulu</p>
            <p className="mt-1 text-[10px] text-primary-100">Antar Jemput Door to Door</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold tracking-wide text-amber-300">E-TIKET</p>
            <p className="text-[10px] text-primary-100">Nomor tiket Anda</p>
          </div>
        </div>

        <div className="p-4">
          <p className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
            PEMBAYARAN TELAH DIKONFIRMASI - LUNAS
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <p className="text-[9px] uppercase tracking-wide text-slate-500">Nama Penumpang</p>
              <p className="font-bold text-slate-800">Nama Anda</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wide text-slate-500">Tanggal Berangkat</p>
              <p className="font-bold text-slate-800">Hari, Tanggal Perjalanan</p>
            </div>
            <div className="col-span-2">
              <p className="text-[9px] uppercase tracking-wide text-slate-500">Rute Perjalanan</p>
              <p className="font-bold text-slate-800">Bengkulu – Palembang</p>
            </div>
          </div>

          {/* garis sobekan */}
          <div className="relative my-4 border-t-2 border-dashed border-slate-200">
            <span className="absolute -left-7 -top-3 h-6 w-6 rounded-full bg-white ring-1 ring-slate-200" />
            <span className="absolute -right-7 -top-3 h-6 w-6 rounded-full bg-white ring-1 ring-slate-200" />
          </div>

          {/* area QR */}
          <div className="flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50/60 p-3">
            <div className="h-20 w-20 shrink-0 rounded-md border border-slate-200 bg-white p-1">
              <FakeQr />
            </div>
            <div>
              <p className="text-[11px] font-bold text-primary-800">VALIDASI KEASLIAN TIKET</p>
              <p className="mt-1 text-[10px] leading-snug text-slate-600">
                Pindai QR code untuk memeriksa keaslian tiket ini kapan saja.
              </p>
            </div>
          </div>
        </div>
      </div>

      <span className="absolute -right-2 -top-3 rotate-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-900 shadow-lg">
        ✓ STATUS VALID
      </span>
    </div>
  );
}

export default function ETicketSection() {
  return (
    <section
      id="e-ticket"
      aria-labelledby="eticket-heading"
      className="relative overflow-hidden bg-white py-12 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-amber-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Teks */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-800">
              🎫 Layanan Digital
            </span>
            <h2 id="eticket-heading" className="mt-4 font-display text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              Tiket Resmi Langsung ke Email,{' '}
              <span className="text-primary-700">Dilengkapi QR Anti-Palsu</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600 md:text-base">
              Fitur yang biasanya hanya ada di travel nasional kini ada di Travel Bengkulu. Setelah
              pembayaran dikonfirmasi, e-tiket PDF resmi terkirim otomatis ke email Anda, lengkap
              dengan QR code yang bisa dipindai siapa pun untuk memastikan tiket asli dan sah.
              Tidak perlu lagi menyimpan kertas atau khawatir soal keabsahan.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {perks.map((p) => (
                <div key={p.title} className="card flex items-start gap-3 p-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xl" aria-hidden="true">
                    {p.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{p.title}</h3>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/pesan" className="btn-primary mt-7">
              Pesan &amp; Terima E-Tiket
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <TicketMockup />
        </div>

        {/* Alur */}
        <div className="mt-14 md:mt-16">
          <h3 className="mb-8 text-center font-display text-xl font-bold text-slate-900 md:text-2xl">
            Dari Pesan sampai E-Tiket, Cuma 4 Langkah
          </h3>

          <ol className="relative grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            <div
              className="absolute left-[12.5%] right-[12.5%] top-7 hidden border-t-2 border-dashed border-amber-400 lg:block"
              aria-hidden="true"
            />
            {steps.map((s, i) => (
              <li
                key={s.no}
                style={{ animationDelay: `${i * 120}ms` } as CSSProperties}
                className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center"
              >
                {i < steps.length - 1 && (
                  <span
                    className="absolute left-7 top-14 h-[calc(100%-0.5rem)] border-l-2 border-dashed border-amber-400 lg:hidden"
                    aria-hidden="true"
                  />
                )}
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-amber-400 bg-white text-2xl shadow-md shadow-primary-900/10">
                  <span aria-hidden="true">{s.icon}</span>
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-700 text-[10px] font-bold text-white">
                    {s.no}
                  </span>
                </div>
                <div className="lg:mt-3">
                  <p className="font-display font-bold text-slate-900">{s.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-600 md:text-sm">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
