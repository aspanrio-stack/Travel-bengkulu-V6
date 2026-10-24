import type { Metadata } from 'next';
import Link from 'next/link';
import DestinationCard from '@/components/DestinationCard';
import { CATEGORIES, DESTINATIONS } from '@/lib/destinations';

export const metadata: Metadata = {
  title: 'Destinasi Wisata Bengkulu – Pantai, Sejarah, Alam',
  description:
    'Jelajahi destinasi wisata Bengkulu: Pantai Panjang, Benteng Marlborough, Bukit Kaba, Air Terjun Suban, Pulau Tikus dan lainnya. Lengkap dengan akses travel dan rental mobil.',
  alternates: { canonical: 'https://bengkulutravel.com/destinasi' },
  // noindex sementara: konten masih tipis. Hapus baris ini setelah tiap destinasi punya artikel lengkap.
  robots: { index: false, follow: true },
};

export default async function DestinasiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string }>;
}) {
  const { q = '', kategori = 'semua' } = await searchParams;
  const term = q.trim().toLowerCase();
  const list = DESTINATIONS.filter(d =>
    (kategori === 'semua' || d.category === kategori) &&
    (!term || `${d.name} ${d.area} ${d.short}`.toLowerCase().includes(term))
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-10">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="font-display text-2xl font-bold text-slate-800 md:text-3xl">Destinasi Wisata Bengkulu</h1>
        <p className="mt-1 text-slate-500">Pilih tujuan, lalu pesan travel atau sewa mobil ke sana.</p>

        <form action="/destinasi" className="mt-4">
          <input type="hidden" name="kategori" value={kategori} />
          <label className="sr-only" htmlFor="q">Cari destinasi</label>
          <input id="q" name="q" defaultValue={q} placeholder="Cari pantai, air terjun, benteng…"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </form>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(c => (
            <Link key={c.id} href={`/destinasi?kategori=${c.id}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${kategori === c.id ? 'bg-primary-700 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}>
              {c.icon} {c.label}
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="mt-10 text-center text-slate-500">Tidak ada destinasi yang cocok. Coba kata kunci lain.</p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {list.map(d => <DestinationCard key={d.slug} d={d} />)}
          </div>
        )}

        <p className="mt-8 text-sm text-slate-500">
          Ingin panduan lengkap? Baca <Link className="font-semibold text-primary-700 underline" href="/tempat-wisata-bengkulu">Tempat Wisata di Bengkulu</Link>.
        </p>
      </div>
    </div>
  );
}
