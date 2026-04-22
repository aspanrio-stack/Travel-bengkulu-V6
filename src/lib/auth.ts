/**
 * lib/auth.ts
 * Sistem autentikasi ringan menggunakan JWT (jose).
 * Username & password diambil dari environment variables — tanpa database.
 * Cookie HttpOnly untuk keamanan di browser.
 */

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Nama cookie session
const COOKIE_NAME = 'admin_session';

// Secret key dari env (minimal 32 karakter)
function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET || 'bengkulutravel-admin-secret-key-2026';
  return new TextEncoder().encode(secret);
}

// ─────────────────────────────────────────────
// Cek apakah username & password valid
// Dibandingkan dengan env variables
// ─────────────────────────────────────────────
export function isValidCredentials(username: string, password: string): boolean {
  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || 'bengkulutravel2026';
  return username === validUser && password === validPass;
}

// ─────────────────────────────────────────────
// Buat JWT token dengan masa berlaku 8 jam
// ─────────────────────────────────────────────
export async function createToken(username: string): Promise<string> {
  return new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getSecret());
}

// ─────────────────────────────────────────────
// Verifikasi JWT token dari cookie
// Kembalikan payload atau null jika tidak valid
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
// Set cookie session (dipanggil setelah login)
// ─────────────────────────────────────────────
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,       // Tidak bisa diakses JavaScript — aman dari XSS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 jam dalam detik
    path: '/',
  });
}

// ─────────────────────────────────────────────
// Hapus cookie session (logout)
// ─────────────────────────────────────────────
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─────────────────────────────────────────────
// Ambil dan verifikasi session dari cookie
// Digunakan di Server Components / API Routes
// ─────────────────────────────────────────────
export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
