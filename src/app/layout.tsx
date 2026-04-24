import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

// ── Optimized Fonts ──
// Playfair: Gunakan preload true karena kemungkinan besar dipakai di judul (LCP)
const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
  preload: true, // Diubah ke true agar judul tidak "berkedip" saat dimuat
  adjustFontFallback: false, // Mematikan penyesuaian otomatis untuk stabilitas layout
});

// Body Font: Jakarta Sans
const fontBody = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bengkulutravel.com'),
  alternates: {
    canonical: 'https://www.bengkulutravel.com',
  },
  title: {
    default: 'Travel Bengkulu | Antar Jemput Door to Door Terpercaya',
    template: '%s | Travel Bengkulu',
  },
  description:
    'Jasa travel Bengkulu terpercaya. Melayani rute Bengkulu-Palembang, Bengkulu-Jambi, Bengkulu-Curup. Antar jemput door to door. Hubungi kami sekarang!',
  keywords: [
    'travel bengkulu', 'travel bengkulu palembang', 'travel palembang bengkulu',
    'travel bengkulu jambi', 'travel jambi bengkulu', 'travel bengkulu curup',
    'travel curup bengkulu', 'rental mobil curup', 'travel bengkulu lebong',
    'travel lebong bengkulu', 'travel bengkulu lampung', 'antar jemput bandara curup',
    'bengkulu ke palembang berapa jam',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://www.bengkulutravel.com',
    siteName: 'Travel Bengkulu',
    title: 'Travel Bengkulu | Antar Jemput Door to Door Terpercaya',
    description:
      'Jasa travel Bengkulu terpercaya. Rute Bengkulu-Palembang, Bengkulu-Jambi, Bengkulu-Curup.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Tambahkan antialiasing di body untuk teks yang lebih tajam tanpa beban berat
    <html lang="id" className={`${fontDisplay.variable} ${fontBody.variable} scroll-smooth`}>
      <body className="antialiased font-body">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
