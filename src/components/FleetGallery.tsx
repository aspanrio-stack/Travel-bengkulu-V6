'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/**
 * Galeri armada Hiace di beranda — gaya carousel geser (seperti RPM Travel):
 * baris Eksterior → chip fasilitas → baris Interior. Kartu bisa digeser ke samping
 * (scroll-snap), kartu berikutnya sedikit mengintip sebagai petunjuk geser.
 * Ketuk foto → tampilan penuh (geser kiri/kanan, panah, Esc).
 * Foto di-lazy-load oleh next/image; hanya foto pertama (eksterior) yang prioritas.
 */
type Photo = { src: string; alt: string; caption: string; pos?: string };
type GroupId = 'eksterior' | 'interior';

const EXTERIOR: Photo[] = [
  { src: '/images/hiace-padang/hiace-silver-depan.webp', alt: 'Toyota Hiace silver tampak depan', caption: 'Hiace silver · tampak depan', pos: '50% 62%' },
  { src: '/images/hiace-padang/hiace-silver-samping.webp', alt: 'Toyota Hiace silver tampak samping', caption: 'Hiace silver · tampak samping', pos: '50% 62%' },
  { src: '/images/curup-bandung/hiace-curup-bandung-malam.webp', alt: 'Toyota Hiace putih dengan lampu LED di malam hari', caption: 'Hiace putih · lampu LED', pos: '50% 58%' },
  { src: '/images/curup-bandung/hiace-curup-bandung-hero.webp', alt: 'Toyota Hiace hitam tampak depan', caption: 'Hiace hitam · tampak depan', pos: '50% 65%' },
];

const INTERIOR: Photo[] = [
  { src: '/images/curup-bandung/interior-hiace-karaoke-tv.webp', alt: 'Kabin Hiace lega dengan TV, speaker, dan lampu ambient', caption: 'Kabin lega dengan TV & speaker', pos: '50% 45%' },
  { src: '/images/curup-bandung/kabin-hiace-lega.webp', alt: 'Kursi kulit baris tengah Hiace', caption: 'Kursi kulit baris tengah', pos: '50% 55%' },
  { src: '/images/curup-bandung/kursi-hiace-penumpang.webp', alt: 'Kursi penumpang Hiace yang nyaman', caption: 'Kursi penumpang nyaman', pos: '50% 55%' },
  { src: '/images/hiace-padang/area-depan-tv-speaker.webp', alt: 'Area depan Hiace dengan TV dan speaker', caption: 'Area depan: TV & speaker', pos: '50% 50%' },
  { src: '/images/hiace-padang/kabin-led-tv.webp', alt: 'Plafon lampu LED dan TV di kabin Hiace', caption: 'Plafon lampu LED & TV', pos: '50% 40%' },
  { src: '/images/hiace-padang/kursi-belakang-lantai.webp', alt: 'Kursi belakang dan lantai kayu Hiace', caption: 'Lantai kayu & kursi belakang', pos: '50% 55%' },
  { src: '/images/hiace-padang/kursi-sabuk-pengaman.webp', alt: 'Kursi Hiace dilengkapi sabuk pengaman', caption: 'Kursi dengan sabuk pengaman', pos: '50% 55%' },
];

const FACILITIES = ['🛋️ Kursi kulit', '📺 LED TV', '🔊 Speaker audio', '💡 Lampu ambient', '🛡️ Sabuk pengaman', '🧳 Bagasi luas'];

const GROUPS: Record<GroupId, Photo[]> = { eksterior: EXTERIOR, interior: INTERIOR };

/** Satu baris carousel: scroll-snap horizontal + indikator titik yang mengikuti posisi geser. */
function Row({
  id, label, photos, onOpen, priority = false,
}: {
  id: GroupId; label: string; photos: Photo[]; onOpen: (g: GroupId, i: number, el: HTMLElement) => void; priority?: boolean;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    kids.forEach((k, i) => {
      const d = Math.abs(k.offsetLeft + k.offsetWidth / 2 - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    setActive(best);
  }, []);

  const scrollTo = (i: number) => {
    const el = scroller.current;
    const k = el?.children[i] as HTMLElement | undefined;
    if (!el || !k) return;
    el.scrollTo({ left: k.offsetLeft - (el.clientWidth - k.offsetWidth) / 2, behavior: 'smooth' });
  };

  // Eksterior: kartu lebar (jenis armada langsung terlihat). Interior: sedikit lebih kecil.
  const cardW = id === 'eksterior' ? 'w-[80%] sm:w-[56%] md:w-[38%] lg:w-[31%]' : 'w-[64%] sm:w-[44%] md:w-[30%] lg:w-[24%]';
  const cardH = id === 'eksterior' ? 'aspect-[4/3]' : 'aspect-[5/4]';

  return (
    <div role="group" aria-label={label}>
      <ul
        ref={scroller}
        onScroll={onScroll}
        tabIndex={0}
        aria-label={`${label} — geser ke samping`}
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:mx-0 md:px-0"
        style={{ scrollPaddingLeft: '1rem', WebkitOverflowScrolling: 'touch' }}
      >
        {photos.map((p, i) => (
          <li key={p.src} className={`${cardW} shrink-0 snap-start`}>
            <button
              type="button"
              onClick={e => onOpen(id, i, e.currentTarget)}
              aria-label={`Perbesar foto: ${p.caption}`}
              className={`group relative block w-full overflow-hidden rounded-3xl bg-slate-200 shadow-lg shadow-slate-400/30 ring-1 ring-slate-200/70 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-[0.98] ${cardH}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                priority={priority && i === 0}
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 360px"
                className="object-cover transition-transform duration-500 md:group-hover:scale-105"
                style={{ objectPosition: p.pos }}
              />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3.5 text-left font-display text-[15px] font-bold leading-snug text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.5)] md:text-base">
                {p.caption}
              </span>
            </button>
          </li>
        ))}
        {/* ruang akhir supaya kartu terakhir bisa rata ke tepi kiri */}
        <li aria-hidden className="w-1 shrink-0" />
      </ul>

      <div className="flex items-center justify-center gap-1.5 md:hidden" aria-hidden>
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            tabIndex={-1}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-primary-700' : 'w-1.5 bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function FleetGallery() {
  const [open, setOpen] = useState<{ g: GroupId; i: number } | null>(null);
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const photos = open ? GROUPS[open.g] : [];
  const total = photos.length;

  const go = useCallback(
    (dir: 1 | -1) => setOpen(o => (o ? { g: o.g, i: (o.i + dir + GROUPS[o.g].length) % GROUPS[o.g].length } : o)),
    [],
  );
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

  const openAt = (g: GroupId, i: number, el: HTMLElement) => { lastFocus.current = el; setOpen({ g, i }); };

  const btn = 'flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-2xl text-white backdrop-blur hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

  return (
    <section
      id="armada"
      aria-label="Armada Hiace Travel Bengkulu"
      className="relative z-10 -mt-9 px-4 pb-2 md:mt-0 md:bg-white md:py-12"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="sr-only">Armada Hiace Travel Bengkulu: tampilan luar dan kabin</h2>

        {/* EKSTERIOR */}
        <Row id="eksterior" label="Foto eksterior Hiace" photos={EXTERIOR} onOpen={openAt} priority />

        {/* FASILITAS — tepat di bawah foto eksterior */}
        <ul aria-label="Fasilitas armada" className="mb-4 mt-2 flex flex-wrap justify-center gap-2">
          {FACILITIES.map(f => (
            <li key={f} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">{f}</li>
          ))}
        </ul>

        {/* INTERIOR */}
        <Row id="interior" label="Foto interior Hiace" photos={INTERIOR} onOpen={openAt} />
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri foto Hiace — ${open.g}`}
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
            <Image key={photos[open.i].src} src={photos[open.i].src} alt={photos[open.i].alt} fill sizes="100vw" className="object-contain" priority />
          </div>
          <p className="w-full bg-black/60 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-center text-sm font-medium text-white">{photos[open.i].caption}</p>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
            <span className="pointer-events-auto rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white">{open.i + 1} / {total}</span>
            <button ref={closeRef} type="button" onClick={e => { e.stopPropagation(); close(); }} aria-label="Tutup galeri" className={`${btn} pointer-events-auto`}>✕</button>
          </div>

          <button type="button" onClick={e => { e.stopPropagation(); go(-1); }} aria-label="Foto sebelumnya" className={`${btn} absolute left-3 top-1/2 -translate-y-1/2`}>‹</button>
          <button type="button" onClick={e => { e.stopPropagation(); go(1); }} aria-label="Foto berikutnya" className={`${btn} absolute right-3 top-1/2 -translate-y-1/2`}>›</button>
        </div>
      )}
    </section>
  );
}
