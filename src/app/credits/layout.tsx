import type { Metadata } from 'next';

// page.tsx adalah Client Component sehingga tidak bisa mengekspor metadata;
// noindex dipasang lewat layout ini.
export const metadata: Metadata = {
  title: 'Kredit',
  robots: { index: false, follow: false },
};

export default function CreditsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
