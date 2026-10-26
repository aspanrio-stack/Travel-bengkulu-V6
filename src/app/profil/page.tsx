import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/server';
import { getOrdersByUser, formatRp, type Order } from '@/lib/orders';
import LogoutButton from '@/components/LogoutButton';
import SavedAddressList from '@/components/SavedAddressList';
import OrderReviewBox from '@/components/OrderReviewBox';
import { getReviewsByOrderIds, type OwnReview } from '@/lib/reviews';

export const metadata: Metadata = { title: 'Profil & Pesanan Saya', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

const STATUS: Record<Order['status'], { label: string; cls: string }> = {
  pending:   { label: 'Menunggu', cls: 'bg-amber-50 text-amber-700' },
  success:   { label: 'Terkonfirmasi', cls: 'bg-green-50 text-green-700' },
  cancelled: { label: 'Dibatalkan', cls: 'bg-red-50 text-red-700' },
};

export default async function ProfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/masuk?next=/profil');

  const meta = user.user_metadata ?? {};
  const name: string = meta.full_name || meta.name || user.email?.split('@')[0] || 'Traveler';

  let orders: Order[] = [];
  let loadError = false;
  try { orders = await getOrdersByUser(user.id); } catch { loadError = true; }

  // Ulasan untuk semua pesanan di atas (satu query). Gagal ≠ halaman error: tombol ulasan saja yang tidak muncul.
  let reviews: Record<string, OwnReview> = {};
  try { reviews = await getReviewsByOrderIds(orders.map(o => o.id)); } catch { /* abaikan */ }

  const upcoming = orders.filter(o => o.status !== 'cancelled' && o.date >= new Date().toISOString().slice(0, 10));

  return (
    <div className="min-h-screen bg-slate-50 pt-6 md:pt-20 pb-10">
      <div className="mx-auto max-w-2xl space-y-5 px-4">
        <section className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
          {meta.avatar_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={meta.avatar_url} alt="" className="h-16 w-16 rounded-full" referrerPolicy="no-referrer" />
            : <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">{name[0]?.toUpperCase()}</span>}
          <div className="min-w-0">
            <h1 className="truncate font-display text-xl font-bold text-slate-800">{name}</h1>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-primary-800 to-primary-600 p-5 text-white">
          <p className="font-display text-lg font-bold">Jelajahi Bengkulu, nikmati perjalanannya.</p>
          <p className="mt-1 text-sm text-primary-100">{upcoming.length > 0 ? `${upcoming.length} perjalanan akan datang` : 'Belum ada perjalanan mendatang'}</p>
          <Link href="/pesan" className="mt-3 inline-block rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary-800">Pesan Sekarang</Link>
        </section>

        <section id="pesanan">
          <h2 className="mb-3 font-display text-lg font-bold text-slate-800">Pesanan Saya</h2>
          {loadError && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Riwayat belum bisa dimuat. Coba lagi sebentar lagi.</p>}
          {!loadError && orders.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
              Belum ada pesanan. Pesanan yang dibuat saat Anda login akan muncul di sini.
            </div>
          )}
          <ul className="space-y-3">
            {orders.map(o => (
              <li key={o.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{o.route}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{o.date} · {o.passengers} orang · No. <span className="font-mono">{o.id}</span></p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS[o.status].cls}`}>{STATUS[o.status].label}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                  <span className="text-slate-500">{o.paymentMethod === 'qris' ? 'QRIS' : 'Tunai ke driver'}</span>
                  <span className="font-bold text-primary-700">{formatRp(o.total)}</span>
                </div>
                <OrderReviewBox order={o} review={reviews[o.id]} />
              </li>
            ))}
          </ul>
        </section>

        <SavedAddressList />

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {[
            { href: '/destinasi', label: 'Jelajahi Destinasi' },
            { href: '/pesan?mode=rental', label: 'Rental Mobil' },
            { href: 'https://wa.me/6282374497929', label: 'Bantuan via WhatsApp' },
          ].map(i => (
            <Link key={i.href} href={i.href} className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 text-sm text-slate-700 last:border-0 hover:bg-slate-50">
              {i.label}<span aria-hidden className="text-slate-400">›</span>
            </Link>
          ))}
        </section>

        <LogoutButton />
      </div>
    </div>
  );
}
