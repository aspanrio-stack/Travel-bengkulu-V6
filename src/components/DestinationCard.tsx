import Link from 'next/link';
import Image from 'next/image';
import type { Destination } from '@/lib/destinations';

export function DestImage({ d, className = '', priority = false, sizes }: { d: Destination; className?: string; priority?: boolean; sizes?: string }) {
  const src = d.images?.[0];
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${d.gradient} ${className}`}>
      {src
        ? <Image src={src} alt={`${d.name}, ${d.area}`} fill priority={priority} sizes={sizes ?? '(max-width:768px) 70vw, 25vw'} className="object-cover" />
        : <span aria-hidden className="absolute inset-0 flex items-center justify-center text-6xl opacity-90">{d.emoji}</span>}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
    </div>
  );
}

/** Kartu destinasi: `compact` = kartu vertikal untuk scroller horizontal di Home. */
export default function DestinationCard({ d, compact = false }: { d: Destination; compact?: boolean }) {
  return (
    <Link
      href={`/destinasi/${d.slug}`}
      className={`group relative block overflow-hidden rounded-3xl shadow-md shadow-slate-300/50 transition-transform active:scale-[0.98] ${
        compact ? 'h-52 w-40 shrink-0 snap-start' : 'h-56 w-full'
      }`}
    >
      <div className="absolute inset-0">
        <DestImage d={d} className="h-full w-full" sizes="(max-width:768px) 50vw, 25vw" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
        <h3 className="font-display text-base font-bold leading-tight">{d.name}</h3>
        <p className="mt-0.5 text-xs text-white/90">{d.area}</p>
      </div>
    </Link>
  );
}
