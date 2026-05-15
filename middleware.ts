/**
 * middleware.ts — di root project (bukan dalam src/ atau app/)
 * Middleware dikosongkan — semua route dapat diakses bebas termasuk /admin.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_request: NextRequest) {
  // Tidak ada proteksi — semua request diteruskan langsung
  return NextResponse.next();
}

// Kosongkan matcher agar middleware tidak aktif di route manapun
export const config = {
  matcher: [],
};
