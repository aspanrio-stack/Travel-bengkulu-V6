'use client';
import { useEffect, useState, type MutableRefObject } from 'react';

export interface SavedAddress { id: string; label: string; address: string; phone: string | null }
const MAX = 5;

/**
 * Alamat tersimpan di form pemesanan (hanya tampil jika login & tabel saved_addresses ada).
 * Tamu / Supabase belum siap → render null, form berjalan seperti biasa.
 * Form induk memanggil `saverRef.current?.()` setelah pesanan berhasil dibuat.
 */
export default function SavedAddressBox({
  address, phone, onPick, saverRef,
}: {
  address: string;
  phone: string;
  onPick: (a: { address: string; phone: string }) => void;
  saverRef: MutableRefObject<null | (() => Promise<void>)>;
}) {
  const [list, setList] = useState<SavedAddress[]>([]);
  const [ready, setReady] = useState(false);
  const [saveIt, setSaveIt] = useState(true);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!/(^|;\s*)sb-[^=]*-auth-token/.test(document.cookie)) return;
    let alive = true;
    import('@/lib/supabase/client').then(async ({ createClient, supabaseReady }) => {
      if (!supabaseReady) return;
      const { data, error } = await createClient().from('saved_addresses').select('id,label,address,phone').order('created_at', { ascending: false });
      if (alive && !error) { setList(data ?? []); setReady(true); }
    });
    return () => { alive = false; };
  }, []);

  const trimmed = address.trim();
  const exists = list.some(a => a.address.trim().toLowerCase() === trimmed.toLowerCase());
  const canSave = ready && saveIt && trimmed.length >= 5 && !exists && list.length < MAX;

  saverRef.current = async () => {
    if (!canSave) return;
    try {
      const { createClient } = await import('@/lib/supabase/client');
      await createClient().from('saved_addresses').insert({ label: label.trim() || 'Alamat', address: trimmed, phone: phone.trim() || null });
    } catch { /* gagal simpan tidak boleh menghalangi pemesanan */ }
  };

  if (!ready) return null;
  return (
    <div className="space-y-2 rounded-xl border border-primary-100 bg-primary-50/60 p-3">
      {list.length > 0 && (
        <div>
          <p className="mb-1.5 text-xs font-semibold text-primary-800">Alamat tersimpan</p>
          <div className="flex flex-wrap gap-2">
            {list.map(a => (
              <button key={a.id} type="button" onClick={() => onPick({ address: a.address, phone: a.phone ?? '' })}
                className="max-w-full truncate rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs font-semibold text-primary-800 hover:bg-primary-50" title={a.address}>
                📍 {a.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {trimmed.length >= 5 && !exists && list.length < MAX && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={saveIt} onChange={e => setSaveIt(e.target.checked)} className="h-4 w-4 accent-primary-600" />
            Simpan alamat ini
          </label>
          {saveIt && (
            <input value={label} onChange={e => setLabel(e.target.value)} maxLength={40} placeholder="Nama, mis. Rumah"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          )}
        </div>
      )}
    </div>
  );
}
