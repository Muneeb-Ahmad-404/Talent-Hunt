import { apiFetch } from '@/lib/server-api';
import { getCurrentUser } from '@/lib/session';
import JobActions from './JobActions';
import EditJobForm from './EditJobForm';
import { ErrorState } from '@/components/ui-states';
import { PageHeader, PageShell, StatusPill, Card } from '@/components/ui';
import Link from 'next/link';

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [response, user] = await Promise.all([
    apiFetch(`/api/jobs/${id}`),
    getCurrentUser(),
  ]);

  if (!response.ok) {
    return (
      <PageShell>
        <ErrorState message="Job not found." />
      </PageShell>
    );
  }

  const job = await response.json();

  const role = user?.memberships[0]?.companyRole;

  const canEdit =
    role === 'owner' ||
    role === 'hr_manager' ||
    role === 'recruiter';

  return (
    <PageShell>
      <div className="space-y-8">
        {/* Header */}
        <PageHeader
          eyebrow="Company job"
          title={job.title}
          description="Review the position details and manage its publishing status."
          action={
            <div className="flex items-center gap-3">
              <StatusPill status={job.status} />

              <Link
                href="/dashboard/jobs"
                className="hidden rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
              >
                Back to jobs
              </Link>
            </div>
          }
        />

        {/* Job details */}
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Job description
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                The information candidates will see for this position.
              </p>
            </div>
          </div>

          <div className="px-6 py-7">
            <div className="max-w-3xl">
              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {job.description}
              </p>
            </div>
          </div>
        </Card>

        {/* Management */}
        {canEdit && (
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Manage job
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update the position or change its publishing status.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900">
                  Edit details
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Update the information associated with this position.
                </p>

                <div className="mt-6">
                  <EditJobForm jobId={id} job={job} />
                </div>
              </Card>

              <Card className="h-fit p-6">
                <h3 className="font-semibold text-slate-900">
                  Publishing
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Control whether this position is available to candidates.
                </p>

                <div className="mt-5">
                  <JobActions
                    jobId={id}
                    currentStatus={job.status}
                  />
                </div>
              </Card>
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}