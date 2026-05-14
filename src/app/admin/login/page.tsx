/**
 * app/admin/login/page.tsx
 * Login tidak diperlukan — client-side redirect ke /admin.
 * Menggunakan useEffect agar tidak loop dengan server redirect.
 */
'use client';
import { useEffect } from 'react';

export default function AdminLoginPage() {
  useEffect(() => {
    window.location.replace('/admin');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      fontFamily: 'Arial, sans-serif',
    }}>
      <p style={{ color: '#64748b', fontSize: 14 }}>Mengalihkan ke dashboard...</p>
    </div>
  );
}
