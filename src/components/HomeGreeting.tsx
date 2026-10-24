'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

/** Pill akun di pojok kanan atas hero (HP). SDK Supabase hanya dimuat jika cookie sesi ada (menjaga PageSpeed). */
export default function HomeGreeting() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!/(^|;\s*)sb-[^=]*-auth-token/.test(document.cookie)) return;
    import('@/lib/supabase/client').then(async ({ createClient, supabaseReady }) => {
      if (!supabaseReady) return;
      const { data } = await createClient().auth.getUser();
      const u = data.user;
      if (u) setName(u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || null);
    });
  }, []);

  const first = name?.trim().split(/\s+/)[0];

  return (
    <Link
      href={name ? '/profil' : '/masuk'}
      className="md:hidden flex max-w-[45vw] items-center gap-2 rounded-full bg-white/15 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white ring-1 ring-white/30"
    >
      <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/25 text-xs font-bold uppercase">
        {first ? first[0] : '👤'}
      </span>
      <span className="truncate">{first ?? 'Masuk'}</span>
    </Link>
  );
}
