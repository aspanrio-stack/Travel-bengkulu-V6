'use client';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  return (
    <button
      onClick={async () => { await createClient().auth.signOut(); window.location.href = '/'; }}
      className="w-full rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
    >
      Keluar
    </button>
  );
}
