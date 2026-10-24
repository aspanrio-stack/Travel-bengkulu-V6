'use client';
import { useEffect, useRef } from 'react';

/**
 * Carousel kartu layanan (HP): geser ke samping kartu demi kartu secara otomatis.
 * Hemat performa — timer HANYA berjalan saat:
 *  • section terlihat di layar (IntersectionObserver),
 *  • tab browser aktif,
 *  • pengguna tidak sedang menyentuh/menggeser (jeda 8 detik setelah interaksi),
 *  • pengguna tidak memilih "kurangi gerakan".
 * Di layar lebar (grid, tidak overflow) tidak ada timer sama sekali.
 */
const STEP_MS = 3500;
const RESUME_AFTER_INTERACTION_MS = 8000;

export default function ServiceCarousel({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let visible = false;
    let pausedUntil = 0;
    let timer: ReturnType<typeof setInterval> | null = null;

    const step = () => {
      if (!visible || document.hidden || Date.now() < pausedUntil) return;
      if (el.scrollWidth <= el.clientWidth + 8) return; // layar lebar: grid, bukan carousel
      const cards = Array.from(el.children) as HTMLElement[];
      if (cards.length < 2) return;
      const x = el.scrollLeft;
      const atEnd = x + el.clientWidth >= el.scrollWidth - 8;
      if (atEnd) { el.scrollTo({ left: 0, behavior: 'smooth' }); return; }
      const next = cards.find(c => c.offsetLeft - cards[0].offsetLeft > x + 8);
      el.scrollTo({ left: next ? next.offsetLeft - cards[0].offsetLeft : 0, behavior: 'smooth' });
    };

    const start = () => { if (!timer) timer = setInterval(step, STEP_MS); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start(); else stop();
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    const pause = () => { pausedUntil = Date.now() + RESUME_AFTER_INTERACTION_MS; };
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('pointerdown', pause, { passive: true });
    el.addEventListener('wheel', pause, { passive: true });
    el.addEventListener('focusin', pause);

    return () => {
      stop();
      io.disconnect();
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('wheel', pause);
      el.removeEventListener('focusin', pause);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="list"
      aria-label={label}
      className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
    >
      {children}
    </div>
  );
}
