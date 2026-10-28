import type { Metadata } from 'next';
import BandungRoutePage from '@/components/BandungRoutePage';
import { hiaceOg, hiaceKeyFor, hiaceUrl } from '@/lib/hiace-images';
import { BANDUNG_ROUTES } from '@/lib/bandung-routes';

const r = BANDUNG_ROUTES['travel-curup-bandung'];
const url = `https://bengkulutravel.com/${r.slug}`;

export const metadata: Metadata = {
  title: r.metaTitle,
  description: r.metaDesc,
  alternates: { canonical: url },
  openGraph: {
    title: `${r.metaTitle} | Travel Bengkulu`,
    description: r.metaDesc,
    url,
    images: [hiaceOg(hiaceKeyFor(r))],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: `${r.metaTitle} | Travel Bengkulu`, description: r.metaDesc, images: [hiaceUrl(hiaceKeyFor(r), 'og')] },
};

export default function Page() {
  return <BandungRoutePage r={r} />;
}
