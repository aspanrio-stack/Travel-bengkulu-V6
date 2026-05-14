/**
 * API: POST /api/admin/login
 * Login dinonaktifkan — langsung return success tanpa cek kredensial.
 * Halaman admin dapat diakses langsung tanpa login.
 */
import { NextResponse } from 'next/server';

export async function POST() {
  // Langsung sukses tanpa validasi apapun
  return NextResponse.json({ success: true });
}
