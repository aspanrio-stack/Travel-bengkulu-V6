'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MobileMenu from '@/components/MobileMenu';

const HIDDEN_ON = ['/admin', '/credits', '/masuk'];

const icons = {
  home: 'M3 11l9-8 9 8v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9z',
  explore: 'M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z',
  ticket: 'M3 9a2 2 0 002-2h14a2 2 0 002 2v1a2 2 0 000 4v1a2 2 0 00-2 2H5a2 2 0 00-2-2v-1a2 2 0 000-4V9z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0',
};

const tabs = [
  { href: '/', label: 'Beranda', icon: icons.home, match: (p: string) => p === '/' },
  { href: '/destinasi', label: 'Jelajah', icon: icons.explore, match: (p: string) => p.startsWith('/destinasi') },
  { href: '/pesan', label: 'Pesan', icon: icons.ticket, match: (p: string) => p.startsWith('/pesan') || p.startsWith('/pembayaran') },
  { href: '/profil', label: 'Profil', icon: icons.user, match: (p: string) => p.startsWith('/profil') },
];

export default function BottomNav() {
  const pathname = usePathname() ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  if (HIDDEN_ON.some(p => pathname.startsWith(p))) return null;

  return (
    <>
      {/* spacer agar konten/footer tidak tertutup bar */}
      <div aria-hidden className="h-[calc(4.25rem+env(safe-area-inset-bottom))] md:hidden" />
      <nav
        aria-label="Navigasi utama"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-100 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="grid grid-cols-5">
          {tabs.map(t => {
            const active = t.match(pathname);
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                    active ? 'text-primary-700' : 'text-slate-500'
                  }`}
                >
                  <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${active ? 'bg-primary-50' : ''}`}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
                      <path d={t.icon} />
                    </svg>
                  </span>
                  {t.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className={`flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${menuOpen ? 'text-primary-700' : 'text-slate-500'}`}
            >
              <span className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${menuOpen ? 'bg-primary-50' : ''}`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
                  <path d={icons.menu} />
                </svg>
              </span>
              Menu
            </button>
          </li>
        </ul>
      </nav>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
