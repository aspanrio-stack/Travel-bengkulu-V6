import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';

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

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0f766e' };

export const metadata: Metadata = {
  metadataBase: new URL('https://bengkulutravel.com'),
  title: {
    default: 'Travel Bengkulu | Antar Jemput Door to Door Terpercaya',
    template: '%s | Travel Bengkulu',
  },
  description:
    'Jasa travel Bengkulu terpercaya. Melayani rute Bengkulu-Palembang, Bengkulu-Jambi, Bengkulu-Curup. Antar jemput door to door. Hubungi kami sekarang!',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Travel Bengkulu | Antar Jemput Door to Door Terpercaya',
    description:
      'Jasa travel Bengkulu terpercaya. Melayani rute Bengkulu-Palembang, Bengkulu-Jambi, Bengkulu-Curup.',
    url: 'https://bengkulutravel.com',
    siteName: 'Travel Bengkulu',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
};

const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  '@id': 'https://bengkulutravel.com/#organization',
  name: 'Travel Bengkulu',
  url: 'https://bengkulutravel.com',
  logo: 'https://bengkulutravel.com/logo.png',
  image: 'https://bengkulutravel.com/og-image.png',
  telephone: ['+62-852-6864-5461', '+62-823-7449-7929'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'BTN Air Bang',
    addressLocality: 'Curup',
    addressRegion: 'Bengkulu',
    addressCountry: 'ID',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  contactPoint: [
    { '@type': 'ContactPoint', telephone: '+62-852-6864-5461', contactType: 'customer service', areaServed: 'ID', availableLanguage: 'id' },
    { '@type': 'ContactPoint', telephone: '+62-823-7449-7929', contactType: 'reservations', areaServed: 'ID', availableLanguage: 'id' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${fontDisplay.variable} ${fontBody.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </head>
      <body className="antialiased font-body bg-white text-slate-900">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
