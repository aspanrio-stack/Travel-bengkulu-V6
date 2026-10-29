'use client';

import { useState } from 'react';

/** Tombol untuk petugas (admin login): tandai tiket sudah dipakai saat penumpang naik. */
export default function VerifyTicketAction({ token }: { token: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'already' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function mark() {
    setState('loading');
    try {
      const res = await fetch('/api/admin/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setState('done'); return; }
      if (res.status === 409) { setState('already'); return; }
      setMsg(data?.error || 'Gagal memproses');
      setState('error');
    } catch {
      setMsg('Koneksi bermasalah, coba lagi');
      setState('error');
    }
  }

  if (state === 'done')
    return <p className="rounded-xl bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-700">Tiket ditandai SUDAH DIGUNAKAN. Muat ulang halaman untuk melihat status.</p>;
  if (state === 'already')
    return <p className="rounded-xl bg-amber-50 p-3 text-center text-sm font-bold text-amber-700">Tiket ini sudah divalidasi sebelumnya. Muat ulang halaman.</p>;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={mark}
        disabled={state === 'loading'}
        className="w-full rounded-xl bg-primary-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {state === 'loading' ? 'Memproses…' : 'Validasi Tiket (Penumpang Naik)'}
      </button>
      {state === 'error' && <p className="text-center text-xs font-semibold text-red-600">{msg}</p>}
    </div>
  );
}
