'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export type AuthStatus = 'loading' | 'in' | 'out' | 'off';

/**
 * Banner ajakan login di form pemesanan.
 * - Tamu tetap bisa memesan (kecuali NEXT_PUBLIC_REQUIRE_LOGIN_TO_BOOK=true).
 * - Jika sudah login: nama/email diprefill, pesanan otomatis tertaut ke akun.
 */
export default function LoginPrompt({
  status, onStatus, onUser, nextUrl, required,
}: {
  status: AuthStatus;
  onStatus: (s: AuthStatus) => void;
  onUser: (u: { name: string; email: string }) => void;
  nextUrl: string;
  required: boolean;
}) {
  useEffect(() => {
    let alive = true;
    import('@/lib/supabase/client').then(async ({ createClient, supabaseReady }) => {
      if (!supabaseReady) { alive && onStatus('off'); return; }
      const { data } = await createClient().auth.getUser();
      if (!alive) return;
      const u = data.user;
      if (!u) { onStatus('out'); return; }
      onStatus('in');
      onUser({ name: u.user_metadata?.full_name || u.user_metadata?.name || '', email: u.email || '' });
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status !== 'out') return null;
  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 text-sm ${required ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-primary-200 bg-primary-50 text-primary-900'}`}>
      <p>{required ? 'Silakan masuk untuk melanjutkan pemesanan.' : 'Masuk agar pesanan tersimpan di profil Anda.'}</p>
      <Link href={`/masuk?next=${encodeURIComponent(nextUrl)}`} className="shrink-0 rounded-lg bg-primary-700 px-3 py-1.5 font-semibold text-white">Masuk</Link>
    </div>
  );
}
