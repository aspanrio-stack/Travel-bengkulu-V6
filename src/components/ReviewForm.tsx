'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Props {
  /** Salah satu: token (dari email) atau orderId (dari /profil, user login) */
  token?: string;
  orderId?: string;
  initialRating: number;
  initialComment: string;
  initialAnonymous: boolean;
  isEdit: boolean;
  /** Tujuan tombol "Kembali" setelah sukses */
  backHref: string;
}

const LABELS = ['', 'Sangat buruk', 'Kurang baik', 'Cukup', 'Baik', 'Sangat baik'];
const MIN = 10;
const MAX = 600;

export default function ReviewForm({ token, orderId, initialRating, initialComment, initialAnonymous, isEdit, backHref }: Props) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [anonymous, setAnonymous] = useState(initialAnonymous);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<null | 'created' | 'updated'>(null);

  const len = comment.trim().length;
  const shown = hover || rating;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (rating < 1) return setError('Pilih rating bintang terlebih dahulu.');
    if (len < MIN) return setError(`Komentar minimal ${MIN} karakter.`);
    setBusy(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, orderId, rating, comment, anonymous }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan ulasan.');
      setDone(data.updated ? 'updated' : 'created');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan ulasan.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="rounded-2xl bg-white p-6 text-center shadow-sm">
        <p className="text-4xl" aria-hidden>🙏</p>
        <h2 className="mt-2 font-display text-xl font-bold text-slate-800">
          {done === 'updated' ? 'Ulasan diperbarui' : 'Terima kasih atas ulasan Anda!'}
        </h2>
        <p className="mt-1 text-sm text-slate-600">Masukan Anda sangat berarti bagi kami dan calon penumpang lain.</p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href={backHref} className="rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-bold text-white">Kembali</Link>
          <Link href="/" className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700">Ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-5 shadow-sm" noValidate>
      <fieldset>
        <legend className="text-sm font-semibold text-slate-800">Bagaimana perjalanan Anda?</legend>
        <div className="mt-2 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} bintang — ${LABELS[n]}`}
              aria-pressed={rating === n}
              className={`h-11 w-11 rounded-lg text-4xl leading-none transition-transform active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${n <= shown ? 'text-amber-500' : 'text-slate-300'}`}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-sm font-semibold text-slate-600" aria-live="polite">{LABELS[shown]}</span>
        </div>
      </fieldset>

      <div>
        <label htmlFor="comment" className="text-sm font-semibold text-slate-800">Ceritakan pengalaman Anda</label>
        <textarea
          id="comment"
          value={comment}
          onChange={e => setComment(e.target.value.slice(0, MAX))}
          rows={5}
          maxLength={MAX}
          placeholder="Ketepatan waktu, kenyamanan armada, keramahan pengemudi…"
          className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 placeholder:text-slate-500 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/30"
        />
        <p className={`mt-1 text-right text-xs ${len < MIN ? 'text-slate-500' : 'text-primary-700'}`}>
          {len}/{MAX} karakter (minimal {MIN})
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3">
        <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="mt-0.5 h-5 w-5 accent-primary-700" />
        <span className="text-sm text-slate-700">
          <strong className="block text-slate-800">Tampilkan sebagai Anonim</strong>
          Nama dan foto Anda tidak ditampilkan di website.
        </span>
      </label>

      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-primary-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-800 disabled:opacity-60"
      >
        {busy ? 'Menyimpan…' : isEdit ? 'Simpan Perubahan' : 'Kirim Ulasan'}
      </button>
    </form>
  );
}
