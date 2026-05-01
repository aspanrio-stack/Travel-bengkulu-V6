/**
 * lib/fonnte.ts
 * Helper untuk kirim WhatsApp via Fonnte API
 * Docs: https://fonnte.com/api
 */

const FONNTE_TOKEN = process.env.FONNTE_TOKEN!;
const FONNTE_URL = 'https://api.fonnte.com/send';

// Nomor admin yang menerima notifikasi pesanan baru
export const ADMIN_NUMBERS = [
  '6281373336728',
  '6285268645461',
];

interface FonntePayload {
  target: string;   // nomor tujuan, format: 628xxx
  message: string;
  delay?: number;   // delay antar pesan dalam detik (opsional)
}

/**
 * Kirim pesan WA ke SATU nomor
 */
export async function sendWA(target: string, message: string): Promise<boolean> {
  try {
    const res = await fetch(FONNTE_URL, {
      method: 'POST',
      headers: {
        Authorization: FONNTE_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        target: normalizePhone(target),
        message,
        delay: '1',
      }),
    });

    const data = await res.json();
    console.log(`[Fonnte] → ${target}:`, data);
    return data.status === true;
  } catch (err) {
    console.error('[Fonnte] Error kirim WA:', err);
    return false;
  }
}

/**
 * Kirim pesan WA ke BANYAK nomor sekaligus
 */
export async function sendWABulk(targets: string[], message: string): Promise<void> {
  await Promise.allSettled(targets.map(t => sendWA(t, message)));
}

/**
 * Normalisasi nomor HP ke format 628xxx
 */
function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) digits = '62' + digits.slice(1);
  if (!digits.startsWith('62')) digits = '62' + digits;
  return digits;
}

/**
 * Format Rupiah
 */
export function formatRp(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n);
}

// ─────────────────────────────────────────────────────────────
// TEMPLATE PESAN
// ─────────────────────────────────────────────────────────────

interface BookingData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  route: string;
  date: string;
  departureTime?: string;
  passengers: number | string;
  pickup: string;
  dropoff?: string;
  total: number;
  paymentMethod: 'tunai' | 'qris';
}

/**
 * NOTIF 1 → KE PEMESAN
 * Dikirim saat pemesan selesai isi form & klik konfirmasi
 */
export function msgPemesanTerima(data: BookingData): string {
  return [
    `Assalamualaikum / Halo *${data.name}* 👋`,
    '',
    `✅ *Pesanan Anda telah kami terima!*`,
    '',
    `📋 *Ringkasan Pemesanan:*`,
    `🚗 Rute      : ${data.route}`,
    `📅 Tanggal   : ${data.date}`,
    data.departureTime ? `🕐 Jam       : ${data.departureTime}` : '',
    `👥 Penumpang : ${data.passengers} orang`,
    `📍 Jemput di : ${data.pickup}`,
    data.dropoff ? `🏁 Antar ke  : ${data.dropoff}` : '',
    `💰 Total     : ${formatRp(data.total)}`,
    `💳 Pembayaran: ${data.paymentMethod === 'qris' ? 'QRIS (Transfer)' : 'Tunai ke Driver'}`,
    `🔖 No. Pesanan: *${data.id}*`,
    '',
    `⏳ Kami akan segera memproses dan mengkonfirmasi pesanan Anda.`,
    data.paymentMethod === 'qris'
      ? `📌 *Untuk pembayaran QRIS:* Admin akan mengecek pembayaran Anda dan mengirimkan konfirmasi beserta tiket setelah pembayaran diterima.`
      : `📌 *Pembayaran tunai* akan dibayarkan langsung kepada driver saat penjemputan.`,
    '',
    `Terima kasih telah memesan di *Travel Bengkulu* 🙏`,
    `_Simpan pesan ini sebagai bukti pemesanan Anda._`,
  ].filter(s => s !== null && s !== undefined && !(s === '' && false)).filter((s, i, arr) => {
    // hapus double blank line
    return !(s === '' && arr[i - 1] === '');
  }).join('\n');
}

/**
 * NOTIF 1 → KE ADMIN
 * Dikirim bersamaan saat ada pesanan baru masuk
 */
export function msgAdminPesananBaru(data: BookingData): string {
  return [
    `🔔 *PESANAN BARU MASUK!*`,
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    `🔖 No. Pesanan : *${data.id}*`,
    ``,
    `📋 *Detail Perjalanan:*`,
    `🚗 Rute      : ${data.route}`,
    `📅 Tanggal   : ${data.date}`,
    data.departureTime ? `🕐 Jam       : ${data.departureTime}` : '',
    `👥 Penumpang : ${data.passengers} orang`,
    ``,
    `👤 *Data Pemesan:*`,
    `📛 Nama      : ${data.name}`,
    `📞 No. HP    : ${data.phone}`,
    data.email ? `📧 Email     : ${data.email}` : `📧 Email     : (tidak diisi)`,
    `📍 Jemput di : ${data.pickup}`,
    data.dropoff ? `🏁 Antar ke  : ${data.dropoff}` : '',
    ``,
    `💰 Total     : ${formatRp(data.total)}`,
    `💳 Metode    : ${data.paymentMethod === 'qris' ? '📱 QRIS' : '💵 Tunai'}`,
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    data.paymentMethod === 'qris'
      ? `⚠️ *Segera cek pembayaran QRIS!*\nSetelah pembayaran diterima, tekan tombol *✅ Konfirmasi* di dashboard admin.\nTiket otomatis terkirim ke pelanggan (via email ${data.email ? `ke ${data.email}` : '(tidak ada email)'} + notif WA).`
      : `ℹ️ Pesanan *Tunai* — Pembayaran dilakukan langsung ke driver saat penjemputan.\nTekan *✅ Konfirmasi* di dashboard setelah sepakat dengan pelanggan.`,
  ].filter(Boolean).join('\n');
}

/**
 * NOTIF 2 → KE PEMESAN
 * Dikirim saat admin klik Konfirmasi di dashboard
 */
export function msgPemesanKonfirmasi(data: BookingData): string {
  return [
    `Assalamualaikum / Halo *${data.name}* 👋`,
    '',
    `🎉 *Pembayaran Anda telah dikonfirmasi!*`,
    '',
    `✅ Pesanan Anda sudah aktif dan siap berangkat.`,
    '',
    `📋 *Detail Perjalanan:*`,
    `🔖 No. Tiket  : *${data.id}*`,
    `🚗 Rute       : ${data.route}`,
    `📅 Tanggal    : ${data.date}`,
    data.departureTime ? `🕐 Jam        : ${data.departureTime}` : '',
    `👥 Penumpang  : ${data.passengers} orang`,
    `📍 Jemput di  : ${data.pickup}`,
    data.dropoff ? `🏁 Antar ke   : ${data.dropoff}` : '',
    `💰 Total       : ${formatRp(data.total)}`,
    '',
    data.email
      ? `📧 *Tiket perjalanan telah dikirim ke email:*\n${data.email}\n_(Cek folder Spam jika tidak masuk Inbox)_`
      : `📌 Harap tunjukkan pesan ini kepada driver saat penjemputan sebagai bukti pemesanan.`,
    '',
    `Driver kami akan menghubungi Anda sebelum keberangkatan.`,
    `Terima kasih telah mempercayai *Travel Bengkulu* 🙏`,
  ].filter(Boolean).join('\n');
}
