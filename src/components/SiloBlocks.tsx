import Link from 'next/link';

type Crumb = { name: string; href: string };

/** JSON-LD: BreadcrumbList + FAQPage (opsional) */
export function SiloJsonLd({ crumbs, faq }: { crumbs: Crumb[]; faq?: [string, string][] }) {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.href })),
    },
  ];
  if (faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

export function SiloFaq({ title, faq }: { title: string; faq: [string, string][] }) {
  return (
    <>
      <h2>{title}</h2>
      {faq.map(([q, a]) => (
        <details key={q} className="mb-3 rounded-2xl border border-slate-200 bg-stone-50 px-5 py-3 open:bg-white">
          <summary className="cursor-pointer font-semibold text-slate-800">{q}</summary>
          <div className="mt-2 text-slate-600">{a}</div>
        </details>
      ))}
    </>
  );
}

export function SiloCta({ text, href = '/pesan?rute=bkl-bdg', label = '🎫 Pesan Sekarang' }: { text: string; href?: string; label?: string }) {
  return (
    <div className="my-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row">
      <div className="font-semibold text-emerald-900">{text}</div>
      <Link href={href} className="shrink-0 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">
        {label}
      </Link>
    </div>
  );
}

/** Kotak ringkasan jawaban cepat (untuk featured snippet) */
export function SiloAnswer({ children }: { children: React.ReactNode }) {
  return (
    <div role="note" className="my-5 rounded-2xl border-l-4 border-amber-400 bg-amber-50 px-5 py-4 text-slate-800">
      {children}
    </div>
  );
}

export function SiloRelated({ links, exclude }: { links: readonly { href: string; label: string }[]; exclude?: string }) {
  return (
    <>
      <h2>Layanan Terkait</h2>
      <ul>
        {links.filter((l) => l.href !== exclude).map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-primary-600 hover:underline">{l.label}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
