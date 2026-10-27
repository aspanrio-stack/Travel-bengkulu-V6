'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ROUTES, formatPrice } from '@/lib/routes';

const MAX_PAX = 13;

/** Kartu pesan cepat di beranda (HP): pilih rute + penumpang → lanjut ke /pesan dengan data terisi. */
export default function HomeBookingCard() {
  const [routeId, setRouteId] = useState(ROUTES[0].id);
  const [pax, setPax] = useState(1);
  const [flip, setFlip] = useState(0);

  const route = ROUTES.find(r => r.id === routeId) ?? ROUTES[0];
  const reverse = ROUTES.find(r => r.from === route.to && r.to === route.from);

  const swap = () => {
    if (!reverse) return;
    setRouteId(reverse.id);
    setFlip(f => f + 1);
  };

  return (
    <section aria-label="Pesan cepat" className="md:hidden relative z-10 mt-3 px-4">
      <div className="rounded-3xl bg-white p-4 shadow-xl shadow-slate-900/10 ring-1 ring-slate-100">
        {/* Dari → Tujuan */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Dari</p>
            <p className="font-display text-[22px] font-bold leading-tight text-slate-900 break-words">{route.from}</p>
          </div>
          <button
            type="button"
            onClick={swap}
            disabled={!reverse}
            aria-label="Tukar asal dan tujuan"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-800 transition-transform duration-300 active:scale-90 disabled:opacity-60"
            style={{ transform: `rotate(${flip * 180}deg)` }}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1 text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Tujuan</p>
            <p className="font-display text-[22px] font-bold leading-tight text-slate-900 break-words">{route.to}</p>
          </div>
        </div>

        {/* Pilih rute */}
        <label htmlFor="home-rute" className="mt-4 block text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          Pilih Rute
        </label>
        <select
          id="home-rute"
          value={routeId}
          onChange={e => setRouteId(e.target.value)}
          className="mt-1.5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {ROUTES.map(r => (
            <option key={r.id} value={r.id}>{r.from} – {r.to}</option>
          ))}
        </select>

        {/* Penumpang */}
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-2.5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">Penumpang</p>
            <p className="text-base font-semibold text-slate-800">
              {pax} orang · {formatPrice(route.price * pax)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPax(n => Math.max(1, n - 1))}
              disabled={pax <= 1}
              aria-label="Kurangi penumpang"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-bold text-slate-700 disabled:opacity-40"
            >
              −
            </button>
            <button
              type="button"
              onClick={() => setPax(n => Math.min(MAX_PAX, n + 1))}
              disabled={pax >= MAX_PAX}
              aria-label="Tambah penumpang"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        <Link
          href={`/pesan?rute=${route.id}&penumpang=${pax}`}
          className="mt-4 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 py-4 text-base font-bold text-white shadow-lg shadow-primary-500/25 active:scale-[0.98] transition-transform"
        >
          Cari & Pesan Tiket
        </Link>
      </div>
    </section>
  );
}
