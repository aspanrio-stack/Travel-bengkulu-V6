import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { formatRp } from '@/lib/orders';
import { rateLimited } from '@/lib/reviews';
import { getTicketByToken, isValidTokenFormat, TICKET_RETENTION_DAYS } from '@/lib/tickets';

// Publik, tanpa login, READ-ONLY (tidak mengubah data apa pun). Per-tiket → jangan diindeks/di-cache.
export const metadata: Metadata = {
  title: 'Verifikasi Keaslian Tiket',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-6 md:pt-24">
      <div className="mx-auto max-w-lg space-y-4 px-4">{children}</div>
    </div>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <Shell>
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <h1 className="font-display text-xl font-bold text-slate-800">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{body}</p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-primary-700 underline underline-offset-4">Ke Beranda</Link>
      </div>
    </Shell>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-right text-sm font-semibold text-slate-800 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : '';

  // Batasi tebak-tebakan token (30 permintaan/menit per IP); cek berulang secara wajar tetap aman
  const h = await headers();
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (await rateLimited(`verify:${ip}`, 30, 60)) {
    return <Notice title="Terlalu banyak permintaan" body="Silakan tunggu sebentar lalu scan ulang QR pada tiket." />;
  }

  if (!isValidTokenFormat(token)) {
    return <Notice title="Tiket tidak valid" body="Tautan verifikasi tidak lengkap. Scan ulang QR pada tiket PDF." />;
  }

  const lookup = await getTicketByToken(token);
  if (lookup.status === 'unavailable') {
    return <Notice title="Layanan sedang tidak tersedia" body="Verifikasi belum dapat diproses saat ini. Silakan coba lagi beberapa saat lagi." />;
  }
  if (lookup.status === 'not-found') {
    return (
      <Notice
        title="Tiket tidak ditemukan"
        body={`Token ini tidak terdaftar, atau data tiket sudah melewati masa simpan ${Math.round(TICKET_RETENTION_DAYS / 30)} bulan dan telah dihapus. Hubungi admin jika Anda merasa ini keliru.`}
      />
    );
  }

  const t = lookup.ticket;
  return (
    <Shell>
      <div className="rounded-2xl bg-emerald-50 p-6 text-center shadow-sm">
        <p className="text-xs font-bold tracking-widest text-emerald-700">STATUS TIKET</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-emerald-700">VALID · RESMI</h1>
        <p className="mt-2 text-sm text-slate-600">Tiket ini asli dan diterbitkan resmi oleh Travel Bengkulu.</p>
      </div>

      <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
        <Row label="Nama Penumpang" value={t.passenger_name} />
        <Row label="Rute" value={t.route} />
        <Row label="Tanggal Keberangkatan" value={t.travel_date} />
        {t.departure_time && <Row label="Jam Berangkat" value={t.departure_time} />}
        <Row label="Kursi" value={`${t.passengers} kursi`} />
        <Row label="Harga" value={formatRp(t.total_price)} />
        <Row label="No. Pesanan" value={t.order_id} mono />
      </div>

      <p className="px-2 text-center text-xs text-slate-500">
        Halaman ini hanya untuk memeriksa keaslian tiket dan bisa dibuka berulang kali tanpa mengubah data apa pun.
        Data verifikasi disimpan {Math.round(TICKET_RETENTION_DAYS / 30)} bulan sejak tiket terbit, lalu dihapus otomatis.
      </p>
    </Shell>
  );
}
