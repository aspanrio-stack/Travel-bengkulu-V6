'use client';

import type { Metadata } from 'next';
import { useEffect, useRef, useState } from 'react';

// ── Tidak diindeks ─────────────────────────────────────────────────────────────
// export const metadata: Metadata = {
//   title: 'Kredit',
//   robots: { index: false, follow: false },
// };

// ── Data ──────────────────────────────────────────────────────────────────────
const stack = [
  {
    icon: '▲',
    name: 'Next.js',
    category: 'Framework',
    desc: 'SSR & SSG cepat, ringan, dan SEO-friendly.',
    color: '#ffffff',
  },
  {
    icon: '⚛',
    name: 'React',
    category: 'UI Library',
    desc: 'Komponen modular yang mudah dikembangkan.',
    color: '#61DAFB',
  },
  {
    icon: 'JS',
    name: 'JavaScript ES6+',
    category: 'Language',
    desc: 'Kode modern yang bersih dan efisien.',
    color: '#F7DF1E',
  },
  {
    icon: '✦',
    name: 'Tailwind CSS',
    category: 'Styling',
    desc: 'Responsif, ringan, kompatibel lintas browser.',
    color: '#38BDF8',
  },
];

const principles = [
  { emoji: '⚡', label: 'Performa Tinggi' },
  { emoji: '📐', label: 'Skalabel' },
  { emoji: '🔍', label: 'SEO-Friendly' },
  { emoji: '📱', label: 'Responsif' },
  { emoji: '🌐', label: 'Cross-Device' },
];

const WA_NUMBER = '081373336728';
const WA_LINK = `https://wa.me/62${WA_NUMBER.replace(/^0/, '')}?text=Halo%2C%20saya%20tertarik%20membuat%20website%20dengan%20standar%20modern%20seperti%20ini.`;

// ── Fade-in hook ──────────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

// ── Section wrapper with animation ───────────────────────────────────────────
function AnimSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CreditsPage() {
  return (
    <div
      className="min-h-screen font-body"
      style={{
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1526 50%, #0a1020 100%)',
        color: '#e2e8f0',
      }}
    >
      {/* Decorative grid overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero ── */}
        <section className="max-w-3xl mx-auto px-6 pt-28 pb-20">
          <AnimSection>
            <p
              className="text-xs tracking-widest uppercase mb-6 font-body"
              style={{ color: '#63B3ED', letterSpacing: '0.3em' }}
            >
              ✦ Halaman Kredit
            </p>
            <h1
              className="font-display text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: '#F7FAFC' }}
            >
              Dibangun dengan{' '}
              <br />
              <span
                style={{
                  fontStyle: 'italic',
                  background: 'linear-gradient(90deg, #63B3ED, #76E4F7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ketelitian &amp; standar modern.
              </span>
            </h1>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#A0AEC0' }}>
              Website ini dikembangkan oleh{' '}
              <span
                className="font-semibold"
                style={{ color: '#63B3ED' }}
              >
                Dekcik
              </span>{' '}
              — dengan perhatian penuh pada performa, skalabilitas, dan pengalaman
              pengguna agar berjalan optimal di berbagai device dan kondisi jaringan.
            </p>
          </AnimSection>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-3xl mx-auto px-6">
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.3), transparent)' }} />
        </div>

        {/* ── Stack Teknologi ── */}
        <section className="max-w-3xl mx-auto px-6 py-20">
          <AnimSection delay={100}>
            <p
              className="text-xs tracking-widest uppercase mb-10 font-body"
              style={{ color: '#63B3ED', letterSpacing: '0.3em' }}
            >
              — Stack Teknologi
            </p>
          </AnimSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stack.map((item, i) => (
              <AnimSection key={item.name} delay={150 + i * 80}>
                <div
                  className="group p-6 rounded-xl h-full cursor-default"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'transform 0.2s ease, background 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,179,237,0.08)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,179,237,0.3)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <span
                    className="block text-xl font-bold font-mono mb-4"
                    style={{ color: item.color }}
                  >
                    {item.icon}
                  </span>
                  <p
                    className="text-[9px] tracking-widest uppercase mb-1"
                    style={{ color: '#718096', letterSpacing: '0.2em' }}
                  >
                    {item.category}
                  </p>
                  <h3
                    className="font-display text-sm font-semibold mb-2 leading-snug"
                    style={{ color: '#F7FAFC' }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#A0AEC0' }}>
                    {item.desc}
                  </p>
                </div>
              </AnimSection>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-3xl mx-auto px-6">
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.3), transparent)' }} />
        </div>

        {/* ── Prinsip ── */}
        <section className="max-w-3xl mx-auto px-6 py-20">
          <AnimSection delay={100}>
            <p
              className="text-xs tracking-widest uppercase mb-10 font-body"
              style={{ color: '#63B3ED', letterSpacing: '0.3em' }}
            >
              — Prinsip Pengembangan
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {principles.map((p, i) => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-2 text-sm font-body px-4 py-2 rounded-full"
                  style={{
                    background: 'rgba(99,179,237,0.08)',
                    border: '1px solid rgba(99,179,237,0.2)',
                    color: '#CBD5E0',
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <span>{p.emoji}</span>
                  <span>{p.label}</span>
                </span>
              ))}
            </div>
            <p
              className="text-base leading-[1.9] italic max-w-lg"
              style={{ color: '#718096', borderLeft: '3px solid rgba(99,179,237,0.4)', paddingLeft: '1.25rem' }}
            >
              Setiap baris kode ditulis dengan mempertimbangkan kecepatan load,
              efisiensi rendering, dan keterbacaan jangka panjang. Tidak sekadar
              berjalan — tetapi berjalan dengan baik, di mana saja.
            </p>
          </AnimSection>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-3xl mx-auto px-6">
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.3), transparent)' }} />
        </div>

        {/* ── CTA ── */}
        <section className="max-w-3xl mx-auto px-6 py-20 pb-28">
          <AnimSection delay={100}>
            <p
              className="text-xs tracking-widest uppercase mb-10 font-body"
              style={{ color: '#63B3ED', letterSpacing: '0.3em' }}
            >
              — Tertarik?
            </p>
            <h2
              className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-5"
              style={{ color: '#F7FAFC' }}
            >
              Wujudkan website{' '}
              <br />
              <span
                style={{
                  fontStyle: 'italic',
                  background: 'linear-gradient(90deg, #63B3ED, #76E4F7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                impian Anda bersama kami.
              </span>
            </h2>
            <p className="text-base leading-relaxed max-w-md mb-10" style={{ color: '#A0AEC0' }}>
              Kami siap membangun website dengan standar modern — cepat, ringan,
              dan tampil profesional untuk bisnis Anda.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm tracking-widest uppercase font-body px-7 py-4 rounded-xl font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#ffffff',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  boxShadow: '0 0 24px rgba(37,211,102,0.3)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = '0.88';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Hubungi via WhatsApp
              </a>
              <span
                className="text-sm font-mono tracking-wider"
                style={{ color: '#718096' }}
              >
                {WA_NUMBER}
              </span>
            </div>
          </AnimSection>
        </section>

        {/* ── Footer strip ── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-8 text-center">
          <p
            className="text-xs tracking-widest uppercase font-body"
            style={{ color: '#4A5568', letterSpacing: '0.2em' }}
          >
            © {new Date().getFullYear()} Dekcik — Crafted with care.
          </p>
        </div>

      </div>
    </div>
  );
}
