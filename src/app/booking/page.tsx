'use client';
import { useState } from 'react';

export default function BookingPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    passengers: '1',
    route: 'Bengkulu - Palembang'
  });

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const { token } = await res.json();

      // Memanggil Jendela Midtrans
      (window as any).snap.pay(token, {
        onSuccess: (result: any) => {
          window.location.href = `/tiket?order_id=${result.order_id}&status=success`;
        },
        onPending: (result: any) => {
          alert("Selesaikan pembayaranmu ya!");
        },
        onError: () => alert("Pembayaran gagal!"),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-2xl font-display font-bold text-slate-900 mb-6">Form Pemesanan</h1>
        
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nama Lengkap</label>
            <input required type="text" className="w-full p-3 rounded-xl border border-slate-200" 
              onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">No. WhatsApp</label>
            <input required type="tel" placeholder="08..." className="w-full p-3 rounded-xl border border-slate-200"
              onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Tanggal</label>
              <input required type="date" className="w-full p-3 rounded-xl border border-slate-200"
                onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Penumpang</label>
              <select className="w-full p-3 rounded-xl border border-slate-200"
                onChange={e => setFormData({...formData, passengers: e.target.value})}>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Orang</option>)}
              </select>
            </div>
          </div>
          
          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20"
          >
            {loading ? 'Memproses...' : 'Bayar Sekarang (QRIS/Transfer)'}
          </button>
        </form>
      </div>
    </div>
  );
}
