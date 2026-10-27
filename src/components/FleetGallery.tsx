'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Galeri armada Hiace di beranda: tab Eksterior / Interior, tile bento,
 * ketuk foto → tampilan penuh (geser kiri/kanan, panah, Esc).
 * Foto di-lazy-load oleh next/image; hanya tab aktif yang dirender.
 */
type Photo = { src: string; alt: string; caption: string; pos?: string };

const EXTERIOR: Photo[] = [
  { src: '/images/hiace-padang/hiace-silver-depan.webp', alt: 'Toyota Hiace silver tampak depan', caption: 'Hiace silver · tampak depan', pos: '50% 60%' },
  { src: '/images/hiace-padang/hiace-silver-samping.webp', alt: 'Toyota Hiace silver tampak samping', caption: 'Hiace silver · tampak samping', pos: '50% 60%' },
  { src: '/images/curup-bandung/hiace-curup-bandung-malam.webp', alt: 'Toyota Hiace putih dengan lampu LED di malam hari', caption: 'Hiace putih · lampu LED', pos: '50% 55%' },
  { src: '/images/curup-bandung/hiace-curup-bandung-hero.webp', alt: 'Toyota Hiace hitam tampak depan', caption: 'Hiace hitam · tampak depan', pos: '50% 65%' },
];

const INTERIOR: Photo[] = [
  { src: '/images/curup-bandung/interior-hiace-karaoke-tv.webp', alt: 'Kabin Hiace lega dengan TV, speaker, dan lampu ambient', caption: 'Kabin lega dengan TV & speaker', pos: '50% 45%' },
  { src: '/images/curup-bandung/kabin-hiace-lega.webp', alt: 'Kursi kulit baris tengah Hiace', caption: 'Kursi kulit baris tengah' },
  { src: '/images/curup-bandung/kursi-hiace-penumpang.webp', alt: 'Kursi penumpang Hiace yang nyaman', caption: 'Kursi penumpang nyaman' },
  { src: '/images/hiace-padang/area-depan-tv-speaker.webp', alt: 'Area depan Hiace dengan TV dan speaker', caption: 'Area depan: TV & speaker' },
  { src: '/images/hiace-padang/kabin-led-tv.webp', alt: 'Plafon lampu LED dan TV di kabin Hiace', caption: 'Plafon lampu LED & TV' },
  { src: '/images/hiace-padang/kursi-belakang-lantai.webp', alt: 'Kursi belakang dan lantai kayu Hiace', caption: 'Lantai kayu & kursi belakang' },
  { src: '/images/hiace-padang/kursi-sabuk-pengaman.webp', alt: 'Kursi Hiace dilengkapi sabuk pengaman', caption: 'Kursi dengan sabuk pengaman' },
];

const FACILITIES = ['🛋️ Kursi kulit', '📺 LED TV', '🔊 Speaker audio', '💡 Lampu ambient', '🛡️ Sabuk pengaman', '🧳 Bagasi luas'];

type TabId = 'eksterior' | 'interior';
const TABS: { id: TabId; label: string; icon: string; photos: Photo[] }[] = [
  { id: 'eksterior', label: 'Eksterior', icon: '🚐', photos: EXTERIOR },
  { id: 'interior', label: 'Interior', icon: '🛋️', photos: INTERIOR },
];

export default function FleetGallery() {
  const [tab, setTab] = useState<TabId>('eksterior');
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const photos = TABS.find(t => t.id === tab)!.photos;
  const total = photos.length;

  const go = useCallback((dir: 1 | -1) => setOpen(i => (i === null ? i : (i + dir + total) % total)), [total]);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      lastFocus.current?.focus();
    };
  }, [open === null, close, go]); // eslint-disable-line react-hooks/exhaustive-deps

  const openAt = (i: number, el: HTMLElement) => { lastFocus.current = el; setOpen(i); };

  const tile = (p: Photo, i: number, featured = false) => (
    <button
      key={p.src}
      type="button"
      onClick={e => openAt(i, e.currentTarget)}
      aria-label={`Perbesar foto: ${p.caption}`}
      className={`group relative overflow-hidden rounded-2xl bg-slate-200 shadow-md shadow-slate-300/50 ring-1 ring-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-[0.98] transition-transform ${
        featured ? 'col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto' : 'aspect-[3/4]'
      }`}
    >
      <Image
        src={p.src}
        alt={p.alt}
        fill
        sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
        className="object-cover transition-transform duration-500 md:group-hover:scale-105"
        style={{ objectPosition: p.pos }}
      />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      <span className={`absolute inset-x-0 bottom-0 p-3 text-left font-semibold leading-snug text-white ${featured ? 'text-sm md:p-4 md:text-base' : 'text-[13px]'}`}>
        {p.caption}
      </span>
    </button>
  );

  const btn = 'flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-2xl text-white backdrop-blur hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

  return (
    <section id="armada" aria-labelledby="armada-title" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto mb-6 max-w-2xl text-center md:mb-8">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3.5 py-1.5 text-xs font-semibold text-primary-800 ring-1 ring-primary-100">
            🚐 Armada Hiace Kami
          </span>
          <h2 id="armada-title" className="section-title">Lihat Dulu Mobilnya, <span className="text-primary-700">Baru Berangkat</span></h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
            Foto asli armada Hiace kami — dari tampilan luar sampai kabin penumpang. Tanpa kejutan di hari keberangkatan.
          </p>
        </div>

        <ul aria-label="Fasilitas armada" className="mb-6 flex flex-wrap justify-center gap-2">
          {FACILITIES.map(f => (
            <li key={f} className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200">{f}</li>
          ))}
        </ul>

        <div role="tablist" aria-label="Pilih jenis foto" className="mx-auto mb-4 grid w-full max-w-xs grid-cols-2 rounded-full bg-slate-100 p-1">
          {TABS.map(t => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="armada-panel"
              type="button"
              onClick={() => { setTab(t.id); setOpen(null); }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                tab === t.id ? 'bg-primary-700 text-white shadow' : 'text-slate-700 hover:text-primary-800'
              }`}
            >
              <span aria-hidden>{t.icon}</span> {t.label} <span className={tab === t.id ? 'text-primary-100' : 'text-slate-600'}>({t.photos.length})</span>
            </button>
          ))}
        </div>

        <div id="armada-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
          {tab === 'interior' ? (
            <>
              {tile(INTERIOR[0], 0, true)}
              {INTERIOR.slice(1).map((p, i) => tile(p, i + 1))}
              <div className="col-span-2 flex min-h-[9rem] flex-col justify-center gap-3 rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 p-5 text-white">
                <p className="font-display text-lg font-bold leading-snug">Nyaman untuk perjalanan jauh</p>
                <p className="text-sm text-primary-100">Kabin lega, kursi empuk, hiburan selama di jalan.</p>
                <Link href="/pesan" className="inline-flex w-fit items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary-800 transition-transform active:scale-95">
                  Pesan Tiket
                </Link>
              </div>
            </>
          ) : (
            EXTERIOR.map((p, i) => tile(p, i))
          )}
        </div>

        <p className="mt-3 text-center text-xs text-slate-600">Ketuk foto untuk memperbesar</p>

        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link href="/travel-bengkulu" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-700/20 transition-transform active:scale-95">
            Lihat Semua Rute & Tarif <span aria-hidden>→</span>
          </Link>
          <Link href="/pesan" className="inline-flex items-center justify-center rounded-xl border border-primary-700 px-6 py-3 text-sm font-bold text-primary-800 transition-colors hover:bg-primary-50">
            Pesan Sekarang
          </Link>
        </div>
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri foto Hiace — ${tab}`}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/90"
          onClick={close}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50 && total > 1) go(dx < 0 ? 1 : -1);
          }}
        >
          <div className="relative w-full max-w-3xl flex-1" onClick={e => e.stopPropagation()}>
            <Image key={photos[open].src} src={photos[open].src} alt={photos[open].alt} fill sizes="100vw" className="object-contain" priority />
          </div>
          <p className="w-full bg-black/60 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-center text-sm font-medium text-white">{photos[open].caption}</p>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
            <span className="pointer-events-auto rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white">{open + 1} / {total}</span>
            <button ref={closeRef} type="button" onClick={e => { e.stopPropagation(); close(); }} aria-label="Tutup galeri" className={`${btn} pointer-events-auto`}>✕</button>
          </div>

          <button type="button" onClick={e => { e.stopPropagation(); go(-1); }} aria-label="Foto sebelumnya" className={`${btn} absolute left-3 top-1/2 -translate-y-1/2`}>‹</button>
          <button type="button" onClick={e => { e.stopPropagation(); go(1); }} aria-label="Foto berikutnya" className={`${btn} absolute right-3 top-1/2 -translate-y-1/2`}>›</button>
        </div>
      )}
    </section>
  );
}
