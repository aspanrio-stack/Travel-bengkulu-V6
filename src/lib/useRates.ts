'use client';
// Hook client: ambil override tarif admin sekali per muat halaman (di-cache di module).
import { useEffect, useState } from 'react';
import type { RateOverrides } from './rates';

let cache: RateOverrides | null = null;
let inflight: Promise<RateOverrides> | null = null;

function load(): Promise<RateOverrides> {
  if (cache) return Promise.resolve(cache);
  inflight ??= fetch('/api/rates', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : { overrides: {} }))
    .then((d) => (cache = (d.overrides ?? {}) as RateOverrides))
    .catch(() => (cache = {}))
    .finally(() => { inflight = null; });
  return inflight;
}

/** `ready` false sampai tarif terbaru selesai dimuat (gagal muat → ready true dengan harga default). */
export function useRates(): { overrides: RateOverrides; ready: boolean } {
  const [state, setState] = useState<{ overrides: RateOverrides; ready: boolean }>(
    () => ({ overrides: cache ?? {}, ready: !!cache })
  );
  useEffect(() => {
    let alive = true;
    load().then((o) => { if (alive) setState({ overrides: o, ready: true }); });
    return () => { alive = false; };
  }, []);
  return state;
}
