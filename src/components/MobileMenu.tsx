'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks, routeIdFromPath } from '@/lib/nav-links';

/**
 * Sheet menu untuk HP — dibuka dari tab "Menu" di BottomNav.
 * Menggantikan hamburger navbar (navbar atas disembunyikan di HP).
 */
export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname() ?? '/';
  const [expanded, setExpanded] = useState<string | null>(null);

  const routeId = routeIdFromPath(pathname);
  const pesanHref = routeId ? `/pesan?rute=${routeId}` : '/pesan';

  // Tutup saat pindah halaman
  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Kunci scroll body + tutup dengan Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  return (
    <div
      className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button aria-label="Tutup menu" onClick={onClose} className="absolute inset-0 bg-slate-900/50" tabIndex={open ? 0 : -1} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="font-display text-base font-bold text-slate-800">
            BENGKULU <span className="text-primary-600">TRAVEL.COM</span>
          </p>
          <button onClick={onClose} aria-label="Tutup" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  onClick={() => setExpanded(expanded === link.label ? null : link.label)}
                  aria-expanded={expanded === link.label}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold uppercase tracking-widest text-slate-500 hover:bg-slate-50"
                >
                  {link.label}
                  <svg className={`h-4 w-4 transition-transform duration-200 ${expanded === link.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expanded === link.label && (
                  <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-primary-100 pl-3">
                    {link.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-primary-50 hover:text-primary-600">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.href} href={link.href!} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-600">
                {link.label}
              </Link>
            )
          )}
        </div>

        <Link
          href={pesanHref}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 py-3 text-sm font-bold text-white shadow-md shadow-primary-500/20"
        >
          🎫 Pesan Tiket Sekarang
        </Link>
      </div>
    </div>
  );
}
