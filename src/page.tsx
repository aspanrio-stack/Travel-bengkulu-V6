import type { Metadata } from 'next';

// ── Tidak diindeks di GSC / Search Engine ─────────────────────────────────────
export const metadata: Metadata = {
  title: 'Kredit',
  robots: { index: false, follow: false },
};

// ── Data ──────────────────────────────────────────────────────────────────────
const stack = [
  {
    icon: '▲',
    name: 'Next.js',
    category: 'Framework',
    desc: 'Rendering SSR & SSG yang cepat, ringan, dan SEO-friendly.',
  },
  {
    icon: '⚛',
    name: 'React',
    category: 'UI Library',
    desc: 'Antarmuka berbasis komponen yang modular dan mudah dikembangkan.',
  },
  {
    icon: 'JS',
    name: 'JavaScript ES6+',
    category: 'Language',
    desc: 'Kode modern yang bersih, efisien, dan mudah di-maintain.',
  },
  {
    icon: '✦',
    name: 'CSS3',
    category: 'Styling',
    desc: 'Tampilan responsif yang ringan dan kompatibel lintas browser.',
  },
];

const principles = [
  '⚡ Performa Tinggi',
  '📐 Skalabel',
  '🔍 SEO-Friendly',
  '📱 Responsif',
  '🌐 Cross-Device',
];

const WA_NUMBER = '081373336728';
const WA_LINK = `https://wa.me/62${WA_NUMBER.replace(/^0/, '')}?text=Halo%2C%20saya%20tertarik%20membuat%20website%20dengan%20standar%20modern%20seperti%20ini.`;

// ── Page Component ────────────────────────────────────────────────────────────
export default function CreditsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-body">

      {/* ── Hero ── */}
      <section className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        <p className="text-[10px] tracking-[0.25em] uppercase text-slate-400 font-body mb-6">
          Halaman Kredit
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight tracking-tight text-slate-900 mb-6">
          Dibangun dengan <br />
          <span className="italic text-slate-400 font-semibold">ketelitian & standar modern.</span>
        </h1>
        <p className="text-base md:text-lg leading-relaxed text-slate-500 max-w-xl">
          Website ini dikembangkan oleh{' '}
          <span className="font-semibold text-slate-700">Dekcik</span> — dengan
          perhatian penuh pada performa, skalabilitas, dan pengalaman pengguna
          agar berjalan optimal di berbagai device dan kondisi jaringan.
        </p>
      </section>

      <hr className="max-w-3xl mx-auto border-slate-100 mx-6" />

      {/* ── Stack Teknologi ── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[10px] tracking-[0.25em] uppercase text-slate-300 font-body mb-10">
          — Stack Teknologi
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stack.map((item) => (
            <div
              key={item.name}
              className="group bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-md transition-all duration-200 p-6 rounded-sm"
            >
              <span className="block text-lg font-bold font-body text-slate-500 mb-3 group-hover:text-slate-800 transition-colors">
                {item.icon}
              </span>
              <p className="text-[9px] tracking-[0.2em] uppercase text-slate-300 mb-1">
                {item.category}
              </p>
              <h3 className="font-display text-[15px] font-semibold text-slate-800 mb-2 leading-snug">
                {item.name}
              </h3>
              <p className="text-[12px] leading-relaxed text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="max-w-3xl mx-auto border-slate-100 mx-6" />

      {/* ── Prinsip Pengembangan ── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[10px] tracking-[0.25em] uppercase text-slate-300 font-body mb-10">
          — Prinsip Pengembangan
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {principles.map((p) => (
            <span
              key={p}
              className="text-[11px] font-body tracking-wide bg-slate-50 border border-slate-200 text-slate-500 px-4 py-2 rounded-sm"
            >
              {p}
            </span>
          ))}
        </div>
        <p className="text-[15px] leading-[1.9] text-slate-400 italic max-w-lg">
          Setiap baris kode ditulis dengan mempertimbangkan kecepatan load,
          efisiensi rendering, dan keterbacaan jangka panjang. Tidak sekadar
          berjalan — tetapi berjalan dengan baik, di mana saja.
        </p>
      </section>

      <hr className="max-w-3xl mx-auto border-slate-100 mx-6" />

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-16 pb-24">
        <p className="text-[10px] tracking-[0.25em] uppercase text-slate-300 font-body mb-10">
          — Tertarik?
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight text-slate-900 mb-4">
          Wujudkan website <br />
          <span className="italic font-semibold text-slate-400">impian Anda bersama kami.</span>
        </h2>
        <p className="text-[15px] leading-relaxed text-slate-500 max-w-md mb-10">
          Kami siap membangun website dengan standar modern — cepat, ringan, dan
          tampil profesional untuk bisnis Anda.
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-900 text-white text-[12px] tracking-widest uppercase font-body px-7 py-4 hover:bg-slate-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Hubungi via WhatsApp
          </a>
          <span className="text-[12px] font-body text-slate-400 tracking-wide">
            {WA_NUMBER}
          </span>
        </div>
      </section>

      {/* ── Footer strip ── */}
      <div className="border-t border-slate-100 py-8 text-center">
        <p className="text-[11px] tracking-[0.18em] uppercase text-slate-300 font-body">
          © {new Date().getFullYear()} Dekcik — Crafted with care.
        </p>
      </div>

    </div>
  );
}
