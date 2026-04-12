'use client';
import { useSearchParams } from 'next/navigation';
import html2canvas from 'html2canvas'; // Import dipindah ke paling atas

export default function TicketPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const downloadTicket = () => {
    const element = document.getElementById('ticket-area');
    if (element) {
      html2canvas(element).then((canvas) => {
        const link = document.createElement('a');
        link.download = `tiket-${orderId}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const sendEmail = async () => {
    alert("Fitur kirim email sedang diproses...");
    // Logika kirim email nanti dipasang di sini
  };

  return (
    <div className="min-h-screen bg-slate-100 pt-28 pb-12 px-4 flex flex-col items-center">
      <div id="ticket-area" className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border-t-8 border-primary-600">
        <div className="p-6 text-center border-b border-dashed border-slate-200">
          <div className="text-primary-600 font-bold text-xl mb-1">E-TICKET</div>
          <div className="text-slate-400 text-xs font-mono">{orderId || 'TRV-12345'}</div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Status</span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">LUNAS ✅</span>
          </div>
          <div className="py-4 border-y border-slate-50 text-center font-bold text-slate-800">
             Konfirmasi Perjalanan
          </div>
        </div>

        <div className="bg-slate-50 p-6 text-center italic text-xs text-slate-500">
          Harap tunjukkan tiket ini saat penjemputan.
        </div>
      </div>

      <div className="mt-8 flex gap-4 w-full max-w-sm">
        <button 
          onClick={downloadTicket}
          className="flex-1 bg-white border border-slate-200 py-3 rounded-xl font-bold text-sm shadow-sm"
        >
          📸 Simpan Gambar
        </button>
        <button 
          onClick={sendEmail}
          className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary-600/20"
        >
          📧 Kirim Email
        </button>
      </div>
    </div>
  );
}
