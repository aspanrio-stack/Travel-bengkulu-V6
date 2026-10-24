'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import MobileMenu from '@/components/MobileMenu';

const HIDDEN_ON = ['/admin', '/credits', '/masuk'];

const icons = {
  explore: 'M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z',
  ticket: 'M3 9a2 2 0 002-2h14a2 2 0 002 2v1a2 2 0 000 4v1a2 2 0 00-2 2H5a2 2 0 00-2-2v-1a2 2 0 000-4V9z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0',
};

type Tab = {
  href: string;
  label: string;
  icon?: string; // tanpa icon → pakai logo
  match: (p: string) => boolean;
};

// Beranda di tengah (indeks 2)
const tabs: Tab[] = [
  { href: '/destinasi', label: 'Jelajah', icon: icons.explore, match: p => p.startsWith('/destinasi') },
  { href: '/pesan', label: 'Pesan', icon: icons.ticket, match: p => p.startsWith('/pesan') || p.startsWith('/pembayaran') },
  { href: '/', label: 'Beranda', match: p => p === '/' },
  { href: '/profil', label: 'Profil', icon: icons.user, match: p => p.startsWith('/profil') },
];
// Slot ke-5 (Menu) bukan halaman: tidak pernah jadi posisi setir.
const SLOTS = 5;
const LOGO_SRC = '/android-chrome-192x192.png';

function TabIcon({ tab, className }: { tab: Tab; className: string }) {
  if (!tab.icon) {
    return <Image src={LOGO_SRC} alt="" width={28} height={28} className={`${className} rounded-full`} />;
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <path d={tab.icon} />
    </svg>
  );
}

/** Setir: pelek gelap, jari-jari emas, penanda jam 12. Bagian tengah (ikon) ditumpuk di atasnya. */
function SteeringWheel() {
  return (
    <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full" aria-hidden>
      <circle cx="32" cy="32" r="31" fill="#0f172a" />
      {/* pelek */}
      <circle cx="32" cy="32" r="25" fill="none" stroke="#f59e0b" strokeWidth="5" />
      <circle cx="32" cy="32" r="25" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="1.5 2.5" opacity="0.9" />
      {/* jari-jari: kiri, kanan, bawah */}
      <path d="M8 32H56M32 32V56" stroke="#f59e0b" strokeWidth="9" />
      {/* penanda jam 12 — terlihat saat setir berputar */}
      <rect x="29.5" y="1.5" width="5" height="7" rx="1.5" fill="#2dd4bf" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname() ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [turns, setTurns] = useState(0); // jumlah tap → setir belok kiri/kanan bergantian
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const turn = useCallback(() => setTurns(n => n + 1), []);

  if (HIDDEN_ON.some(p => pathname.startsWith(p))) return null;

  const activeIdx = tabs.findIndex(t => t.match(pathname));
  const activeTab = activeIdx >= 0 ? tabs[activeIdx] : null;
  const rotation = turns === 0 ? 0 : turns % 2 === 1 ? 55 : -55;

  return (
    <>
      <style>{`
        @keyframes wheel-icon-pop { 0% { transform: scale(.5); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
        .wheel-icon-pop { animation: wheel-icon-pop .35s cubic-bezier(.34,1.56,.64,1) both }
        @media (prefers-reduced-motion: reduce) { .wheel-icon-pop { animation: none } }
      `}</style>

      {/* spacer agar konten/footer tidak tertutup bar */}
      <div aria-hidden className="h-[calc(4.25rem+env(safe-area-inset-bottom))] md:hidden" />

      <nav
        aria-label="Navigasi utama"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-100 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] pb-[env(safe-area-inset-bottom)]"
      >
        {/* Setir — meluncur ke tab aktif, berputar tiap tap */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-7 h-16 w-16 -translate-x-1/2 rounded-full ring-[6px] ring-white shadow-[0_6px_16px_rgba(15,23,42,0.28)] transition-[left,opacity] duration-300 ease-out motion-reduce:transition-none ${
            activeTab ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ left: `${((activeIdx < 0 ? 2 : activeIdx) + 0.5) * (100 / SLOTS)}%` }}
        >
          <div
            className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] motion-reduce:transition-none"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <SteeringWheel />
          </div>
          {/* hub: ikon tab aktif (logo untuk Beranda), tidak ikut berputar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-900 shadow-inner">
              {activeTab && (
                <span key={activeTab.href} className="wheel-icon-pop flex items-center justify-center">
                  <TabIcon tab={activeTab} className={activeTab.icon ? 'h-4 w-4' : 'h-6 w-6'} />
                </span>
              )}
            </div>
          </div>
        </div>

        <ul className="grid grid-cols-5">
          {tabs.map(t => {
            const active = t.match(pathname);
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  onClick={turn}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] transition-colors ${
                    active ? 'font-bold text-primary-700' : 'font-medium text-slate-500'
                  }`}
                >
                  <span className={`flex h-7 w-12 items-center justify-center transition-opacity ${active ? 'opacity-0' : ''}`}>
                    <TabIcon tab={t} className={t.icon ? 'h-5 w-5' : 'h-6 w-6'} />
                  </span>
                  {t.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => { turn(); setMenuOpen(true); }}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-slate-500"
            >
              <span className="flex h-7 w-12 items-center justify-center">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
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
