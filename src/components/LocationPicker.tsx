'use client';

import { useEffect, useRef, useState } from 'react';

interface LocationPickerProps {
  onChange: (location: { lat: number; lng: number } | null) => void;
}

export default function LocationPicker({ onChange }: LocationPickerProps) {
  const [enabled, setEnabled] = useState(false);
  const [showMap, setShowMap] = useState(false);           // kontrol tampil/sembunyikan peta
  const [applied, setApplied] = useState(false);           // true setelah user tekan "Terapkan"
  const [pendingLoc, setPendingLoc] = useState<{ lat: number; lng: number } | null>(null); // lokasi di peta (belum diterapkan)
  const [appliedLoc, setAppliedLoc] = useState<{ lat: number; lng: number } | null>(null); // lokasi yang sudah diterapkan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Buka peta & ambil GPS saat checkbox dicentang
  useEffect(() => {
    if (!enabled) {
      destroyMap();
      setPendingLoc(null);
      setAppliedLoc(null);
      setApplied(false);
      setShowMap(false);
      setError('');
      onChange(null);
      return;
    }

    setShowMap(true);
    setApplied(false);
    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPendingLoc({ lat, lng });
        setLoading(false);
        await initMap(lat, lng);
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setError('Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser Anda.');
        } else {
          setError('Gagal mendapatkan lokasi. Pastikan GPS Anda aktif.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [enabled]);

  function destroyMap() {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    }
  }

  async function initMap(lat: number, lng: number) {
    const L = (await import('leaflet')).default;
    await import('leaflet/dist/leaflet.css');

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([lat, lng], 16);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    marker.bindPopup('📍 Geser pin ke lokasi penjemputan Anda').openPopup();

    marker.on('dragend', () => {
      const p = marker.getLatLng();
      setPendingLoc({ lat: p.lat, lng: p.lng });
    });

    map.on('click', (e: any) => {
      marker.setLatLng(e.latlng);
      setPendingLoc({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
  }

  // Tombol "Terapkan Lokasi" ditekan → simpan & tutup peta
  const handleApply = () => {
    if (!pendingLoc) return;
    setAppliedLoc(pendingLoc);
    onChange(pendingLoc);
    setApplied(true);
    setShowMap(false);
    destroyMap();
  };

  // Tombol "Ubah" ditekan → buka peta lagi dari lokasi yang sudah diterapkan
  const handleChangeLocation = () => {
    setApplied(false);
    setShowMap(true);
    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // Pakai koordinat yang sudah diterapkan sebagai titik awal, bukan GPS baru
        const lat = appliedLoc?.lat ?? pos.coords.latitude;
        const lng = appliedLoc?.lng ?? pos.coords.longitude;
        setPendingLoc({ lat, lng });
        setLoading(false);
        await initMap(lat, lng);
      },
      async () => {
        // Jika GPS gagal, pakai lokasi yang sudah diterapkan
        if (appliedLoc) {
          setPendingLoc(appliedLoc);
          setLoading(false);
          await initMap(appliedLoc.lat, appliedLoc.lng);
        } else {
          setLoading(false);
          setError('Gagal mendapatkan lokasi. Pastikan GPS Anda aktif.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleRetry = () => {
    setEnabled(false);
    setTimeout(() => setEnabled(true), 100);
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">

      {/* ── Checkbox toggle ── */}
      <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="mt-0.5">
          <input
            type="checkbox"
            checked={enabled}
            onChange={() => setEnabled(prev => !prev)}
            className="w-4 h-4 accent-primary-600 rounded cursor-pointer"
          />
        </div>
        <div>
          <p className="font-semibold text-slate-700 text-sm">
            📍 Sertakan lokasi GPS penjemputan
          </p>
          <p className="text-slate-400 text-xs mt-0.5">
            Opsional — membantu driver menemukan lokasi Anda dengan mudah
          </p>
        </div>
      </label>

      {enabled && (
        <div className="border-t border-slate-100">

          {/* ── Ringkasan setelah diterapkan (peta tertutup) ── */}
          {applied && appliedLoc && (
            <div className="px-4 py-3 bg-green-50 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-green-700 mb-0.5">✅ Lokasi diterapkan</p>
                <p className="text-xs text-green-600 font-mono">
                  {appliedLoc.lat.toFixed(6)}, {appliedLoc.lng.toFixed(6)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://maps.google.com/?q=${appliedLoc.lat},${appliedLoc.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:underline"
                >
                  Lihat ↗
                </a>
                <button
                  type="button"
                  onClick={handleChangeLocation}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Ubah
                </button>
              </div>
            </div>
          )}

          {/* ── Peta + tombol terapkan ── */}
          {showMap && (
            <>
              {/* Loading */}
              {loading && (
                <div className="px-4 py-6 flex items-center justify-center gap-3 text-slate-500 text-sm bg-slate-50">
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-primary-600 rounded-full animate-spin" />
                  Mendeteksi lokasi Anda...
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="px-4 py-4 bg-red-50">
                  <p className="text-red-600 text-sm mb-3">⚠️ {error}</p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* Peta */}
              {!loading && !error && (
                <>
                  <div
                    ref={mapRef}
                    className="w-full"
                    style={{ height: '260px' }}
                  />

                  {/* Koordinat pending */}
                  {pendingLoc && (
                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-xs text-slate-500 font-mono">
                        {pendingLoc.lat.toFixed(6)}, {pendingLoc.lng.toFixed(6)}
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${pendingLoc.lat},${pendingLoc.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:underline shrink-0 ml-2"
                      >
                        Lihat ↗
                      </a>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 text-center pt-2 px-4">
                    Geser pin atau ketuk peta untuk menyesuaikan lokasi
                  </p>

                  {/* ── Tombol Terapkan ── */}
                  <div className="px-4 pb-4 pt-3">
                    <button
                      type="button"
                      onClick={handleApply}
                      disabled={!pendingLoc}
                      className="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      ✅ Terapkan Lokasi Ini
                    </button>
                  </div>
                </>
              )}
            </>
          )}

        </div>
      )}
    </div>
  );
}
