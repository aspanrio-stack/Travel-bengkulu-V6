'use client';

import { useEffect, useRef, useState } from 'react';

interface LocationPickerProps {
  onChange: (location: { lat: number; lng: number } | null) => void;
}

export default function LocationPicker({ onChange }: LocationPickerProps) {
  const [enabled, setEnabled] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Inisialisasi peta Leaflet saat checkbox dicentang
  useEffect(() => {
    if (!enabled) {
      // Reset peta dan lokasi saat dinonaktifkan
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
      setLocation(null);
      setError('');
      onChange(null);
      return;
    }

    // Ambil lokasi GPS user terlebih dahulu
    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        onChange({ lat, lng });
        setLoading(false);

        // Import Leaflet secara dinamis (hindari SSR error)
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        // Fix icon default Leaflet yang sering hilang di Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (!mapRef.current || mapInstanceRef.current) return;

        // Buat instance peta
        const map = L.map(mapRef.current).setView([lat, lng], 16);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Buat marker yang bisa di-drag
        const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        markerRef.current = marker;

        marker.bindPopup('📍 Geser pin ke lokasi penjemputan Anda').openPopup();

        // Update koordinat saat marker digeser
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          const newLoc = { lat: pos.lat, lng: pos.lng };
          setLocation(newLoc);
          onChange(newLoc);
        });

        // Update koordinat saat user klik di peta
        map.on('click', (e: any) => {
          const newLoc = { lat: e.latlng.lat, lng: e.latlng.lng };
          marker.setLatLng(e.latlng);
          setLocation(newLoc);
          onChange(newLoc);
        });
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

  const handleToggle = () => {
    setEnabled(prev => !prev);
  };

  const handleRetry = () => {
    setEnabled(false);
    setTimeout(() => setEnabled(true), 100);
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Checkbox toggle */}
      <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="mt-0.5">
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
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

      {/* Konten yang muncul saat dicentang */}
      {enabled && (
        <div className="border-t border-slate-100">
          {/* Loading */}
          {loading && (
            <div className="px-4 py-6 flex items-center justify-center gap-3 text-slate-500 text-sm bg-slate-50">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-primary-600 rounded-full animate-spin" />
              Mendeteksi lokasi Anda...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-4 py-4 bg-red-50 border-t border-red-100">
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
              {location && (
                <div className="px-4 py-3 bg-green-50 border-t border-green-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-0.5">✅ Lokasi terdeteksi</p>
                    <p className="text-xs text-green-600 font-mono">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:underline shrink-0 ml-2"
                  >
                    Lihat di Maps ↗
                  </a>
                </div>
              )}
              <p className="text-xs text-slate-400 text-center py-2 px-4">
                Geser pin atau ketuk peta untuk menyesuaikan lokasi
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
