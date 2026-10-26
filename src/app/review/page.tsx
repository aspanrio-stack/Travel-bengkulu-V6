import type { Metadata } from 'next';
import Link from 'next/link';
import ReviewForm from '@/components/ReviewForm';
import { resolveReviewAccess, getReviewByOrderId, type AccessFail } from '@/lib/reviews';

// Halaman pribadi per pelanggan → jangan diindeks
export const metadata: Metadata = {
  title: 'Beri Ulasan Perjalanan',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

const MESSAGES: Record<Exclude<AccessFail, 'login-required' | 'not-eligible'>, { title: string; body: string }> = {
  'invalid-link': { title: 'Tautan tidak berlaku', body: 'Tautan ulasan ini tidak valid atau sudah melewati masa berlaku 60 hari.' },
  'no-access':    { title: 'Tidak dapat diakses', body: 'Pesanan ini bukan milik akun yang sedang masuk.' },
  'not-found':    { title: 'Pesanan tidak ditemukan', body: 'Data pesanan untuk tautan ini tidak ditemukan.' },
  'unavailable':  { title: 'Layanan sedang tidak tersedia', body: 'Fitur ulasan belum dapat dipakai saat ini. Silakan coba lagi nanti.' },
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-6 md:pt-24">
      <div className="mx-auto max-w-lg space-y-4 px-4">{children}</div>
    </div>
  );
}

function Notice({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <Shell>
      <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <h1 className="font-display text-xl font-bold text-slate-800">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{body}</p>
        <div className="mt-4">{action ?? <Link href="/" className="text-sm font-semibold text-primary-700 underline underline-offset-4">Ke Beranda</Link>}</div>
      </div>
    </Shell>
  );
}

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; order?: string; rating?: string }>;
}) {
  const sp = await searchParams;
  const token = typeof sp.token === 'string' ? sp.token : undefined;
  const orderParam = typeof sp.order === 'string' ? sp.order : undefined;

  const access = await resolveReviewAccess({ token, orderId: orderParam });

  if (!access.ok) {
    if (access.reason === 'login-required') {
      const next = `/review?order=${encodeURIComponent(orderParam ?? '')}`;
      return (
        <Notice
          title="Masuk untuk memberi ulasan"
          body="Silakan masuk dengan akun yang Anda pakai saat memesan."
          action={<Link href={`/masuk?next=${encodeURIComponent(next)}`} className="rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white">Masuk</Link>}
        />
      );
    }
    if (access.reason === 'not-eligible') {
      const when = access.availableAt
        ? access.availableAt.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) + ' WIB'
        : null;
      return (
        <Notice
          title="Ulasan belum dapat diberikan"
          body={`Ulasan dibuka setelah perjalanan selesai${when ? ` (mulai ${when})` : ''} dan pembayaran terkonfirmasi.`}
        />
      );
    }
    const m = MESSAGES[access.reason];
    return <Notice title={m.title} body={m.body} />;
  }

  const { order } = access;
  const existing = await getReviewByOrderId(order.id);
  const ratingParam = Number(sp.rating);
  // Edit: tampilkan ulasan lama. Baru: isi otomatis dari bintang yang diklik di email.
  const initialRating = existing?.rating ?? (Number.isInteger(ratingParam) && ratingParam >= 1 && ratingParam <= 5 ? ratingParam : 0);

  return (
    <Shell>
      <header className="text-center">
        <h1 className="font-display text-2xl font-bold text-slate-800">{existing ? 'Edit Ulasan Anda' : 'Beri Ulasan'}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {order.route} · {order.date}
        </p>
      </header>
      <ReviewForm
        token={access.via === 'token' ? token : undefined}
        orderId={access.via === 'session' ? order.id : undefined}
        initialRating={initialRating}
        initialComment={existing?.comment ?? ''}
        initialAnonymous={existing?.is_anonymous ?? false}
        isEdit={!!existing}
        backHref={access.via === 'session' ? '/profil#pesanan' : '/'}
      />
    </Shell>
  );
}
