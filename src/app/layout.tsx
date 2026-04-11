import type { Metadata } from 'next';
import Script from 'next/script';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

// Next.js font optimization — font dihost lokal, tidak blocking render
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const GA_ID = 'G-H8TJZM1ZNM';

export const metadata: Metadata = {
  metadataBase: new URL('https://bengkulutravel.com'),
  alternates: {
    canonical: 'https://bengkulutravel.com',
  },
  title: {
    default: 'Travel Bengkulu | Antar Jemput Door to Door Terpercaya',
    template: '%s | Travel Bengkulu',
  },
  description:
    'Jasa travel Bengkulu terpercaya. Melayani rute Bengkulu-Palembang, Bengkulu-Jambi, Bengkulu-Curup, Bengkulu-Lampung, Bengkulu-Lebong. Antar jemput door to door. Hubungi kami sekarang!',
  keywords: [
    'travel bengkulu',
    'travel bengkulu palembang',
    'travel palembang bengkulu',
    'travel bengkulu jambi',
    'travel jambi bengkulu',
    'travel bengkulu curup',
    'travel curup bengkulu',
    'travel bengkulu lampung',
    'travel bengkulu lebong',
    'rental mobil curup',
    'antar jemput bandara curup',
    'bengkulu ke palembang berapa jam',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://bengkulutravel.com',
    siteName: 'Travel Bengkulu',
    title: 'Travel Bengkulu | Antar Jemput Door to Door Terpercaya',
    description: 'Jasa travel Bengkulu terpercaya. Rute Bengkulu-Palembang, Bengkulu-Jambi, Bengkulu-Curup, Bengkulu-Lampung. Antar jemput door to door.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <head>
        {/* Google Analytics GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
