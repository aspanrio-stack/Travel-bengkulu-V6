/**
 * qrisGenerator.ts
 * Utilitas untuk memodifikasi QRIS statis menjadi QRIS dinamis
 * dengan menyisipkan jumlah pembayaran ke Tag 54 dan
 * menghitung ulang CRC16 secara otomatis.
 */

// ─────────────────────────────────────────────
// FUNGSI 1: Hitung CRC16 (CCITT-FALSE)
// Algoritma standar yang digunakan QRIS Indonesia
// ─────────────────────────────────────────────
export function hitungCRC16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  // Kembalikan sebagai HEX 4 karakter kapital
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// ─────────────────────────────────────────────
// FUNGSI 2: Parse TLV (Tag-Length-Value) QRIS
// QRIS terdiri dari segmen: 2 digit tag + 2 digit length + value
// ─────────────────────────────────────────────
function parseTLV(qris: string): Map<string, string> {
  const hasil = new Map<string, string>();
  let i = 0;
  while (i < qris.length - 4) { // -4 untuk skip CRC di akhir
    const tag = qris.substring(i, i + 2);
    const length = parseInt(qris.substring(i + 2, i + 4), 10);
    const value = qris.substring(i + 4, i + 4 + length);
    hasil.set(tag, value);
    i += 4 + length;
  }
  return hasil;
}

// ─────────────────────────────────────────────
// FUNGSI 3: Rebuild QRIS dari Map TLV
// Susun ulang semua segmen menjadi string QRIS
// ─────────────────────────────────────────────
function rebuildQRIS(tlvMap: Map<string, string>): string {
  let hasil = '';
  for (const [tag, value] of tlvMap) {
    const length = value.length.toString().padStart(2, '0');
    hasil += tag + length + value;
  }
  return hasil;
}

// ─────────────────────────────────────────────
// FUNGSI UTAMA: Generate QRIS Dinamis
// Sisipkan total pembayaran ke Tag 54, hitung ulang CRC
// ─────────────────────────────────────────────
export function generateQRISDinamis(
  qrisStatis: string,
  totalBayar: number
): string {
  // Validasi input
  if (!qrisStatis || qrisStatis.length < 20) {
    throw new Error('QRIS statis tidak valid');
  }

  // Hapus 4 karakter CRC di akhir string QRIS
  const qrisTanpaCRC = qrisStatis.slice(0, -4);

  // Parse semua segmen TLV
  const tlvMap = parseTLV(qrisTanpaCRC);

  // Tag 54 = Transaction Amount (jumlah pembayaran)
  // Sisipkan total pembayaran tanpa desimal
  const nilaiTotal = Math.round(totalBayar).toString();
  tlvMap.set('54', nilaiTotal);

  // Rebuild string QRIS dengan Tag 54 baru
  // Tag 63 (CRC) selalu di akhir dengan length 04
  const qrisBaru = rebuildQRIS(tlvMap) + '6304';

  // Hitung CRC16 dari seluruh string termasuk "6304"
  const crcBaru = hitungCRC16(qrisBaru);

  // Kembalikan QRIS lengkap dengan CRC baru
  return qrisBaru + crcBaru;
}

// ─────────────────────────────────────────────
// FUNGSI HELPER: Format Rupiah
// ─────────────────────────────────────────────
export function formatRupiah(angka: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);
}

// ─────────────────────────────────────────────
// FUNGSI HELPER: Generate kode unik 3 digit (100–999)
// ─────────────────────────────────────────────
export function generateKodeUnik(): number {
  return Math.floor(Math.random() * 900) + 100;
}
