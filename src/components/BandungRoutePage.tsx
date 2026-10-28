import Link from 'next/link';
import Image from 'next/image';
import ArticleLayout from '@/components/ArticleLayout';
import type { BandungRoute } from '@/lib/bandung-routes';
import { KAPASITAS_HIACE } from '@/lib/bandung-routes';

const BASE = 'https://bengkulutravel.com';

const INTERIOR = [
  { src: 'interior-hiace-karaoke-tv.webp', w: 750, h: 1000, alt: 'Interior Hiace dengan TV, speaker, dan lampu LED biru', cap: 'Kabin dengan TV, speaker, dan lampu LED.' },
  { src: 'kursi-hiace-penumpang.webp', w: 750, h: 1000, alt: 'Kursi penumpang Hiace dengan sabuk pengaman', cap: 'Kursi penumpang dengan sabuk pengaman.' },
  { src: 'kabin-hiace-lega.webp', w: 712, h: 1000, alt: 'Kabin Hiace atap tinggi dengan ruang gerak lega', cap: 'Atap tinggi dan ruang gerak lega.' },
];

const CORRIDOR_WEST = ['Bengkulu', 'Curup', 'Lubuklinggau', 'Padang'];
const CORRIDOR_JAWA = ['Bandung', 'Tol Cipularang', 'Bakauheni–Merak', 'Tol Palembang', 'Lubuklinggau', 'Curup', 'Bengkulu'];

function routeStops(from: string, to: string): string[] {
  const kor = [CORRIDOR_WEST, CORRIDOR_JAWA].find((k) => k.includes(from) && k.includes(to));
  if (!kor) return [from, to];
  const a = kor.indexOf(from), b = kor.indexOf(to);
  return a < b ? kor.slice(a, b + 1) : kor.slice(b, a + 1).reverse();
}

const STEPS = [
  { icon: '📝', t: 'Isi form pesan', d: 'Pilih rute, tanggal, jam, dan jumlah penumpang.' },
  { icon: '📍', t: 'Kirim titik jemput', d: 'Alamat jemput dan alamat tujuan Anda.' },
  { icon: '✅', t: 'Admin konfirmasi', d: 'Kursi, jadwal, dan pembayaran dikonfirmasi admin.' },
  { icon: '🚐', t: 'Berangkat', d: 'Siap di titik jemput sesuai jam yang disepakati.' },
];

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

/** Teks dengan **tebal** sederhana */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : <span key={i}>{t}</span>))}
    </>
  );
}

const TONE = {
  emerald: {
    wrap: 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50',
    eyebrow: 'bg-emerald-700 text-white',
    check: 'text-emerald-700',
    chipEnd: 'bg-emerald-700 text-white',
    chip: 'border-emerald-200 bg-white text-emerald-900',
    switchBtn: 'border-emerald-300 text-emerald-800 hover:bg-emerald-50',
  },
  sky: {
    wrap: 'border-sky-200 bg-gradient-to-br from-sky-50 via-white to-sky-50',
    eyebrow: 'bg-sky-700 text-white',
    check: 'text-sky-700',
    chipEnd: 'bg-sky-700 text-white',
    chip: 'border-sky-200 bg-white text-sky-900',
    switchBtn: 'border-sky-300 text-sky-800 hover:bg-sky-50',
  },
} as const;

export default function BandungRoutePage({ r }: { r: BandungRoute }) {
  const IMG_DIR = r.imgDir ?? '/images/curup-bandung';
  const via = r.via ?? 'Tol Palembang';
  const jadwal = r.jadwal ?? '2 kali seminggu';
  const jadwalFaq = r.jadwalFaq ?? 'Berangkat 2 kali seminggu. Hubungi admin untuk hari, jam, dan sisa kursi terbaru.';
  const url = `${BASE}/${r.slug}`;
  const nama = `${r.from} ${r.to}`;
  const harga = rp(r.price);
  const heroIsMalam = r.heroSrc.includes('malam');
  const extra = heroIsMalam
    ? { src: 'hiace-curup-bandung-hero.webp', w: 750, h: 1000, alt: `Hiace hitam armada travel ${nama} di atas kapal`, cap: 'Armada Hiace di atas kapal penyeberangan.' }
    : { src: 'hiace-curup-bandung-malam.webp', w: 562, h: 1000, alt: `Hiace putih armada travel ${nama} saat penyeberangan malam`, cap: 'Armada saat penyeberangan malam.' };
  const galeri = r.galeri ?? [...INTERIOR, extra];

  const faq: [string, string][] = [
    ...(r.faqExtra ?? []),
    [`Berapa tarif travel ${nama}?`, `Tarif travel Hiace ${nama} adalah ${harga} per orang.`],
    ['Kapan jadwal keberangkatannya?', jadwalFaq],
    ...(r.tarifTujuan
      ? ([r.faqTurun ?? [
          'Bisa turun di kota selain Padang?',
          `Bisa. Selain Padang, perjalanan ini melayani ${r.tarifTujuan.filter((t) => t.tujuan !== 'Padang').map((t) => t.tujuan).join(', ')}. Tarif Hiace Rp 300.000 sampai Rp 350.000 per orang tergantung tujuan, dan kendaraan selain Hiace Rp 50.000 lebih murah.`,
        ]] as [string, string][])
      : []),
    [`Lewat mana rute travel ${nama}?`, r.jalur],
    ['Berapa lama perjalanannya?', `Estimasi ${r.duration} termasuk ${r.durasiFaq ?? 'penyeberangan Bakauheni–Merak, istirahat, dan makan'}. Waktu aktual bisa berubah karena ${r.durasiNote ?? 'kondisi jalan, antrean pelabuhan, dan cuaca'}.`],
    ['Bagaimana cara memesan?', 'Lewat form online di website ini atau WhatsApp admin.'],
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Travel Bengkulu', item: `${BASE}/travel-bengkulu` },
          { '@type': 'ListItem', position: 3, name: `${r.from}–${r.to}`, item: url },
        ],
      },
      {
        '@type': 'Service',
        name: `Travel Hiace ${r.from} ke ${r.to}`,
        serviceType: 'Travel antar kota',
        url,
        image: `${BASE}${IMG_DIR}/${r.heroSrc}`,
        provider: { '@id': `${BASE}/#organization` },
        areaServed: Array.from(new Set([r.from, r.to, ...(r.tarifTujuan ?? []).map((t) => t.tujuan)])).map((name) => ({ '@type': 'City', name })),
        offers: { '@type': 'Offer', price: String(r.price), priceCurrency: 'IDR', availability: 'https://schema.org/InStock', url },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };

  const stops = r.stops ?? routeStops(r.from, r.to);
  const pesanHref = `/pesan?rute=${r.routeId}`;
  const cards = r.jadwalCards ?? [
    { jam: jadwal.charAt(0).toUpperCase() + jadwal.slice(1), judul: 'Jadwal Rutin', sub: 'Hari & jam keberangkatan dikonfirmasi admin', armada: 'Hiace', icon: '📅', tone: 'hiace' as const, time: undefined },
  ];
  const ringkasan = [
    { k: 'Rute', v: `${r.from} → ${r.to}` },
    { k: 'Armada', v: r.armadaCard ?? 'Toyota Hiace' },
    { k: 'Kapasitas', v: r.kapasitas ?? KAPASITAS_HIACE },
    { k: 'Harga', v: `${harga}/orang` },
  ];
  const H2 = 'text-2xl font-bold text-slate-800 mt-12 mb-5 pb-3 border-b-2 border-amber-300 inline-block';

  return (
    <ArticleLayout
      title={r.h1}
      description={r.lead}
      breadcrumbs={[{ label: 'Travel Bengkulu', href: '/travel-bengkulu' }, { label: `${r.from}–${r.to}` }]}
      badge={r.badge ?? '🚐 Rute Baru · Via Tol'}
      price={harga}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Foto utama ── */}
      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-5 shadow-sm">
        <Image
          src={`${IMG_DIR}/${r.heroSrc}`}
          alt={r.heroAlt}
          fill
          priority
          className={r.heroPos ? `object-cover ${r.heroPos}` : heroIsMalam ? 'object-cover object-[50%_65%]' : 'object-cover object-bottom'}
          sizes="(max-width: 1024px) 100vw, 700px"
        />
        {r.heroChip && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-900/75 to-transparent" aria-hidden="true" />
            <span className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-1.5 text-sm font-bold text-slate-900 shadow-md">
              {r.heroChip}
            </span>
          </>
        )}
      </div>

      {/* ── Penegasan target pasar ── */}
      {r.fokus && (
        <section aria-label={r.fokus.eyebrow} className={`mb-6 rounded-2xl border p-5 shadow-sm ${TONE[r.fokus.tone].wrap}`}>
          <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${TONE[r.fokus.tone].eyebrow}`}>
            {r.fokus.eyebrow}
          </span>
          <p className="mt-3 text-lg font-extrabold leading-snug text-slate-800">{r.fokus.judul}</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 list-none p-0 m-0">
            {r.fokus.poin.map((x) => (
              <li key={x} className="flex gap-2 text-sm text-slate-700">
                <span className={`font-bold ${TONE[r.fokus!.tone].check}`} aria-hidden="true">✓</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
          {r.fokus.kota && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5" aria-label="Kota yang dilewati">
              {r.fokus.kota.map((k, i, arr) => (
                <span key={k} className="flex items-center gap-1.5">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${i === 0 || i === arr.length - 1 ? TONE[r.fokus!.tone].chipEnd + ' border-transparent' : TONE[r.fokus!.tone].chip}`}>{k}</span>
                  {i < arr.length - 1 && <span className="text-slate-400" aria-hidden="true">→</span>}
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Ringkasan: Rute / Armada / Kapasitas / Harga ── */}
      <div className="grid grid-cols-2 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 mb-6">
        {ringkasan.map((x) => (
          <div key={x.k} className="bg-stone-50 px-4 py-4 text-center">
            <div className="text-[11px] tracking-widest uppercase text-slate-400 mb-1">{x.k}</div>
            <div className="font-bold text-slate-800 leading-snug">{x.v}</div>
          </div>
        ))}
      </div>

      {r.intro ? (
        r.intro.map((t) => (
          <p key={t}><Rich text={t} /></p>
        ))
      ) : (
        <p>
          <strong>Travel {nama} Hiace</strong> melayani perjalanan dari {r.from} langsung ke {r.tujuan} lewat{' '}
          <strong>{via}</strong>. Tarif <strong>{harga} per orang</strong>, jadwal <strong>{jadwal}</strong>. Banyak
          penumpang memilih Hiace karena kabinnya lebih lega dan nyaman untuk perjalanan jauh.
        </p>
      )}

      {r.switcher && r.fokus && (
        <div className="my-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-slate-700">{r.switcher.text}</span>
          <Link href={r.switcher.href} className={`inline-flex shrink-0 items-center justify-center rounded-xl border px-4 py-2 text-sm font-bold transition ${TONE[r.fokus.tone].switchBtn}`}>
            {r.switcher.label} →
          </Link>
        </div>
      )}

      {/* ── Jadwal ── */}
      <h2 className={H2}>Jadwal Keberangkatan</h2>
      <div className={`grid gap-4 ${cards.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {cards.map((c) => (
          <Link
            key={c.judul}
            href={c.time ? `/pesan?rute=${c.routeId ?? r.routeId}&jam=${c.time}` : `/pesan?rute=${c.routeId ?? r.routeId}`}
            className="group block rounded-2xl bg-slate-900 p-5 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl shrink-0" aria-hidden="true">{c.icon}</span>
              <div className="min-w-0">
                <div className="text-2xl font-bold text-amber-300 leading-tight">{c.jam}</div>
                <div className="font-semibold">{c.judul}</div>
                <div className="text-sm text-slate-300">{c.sub}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${c.tone === 'hiace' ? 'bg-emerald-400 text-emerald-950' : 'bg-amber-200 text-amber-900'}`}>
                {c.armada}
              </span>
              <span className="text-sm text-slate-300 group-hover:text-white transition">Pilih jadwal ini →</span>
            </div>
          </Link>
        ))}
      </div>

      {r.catatanArmada && (
        <div role="note" className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 flex gap-3">
          <span className="text-xl shrink-0" aria-hidden="true">⚠️</span>
          <div className="text-amber-900 text-sm leading-relaxed">
            <strong>Catatan armada:</strong> {r.catatanArmada}
          </div>
        </div>
      )}
      <div role="note" className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 flex gap-3">
        <span className="text-xl shrink-0" aria-hidden="true">ℹ️</span>
        <div className="text-sky-900 text-sm leading-relaxed">
          Jadwal dapat berubah pada hari tertentu. Konfirmasi ketersediaan kursi lewat WhatsApp atau form sebelum berangkat.
        </div>
      </div>

      <Link
        href={pesanHref}
        className="cta-btn-shimmer mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-lg font-extrabold text-white shadow-lg"
        style={{ backgroundColor: '#16a34a' }}
      >
        🎫 Pesan Sekarang
      </Link>
      <div className="mt-3 text-center text-sm text-slate-500">
        Atau hubungi admin: <a href="tel:+6285268645461">0852-6864-5461</a> / <a href="tel:+6282374497929">0823-7449-7929</a>
      </div>

      {/* ── Tarif per tujuan (koridor Padang) ── */}
      {r.tarifTujuan && (
        <>
          <h2 className={H2}>{r.judulTarif ?? `Tarif per Tujuan dari ${r.from}`}</h2>
          <p>
            {r.tarifIntro ?? 'Satu keberangkatan melayani beberapa kota di sepanjang jalur ke Padang. Pilih tujuan Anda: tarif Hiace dan tarif kendaraan lain (Rp 50.000 lebih murah) tertera di bawah.'}
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr><th>Tujuan</th><th>{r.tarifTujuan.some((t) => t.lain) ? 'Hiace' : 'Tarif/orang'}</th>{r.tarifTujuan.some((t) => t.lain) && <th>Kendaraan lain</th>}<th></th></tr>
              </thead>
              <tbody>
                {r.tarifTujuan.map((t) => (
                  <tr key={t.routeId}>
                    <td><strong>{r.from} → {t.tujuan}</strong></td>
                    <td>{rp(t.hiace)}</td>
                    {r.tarifTujuan!.some((x) => x.lain) && <td>{t.lain ? rp(t.lain) : '-'}</td>}
                    <td><Link href={`/pesan?rute=${t.routeId}`} className="font-semibold text-primary-700 hover:underline">Pesan →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500">{r.tarifFootnote ?? 'Tarif per orang. Jam keberangkatan Hiace dan mobil random tertera di bagian Jadwal di atas.'}</p>
        </>
      )}

      {/* ── Rute ── */}
      <h2 className={H2}>{r.judulRute ?? `Rute Perjalanan ${r.from} ke ${r.to} via ${via}`}</h2>
      <div className="flex flex-wrap items-center gap-2 mb-4" aria-label="Titik yang dilewati">
        {stops.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${i === 0 || i === stops.length - 1 ? 'bg-primary-700 text-white' : 'bg-slate-100 text-slate-700'}`}>{s}</span>
            {i < stops.length - 1 && <span className="text-slate-400" aria-hidden="true">→</span>}
          </span>
        ))}
      </div>
      <p>{r.jalur}</p>
      <table>
        <tbody>
          <tr><td>Estimasi waktu</td><td>{r.duration}, tergantung {r.durasiNote ?? 'jalan, antrean pelabuhan, dan cuaca'}</td></tr>
          <tr><td>Penjemputan</td><td>{r.jemput}, titik disepakati saat pesan</td></tr>
          <tr><td>Pembayaran</td><td>Tunai atau QRIS</td></tr>
          <tr><td>Pemesanan</td><td>Form online atau WhatsApp admin</td></tr>
        </tbody>
      </table>

      {/* ── Keunggulan ── */}
      <h2 className={H2}>{r.judulKenapa ?? `Kenapa Pilih Travel Hiace ${nama}`}</h2>
      <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {(r.perks ?? [
          ['Hiace kabin lega', 'atap tinggi, sabuk pengaman, TV dan audio'],
          [via, r.perkVia ?? 'rute Palembang–Lampung lewat Tol Trans Sumatera'],
          ['Jadwal jelas', r.perkJadwal ?? '2 kali seminggu, bisa direncanakan jauh hari'],
          ['Tarif transparan', `${harga}/orang, dijelaskan sebelum Anda membayar`],
          ['Dijemput', `titik jemput di ${r.jemput.replace(/^Area /, '')} disepakati saat pesan`],
          ['Pesan 24 jam', 'admin siap dihubungi kapan saja'],
        ]).map(([t, d]) => (
          <div key={t} className="flex gap-3 text-sm">
            <span className="mt-0.5 text-emerald-600 font-bold" aria-hidden="true">✓</span>
            <div><span className="font-semibold text-slate-800">{t}</span><span className="text-slate-600"> — {d}</span></div>
          </div>
        ))}
      </div>

      {/* ── Galeri ── */}
      <h2 className={H2}>Galeri Armada Hiace</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {galeri.map((g) => (
          <figure key={g.src} className="m-0">
            <Image src={`${IMG_DIR}/${g.src}`} alt={g.alt} width={g.w} height={g.h} loading="lazy" className="w-full h-44 object-cover rounded-xl" sizes="(max-width: 640px) 50vw, 220px" />
            <figcaption className="text-xs text-slate-500 mt-1.5 leading-snug">{g.cap}</figcaption>
          </figure>
        ))}
      </div>

      {/* ── Cara memesan ── */}
      <h2 className={H2}>Cara Memesan</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <div key={s.t} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-50 text-primary-800">
              <span className="text-lg leading-none" aria-hidden="true">{s.icon}</span>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-600">Langkah {i + 1}</div>
              <div className="font-semibold text-slate-800">{s.t}</div>
              <div className="text-sm text-slate-600 leading-snug">{s.d}</div>
            </div>
          </div>
        ))}
      </div>
      <Link href={pesanHref} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-700 px-6 py-3 font-bold text-white hover:bg-primary-800 transition">
        Mulai Pesan →
      </Link>

      {/* ── FAQ ── */}
      <h2 className={H2}>Pertanyaan yang Sering Diajukan</h2>
      <div className="space-y-3">
        {faq.map(([q, a]) => (
          <details key={q} className="group rounded-2xl border border-slate-200 bg-stone-50 open:bg-white open:shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
              <span>{q}</span>
              <span className="shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
            </summary>
            <div className="px-5 pb-4 text-slate-600 leading-relaxed">{a}</div>
          </details>
        ))}
      </div>

      <div className="mt-8 text-xs text-slate-500">
        Diperbarui 28 Oktober 2026 oleh tim Travel Bengkulu, BTN Air Bang Curup. Informasi tarif dan jadwal dikelola langsung oleh admin kami.
      </div>

      {/* ── Terkait ── */}
      <div className="mt-8 rounded-2xl bg-slate-50 p-5">
        <div className="mb-3 font-bold text-slate-800">Rute &amp; Info Terkait</div>
        <div className="flex flex-wrap gap-2">
          {r.related.map((x) => (
            <Link key={x.href} href={x.href} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-primary-700 hover:border-primary-400 hover:bg-primary-50 transition">
              {x.label}
            </Link>
          ))}
        </div>
      </div>
    </ArticleLayout>
  );
}
