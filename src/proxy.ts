import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { createServerClient } from '@supabase/ssr';

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET || '';
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { search, searchParams, pathname } = request.nextUrl;

  // ── PROTEKSI /admin (kecuali /admin/login) ──
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
      await jwtVerify(token, getSecret());
    } catch {
      const res = NextResponse.redirect(new URL('/admin/login', request.url));
      res.cookies.delete('admin_session');
      return res;
    }
  }

  // ── PROTEKSI /profil (user Supabase) — hanya path ini yang memanggil Supabase,
  //    supaya halaman publik/SEO tidak kena tambahan latency ──
  if (pathname.startsWith('/profil')) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const toLogin = () => NextResponse.redirect(new URL('/masuk?next=/profil', request.url));
    if (!url || !key) return toLogin();

    let response = NextResponse.next({ request });
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    if (!data.user) return toLogin();
    return response; // sesi ter-refresh lewat cookie di atas
  }

  // ============================================================
  // 1. URL rusak Blogger: /?m=1feeds/... /?m=1search/... /?m=1p/...
  // ============================================================
  if (search.includes('m=1feeds') || search.includes('m=1search') || search.includes('m=1p/')) {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  // ============================================================
  // 2. Redirect semua ?m=1 (versi mobile Blogger)
  // ============================================================
  if (searchParams.has('m')) {
    const url = request.nextUrl.clone();
    url.search = '';
    return NextResponse.redirect(url, { status: 301 });
  }

  // ============================================================
  // 3. Redirect feeds Blogger
  // ============================================================
  if (
    pathname.startsWith('/feeds/') ||
    search.includes('feeds/posts') ||
    search.includes('alt=rss') ||
    search.includes('alt%3Drss')
  ) {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  // ============================================================
  // 4. Redirect sitemap Blogger → sitemap Next.js
  // ============================================================
  if (pathname === '/p/sitemap.html' || search.includes('sitemap.html')) {
    return NextResponse.redirect(new URL('/sitemap.xml', request.url), { status: 301 });
  }

  // ============================================================
  // 5. Redirect label/search Blogger
  // ============================================================
  if (search.includes('search/label')) {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
