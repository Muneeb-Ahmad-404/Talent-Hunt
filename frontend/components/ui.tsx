import Link from 'next/link';

export function PageShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({ eyebrow, title, description, action }: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    draft: 'bg-slate-100 text-slate-600 ring-slate-200',
    closed: 'bg-rose-50 text-rose-700 ring-rose-200',
    applied: 'bg-slate-100 text-slate-700 ring-slate-200',
    screening: 'bg-blue-50 text-blue-700 ring-blue-200',
    interview: 'bg-amber-50 text-amber-700 ring-amber-200',
    final_interview: 'bg-orange-50 text-orange-700 ring-orange-200',
    offer: 'bg-violet-50 text-violet-700 ring-violet-200',
    hired: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${styles[status] ?? 'bg-slate-100 text-slate-600 ring-slate-200'}`}>{status.replaceAll('_', ' ')}</span>;
}

export function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">{children}</Link>;
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>;
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700">{label}</span>{children}{hint && <span className="block text-xs text-slate-400">{hint}</span>}</label>;
}

export const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';
