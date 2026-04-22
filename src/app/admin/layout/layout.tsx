/**
 * Layout khusus /admin
 * Menyembunyikan Navbar, Footer, dan WhatsApp Float website
 * menggunakan CSS override — cara paling andal di Next.js App Router
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Travel Bengkulu',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Sembunyikan semua elemen website di halaman admin */}
      <style dangerouslySetInnerHTML={{ __html: `
        body > main > div.admin-layout ~ * { display: none !important; }
        header { display: none !important; }
        footer { display: none !important; }
        .wa-float { display: none !important; }
        [class*="fixed bottom"] { display: none !important; }
      `}} />
      <div className="admin-layout min-h-screen bg-slate-50">
        {children}
      </div>
    </>
  );
}
