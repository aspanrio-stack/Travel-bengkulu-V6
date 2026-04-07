import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const GA_ID = 'G-H8TJZM1ZNM';

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
    'travel bengkulu',
    'travel bengkulu palembang',
    'travel palembang bengkulu',
    'travel bengkulu jambi',
    'travel jambi bengkulu',
    'travel bengkulu curup',
    'rental mobil curup',
    'antar jemput bandara curup',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://www.bengkulutravel.com',
    siteName: 'Travel Bengkulu',
    title: 'Travel Bengkulu | Antar Jemput Door to Door Terpercaya',
    description: 'Jasa travel Bengkulu terpercaya. Rute Bengkulu-Palembang, Bengkulu-Jambi, Bengkulu-Curup. Antar jemput door to door.',
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
    <html lang="id">
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
