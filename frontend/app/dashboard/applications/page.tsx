import Link from 'next/link';
import { apiFetch } from '@/lib/api';

const stages: Record<string, string> = { applied: 'bg-blue-50 text-blue-700', screening: 'bg-amber-50 text-amber-700', interview: 'bg-violet-50 text-violet-700', final_interview: 'bg-violet-50 text-violet-700', offer: 'bg-emerald-50 text-emerald-700', hired: 'bg-emerald-50 text-emerald-700', rejected: 'bg-rose-50 text-rose-700' };

export default async function ApplicationsPage() {
  const response = await apiFetch('/api/applicants/applications');
  const payload = await response.json().catch(() => ({}));
  const applications = Array.isArray(payload) ? payload : Array.isArray(payload.applications) ? payload.applications : [];
  return <main className="mx-auto max-w-6xl px-6 py-8 md:px-10">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-primary">Applicant workspace</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Your applications</h1><p className="mt-2 text-muted-foreground">Track every opportunity from application to offer.</p></div><Link href="/jobs" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Find a new role</Link></div>
    {!response.ok ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">We couldn&apos;t load your applications right now.</div> : applications.length === 0 ? <div className="rounded-2xl border bg-card p-12 text-center"><h2 className="text-lg font-semibold">No applications yet</h2><p className="mt-2 text-muted-foreground">Your submitted applications will appear here.</p><Link href="/jobs" className="mt-5 inline-flex rounded-lg border px-4 py-2 text-sm font-medium">Browse jobs</Link></div> : <div className="overflow-hidden rounded-2xl border bg-card"><div className="grid gap-4 p-5 md:grid-cols-2">{applications.map((item: any) => { const stage = String(item.stage ?? 'applied'); return <article key={item.id} className="rounded-xl border p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold">{item.job_title ?? item.jobTitle ?? 'Untitled role'}</h2><p className="mt-1 text-sm text-muted-foreground">{item.company_name ?? item.companyName ?? 'Company'}</p></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stages[stage] ?? 'bg-muted text-muted-foreground'}`}>{stage.replaceAll('_', ' ')}</span></div>{item.applied_at && <p className="mt-5 text-xs text-muted-foreground">Applied {new Date(item.applied_at).toLocaleDateString()}</p>}{item.job_id && <Link href={`/jobs/${item.job_id}`} className="mt-4 inline-block text-sm font-semibold text-primary">View role →</Link>}</article> })}</div></div>}
  </main>;
}

export const dynamic = 'force-dynamic';
