/**
 * lib/auth.ts
 * Auth admin pakai JWT di cookie httpOnly `admin_session`.
 * Password & secret diambil dari environment variable — WAJIB di-set
 * di Vercel (Project → Settings → Environment Variables):
 *   ADMIN_PASSWORD   = password login dashboard
 *   ADMIN_JWT_SECRET = string acak panjang (min 32 karakter) untuk sign JWT
 *   ADMIN_USERNAME   = opsional, default "admin"
 */

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_session';

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET belum di-set di environment variables');
  }
  return new TextEncoder().encode(secret);
}

// ─────────────────────────────────────────────
// isValidCredentials — cek username & password
// ─────────────────────────────────────────────
export function isValidCredentials(username: string, password: string): boolean {
  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD;
  if (!validPass) return false; // belum di-set → tolak semua login
  return username === validUser && password === validPass;
}

// ─────────────────────────────────────────────
// createToken — sign JWT untuk session
// ─────────────────────────────────────────────
export async function createToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

// ─────────────────────────────────────────────
// verifyToken — verifikasi JWT
// ─────────────────────────────────────────────
export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { username: payload.username as string };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// setSessionCookie / clearSessionCookie
// ─────────────────────────────────────────────
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─────────────────────────────────────────────
// getSession — dipakai API routes untuk cek auth
// ─────────────────────────────────────────────
export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
