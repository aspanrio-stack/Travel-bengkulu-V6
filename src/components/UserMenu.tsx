'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Tombol Masuk / avatar di navbar desktop.
 * Perf: SDK Supabase TIDAK dimuat di halaman publik kecuali cookie sesi
 * (sb-…-auth-token) ada — halaman SEO tetap ringan.
 */
export default function UserMenu() {
  const [user, setUser] = useState<{ name: string; avatar?: string } | null>(null);

  useEffect(() => {
    if (!/(^|;\s*)sb-[^=]*-auth-token/.test(document.cookie)) return;
    let alive = true;
    import('@/lib/supabase/client').then(async ({ createClient, supabaseReady }) => {
      if (!supabaseReady) return;
      const { data } = await createClient().auth.getUser();
      const u = data.user;
      if (alive && u) {
        const m = u.user_metadata ?? {};
        setUser({ name: m.full_name || m.name || u.email?.split('@')[0] || 'Akun', avatar: m.avatar_url });
      }
    });
    return () => { alive = false; };
  }, []);

  if (!user) {
    return (
      <Link href="/masuk" className="hidden md:inline-flex rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
        Masuk
      </Link>
    );
  }
  return (
    <Link href="/profil" className="hidden md:inline-flex items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
      {user.avatar
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={user.avatar} alt="" className="h-7 w-7 rounded-full" referrerPolicy="no-referrer" />
        : <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs text-white">{user.name[0]?.toUpperCase()}</span>}
      <span className="max-w-[90px] truncate">{user.name}</span>
    </Link>
  );
}
