'use client';

import { useEffect } from 'react';

/**
 * Menghitung klik SEMUA tautan WhatsApp (wa.me) di website: tombol Chat di bottom nav, footer,
 * dan CTA di beranda, halaman rute, artikel, dll. Satu listener global — halaman server tidak
 * perlu diubah satu per satu, dan tautan baru otomatis ikut terhitung.
 * Halaman pemesanan/pembayaran, admin, dan credits diabaikan (juga disaring ulang di server).
 */
const EXCLUDED = ['/pesan', '/pembayaran', '/admin', '/credits'];

export default function WaClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="https://wa.me/"]');
      if (!a) return;
      const path = window.location.pathname;
      if (EXCLUDED.some(p => path === p || path.startsWith(p + '/'))) return;

      const source = a.getAttribute('data-wa-src') ?? (a.closest('footer') ? 'footer' : 'cta');
      const body = JSON.stringify({ path, source });
      try {
        const sent = navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }));
        if (!sent) {
          fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
        }
      } catch { /* pelacakan tidak boleh mengganggu klik */ }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
