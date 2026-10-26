'use client';
import { useEffect, useState } from 'react';

export type AuthUser = { name: string; avatar?: string };

const SESSION_COOKIE = /(^|;\s*)sb-[^=]*-auth-token/;

// Satu panggilan getUser dibagi untuk semua komponen (HomeGreeting + BottomNav).
let inflight: Promise<AuthUser | null> | null = null;

function loadUser(): Promise<AuthUser | null> {
  if (!inflight) {
    inflight = import('@/lib/supabase/client')
      .then(async ({ createClient, supabaseReady }) => {
        if (!supabaseReady) return null;
        const { data } = await createClient().auth.getUser();
        const u = data.user;
        if (!u) return null;
        const m = u.user_metadata ?? {};
        return {
          name: m.full_name || m.name || u.email?.split('@')[0] || 'Akun',
          // Google: avatar_url / picture (hanya ada jika akun Gmail punya foto)
          avatar: (m.avatar_url || m.picture || undefined) as string | undefined,
        };
      })
      .catch(() => null);
    // Jangan simpan hasil lama terlalu lama (login/logout) — cukup untuk berbagi panggilan bersamaan.
    setTimeout(() => { inflight = null; }, 3000);
  }
  return inflight;
}

/**
 * Data user login (nama + foto). SDK Supabase hanya dimuat jika cookie sesi ada,
 * jadi pengunjung publik / PageSpeed tidak terbebani. `refreshKey` (mis. pathname)
 * memicu cek ulang setelah login lewat navigasi client-side.
 */
export function useAuthUser(refreshKey?: string): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!SESSION_COOKIE.test(document.cookie)) { setUser(null); return; }
    let alive = true;
    loadUser().then(u => { if (alive) setUser(u); });
    return () => { alive = false; };
  }, [refreshKey]);

  return user;
}
