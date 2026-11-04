'use client';
// Tab "Grafik": perkembangan website (pesanan per hari, jurusan terbanyak, klik WhatsApp).
// Tanpa library grafik — memakai SVG/CSS ringan.

import { useState, useEffect, useCallback } from 'react';

interface Point { date: string; orders: number; wa: number }
interface Stats {
  days: number;
  series: Point[];
  routes: { name: string; count: number; pax: number }[];
  pages: { path: string; count: number }[];
  sources: Record<string, number>;
  totals: { waTotal: number; waToday: number; waPeriod: number; ordersPeriod: number; ordersAll: number };
  waSince: string | null;
}

const SRC_LABEL: Record<string, string> = { bottomnav: 'Tombol Chat (bottom nav)', cta: 'Tombol CTA di halaman', footer: 'Footer' };

const fmtShort = (d: string) => {
  const [, m, day] = d.split('-');
  return `${Number(day)}/${Number(m)}`;
};

function BarChart({ data, field, color }: { data: Point[]; field: 'orders' | 'wa'; color: string }) {
  const max = Math.max(1, ...data.map((d) => d[field]));
  const W = 600, H = 150, PAD = 24;
  const bw = (W - PAD) / data.length;
  const step = Math.ceil(data.length / 6);
  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} className="w-full h-auto" role="img">
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <line x1={PAD} x2={W} y1={H - t * (H - 10)} y2={H - t * (H - 10)} stroke="#e2e8f0" />
          <text x={0} y={H - t * (H - 10) + 3} fontSize="9" fill="#94a3b8">{Math.round(max * t)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const h = (d[field] / max) * (H - 10);
        return (
          <g key={d.date}>
            <rect x={PAD + i * bw + bw * 0.15} y={H - h} width={Math.max(1, bw * 0.7)} height={h} rx="2" fill={color}>
              <title>{`${d.date}: ${d[field]}`}</title>
            </rect>
            {i % step === 0 && (
              <text x={PAD + i * bw + bw / 2} y={H + 14} fontSize="9" textAnchor="middle" fill="#94a3b8">{fmtShort(d.date)}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function HBars({ rows, color, empty }: { rows: { label: string; value: number; sub?: string }[]; color: string; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <p className="text-slate-400 text-xs py-4 text-center">{empty}</p>;
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between gap-3 text-xs mb-1">
            <span className="text-slate-700 truncate">{r.label}</span>
            <span className="text-slate-500 shrink-0">{r.value}{r.sub ? ` · ${r.sub}` : ''}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function StatsTab() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/admin/stats?days=${days}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch { setError('Gagal memuat grafik'); }
    finally { setLoading(false); }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  const resetWa = async () => {
    if (!confirm('Reset semua hitungan klik WhatsApp menjadi 0? Data tidak bisa dikembalikan.')) return;
    const res = await fetch('/api/admin/stats', { method: 'DELETE' });
    if (res.ok) load(); else setError('Gagal reset hitungan WA');
  };

  const t = data?.totals;
  const cards = [
    { label: 'Pesanan (periode)', value: t?.ordersPeriod, icon: '📋', color: 'text-slate-800' },
    { label: 'Klik WA (periode)', value: t?.waPeriod,     icon: '💬', color: 'text-green-600' },
    { label: 'Klik WA hari ini',  value: t?.waToday,      icon: '📲', color: 'text-green-600' },
    { label: 'Klik WA total',     value: t?.waTotal,      icon: '🟢', color: 'text-blue-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white">
          {[7, 30, 90].map((d) => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-4 py-2 text-xs font-bold transition-colors ${days === d ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
              {d} hari
            </button>
          ))}
        </div>
        <button onClick={load} className="text-sm bg-white hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-lg border border-slate-200 transition-colors">🔄 Refresh</button>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">❌ {error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg border border-slate-100 p-3 shadow-sm flex items-center gap-2.5">
            <span className="text-xl shrink-0">{c.icon}</span>
            <div className="min-w-0">
              <p className={`font-bold text-base leading-tight ${c.color}`}>{loading && !data ? '…' : (c.value ?? 0)}</p>
              <p className="text-slate-500 text-[11px] leading-tight truncate">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {data && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-slate-800 font-bold text-sm mb-3">📋 Jumlah pesanan per hari</p>
            <BarChart data={data.series} field="orders" color="#2563eb" />
            <p className="text-slate-400 text-[11px] mt-2">Pesanan yang dibatalkan tidak dihitung.</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-slate-800 font-bold text-sm mb-3">💬 Klik WhatsApp per hari</p>
            <BarChart data={data.series} field="wa" color="#22c55e" />
            <p className="text-slate-400 text-[11px] mt-2">
              Semua tombol chat di website, kecuali halaman Pesan/Pembayaran.
              {data.waSince ? ` Dihitung sejak ${new Date(data.waSince).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}.` : ''}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-slate-800 font-bold text-sm mb-3">🚌 Jurusan paling banyak dipesan</p>
              <HBars color="#2563eb" empty="Belum ada pesanan pada periode ini"
                rows={data.routes.map((r) => ({ label: r.name, value: r.count, sub: `${r.pax} pax` }))} />
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
              <p className="text-slate-800 font-bold text-sm mb-3">📄 Halaman dengan klik WA terbanyak</p>
              <HBars color="#22c55e" empty="Belum ada klik WhatsApp tercatat"
                rows={data.pages.map((p) => ({ label: p.path, value: p.count }))} />
              <p className="text-slate-500 text-xs font-semibold mt-5 mb-2">Sumber klik (semua waktu)</p>
              <HBars color="#f59e0b" empty="—"
                rows={Object.entries(data.sources).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ label: SRC_LABEL[k] ?? k, value: v }))} />
            </div>
          </div>

          <div className="text-right">
            <button onClick={resetWa} className="text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 transition-colors">
              🗑️ Reset hitungan klik WA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
