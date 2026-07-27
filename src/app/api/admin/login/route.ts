/**
 * API: POST /api/admin/login
 */
import { NextRequest, NextResponse } from 'next/server';
import { isValidCredentials, createToken, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Password wajib diisi' }, { status: 400 });
    }

    if (!isValidCredentials(username, password)) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }

    const token = await createToken(username);
    await setSessionCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Gagal login, coba lagi' }, { status: 500 });
  }
}
