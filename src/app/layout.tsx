/**
 * Layout khusus /admin — tidak pakai Navbar website.
 * Header admin sudah ada di page.tsx masing-masing.
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Travel Bengkulu',
  robots: 'noindex, nofollow', // Jangan diindex Google
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout kosong tanpa Navbar dan Footer website
  return <>{children}</>;
}
