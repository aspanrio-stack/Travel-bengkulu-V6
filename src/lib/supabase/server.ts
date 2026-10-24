import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/** Server client (Server Component / Route Handler). Null jika env belum di-set. */
export async function createClient() {
  if (!supabaseConfigured) return null;
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            /* dipanggil dari Server Component — aman diabaikan, proxy yang refresh sesi */
          }
        },
      },
    }
  );
}

/** User yang sedang login (null jika tamu / Supabase belum dikonfigurasi). */
export async function getCurrentUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
