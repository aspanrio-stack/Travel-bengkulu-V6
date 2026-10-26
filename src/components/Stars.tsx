/** Bintang statis (server/client-safe, tanpa JS). Kontras: bintang kosong slate-300 hanya dekoratif. */
export default function Stars({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' }) {
  const cls = size === 'sm' ? 'text-base' : 'text-xl';
  return (
    <span role="img" aria-label={`Rating ${value} dari 5 bintang`} className={`inline-flex leading-none ${cls}`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} aria-hidden className={n <= value ? 'text-amber-500' : 'text-slate-300'}>★</span>
      ))}
    </span>
  );
}
