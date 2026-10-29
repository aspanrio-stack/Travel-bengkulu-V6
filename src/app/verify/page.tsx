import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import VerifyTicketAction from '@/components/VerifyTicketAction';
import { getSession } from '@/lib/auth';
import { rateLimited } from '@/lib/reviews';
import { getTicketByToken, isValidTokenFormat, maskPassengerName, TICKET_RETENTION_DAYS } from '@/lib/tickets';

// Halaman publik tanpa login, tapi per-tiket → jangan diindeks & jangan di-cache
export const metadata: Metadata = {
  title: 'Verifikasi Tiket',
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

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB';

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : '';

  // Batasi tebak-tebakan token (30 permintaan/menit per IP)
  const h = await headers();
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (await rateLimited(`verify:${ip}`, 30, 60)) {
    return <Notice title="Terlalu banyak permintaan" body="Silakan tunggu sebentar lalu scan ulang QR pada tiket Anda." />;
  }

  if (!isValidTokenFormat(token)) {
    return <Notice title="Tiket tidak valid" body="Tautan verifikasi tidak lengkap. Scan ulang QR pada tiket PDF Anda." />;
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
  const isStaff = Boolean(await getSession().catch(() => null));
  const used = t.is_verified;
  const name = isStaff ? t.passenger_name : maskPassengerName(t.passenger_name);

  return (
    <Shell>
      <div className={`rounded-2xl p-6 text-center shadow-sm ${used ? 'bg-amber-50' : 'bg-emerald-50'}`}>
        <p className={`text-xs font-bold tracking-widest ${used ? 'text-amber-700' : 'text-emerald-700'}`}>STATUS TIKET</p>
        <h1 className={`mt-1 font-display text-3xl font-bold ${used ? 'text-amber-700' : 'text-emerald-700'}`}>
          {used ? 'SUDAH DIGUNAKAN' : 'VALID'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {used
            ? `Tiket ini sudah divalidasi petugas pada ${t.verified_at ? fmtDateTime(t.verified_at) : '-'} dan tidak dapat dipakai lagi.`
            : 'Tiket asli, diterbitkan resmi oleh Travel Bengkulu.'}
        </p>
      </div>

      <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
        <Row label="Nama Penumpang" value={name} />
        <Row label="Rute" value={t.route} />
        <Row label="Tanggal" value={t.travel_date} />
        {t.departure_time && <Row label="Jam Berangkat" value={t.departure_time} />}
        <Row label="Jumlah Penumpang" value={`${t.passengers} orang`} />
        <Row label="No. Pesanan" value={t.order_id} mono />
      </div>

      {isStaff && !used && <VerifyTicketAction token={token} />}

      <p className="px-2 text-center text-xs text-slate-500">
        Data verifikasi disimpan {Math.round(TICKET_RETENTION_DAYS / 30)} bulan sejak tiket terbit, lalu dihapus otomatis.
        Nama penumpang disamarkan untuk menjaga privasi.
      </p>
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
