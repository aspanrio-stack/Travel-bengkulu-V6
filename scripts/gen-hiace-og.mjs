// Membuat gambar thumbnail/OG Hiace (4 rasio) dari foto asli, tanpa upscale foto utama:
// foto di tengah (skala turun, tajam) + latar blur dari foto yang sama.
// Jalankan: node scripts/gen-hiace-og.mjs
import sharp from 'sharp';
import fs from 'node:fs';

const SRC = [
  { name: 'travel-hiace-bandung-kapal', file: 'public/images/curup-bandung/hiace-curup-bandung-hero.webp' },
  { name: 'travel-hiace-bandung-malam', file: 'public/images/curup-bandung/hiace-curup-bandung-malam.webp' },
  { name: 'travel-hiace-padang-samping', file: 'public/images/hiace-padang/hiace-silver-samping.webp' },
  { name: 'travel-hiace-padang-depan', file: 'public/images/hiace-padang/hiace-silver-depan.webp' },
];
const RATIOS = { og: [1200, 630], '1x1': [1000, 1000], '4x3': [1200, 900], '16x9': [1280, 720] };

for (const s of SRC) {
  const buf = fs.readFileSync(s.file);
  for (const [r, [W, H]] of Object.entries(RATIOS)) {
    const bg = await sharp(buf).resize(W, H, { fit: 'cover', position: 'centre' }).blur(28).modulate({ brightness: 0.72, saturation: 1.1 }).toBuffer();
    const fg = await sharp(buf).resize({ height: H, width: W, fit: 'inside', withoutEnlargement: false }).toBuffer();
    const out = `public/images/og/${s.name}-${r}.jpg`;
    await sharp(bg).composite([{ input: fg, gravity: 'centre' }]).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  }
}
console.log('ok');
