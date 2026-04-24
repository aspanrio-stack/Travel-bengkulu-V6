// ... (import tetap sama)

export default function HomePage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900"></div>
          {/* OPTIMASI 1: Tambahkan fetchPriority pada dekorasi jika ini dianggap LCP */}
          <div className="absolute top-0 right-0 w-1/2 h-full pattern-dots opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* ... (Badge "Siap Melayani" tetap sama) */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">
              Travel Bengkulu<br />
              <span className="text-primary-400">Terpercaya &</span><br />
              Terjangkau
            </h1>
            {/* ... (Pesan WA & Link tetap sama) */}
          </div>

          {/* Right side visual */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* OPTIMASI 2: Bungkus Emoji agar tidak menyebabkan layout shift */}
              <div className="w-80 h-80 bg-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
                <div className="w-60 h-60 bg-primary-600/30 rounded-full flex items-center justify-center border border-primary-500/40">
                  <div className="text-center">
                    {/* Gunakan font-display agar rendering emoji lebih stabil */}
                    <div className="text-8xl mb-2 leading-none">🚐</div>
                    <p className="text-primary-300 font-semibold text-sm">Armada Kami</p>
                    <p className="text-white text-xs mt-1">Avanza · Innova · HiAce</p>
                  </div>
                </div>
              </div>
              {/* ... (Floating badges tetap sama) */}
            </div>
          </div>
        </div>
        {/* ... (Stats bar tetap sama) */}
      </section>

      {/* ... (Services & Why Us section tetap sama) */}

      {/* ARMADA SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* ... (Header section tetap sama) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              // ... (Data car tetap sama)
            ].map((car, index) => (
              <div key={car.name} className={`card overflow-hidden relative group ${car.featured ? 'ring-2 ring-primary-500' : ''}`}>
                <div className="relative h-52 overflow-hidden bg-slate-200">
                  <Image
                    src={car.img}
                    alt={car.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    // OPTIMASI 3: Atur priority & sizes
                    // Karena ini di bawah fold, jangan pakai priority, tapi set sizes dengan benar
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    // Berikan hint browser untuk memuat gambar pertama sedikit lebih cepat jika terlihat di layar kecil
                    priority={index === 0} 
                  />
                  {/* ... (Overlay tetap sama) */}
                </div>
                {/* ... (Info tetap sama) */}
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ... (CTA tetap sama) */}
    </>
  );
}
