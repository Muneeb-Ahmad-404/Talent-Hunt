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

  const attributes =
    job.attributes && typeof job.attributes === 'object'
      ? Object.entries(job.attributes)
      : [];

  const salary =
    job.salary_min != null || job.salary_max != null
      ? [job.salary_min, job.salary_max]
          .filter((value) => value != null)
          .join(' – ')
      : null;

  return (
    <PageShell>
      <div className="space-y-8">
        {/* Header */}
        <PageHeader
          eyebrow="Company job"
          title={job.title}
          description={[
            job.location,
            job.employment_type?.replace(/_/g, ' '),
          ]
            .filter(Boolean)
            .join(' · ')}
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

        {/* Job overview */}
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Job details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                The information candidates will see for this position.
              </p>
            </div>
          </div>

          <div className="space-y-8 px-6 py-7">
            {/* Basic information */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {job.location && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Location
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-800">
                    {job.location}
                  </p>
                </div>
              )}

              {job.employment_type && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Employment
                  </p>

                  <p className="mt-2 text-sm font-medium capitalize text-slate-800">
                    {job.employment_type.replace(/_/g, ' ')}
                  </p>
                </div>
              )}

              {salary && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Salary
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-800">
                    {salary}
                  </p>
                </div>
              )}

              {job.deadline && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Deadline
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-800">
                    {new Date(job.deadline).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {job.description && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Description
                </h3>

                <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {job.description}
                </p>
              </div>
            )}

            {/* Requirements */}
            {attributes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Requirements
                </h3>

                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  {attributes.map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {key.replace(/[_-]/g, ' ')}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {Array.isArray(value)
                          ? value.join(', ')
                          : typeof value === 'object' && value !== null
                            ? JSON.stringify(value)
                            : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Screening questions */}
            {job.screening_questions && job.screening_questions?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Screening questions
                </h3>

                <div className="mt-3 space-y-3">
                  {job.screening_questions.map(
                    (
                      question: {
                        text: string;
                        type: 'text' | 'boolean' | 'url';
                        required: boolean;
                      },
                      index: number,
                    ) => (
                      <div
                        key={`${index}-${question.text}`}
                        className="rounded-lg border border-slate-200 p-3"
                      >
                        <p className="text-sm text-slate-900">
                          {index + 1}. {question.text}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {question.type} ·{' '}
                          {question.required ? 'Required' : 'Optional'}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t border-slate-100 pt-5">
              <p className="text-xs text-slate-400">
                Posted{' '}
                {new Date(job.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
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