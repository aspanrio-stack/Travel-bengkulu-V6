import type { Metadata } from 'next';
import BookingForm from '@/components/BookingForm';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Pesan Tiket Travel Bengkulu – Konfirmasi via WhatsApp Bisa Tunai & QRIS',
  description: 'Pesan tiket travel Bengkulu secara online. Isi form, konfirmasi via WhatsApp, bayar tunai ke driver. atau bayar online Mudah dan cepat!',
};

// Next.js 15: searchParams harus di-await sebagai Promise
export default async function PesanPage({
  searchParams,
}: {
  searchParams: Promise<{ rute?: string }>;
}) {
  const params = await searchParams;
  const routeId = params.rute || '';
  const selectedRoute = ROUTES.find(r => r.id === routeId);

  return (
    <div className="min-h-screen pt-16 bg-slate-50">
      <div className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            {selectedRoute
              ? `Pesan Travel ${selectedRoute.from} → ${selectedRoute.to}`
              : 'Pesan Tiket Travel Bengkulu'}
          </h1>
          <p className="text-primary-100 text-lg">
            Isi form, kirim via WhatsApp, driver kami segera konfirmasi keberangkatan Anda.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5 text-sm">
            {[
              '✅ Mudah & Cepat',
              '💬 Konfirmasi via WhatsApp',
              '📱 Bayar via QRIS',
              '🚗 Door to Door',
            ].map(f => (
              <span key={f} className="bg-white/20 px-3 py-1.5 rounded-full font-medium">{f}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <BookingForm preselectedRouteId={routeId} />
      </div>
    </div>
  );
}
