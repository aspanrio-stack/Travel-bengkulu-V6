/**
 * lib/auth.ts
 * Auth dinonaktifkan — halaman admin dapat diakses langsung tanpa login.
 * getSession() selalu mengembalikan session admin dummy.
 */

import { cookies } from 'next/headers';

// ─────────────────────────────────────────────
// getSession — selalu return admin (no auth)
// ─────────────────────────────────────────────
export async function getSession(): Promise<{ username: string } | null> {
  // Langsung return session admin tanpa cek cookie / JWT
  return { username: 'admin' };
}

// ─── Stub functions (tidak digunakan, disimpan agar import lain tidak error) ───

export function isValidCredentials(_username: string, _password: string): boolean {
  return true;
}

export async function createToken(_username: string): Promise<string> {
  return 'no-auth';
}

export async function verifyToken(_token: string): Promise<{ username: string } | null> {
  return { username: 'admin' };
}

export async function setSessionCookie(_token: string): Promise<void> {
  // no-op
}

export async function clearSessionCookie(): Promise<void> {
  // no-op — logout tidak melakukan apa-apa
  // Opsional: bisa diabaikan atau langsung redirect di komponen
  void (await cookies()); // agar tidak ada unused import error
}
