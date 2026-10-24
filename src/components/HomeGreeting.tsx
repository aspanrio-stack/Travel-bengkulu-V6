'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

/** Sapaan di Home. SDK Supabase hanya dimuat jika cookie sesi ada (menjaga PageSpeed). */
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

  return (
    <div className="flex items-center justify-between md:hidden">
      <div>
        <p className="text-sm text-primary-100">Halo, {name ?? 'Traveler'} 👋</p>
        <p className="text-base font-semibold text-white">Mau ke mana hari ini?</p>
      </div>
      {!name && (
        <Link href="/masuk" className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30">Masuk</Link>
      )}
    </div>
  );
}
