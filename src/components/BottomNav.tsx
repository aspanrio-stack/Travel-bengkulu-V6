'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { waLinkUntukPath } from '@/lib/whatsapp';

const HIDDEN_ON = ['/admin', '/credits', '/masuk'];

const icons = {
  explore: 'M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z',
  ticket: 'M3 9a2 2 0 002-2h14a2 2 0 002 2v1a2 2 0 000 4v1a2 2 0 00-2 2H5a2 2 0 00-2-2v-1a2 2 0 000-4V9z',
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
const WA_ICON =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';
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
  // Tab yang baru ditekan langsung aktif (optimistic) — tidak menunggu server
  // selesai merender halaman tujuan, jadi respons terasa instan.
  const [pending, setPending] = useState<string | null>(null);

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
            <a
              href={waLinkUntukPath(pathname)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Hitung klik WhatsApp (diam-diam, tidak mengganggu pengguna)
                fetch('/api/track', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ source: 'wa_nav', page: pathname }),
                  keepalive: true,
                }).catch(() => {});
              }}
              aria-label="Chat admin via WhatsApp"
              className="flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-slate-500 transition-colors active:scale-95"
            >
              <span className="flex h-7 w-12 items-center justify-center text-green-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d={WA_ICON} />
                </svg>
              </span>
              Chat
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
