import Link from 'next/link';

/**
 * Panduan memberi ulasan & rating (halaman Jelajah).
 * Server component, tanpa gambar, tanpa JS tambahan.
 * Fakta mengacu pada kode: ulasan hanya untuk pesanan lunas, tombol "Beri Ulasan"
 * di Profil muncul 8 jam setelah jadwal berangkat, email permintaan ulasan dikirim
 * otomatis, tautan email berlaku 60 hari dan tanpa login, bisa tampil Anonim & diedit.
 */

const trust = [
  { icon: '✅', title: 'Hanya Penumpang Asli', desc: 'Ulasan hanya bisa ditulis dari pesanan yang sudah lunas dan perjalanannya selesai.' },
  { icon: '⭐', title: 'Rating Apa Adanya', desc: 'Bintang dan komentar datang langsung dari penumpang, bukan buatan kami.' },
  { icon: '🛠️', title: 'Bikin Kami Lebih Baik', desc: 'Setiap masukan kami baca untuk meningkatkan layanan di perjalanan berikutnya.' },
];

const viaAkun = [
  { title: 'Masuk ke akun', desc: 'Login dengan Google atau email dan kata sandi Anda.' },
  { title: 'Buka tab Profil', desc: 'Cari perjalanan Anda yang berstatus Terkonfirmasi.' },
  { title: 'Tekan “Beri Ulasan”', desc: 'Pilih bintang, tulis cerita Anda, lalu kirim. Ulasan bisa diedit kapan saja.' },
];

const viaEmail = [
  { title: 'Isi email saat memesan', desc: 'Pastikan alamat email Anda benar di formulir pemesanan.' },
  { title: 'Tunggu email dari kami', desc: 'Setelah perjalanan selesai, email “Bagaimana perjalanan Anda?” masuk otomatis.' },
  { title: 'Klik tombol di email', desc: 'Langsung ke halaman ulasan tanpa perlu login. Tautan berlaku 60 hari.' },
];

function Steps({ items, tone }: { items: { title: string; desc: string }[]; tone: 'teal' | 'amber' }) {
  const dot = tone === 'teal' ? 'bg-primary-700 text-white' : 'bg-amber-400 text-slate-900';
  return (
    <ol className="relative mt-4 space-y-4">
      {items.map((s, i) => (
        <li key={s.title} className="relative flex gap-3">
          {i < items.length - 1 && (
            <span className="absolute left-[15px] top-8 h-[calc(100%-0.5rem)] border-l-2 border-dashed border-slate-300" aria-hidden="true" />
          )}
          <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${dot}`}>
            {i + 1}
          </span>
          <div>
            <p className="font-bold text-slate-800">{s.title}</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{s.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Mockup kartu ulasan seperti di halaman Profil (data contoh) */
function ReviewMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-amber-100/80 via-primary-50 to-primary-200/60 blur-2xl" />
      <div className="rotate-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-primary-900/15 transition-transform duration-500 hover:rotate-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-display text-base font-bold text-slate-800">Curup → Bengkulu</p>
            <p className="text-[11px] text-slate-500">1 orang · Perjalanan Anda</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Terkonfirmasi</span>
        </div>
        <div className="mt-3 rounded-xl border border-primary-200 bg-primary-50/60 p-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wide text-primary-800">ULASAN ANDA</p>
            <span className="rounded-full border border-primary-200 px-2.5 py-0.5 text-[11px] font-semibold text-primary-700">Edit</span>
          </div>
          <p className="mt-1.5 text-xl tracking-wider text-amber-500">★★★★★</p>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-700">Sopir ramah, mobil bersih, jemputnya tepat waktu. Top!</p>
        </div>
      </div>
      <span className="absolute -right-2 -top-3 -rotate-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-900 shadow-lg">
        ★ PENUMPANG ASLI
      </span>
    </div>
  );
}

export default function ReviewGuideSection() {
  return (
    <section id="ulasan" aria-labelledby="ulasan-heading" className="relative mt-10 overflow-hidden rounded-3xl bg-white px-4 py-10 shadow-sm ring-1 ring-slate-100 md:px-10 md:py-14">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-100/60 blur-3xl" />
      </div>

      <div className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
              ⭐ Ulasan &amp; Rating
            </span>
            <h2 id="ulasan-heading" className="mt-4 font-display text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              Rating dari Penumpang Asli,{' '}
              <span className="text-primary-700">Bukan Rekayasa</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600 md:text-base">
              Setiap bintang di Travel Bengkulu datang dari orang yang benar-benar sudah
              berangkat bersama kami. Ulasan Anda membantu kami menjadi lebih baik dan
              meningkatkan layanan, sekaligus membantu calon penumpang lain memilih dengan
              yakin. Cukup beberapa menit, dan cerita Anda berarti banyak.
            </p>

            <ul className="mt-6 space-y-3">
              {trust.map((t) => (
                <li key={t.title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xl" aria-hidden="true">{t.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{t.title}</h3>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{t.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <ReviewMockup />
        </div>

        <h3 className="mb-6 mt-12 text-center font-display text-xl font-bold text-slate-900 md:text-2xl">
          Dua Cara Mudah Memberi Ulasan
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-5">
            <p className="inline-block rounded-full bg-primary-700 px-3 py-1 text-xs font-bold text-white">Cara 1 · Lewat Akun</p>
            <Steps items={viaAkun} tone="teal" />
            <p className="mt-4 rounded-lg bg-white/80 p-2.5 text-xs leading-relaxed text-slate-600">
              💡 Tombol “Beri Ulasan” muncul sekitar 8 jam setelah jadwal berangkat.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/masuk" className="btn-primary !px-4 !py-2 text-sm">Masuk dengan Google / Email</Link>
              <Link href="/profil" className="rounded-xl border border-primary-300 bg-white px-4 py-2 text-sm font-semibold text-primary-800">Buka Profil</Link>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
            <p className="inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">Cara 2 · Lewat Email</p>
            <Steps items={viaEmail} tone="amber" />
            <p className="mt-4 rounded-lg bg-white/80 p-2.5 text-xs leading-relaxed text-slate-600">
              📬 Belum menemukan emailnya? Cek juga folder Spam atau Promosi.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Privasi terjaga: Anda bisa memilih tampil sebagai Anonim saat menulis ulasan.
        </p>
      </div>
    </section>
  );
}
