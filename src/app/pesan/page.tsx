import type { Metadata } from 'next';
import BookingForm from '@/components/BookingForm';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Pesan Tiket Travel Bengkulu – Bayar QRIS & Transfer Bank',
  description: 'Pesan tiket travel Bengkulu secara online. Pilih rute, isi data, bayar via QRIS atau transfer bank. Tiket muncul langsung di layar setelah bayar.',
};

export default function PesanPage({
  searchParams,
}: {
  searchParams: { rute?: string };
}) {
  const routeId = searchParams.rute || '';
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
            Isi data, bayar via QRIS atau Transfer Bank, tiket langsung muncul di layar.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5 text-sm">
            {['✅ Booking 24 Jam', '🎫 Tiket Langsung Muncul', '🔒 Pembayaran Aman', '🚗 Door to Door'].map(f => (
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
