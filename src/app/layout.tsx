import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

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
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${fontDisplay.variable} ${fontBody.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased font-body bg-white text-slate-900">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
