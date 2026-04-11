import Link from 'next/link';

const WA = 'https://wa.me/6285268645461';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">T</div>
            <div className="leading-tight">
              <div className="font-display font-bold text-white text-sm">Travel</div>
              <div className="font-display font-bold text-primary-400 text-sm -mt-0.5">Bengkulu</div>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Jasa travel antar jemput door to door terpercaya melayani berbagai rute di Bengkulu dan sekitarnya.
          </p>
          <div className="mt-4 flex gap-3">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Layanan */}
        <div>
          <h4 className="font-semibold text-white mb-4">Layanan Travel</h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/travel-bengkulu-palembang', label: 'Travel Bengkulu–Palembang' },
              { href: '/travel-palembang-bengkulu', label: 'Travel Palembang–Bengkulu' },
              { href: '/travel-bengkulu-jambi', label: 'Travel Bengkulu–Jambi' },
              { href: '/travel-jambi-bengkulu', label: 'Travel Jambi–Bengkulu' },
              { href: '/travel-bengkulu-curup', label: 'Travel Bengkulu–Curup' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-400 hover:text-primary-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Layanan Lainnya */}
        <div>
          <h4 className="font-semibold text-white mb-4">Layanan Lainnya</h4>
          <ul className="space-y-2 text-sm">
            {[
              { href: '/rental-mobil-curup', label: 'Rental Mobil Curup' },
              { href: '/antar-jemput-bandara-curup', label: 'Antar Jemput Bandara' },
              { href: '/kirim-paket-bengkulu-palembang', label: 'Kirim Paket' },
              { href: '/tempat-wisata-bengkulu', label: 'Wisata Bengkulu' },
              { href: '/wisata-pantai-panjang-bengkulu', label: 'Pantai Panjang Bengkulu' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-400 hover:text-primary-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Kontak */}
        <div id="kontak">
          <h4 className="font-semibold text-white mb-4">Kontak Kami</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <svg className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>BTN Air Bang Curup, Bengkulu</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-4 h-4 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+6285268645461" className="hover:text-primary-400 transition-colors">0852-6864-5461</a>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-4 h-4 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <a href={WA} target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">WhatsApp 24 Jam</a>
            </li>
          </ul>

          <div className="mt-4 p-3 bg-slate-800 rounded-xl">
            <p className="text-xs text-slate-500 mb-1">Armada Kami</p>
            <p className="text-xs text-slate-300">🚗 Toyota Avanza &nbsp;|&nbsp; Toyota Innova &nbsp;|&nbsp; Toyota HiAce</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} BengkuluTravel.com — Semua hak dilindungi.
      </div>
    </footer>
  );
}
