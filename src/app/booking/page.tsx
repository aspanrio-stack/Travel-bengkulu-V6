'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function BookingForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    route: '',
    passengers: '1',
    price: 250000, // Harga default
  });

  // Ambil rute dari URL & Atur harga otomatis
  useEffect(() => {
    const routeParam = searchParams.get('route') || '';
    const formattedRoute = routeParam.replace(/-/g, ' ');
    setFormData(prev => ({ 
      ...prev, 
      route: formattedRoute,
      price: formattedRoute.includes('Curup') ? 80000 : 250000 
    }));

    // Load Script Midtrans Snap
    const script = document.createElement('script');
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js"; // Ganti ke app.midtrans.com saat Production
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
    script.async = true;
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, [searchParams]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.token) {
        (window as any).snap.pay(data.token, {
          onSuccess: function(result: any) {
            // KIRIM KONFIRMASI KE WA
            const text = `Halo Admin, saya sudah membayar tiket travel!%0A%0A` +
                         `Order ID: ${result.order_id}%0A` +
                         `Nama: ${formData.name}%0A` +
                         `Rute: ${formData.route}%0A` +
                         `Total: ${result.gross_amount}`;
            window.open(`https://wa.me/6285268645461?text=${text}`, '_blank');
          },
          onPending: () => alert('Selesaikan pembayaran Anda'),
          onError: () => alert('Pembayaran gagal, silakan coba lagi'),
        });
      }
    } catch (err) {
      alert('Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-4 border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800">Detail Penumpang</h2>
      <input 
        required type="text" placeholder="Nama Lengkap" 
        className="w-full p-3 border rounded-xl"
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <input 
        required type="tel" placeholder="Nomor WhatsApp" 
        className="w-full p-3 border rounded-xl"
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
      />
      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-600">Rute: <span className="font-bold">{formData.route || 'Pilih di halaman depan'}</span></p>
        <p className="text-lg font-bold text-blue-800">Total: Rp {(formData.price * parseInt(formData.passengers)).toLocaleString()}</p>
      </div>
      <button 
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md"
      >
        {loading ? 'Memproses...' : 'Bayar via QRIS / Transfer'}
      </button>
    </form>
  );
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Pembayaran Tiket</h1>
        <p className="text-slate-500">Selesaikan pembayaran untuk mengamankan kursi Anda.</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <BookingForm />
      </Suspense>
    </main>
  );
}
