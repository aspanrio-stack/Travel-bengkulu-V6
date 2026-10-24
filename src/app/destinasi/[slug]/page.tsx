import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { DESTINATIONS, getDestination } from '@/lib/destinations';
import { DestImage } from '@/components/DestinationCard';
import { getRouteById, formatPrice } from '@/lib/routes';
import { RENTAL_PRICES } from '@/lib/rental-config';

const BASE = 'https://bengkulutravel.com';

export function generateStaticParams() {
  return DESTINATIONS.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = getDestination((await params).slug);
  if (!d) return {};
  return {
    title: `${d.name}, ${d.area} – Info & Cara ke Sana`,
    description: `${d.short} Info fasilitas, akses, dan pemesanan travel atau rental mobil ke ${d.name}.`,
    alternates: { canonical: `${BASE}/destinasi/${d.slug}` },
    // noindex sementara: konten masih tipis & tumpang tindih dengan artikel wisata yang sudah ada
    robots: { index: false, follow: true },
    openGraph: {
      title: `${d.name}, ${d.area} | Travel Bengkulu`,
      description: d.short,
      url: `${BASE}/destinasi/${d.slug}`,
      locale: 'id_ID',
      type: 'website',
      images: [{ url: d.images?.[0] ?? '/og-image.png', width: 1200, height: 630 }],
    },
  };
}

export default async function DestinasiDetail({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDestination((await params).slug);
  if (!d) notFound();

  const route = d.access.type === 'route' ? getRouteById(d.access.routeId) : undefined;
  const price = route
    ? { label: `Travel ${route.from} → ${route.to}`, value: formatPrice(route.price), unit: 'orang' }
    : { label: 'Sewa mobil + sopir (dalam kota)', value: formatPrice(RENTAL_PRICES.with_driver.dalam_kota.avanza), unit: 'hari' };
  const bookHref = route ? `/pesan?rute=${route.id}&tujuan=${d.slug}` : `/pesan?mode=rental&tujuan=${d.slug}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      name: d.name,
      description: d.description,
      url: `${BASE}/destinasi/${d.slug}`,
      address: { '@type': 'PostalAddress', addressLocality: d.area, addressRegion: 'Bengkulu', addressCountry: 'ID' },
      ...(d.images?.[0] ? { image: `${BASE}${d.images[0]}` } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: BASE },
        { '@type': 'ListItem', position: 2, name: 'Destinasi', item: `${BASE}/destinasi` },
        { '@type': 'ListItem', position: 3, name: d.name, item: `${BASE}/destinasi/${d.slug}` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white md:bg-slate-50 md:pt-[62px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl md:py-6">
        <DestImage d={d} priority sizes="(max-width:768px) 100vw, 768px" className="h-72 md:h-96 md:rounded-3xl" />

        <article className="relative -mt-8 rounded-t-3xl bg-white px-5 pb-40 pt-6 md:mt-4 md:rounded-3xl md:pb-8 md:shadow-sm">
          <nav aria-label="Breadcrumb" className="mb-2 text-xs text-slate-500">
            <Link href="/destinasi" className="underline underline-offset-2">Destinasi</Link> › {d.name}
          </nav>
          <h1 className="font-display text-2xl font-bold text-slate-800">{d.name}</h1>
          <p className="mt-1 text-sm text-slate-500">📍 {d.area}, Bengkulu</p>

          <div className="mt-4 flex items-end justify-between rounded-2xl bg-primary-50 p-4">
            <div>
              <p className="text-xs text-slate-600">{price.label}</p>
              <p className="font-display text-2xl font-bold text-primary-800">{price.value}<span className="text-sm font-medium text-slate-600"> / {price.unit}</span></p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary-700">Mulai dari</span>
          </div>

          <p className="mt-5 leading-relaxed text-slate-600">{d.description}</p>

          <h2 className="mb-3 mt-6 font-display text-lg font-bold text-slate-800">Fasilitas</h2>
          <ul className="grid grid-cols-4 gap-2">
            {d.facilities.map(f => (
              <li key={f.label} className="flex flex-col items-center gap-1 rounded-2xl border border-slate-100 py-3 text-center shadow-sm">
                <span aria-hidden className="text-2xl">{f.icon}</span>
                <span className="px-1 text-[11px] leading-tight text-slate-600">{f.label}</span>
              </li>
            ))}
          </ul>

          {d.images && d.images.length > 1 && (
            <>
              <h2 className="mb-3 mt-6 font-display text-lg font-bold text-slate-800">Galeri</h2>
              <div className="grid grid-cols-3 gap-2">
                {d.images.slice(1, 4).map((src, i) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-2xl">
                    <Image src={src} alt={`${d.name} ${i + 2}`} fill sizes="33vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </>
          )}
        </article>
      </div>

      {/* CTA — menempel di atas bottom bar (mobile), biasa di desktop */}
      <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 px-4 pb-3 md:static md:mx-auto md:max-w-3xl md:px-0 md:pb-8">
        <Link href={bookHref} className="flex w-full items-center justify-between rounded-2xl bg-primary-700 px-6 py-4 font-bold text-white shadow-xl shadow-primary-900/25 hover:bg-primary-800 active:scale-[0.99]">
          <span>Pesan Sekarang</span><span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
