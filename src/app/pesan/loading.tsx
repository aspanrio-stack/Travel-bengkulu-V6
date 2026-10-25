export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-8" aria-busy="true" aria-label="Memuat">
      <div className="mb-6 h-8 w-2/3 rounded-lg bg-slate-200" />
      <div className="mb-8 h-4 w-1/2 rounded bg-slate-100" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-40 rounded-2xl bg-slate-100" />
        <div className="h-40 rounded-2xl bg-slate-100" />
        <div className="h-40 rounded-2xl bg-slate-100" />
        <div className="h-40 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}
