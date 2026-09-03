import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../../components/site-header';
import { apiFetch } from '../../lib/api';

export default async function JobsPage() {
  const res = await apiFetch('/api/public/jobs');
  const data: { jobs?: any[] } = await res.json().catch(() => ({ jobs: [] }));
  const jobs = data.jobs ?? [];
  return <main className="min-h-screen bg-background"><SiteHeader /><section className="mx-auto max-w-6xl px-6 py-12"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Opportunities</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Open positions</h1><p className="mt-2 text-slate-600">Explore roles from companies hiring through Talent Hunt.</p></div>{jobs.length === 0 ? <div className="rounded-lg border bg-white p-10 text-center text-slate-600">No open positions are available right now.</div> : <div className="grid gap-4 md:grid-cols-2">{jobs.map((job) => <Link key={job.id} href={`/jobs/${job.id}`} className="rounded-lg border bg-white p-6 transition hover:border-blue-300 hover:shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold text-slate-900">{job.title}</h2><p className="mt-1 text-sm text-slate-600">{job.companyName ?? job.company?.name ?? 'Company'}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">View role</span></div><p className="mt-5 text-sm text-slate-500">{job.location ?? job.employmentType ?? 'Open position'}</p></Link>)}</div>}</section><SiteFooter /></main>;
}
