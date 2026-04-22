import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET || 'bengkulutravel-admin-secret-key-2026';
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

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
