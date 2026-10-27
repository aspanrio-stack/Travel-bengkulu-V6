import type { Metadata } from 'next';
import BandungRoutePage from '@/components/BandungRoutePage';
import { PADANG_ROUTES } from '@/lib/bandung-routes';

const r = PADANG_ROUTES['travel-padang-curup'];
const url = `https://bengkulutravel.com/${r.slug}`;

export const metadata: Metadata = {
  title: r.metaTitle,
  description: r.metaDesc,
  alternates: { canonical: url },
  openGraph: {
    title: `${r.metaTitle} | Travel Bengkulu`,
    description: r.metaDesc,
    url,
    images: [{ url: `https://bengkulutravel.com${r.imgDir}/${r.heroSrc}`, width: r.heroW, height: r.heroH }],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function Page() {
  return <BandungRoutePage r={r} />;
}
