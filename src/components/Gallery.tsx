'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/**
 * Galeri foto: thumbnail bisa diklik → tampilan penuh (lightbox).
 * Geser kiri/kanan (sentuh), tombol panah, atau keyboard ← → ; Esc untuk menutup.
 * `images` = semua foto destinasi (termasuk foto utama); thumbnail menampilkan mulai foto ke-2.
 */
export default function Gallery({ images, name }: { images: string[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const total = images.length;

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

  const btn = 'flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-2xl text-white backdrop-blur hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white';

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {images.slice(1).map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={e => openAt(i + 1, e.currentTarget)}
            aria-label={`Perbesar foto ${i + 2} dari ${total}: ${name}`}
            className="relative aspect-square overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-[0.98] transition-transform"
          >
            <Image src={src} alt={`${name} ${i + 2}`} fill sizes="33vw" className="object-cover" />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri foto ${name}`}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90"
          onClick={close}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50 && total > 1) go(dx < 0 ? 1 : -1);
          }}
        >
          <div className="relative h-full w-full max-w-5xl" onClick={e => e.stopPropagation()}>
            <Image
              key={images[open]}
              src={images[open]}
              alt={`${name} ${open + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
            <span className="pointer-events-auto rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white">{open + 1} / {total}</span>
            <button ref={closeRef} type="button" onClick={e => { e.stopPropagation(); close(); }} aria-label="Tutup galeri" className={`${btn} pointer-events-auto`}>✕</button>
          </div>

          {total > 1 && (
            <>
              <button type="button" onClick={e => { e.stopPropagation(); go(-1); }} aria-label="Foto sebelumnya" className={`${btn} absolute left-3 top-1/2 -translate-y-1/2`}>‹</button>
              <button type="button" onClick={e => { e.stopPropagation(); go(1); }} aria-label="Foto berikutnya" className={`${btn} absolute right-3 top-1/2 -translate-y-1/2`}>›</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
