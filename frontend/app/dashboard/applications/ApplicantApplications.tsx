import { apiFetch } from '@/lib/server-api';
import type { Application } from '@/lib/types';
import { EmptyState, ErrorState } from '@/components/ui-states';
import { PageHeader, PageShell, Card, StatusPill } from '@/components/ui';
import Link from 'next/link';

export default async function ApplicantApplications() {
  const response = await apiFetch('/api/applicants/applications');
  if (!response.ok) return <PageShell><ErrorState message="Unable to load your applications." /></PageShell>;
  const { applications }: { applications: Application[] } = await response.json();
  return <PageShell><PageHeader eyebrow="Applicant workspace" title="My applications" description="Track where each application stands and what comes next." />{applications.length === 0 ? <EmptyState message="You have not applied to any jobs yet. Browse open positions to get started." /> : <div className="space-y-3">{applications.map((application) => <Card key={application.id} className="p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><Link href={`/dashboard/applications/${application.id}`} className="font-semibold text-slate-950 hover:text-indigo-700">{application.job_title}</Link><p className="mt-1 text-sm text-slate-500">{application.company_name}</p>{application.created_at && <p className="mt-2 text-xs text-slate-400">Submitted {new Date(application.created_at).toLocaleDateString()}</p>}</div><StatusPill status={application.stage} /></div>{application.upcoming_interview && <p className="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-800">Interview scheduled for {new Date(application.upcoming_interview.scheduled_at).toLocaleString()}</p>}</Card>)}</div>}</PageShell>;
}
