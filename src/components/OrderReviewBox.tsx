import Link from 'next/link';
import Stars from './Stars';
import { isReviewable, REVIEW_MIN_HOURS_MANUAL, type OwnReview } from '@/lib/reviews';
import type { Order } from '@/lib/orders';

/**
 * Blok ulasan di dalam kartu pesanan (/profil). Server component.
 *  - Sudah diulas                         → kotak "ULASAN ANDA" + tombol Edit di pojok kanan atas
 *  - Belum diulas & lewat 8 jam berangkat → tombol "Beri Ulasan"
 *  - Selain itu                           → tidak menampilkan apa pun
 */
export default function OrderReviewBox({ order, review }: { order: Order; review?: OwnReview }) {
  const href = `/review?order=${encodeURIComponent(order.id)}`;

  if (review) {
    return (
      <div className="mt-3 rounded-xl border border-primary-100 bg-primary-50 p-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-bold tracking-wider text-primary-800">ULASAN ANDA</p>
          <Link
            href={href}
            className="-mr-1 -mt-1 shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold text-primary-800 ring-1 ring-primary-200 hover:bg-white"
            aria-label={`Edit ulasan untuk pesanan ${order.id}`}
          >
            Edit
          </Link>
        </div>
        <div className="mt-1"><Stars value={review.rating} /></div>
        <p className="mt-1.5 whitespace-pre-line break-words text-sm text-slate-700">{review.comment}</p>
      </div>
    );
  }

  if (!isReviewable(order, REVIEW_MIN_HOURS_MANUAL)) return null;

  return (
    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 p-3">
      <p className="text-sm text-slate-700">Bagaimana perjalanan Anda?</p>
      <Link href={href} className="shrink-0 rounded-lg bg-primary-700 px-3.5 py-2 text-sm font-bold text-white hover:bg-primary-800">
        Beri Ulasan
      </Link>
    </div>
  );
}
