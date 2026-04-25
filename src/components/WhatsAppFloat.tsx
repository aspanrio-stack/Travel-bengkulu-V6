'use client';
import { usePathname } from 'next/navigation';

// ── Map pathname ke pesan WA yang relevan ──
const pesanMap: Record<string, string> = {
  '/travel-bengkulu-palembang': 'Halo Travel Bengkulu, saya ingin pesan travel Bengkulu ke Palembang',
  '/travel-palembang-bengkulu': 'Halo Travel Bengkulu, saya ingin pesan travel Palembang ke Bengkulu',
  '/travel-bengkulu-jambi':     'Halo Travel Bengkulu, saya ingin pesan travel Bengkulu ke Jambi',
  '/travel-jambi-bengkulu':     'Halo Travel Bengkulu, saya ingin pesan travel Jambi ke Bengkulu',
  '/travel-bengkulu-curup':     'Halo Travel Bengkulu, saya ingin pesan travel Bengkulu ke Curup',
  '/travel-curup-bengkulu':     'Halo Travel Bengkulu, saya ingin pesan travel Curup ke Bengkulu',
  '/travel-bengkulu-lebong':    'Halo Travel Bengkulu, saya ingin pesan travel Bengkulu ke Lebong',
  '/travel-lebong-bengkulu':    'Halo Travel Bengkulu, saya ingin pesan travel Lebong ke Bengkulu',
  '/travel-bengkulu-lampung':   'Halo Travel Bengkulu, saya ingin pesan travel Bengkulu ke Lampung',
  '/travel-lampung-bengkulu':   'Halo Travel Bengkulu, saya ingin pesan travel Lampung ke Bengkulu',
  '/travel-curup-bandara-bengkulu': 'Halo Travel Bengkulu, saya ingin pesan antar jemput Curup ke Bandara Bengkulu',
  '/antar-jemput-bandara-curup':    'Halo Travel Bengkulu, saya ingin pesan antar jemput Bandara ke Curup',
  '/rental-mobil-curup':        'Halo Travel Bengkulu, saya ingin info rental mobil di Curup',
  '/kirim-paket-bengkulu-palembang': 'Halo Travel Bengkulu, saya ingin kirim paket Bengkulu ke Palembang',
  '/pesan':                     'Halo Travel Bengkulu, saya ingin pesan travel',
  '/pembayaran':                'Halo Travel Bengkulu, saya ingin konfirmasi pembayaran',
  '/hotel-di-curup':            'Halo Travel Bengkulu, saya ingin info travel ke Curup sekaligus hotel',
  '/hotel-di-lebong':           'Halo Travel Bengkulu, saya ingin info travel ke Lebong sekaligus hotel',
};

// Pesan default untuk halaman yang tidak ada di map
const pesanDefault = 'Halo Travel Bengkulu, saya ingin informasi layanan travel';

export default function WhatsAppFloat() {
  const pathname = usePathname();

  // Ambil pesan sesuai halaman, fallback ke default
  const pesan = pesanMap[pathname] || pesanDefault;
  const waUrl = `https://wa.me/6285268645461?text=${encodeURIComponent(pesan)}`;

  const handleClick = () => {
    // Track ke Redis — silent
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'wa_float', page: pathname }),
    }).catch(() => {});
  };

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Hubungi Travel Bengkulu via WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl wa-float transition-colors group"
      title="Chat WhatsApp Travel Bengkulu"
    >
      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {/* Tooltip pesan preview */}
      <span className="absolute right-16 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg max-w-[200px] truncate">
        Chat via WhatsApp
      </span>
    </a>
  );
}
