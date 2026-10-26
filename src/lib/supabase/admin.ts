import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Client Supabase dengan SERVICE ROLE — melewati RLS.
 * HANYA untuk dipakai di server (route handler / server component).
 * JANGAN diimpor dari file 'use client'. Key tidak boleh berawalan NEXT_PUBLIC_.
 */
let admin: SupabaseClient | null = null;

export const supabaseAdminConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseAdminConfigured) return null;
  if (admin) return admin;
  admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
  return admin;
}
