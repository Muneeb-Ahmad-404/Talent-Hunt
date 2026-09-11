import { apiFetch } from '../../lib/server-api';
import Link from 'next/link';
import type { Job } from '@/lib/types';
import { EmptyState, ErrorState } from '@/components/ui-states';
import { PageHeader, PageShell, StatusPill, Card } from '@/components/ui';

export default async function JobsPage() {
  const res = await apiFetch('/api/public/jobs');
  if (!res.ok) return <PageShell><ErrorState message="We couldn't load open positions right now." /></PageShell>;
  const data: { jobs: Job[]; nextCursor: string | null } = await res.json();
  return <PageShell><PageHeader eyebrow="Opportunities" title="Open positions" description="Explore roles from companies building their next chapter." />{data.jobs.length === 0 ? <EmptyState message="There are no open positions right now. Check back soon." /> : <div className="grid gap-4 md:grid-cols-2">{data.jobs.map((job) => <Card key={job.id} className="transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"><Link href={`/jobs/${job.id}`} className="block p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-950">{job.title}</h2><p className="mt-1 text-sm text-slate-500">{job.companyName}</p></div>{job.status && <StatusPill status={job.status} />}</div><div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-500">{job.location && <span className="rounded-full bg-slate-100 px-2.5 py-1">{job.location}</span>}{job.employmentType && <span className="rounded-full bg-slate-100 px-2.5 py-1">{job.employmentType.replace('_', ' ')}</span>}</div><p className="mt-5 text-sm font-semibold text-indigo-600">View opportunity <span aria-hidden="true">→</span></p></Link></Card>)}</div>}</PageShell>;
}
