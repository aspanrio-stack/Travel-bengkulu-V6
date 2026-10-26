import Stars from './Stars';
import { getPublishedReviews, type PublicReview } from '@/lib/reviews';

function Avatar({ r }: { r: PublicReview }) {
  if (r.avatar_url && !r.is_anonymous) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={r.avatar_url} alt="" width={40} height={40} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-10 w-10 shrink-0 rounded-full object-cover" />
    );
  }
  return (
    <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white">
      {r.is_anonymous ? '👤' : r.display_name.charAt(0).toUpperCase()}
    </span>
  );
}

/**
 * Ulasan pelanggan di beranda — 6 ulasan terbaru yang is_published = true.
 * Server component tanpa JS di browser. Data di-cache 5 menit (lihat getPublishedReviews),
 * sehingga beranda tetap statis. Jika belum ada ulasan → tidak merender apa pun.
 */
export default async function CustomerReviewsCard() {
  const reviews = await getPublishedReviews(6);
  if (reviews.length === 0) return null;

  return (
    <section aria-labelledby="ulasan-pelanggan" className="bg-slate-50 py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 text-center md:mb-10">
          <h2 id="ulasan-pelanggan" className="section-title">Kata Pelanggan Kami</h2>
          <p className="section-subtitle">Pengalaman nyata dari penumpang Travel Bengkulu.</p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map(r => (
            <li key={r.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <Stars value={r.rating} />
              <p className="mt-3 line-clamp-5 flex-1 whitespace-pre-line break-words text-sm leading-relaxed text-slate-700">{r.comment}</p>
              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                <Avatar r={r} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{r.display_name}</p>
                  <p className="truncate text-xs text-slate-600">
                    {r.route ? `${r.route} · ` : ''}
                    {new Date(r.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
