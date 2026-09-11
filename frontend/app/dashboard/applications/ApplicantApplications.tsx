import { apiFetch } from '@/lib/server-api';
import type { Application } from '@/lib/types';
import { EmptyState, ErrorState } from '@/components/ui-states';
import { PageHeader, PageShell, Card, StatusPill } from '@/components/ui';

export default async function ApplicantApplications() {
  const response = await apiFetch('/api/applicants/applications');
  if (!response.ok) return <PageShell><ErrorState message="Unable to load your applications." /></PageShell>;
  const { applications }: { applications: Application[] } = await response.json();
  return <PageShell><PageHeader eyebrow="Applicant workspace" title="My applications" description="Track where each application stands and what comes next." />{applications.length === 0 ? <EmptyState message="You have not applied to any jobs yet. Browse open positions to get started." /> : <div className="space-y-3">{applications.map((application) => <Card key={application.id} className="p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><h2 className="font-semibold">{application.job_title}</h2><p className="mt-1 text-sm text-slate-500">{application.company_name}</p></div><StatusPill status={application.stage} /></div>{application.upcoming_interview && <p className="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-800">Interview scheduled for {new Date(application.upcoming_interview.scheduled_at).toLocaleString()}</p>}</Card>)}</div>}</PageShell>;
}
