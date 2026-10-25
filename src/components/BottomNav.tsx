'use client';
import { useState, useCallback, useEffect } from 'react';
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

export default function BottomNav() {
  const pathname = usePathname() ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);
  // Tab yang baru ditekan langsung aktif (optimistic) — tidak menunggu server
  // selesai merender halaman tujuan, jadi respons terasa instan.
  const [pending, setPending] = useState<string | null>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => { setPending(null); }, [pathname]);
  useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setPending(null), 5000); // jaga-jaga navigasi gagal/dibatalkan
    return () => clearTimeout(t);
  }, [pending]);

  if (HIDDEN_ON.some(p => pathname.startsWith(p))) return null;

  const current = pending ?? pathname;
  const activeIdx = tabs.findIndex(t => t.match(current));
  const activeTab = activeIdx >= 0 ? tabs[activeIdx] : null;

  return (
    <>
      {/* spacer agar konten/footer tidak tertutup bar */}
      <div aria-hidden className="h-[calc(4.25rem+env(safe-area-inset-bottom))] md:hidden" />

      <nav
        aria-label="Navigasi utama"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] pb-[env(safe-area-inset-bottom)]"
      >
        {/* Penanda tab aktif — lingkaran ringan, bergeser via transform (GPU, tanpa layout) */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -top-5 left-0 flex w-1/5 justify-center will-change-transform transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none ${
            activeTab ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: `translate3d(${(activeIdx < 0 ? 2 : activeIdx) * 100}%,0,0)` }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-600 bg-white text-primary-700 shadow-md ring-4 ring-white">
            {activeTab && <TabIcon tab={activeTab} className={activeTab.icon ? 'h-5 w-5' : 'h-7 w-7'} />}
          </div>
        </div>

        <ul className="grid grid-cols-5">
          {tabs.map(t => {
            const active = t.match(current);
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  onClick={() => setPending(t.href)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] transition-colors active:scale-95 ${
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
              onClick={() => setMenuOpen(true)}
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
