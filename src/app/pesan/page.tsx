import type { Metadata } from 'next';
import BookingForm from '@/components/BookingForm';
import RentalForm from '@/components/RentalForm';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Pesan Travel & Rental Mobil Bengkulu – Konfirmasi via WhatsApp',
  description: 'Pesan tiket travel atau rental mobil Bengkulu secara online. Isi form, konfirmasi via WhatsApp, bayar tunai atau QRIS.',
};

export default async function PesanPage({
  searchParams,
}: {
  searchParams: Promise<{ rute?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const routeId = params.rute || '';
  const mode = params.mode === 'rental' ? 'rental' : 'travel';
  const selectedRoute = ROUTES.find(r => r.id === routeId);

  const isRental = mode === 'rental';

  return (
    <div className="min-h-screen pt-16 bg-slate-50">

      {/* Hero Header */}
      <div className={`text-white py-12 ${
        isRental
          ? 'bg-gradient-to-br from-amber-700 to-amber-500'
          : 'bg-gradient-to-br from-primary-800 to-primary-600'
      }`}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            {isRental
              ? 'Rental Mobil Bengkulu'
              : selectedRoute
                ? `Pesan Travel ${selectedRoute.from} → ${selectedRoute.to}`
                : 'Pesan Tiket Travel Bengkulu'}
          </h1>
          <p className={`text-lg ${isRental ? 'text-amber-100' : 'text-primary-100'}`}>
            {isRental
              ? 'Sewa mobil harian, dengan sopir atau lepas kunci. Unit siap diantar ke lokasi Anda.'
              : 'Isi form, kirim via WhatsApp, driver kami segera konfirmasi keberangkatan Anda.'}
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-5 text-sm">
            {isRental
              ? ['✅ Avanza · Innova · HiAce', '👨‍✈️ Dengan Sopir / Lepas Kunci', '📱 Bayar QRIS atau Tunai', '🚗 Unit Diantar ke Lokasi']
              : ['✅ Mudah & Cepat', '💬 Konfirmasi via WhatsApp', '📱 Bayar via QRIS', '🚗 Door to Door']
            }.map(f => (
              <span key={f} className="bg-white/20 px-3 py-1.5 rounded-full font-medium">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Mode Switch Tab */}
      <div className="max-w-3xl mx-auto px-4 -mt-1">
        <div className="bg-white rounded-t-2xl border border-slate-200 border-b-0 flex overflow-hidden shadow-sm">
          <a
            href="/pesan"
            className={`flex-1 py-3.5 text-center text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
              !isRental
                ? 'bg-primary-700 text-white'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            🚌 Travel Antar Kota
          </a>
          <a
            href="/pesan?mode=rental"
            className={`flex-1 py-3.5 text-center text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
              isRental
                ? 'bg-amber-600 text-white'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            🚗 Rental Mobil
          </a>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 pb-10">
        {isRental
          ? <RentalForm />
          : <BookingForm preselectedRouteId={routeId} />
        }
      </div>
    </div>
  );
}
