import type { Metadata } from 'next';
import BookingForm from '@/components/BookingForm';

export const metadata: Metadata = {
  title: 'Pesan Tiket Travel Bengkulu – Bayar QRIS & Transfer Bank',
  description: 'Pesan tiket travel Bengkulu secara online. Pilih rute, isi data, bayar via QRIS atau transfer bank. Tiket dikirim otomatis ke email Anda.',
};

export default function PesanPage() {
  return (
    <div className="min-h-screen pt-16 bg-slate-50">
      <div className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Pesan Tiket Travel Bengkulu
          </h1>
          <p className="text-primary-100 text-lg">
            Isi form di bawah, bayar via QRIS atau Transfer Bank, tiket langsung dikirim ke email Anda.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5 text-sm">
            {['✅ Booking Online 24 Jam', '📧 Tiket via Email', '🔒 Pembayaran Aman', '🚗 Door to Door'].map(f => (
              <span key={f} className="bg-white/20 px-3 py-1.5 rounded-full font-medium">{f}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <BookingForm />
      </div>
    </div>
  );
}
