import type { ReactNode } from 'react';

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 pt-6 md:pt-24 pb-16">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-10 [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_p]:mt-2 [&_p]:leading-relaxed [&_p]:text-slate-600 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ul]:text-slate-600 [&_a]:font-semibold [&_a]:text-primary-700 [&_a]:underline">
        <h1 className="font-display text-3xl font-bold text-slate-900">{title}</h1>
        <p className="!mt-1 text-sm !text-slate-500">Terakhir diperbarui: {updated}</p>
        {children}
      </article>
    </main>
  );
}
