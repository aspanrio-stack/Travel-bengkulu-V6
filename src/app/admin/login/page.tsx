'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username: 'admin', password }),
      });
      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setError(data.error ?? 'Login gagal');
        setLoading(false);
      }
    } catch {
      setError('Koneksi bermasalah, coba lagi');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
      >
        <h1 className="text-lg font-bold text-slate-800 mb-1">Admin Dashboard</h1>
        <p className="text-sm text-slate-400 mb-5">Travel Bengkulu</p>

        <label className="block text-sm font-medium text-slate-600 mb-1.5">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mb-4
                     focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold
                     text-sm py-2.5 rounded-xl transition-all"
        >
          {loading ? 'Masuk...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
