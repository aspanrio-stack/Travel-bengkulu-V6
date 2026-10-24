'use client';
import { useState } from 'react';
import { createClient, supabaseReady } from '@/lib/supabase/client';

export default function AuthForm({ next = '/profil' }: { next?: string }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!supabaseReady) {
    return (
      <p className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        Login belum aktif: isi <code>NEXT_PUBLIC_SUPABASE_URL</code> dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di environment variables.
      </p>
    );
  }

  const callback = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const google = async () => {
    setBusy(true); setError('');
    const { error } = await createClient().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callback() } });
    if (error) { setError(error.message); setBusy(false); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!form.email || form.password.length < 6) { setError('Isi email dan kata sandi (minimal 6 karakter).'); return; }
    setBusy(true);
    const supabase = createClient();
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      if (error) { setError('Email atau kata sandi salah.'); setBusy(false); return; }
      window.location.href = next;
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name }, emailRedirectTo: callback() },
      });
      if (error) { setError(error.message); setBusy(false); return; }
      if (data.session) { window.location.href = next; return; }
      setInfo('Pendaftaran berhasil. Cek email Anda untuk konfirmasi, lalu masuk.');
      setMode('login'); setBusy(false);
    }
  };

  const input = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500';

  return (
    <div className="space-y-3">
      <button onClick={google} disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60">
        <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3A12 12 0 1112 24a12 12 0 018-3l5.7-5.7A20 20 0 1024 44c11 0 20-8 20-20 0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.600 4.800A12 12 0 0124 12c3 0 5.800 1.100 8 3l5.700-5.700A20 20 0 006.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.200 0 9.900-2 13.400-5.200l-6.200-5.200A12 12 0 0112.700 28l-6.500 5A20 20 0 0024 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3a12 12 0 01-4.100 5.600l6.200 5.200C37 39.2 44 34 44 24c0-1.300-.1-2.7-.4-3.9z"/></svg>
        Lanjutkan dengan Google
      </button>

      <div className="flex items-center gap-3 text-xs text-slate-500"><span className="h-px flex-1 bg-slate-200" />atau dengan email<span className="h-px flex-1 bg-slate-200" /></div>

      <form onSubmit={submit} className="space-y-3">
        {mode === 'register' && (
          <input className={input} placeholder="Nama lengkap" autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input className={input} type="email" placeholder="Email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className={input} type="password" placeholder="Kata sandi" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-primary-700">{info}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-primary-700 py-3 font-bold text-white shadow-lg hover:bg-primary-800 disabled:opacity-60">
          {busy ? 'Memproses…' : mode === 'login' ? 'Masuk' : 'Daftar'}
        </button>
      </form>

      <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="w-full text-center text-sm text-slate-600">
        {mode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
        <span className="font-semibold text-primary-700 underline underline-offset-2">{mode === 'login' ? 'Daftar' : 'Masuk'}</span>
      </button>
    </div>
  );
}
