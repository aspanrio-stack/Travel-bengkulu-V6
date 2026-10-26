'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuthUser } from '@/lib/useAuthUser';

/** Pill akun di pojok kanan atas hero (HP). Menampilkan foto Google jika ada. SDK Supabase hanya dimuat jika cookie sesi ada (menjaga PageSpeed). */
export default function HomeGreeting() {
  const user = useAuthUser();
  const [broken, setBroken] = useState(false);

  const name = user?.name ?? null;
  const first = name?.trim().split(/\s+/)[0];
  const photo = user?.avatar && !broken ? user.avatar : null;

  return (
    <Link
      href={name ? '/profil' : '/masuk'}
      className="md:hidden flex max-w-[45vw] items-center gap-2 rounded-full bg-white/15 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white ring-1 ring-white/30"
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          width={28}
          height={28}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
          className="h-7 w-7 shrink-0 rounded-full bg-white/25 object-cover"
        />
      ) : (
        <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/25 text-xs font-bold uppercase">
          {first ? first[0] : '👤'}
        </span>
      )}
      <span className="truncate">{first ?? 'Masuk'}</span>
    </Link>
  );
}
