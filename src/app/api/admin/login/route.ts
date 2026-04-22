/**
 * API: POST /api/admin/login
 * Verifikasi kredensial dari env, buat JWT, set cookie session.
 */
import { NextRequest, NextResponse } from 'next/server';
import { isValidCredentials, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }

    // Cek kredensial dari environment variable
    if (!isValidCredentials(username, password)) {
      // Delay 1 detik untuk mencegah brute force
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    // Buat JWT dan set cookie
    const token = await createToken(username);
    await setSessionCookie(token);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
