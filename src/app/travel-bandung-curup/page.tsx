import type { Metadata } from 'next';
import BandungRoutePage from '@/components/BandungRoutePage';
import { BANDUNG_ROUTES } from '@/lib/bandung-routes';

const r = BANDUNG_ROUTES['travel-bandung-curup'];
const url = `https://bengkulutravel.com/${r.slug}`;

export const metadata: Metadata = {
  title: r.metaTitle,
  description: r.metaDesc,
  alternates: { canonical: url },
  openGraph: {
    title: `${r.metaTitle} | Travel Bengkulu`,
    description: r.metaDesc,
    url,
    images: [{ url: `https://bengkulutravel.com/images/curup-bandung/${r.heroSrc}`, width: r.heroW, height: r.heroH }],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function Page() {
  return <BandungRoutePage r={r} />;
}
