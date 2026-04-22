import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

  // 1. URL rusak Blogger
  if (
    search.includes('m=1feeds') ||
    search.includes('m=1search') ||
    search.includes('m=1p/')
  ) {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  // 2. Redirect ?m=1
  if (searchParams.has('m')) {
    const url = new URL(request.url);
    url.searchParams.delete('m');
    return NextResponse.redirect(url, { status: 301 });
  }

  // 3. Redirect feeds Blogger
  if (
    pathname.startsWith('/feeds/') ||
    search.includes('feeds/posts') ||
    search.includes('alt=rss') ||
    search.includes('alt%3Drss')
  ) {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  // 4. Redirect sitemap Blogger
  if (
    pathname === '/p/sitemap.html' ||
    search.includes('sitemap.html')
  ) {
    return NextResponse.redirect(new URL('/sitemap.xml', request.url), { status: 301 });
  }

  // 5. Redirect label/search Blogger
  if (search.includes('search/label')) {
    return NextResponse.redirect(new URL('/', request.url), { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Versi SAFE (tidak pakai regex kompleks)
     * Ini yang bikin error di Vercel sebelumnya
     */
    '/((?!api|_next|favicon.ico).*)',
  ],
};
