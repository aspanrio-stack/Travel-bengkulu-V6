import Link from 'next/link';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ArticleLayoutProps {
  title: string;
  description: string;
  breadcrumbs: Breadcrumb[];
  badge?: string;
  price?: string;
  children: React.ReactNode;
}

const WA_BASE = 'https://wa.me/6285268645461?text=';

export default function ArticleLayout({
  title,
  description,
  breadcrumbs,
  badge,
  price,
  children,
}: ArticleLayoutProps) {
  const waText = encodeURIComponent(`Halo Travel Bengkulu, saya ingin informasi tentang ${title}`);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-primary-200 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                <span>/</span>
                {b.href ? (
                  <Link href={b.href} className="hover:text-white transition-colors">{b.label}</Link>
                ) : (
                  <span className="text-white">{b.label}</span>
                )}
              </span>
            ))}
          </nav>

          {badge && (
            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {badge}
            </span>
          )}

          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            {title}
          </h1>
          <p className="text-primary-100 text-lg leading-relaxed max-w-2xl">{description}</p>

          {price && (
            <div className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl px-5 py-3">
              <div>
                <p className="text-primary-200 text-xs">Tarif</p>
                <p className="text-white font-bold text-2xl">{price}</p>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <p className="text-primary-100 text-sm">per orang / per perjalanan</p>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 prose-article">
            {children}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* CTA Card */}
              <div className="bg-primary-600 rounded-2xl p-6 text-white">
                <h3 className="font-display font-bold text-xl mb-2">Pesan Sekarang</h3>
                <p className="text-primary-100 text-sm mb-5">Hubungi kami via WhatsApp untuk konfirmasi jadwal dan ketersediaan.</p>
                <a
                  href={`${WA_BASE}${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-400 hover:bg-green-300 text-slate-900 font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat WhatsApp
                </a>
                <a
                  href="tel:+6285268645461"
                  className="w-full mt-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Telepon
                </a>
              </div>

              {/* Info Card */}
              <div className="card p-5">
                <h4 className="font-semibold text-slate-700 mb-3">Informasi</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    BTN Air Bang Curup, Bengkulu
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Operasional 24 Jam
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Armada: Avanza, Innova, HiAce
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
