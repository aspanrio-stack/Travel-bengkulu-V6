const CITIES = ['Bengkulu', 'Palembang', 'Bandung', 'Lampung', 'Jambi', 'Padang', 'Kaur'];

// Satu "grup" = daftar kota diulang agar selalu lebih lebar dari layar (hingga ultra-wide).
// Track berisi 2 grup identik → animasi geser -50% terlihat tanpa putus (seamless).
const REPEAT = 4;

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEAT }).flatMap((_, r) =>
        CITIES.map((c) => (
          <span
            key={`${r}-${c}`}
            className="whitespace-nowrap px-5 md:px-8 font-display text-xl md:text-3xl font-bold uppercase tracking-wide"
          >
            {c}
          </span>
        )),
      )}
    </div>
  );
}

/**
 * Kartu full-width (tanpa border/rounded) dengan dua baris marquee berlawanan arah
 * dan badge "Curup" yang diam di tengah. Murni CSS (server component, tanpa JS client).
 * Keyframes & pause ada di globals.css (.marquee-*).
 */
export default function CityMarqueeCard() {
  return (
    <section
      aria-label="Rute travel dari dan ke Curup"
      className="marquee relative w-full overflow-hidden bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 py-6 md:py-8"
    >
      <p className="sr-only">Melayani rute dari dan ke Curup: {CITIES.join(', ')}.</p>

      <div className="flex flex-col gap-6 md:gap-8">
        {/* Baris atas → bergerak ke KANAN */}
        <div className="marquee-mask overflow-hidden text-white" aria-hidden>
          <div className="marquee-track marquee-right">
            <Group />
            <Group hidden />
          </div>
        </div>

        {/* Baris bawah → bergerak ke KIRI */}
        <div className="marquee-mask overflow-hidden text-primary-200" aria-hidden>
          <div className="marquee-track marquee-left">
            <Group />
            <Group hidden />
          </div>
        </div>
      </div>

      {/* Badge tengah — diam di tempat */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <span className="inline-block rounded-full bg-white px-7 py-2 md:px-10 md:py-2.5 font-display text-2xl md:text-4xl font-extrabold uppercase tracking-wider text-primary-800 shadow-xl shadow-black/30 ring-4 ring-gold-500">
          Curup
        </span>
      </div>
    </section>
  );
}
