'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ROUTES, getRouteById } from '@/lib/routes';

const navLinks = [
  {
    label: 'Layanan',
    children: [
      { href: '/travel-bengkulu-palembang', label: 'Bengkulu ↔ Palembang' },
      { href: '/travel-palembang-bengkulu', label: 'Bengkulu ↔ Palembang' },
      { href: '/travel-bengkulu-jambi', label: 'Bengkulu ↔ Jambi' },
      { href: '/travel-jambi-bengkulu', label: 'Bengkulu ↔ Jambi' },
      { href: '/travel-bengkulu-curup', label: 'Bengkulu ↔ Curup' },
      { href: '/travel-bengkulu-lebong', label: 'Bengkulu ↔ Lebong' },
      { href: '/travel-bengkulu-lampung', label: 'Bengkulu ↔ Lampung' },
      { href: '/rental-mobil-curup', label: 'Rental Mobil Curup' },
      { href: '/antar-jemput-bandara-curup', label: 'Antar Jemput Bandara' },
      { href: '/kirim-paket-bengkulu-palembang', label: 'Kirim Paket' },
    ],
  },
  {
    label: 'Artikel',
    children: [
      { href: '/tempat-wisata-bengkulu', label: 'Wisata Bengkulu' },
      { href: '/wisata-pantai-panjang-bengkulu', label: 'Pantai Panjang' },
      { href: '/jarak-jambi-bengkulu', label: 'Jarak Jambi–Bengkulu' },
      { href: '/bengkulu-ke-palembang-berapa-jam', label: 'Bengkulu–Palembang Berapa Jam' },
    ],
  },
  {
    label: 'Hotel',
    children: [
      { href: '/daftar-hotel-di-bengkulu', label: '🏨 Semua Hotel di Bengkulu' },
      { href: '/hotel-di-kota-bengkulu', label: 'Hotel di Kota Bengkulu' },
      { href: '/hotel-di-curup', label: 'Hotel di Curup' },
      { href: '/hotel-syariah-di-curup', label: 'Hotel Syariah di Curup' },
      { href: '/hotel-di-lebong', label: 'Hotel di Lebong' },
      { href: '/hotel-syariah-di-lebong', label: 'Hotel Syariah di Lebong' },
    ],
  },
  {
    label: 'Kuliner',
    children: [
      { href: '/makanan-khas-bengkulu', label: '🍽️ Semua Makanan Khas Bengkulu' },
      { href: '/makanan-khas-kota-bengkulu', label: 'Makanan Khas Kota Bengkulu' },
      { href: '/makanan-khas-curup', label: 'Makanan Khas Curup' },
      { href: '/makanan-khas-lebong', label: 'Makanan Khas Lebong' },
    ],
  },
  { href: '/#kontak', label: 'Kontak' },
];

// ─── Mapping pathname → route ID ─────────────────────────────────────────────
//
// Setiap halaman produk dipetakan ke route ID di routes.ts.
// Navbar membaca pathname saat ini lalu mengambil harga dari ROUTES —
// tidak perlu event, tidak perlu DOM attribute.
//
const PATH_TO_ROUTE_ID: Record<string, string> = {
  '/travel-bengkulu-palembang':   'bkl-plm',
  '/travel-palembang-bengkulu':   'plm-bkl',
  '/travel-bengkulu-jambi':       'bkl-jmb',
  '/travel-jambi-bengkulu':       'jmb-bkl',
  '/travel-bengkulu-curup':       'bkl-crp',
  '/travel-curup-bengkulu':       'crp-bkl',
  '/antar-jemput-bandara-curup':  'crp-bnd',
  '/travel-bengkulu-lebong':      'bkl-lbg',
  '/travel-lebong-bengkulu':      'lbg-bkl',
  '/travel-bengkulu-lampung':     'bkl-lmp',
  '/travel-lampung-bengkulu':     'lmp-bkl',
};

function useRouteFromPath() {
  const pathname = usePathname();
  const routeId = PATH_TO_ROUTE_ID[pathname] ?? null;
  const route = routeId ? getRouteById(routeId) : null;
  return route ?? null;
}

// ─── Tombol Pesan dengan shimmer ─────────────────────────────────────────────
function PesanButton({ href }: { href: string }) {
  return (
    <>
      <style>{`
        @keyframes shimmer-slide {
          0%   { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(350%) skewX(-20deg); }
        }
        .btn-pesan {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }
        .btn-pesan::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.45) 50%,
            transparent 100%
          );
          width: 60%;
          animation: shimmer-slide 2.4s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }
        .btn-pesan > * {
          position: relative;
          z-index: 2;
        }
      `}</style>

      <Link
        href={href}
        className="btn-pesan inline-flex items-center gap-2 rounded-xl
          bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700
          px-4 py-2 text-sm font-bold text-white shadow-md shadow-primary-500/30
          hover:shadow-lg hover:shadow-primary-500/40 hover:scale-[1.03]
          active:scale-[0.98] transition-all duration-200 select-none"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 0 0-4 0v2"/>
          <path d="M8 7V5a2 2 0 0 0-4 0v2"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
          <line x1="8" y1="16" x2="12" y2="16"/>
        </svg>
        <span className="hidden sm:inline">Pesan Tiket</span>
        <span className="sm:hidden">Pesan</span>
      </Link>
    </>
  );
}

// ─── Navbar utama ─────────────────────────────────────────────────────────────
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const route = useRouteFromPath();

  // Kalau halaman punya rute → bawa route ID & harga ke form pemesanan.
  // Kalau tidak (homepage, artikel, hotel, dll) → buka /pesan biasa.
  const pesanHref = route
    ? `/pesan?rute=${route.id}`
    : '/pesan';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openDropdown = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdown(label);
  };
  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setDropdown(null), 120);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-[0_2px_24px_rgba(0,0,0,0.08)] border-b border-slate-100'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-100/80'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[62px] flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-9 h-9">
            <Image
              src="/logo.png"
              alt="Bengkulu Travel Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-slate-800 text-[15px] tracking-tight">BENGKULU</div>
            <div className="font-semibold text-primary-600 text-[11px] tracking-wider uppercase -mt-0.5">Travel.COM</div>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="relative">
                <button
                  className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50/70 flex items-center gap-1"
                  onMouseEnter={() => openDropdown(link.label)}
                  onMouseLeave={closeDropdown}
                >
                  {link.label}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdown === link.label ? 'rotate-180 text-primary-500' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                <div
                  className={`absolute top-full left-0 mt-2 transition-all duration-200 origin-top-left
                    ${dropdown === link.label
                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                    }`}
                  onMouseEnter={() => openDropdown(link.label)}
                  onMouseLeave={closeDropdown}
                >
                  <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 py-2 min-w-[230px] overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-primary-500 to-primary-300 mx-3 mb-2 rounded-full" />
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-2 px-4 py-2 text-[13px] text-slate-600 hover:text-primary-600 hover:bg-primary-50/60 transition-colors"
                      >
                        <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-primary-50/70"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* ── CTA + Hamburger ── */}
        <div className="flex items-center gap-2 shrink-0">
          <PesanButton href={pesanHref} />

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Buka menu navigasi"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-white border-t border-slate-100 px-4 py-3 space-y-1 overflow-y-auto max-h-[80vh]">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  onClick={() => setExpandedMobile(expandedMobile === link.label ? null : link.label)}
                  className="w-full flex items-center justify-between py-2.5 px-3 text-[13px] font-semibold text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-colors"
                >
                  {link.label}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${expandedMobile === link.label ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedMobile === link.label && (
                  <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-primary-100 pl-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block py-2 px-2 text-sm text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                onClick={() => setOpen(false)}
                className="block py-2.5 px-3 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            )
          )}

          {/* Mobile CTA */}
          <div className="pt-2 pb-1">
            <Link
              href={pesanHref}
              onClick={() => setOpen(false)}
              className="btn-pesan flex items-center justify-center gap-2 w-full py-3 rounded-xl
                bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700
                text-white font-bold text-sm shadow-md shadow-primary-500/20"
            >
              🎫 Pesan Tiket Sekarang
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
