'use client';
import { useEffect, useState } from 'react';
import type { SavedAddress } from './SavedAddressBox';

/** Kelola alamat tersimpan di halaman /profil. */
export default function SavedAddressList() {
  const [list, setList] = useState<SavedAddress[] | null>(null);
  const [off, setOff] = useState(false);

  useEffect(() => {
    import('@/lib/supabase/client').then(async ({ createClient, supabaseReady }) => {
      if (!supabaseReady) { setOff(true); return; }
      const { data, error } = await createClient().from('saved_addresses').select('id,label,address,phone').order('created_at', { ascending: false });
      if (error) setOff(true); else setList(data ?? []);
    });
  }, []);

  const remove = async (id: string) => {
    const { createClient } = await import('@/lib/supabase/client');
    const { error } = await createClient().from('saved_addresses').delete().eq('id', id);
    if (!error) setList(l => (l ?? []).filter(a => a.id !== id));
  };

  if (off) return null;
  return (
    <section>
      <h2 className="mb-3 font-display text-lg font-bold text-slate-800">Alamat Tersimpan</h2>
      {list === null ? (
        <div className="h-16 animate-pulse rounded-2xl bg-white" />
      ) : list.length === 0 ? (
        <p className="rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-sm">Belum ada alamat. Centang &ldquo;Simpan alamat ini&rdquo; saat memesan, maka alamat muncul di sini.</p>
      ) : (
        <ul className="space-y-2">
          {list.map(a => (
            <li key={a.id} className="flex items-start justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">📍 {a.label}</p>
                <p className="mt-0.5 text-sm text-slate-600">{a.address}</p>
                {a.phone && <p className="mt-0.5 text-xs text-slate-500">+62{a.phone.replace(/^0+/, '')}</p>}
              </div>
              <button onClick={() => remove(a.id)} className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50" aria-label={`Hapus alamat ${a.label}`}>Hapus</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
