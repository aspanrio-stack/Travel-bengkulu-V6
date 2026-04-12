'use client';
import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  {
    label: 'Layanan',
    children: [
      { href: '/travel-bengkulu-palembang', label: 'Bengkulu ↔ Palembang' },
      { href: '/travel-bengkulu-jambi', label: 'Bengkulu ↔ Jambi' },
      { href: '/travel-bengkulu-curup', label: 'Bengkulu ↔ Curup' },
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
    ],
  },
  { href: '/#kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform">
            T
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-slate-900 text-sm md:text-base">Travel</div>
            <div className="font-display font-bold text-primary-600 text-sm md:text-base -mt-1">Bengkulu</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group/item">
              {link.children ? (
                <>
                  <button className="text-sm font-semibold text-slate-600 hover:text-primary-600 flex items-center gap-1">
                    {link.label}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 py-2">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link href={link.href} className="text-sm font-semibold text-slate-600 hover:text-primary-600">
                  {link.label}
                </Link>
              )}
            </div>
          ))}
          {/* Tombol ke Halaman Booking Internal */}
          <Link
            href="/booking"
            className="bg-primary-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
          >
            Pesan Tiket
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-slate-600"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-xl">
          {navLinks.map((link) => (
            <div key={link.label}>
              {link.children ? (
                <>
                  <button
                    onClick={() => setDropdown(dropdown === link.label ? null : link.label)}
                    className="flex items-center justify-between w-full text-sm font-bold text-slate-800"
                  >
                    {link.label}
                    <svg className={`w-4 h-4 transition-transform ${dropdown === link.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdown === link.label && (
                    <div className="mt-2 ml-4 space-y-3 border-l-2 border-slate-100 pl-4">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block text-sm text-slate-600"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  className="block text-sm font-bold text-slate-800"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
          
          {/* Menu Mobile: Tombol Utama ke Booking */}
          <Link
            href="/booking"
            className="btn-primary w-full justify-center"
            onClick={() => setOpen(false)}
          >
            Pesan Tiket Sekarang
          </Link>

          {/* Menu Mobile: Tombol WhatsApp sebagai Bantuan */}
          <a
            href="https://wa.me/6285268645461?text=Halo%20Travel%20Bengkulu%2C%20saya%20butuh%20bantuan%20pemesanan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-green-500 text-green-600 font-bold text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.98c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.43 5.63 1.43h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z\" />
            </svg>
            Bantuan WhatsApp
          </a>
        </div>
      )}
    </nav>
  );
}
