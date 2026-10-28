import type { Metadata } from 'next';

// page.tsx adalah Client Component → noindex lewat layout ini (halaman pembayaran pelanggan).
export const metadata: Metadata = {
  title: 'Pembayaran',
  robots: { index: false, follow: false },
};

export default function PembayaranLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
