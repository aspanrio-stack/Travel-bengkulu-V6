import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** OAuth Google & konfirmasi email Supabase kembali ke sini. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const rawNext = searchParams.get('next') ?? '/profil';
  // hanya izinkan path internal (cegah open redirect)
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/profil';

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/masuk?error=auth`);
}
