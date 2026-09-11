import { apiFetch } from '../../../lib/server-api';
import type { ShortlistItem } from '@/lib/types';
import Link from 'next/link';
import { PageHeader, PageShell, Card } from '@/components/ui';
import { EmptyState, ErrorState } from '@/components/ui-states';

export default async function ShortlistPage() {
  const res = await apiFetch('/api/applicants/shortlist');
  if (!res.ok) return <PageShell><ErrorState message="Unable to load your shortlist." /></PageShell>;
  const data: { shortlist: ShortlistItem[] } = await res.json();
  return <PageShell><PageHeader eyebrow="Applicant workspace" title="Your shortlist" description="Keep promising opportunities close while you explore your next move." />{!data.shortlist?.length ? <EmptyState message="Your shortlist is empty. Save a role from its job detail page to see it here." /> : <div className="grid gap-4 md:grid-cols-2">{data.shortlist.map((item) => <Card key={item.id} className="p-5"><p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Saved opportunity</p><h2 className="mt-2 text-lg font-semibold">{item.title}</h2><p className="mt-1 text-sm text-slate-500">{item.company_name}</p><Link href={`/jobs/${item.job_id}`} className="mt-5 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700">View job →</Link></Card>)}</div>}</PageShell>;
}
