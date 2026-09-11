import { apiFetch } from '@/lib/server-api';
import type { Application } from '@/lib/types';
import { EmptyState, ErrorState } from '@/components/ui-states';
import { PageHeader, PageShell, Card, StatusPill } from '@/components/ui';
import Link from 'next/link';

export default async function ApplicantApplications() {
  const response = await apiFetch('/api/applicants/applications');

  if (!response.ok) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Applicant workspace"
          title="My applications"
          description="Track where each application stands and what comes next."
        />
        <ErrorState message="Unable to load your applications." />
      </PageShell>
    );
  }

  const { applications }: { applications: Application[] } =
    await response.json();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Applicant workspace"
        title="My applications"
        description="Track where each application stands and what comes next."
      />

      {applications.length === 0 ? (
        <EmptyState message="You have not applied to any jobs yet. Browse open positions to get started." />
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <Card
              key={application.id}
              className="p-0 transition-shadow hover:shadow-md"
            >
              <Link
                href={`/dashboard/applications/${application.id}`}
                className="group block p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
                        {application.company_name
                          ?.slice(0, 1)
                          .toUpperCase() || 'C'}
                      </div>

                      <div className="min-w-0">
                        <h2 className="font-semibold text-slate-950 transition-colors group-hover:text-slate-600">
                          {application.job_title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {application.company_name}
                        </p>
                      </div>
                    </div>

                    {application.created_at && (
                      <p className="mt-4 text-xs text-slate-400">
                        Submitted{' '}
                        {new Date(
                          application.created_at,
                        ).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <StatusPill status={application.stage} />
                    <span
                      className="hidden text-slate-300 transition-colors group-hover:text-slate-600 sm:inline"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>

                {application.upcoming_interview && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-semibold text-slate-600 shadow-sm">
                        •
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          Upcoming interview
                        </p>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {new Date(
                            application.upcoming_interview.scheduled_at,
                          ).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
