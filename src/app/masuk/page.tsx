import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Masuk atau Daftar',
  robots: { index: false, follow: false },
};

export default async function MasukPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/profil';

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-gradient-to-b from-primary-800 via-primary-900 to-slate-900">
      <div className="mx-auto flex min-h-full max-w-md flex-col px-6 pb-8 pt-12">
        <div className="text-center text-white">
          <div className="relative mx-auto mb-4 h-16 w-16 rounded-2xl bg-white p-2 shadow-lg">
            <Image src="/logo.png" alt="Travel Bengkulu" fill className="object-contain p-1.5" priority />
          </div>
          <h1 className="font-display text-3xl font-bold">Travel Bengkulu</h1>
          <p className="mt-2 text-primary-100">Masuk untuk menyimpan riwayat dan memantau pesanan Anda.</p>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-2xl">
          {error && <p role="alert" className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">Login gagal. Silakan coba lagi.</p>}
          <AuthForm next={safeNext} />
        </div>

        <Link href="/" className="mt-6 text-center text-sm font-medium text-primary-100 underline underline-offset-4">
          Lanjut sebagai tamu
        </Link>
      </div>
    </div>
  );
}
