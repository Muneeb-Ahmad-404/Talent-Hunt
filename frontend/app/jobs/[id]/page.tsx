import { apiFetch } from '@/lib/server-api';
import type { Job } from '@/lib/types';
import JobApplicationActions from './JobApplicationActions';
import { ErrorState, NotFoundState } from '@/components/ui-states';
import { Card, PageHeader, PageShell } from '@/components/ui';

export default async function PublicJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await apiFetch(`/api/public/jobs/${id}`);

  if (response.status === 404) {
    return (
      <PageShell>
        <NotFoundState />
      </PageShell>
    );
  }

  if (!response.ok) {
    return (
      <PageShell>
        <ErrorState message="Unable to load this job." />
      </PageShell>
    );
  }

  const job: Job = await response.json();

  const attributes =
    job.attributes && typeof job.attributes === 'object'
      ? Object.entries(job.attributes)
      : [];

  const salary =
    job.salaryMin != null || job.salaryMax != null
      ? [job.salaryMin, job.salaryMax]
          .filter((value) => value != null)
          .join(' – ')
      : null;

  return (
    <PageShell className="max-w-5xl">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          <PageHeader
            eyebrow={job.companyName}
            title={job.title}
            description={[
              job.location,
              job.employmentType?.replace(/_/g, ' '),
            ]
              .filter(Boolean)
              .join(' · ')}
          />

          <div className="mt-6 space-y-5">
            {job.description && (
              <Card className="p-6">
                <h2 className="text-base font-semibold text-slate-950">
                  About the role
                </h2>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {job.description}
                </p>
              </Card>
            )}

            {attributes.length > 0 && (
              <Card className="p-6">
                <h2 className="text-base font-semibold text-slate-950">
                  Requirements
                </h2>

                <div className="mt-5 space-y-4">
                  {attributes.map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {key.replace(/[_-]/g, ' ')}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-700">
                        {Array.isArray(value)
                          ? value.join(', ')
                          : typeof value === 'object' && value !== null
                            ? JSON.stringify(value)
                            : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <JobApplicationActions
              jobId={id}
              questions={job.screeningQuestions ?? []}
            />

            <p className="px-1 text-xs text-slate-400">
              Posted{' '}
              {new Date(job.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </main>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <h2 className="text-base font-semibold text-slate-950">
              Job details
            </h2>

            <dl className="mt-5 space-y-4">
              {job.location && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">
                    {job.location}
                  </dd>
                </div>
              )}

              {job.employmentType && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Employment
                  </dt>
                  <dd className="mt-1 text-sm capitalize text-slate-700">
                    {job.employmentType.replace(/_/g, ' ')}
                  </dd>
                </div>
              )}

              {salary && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Salary
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">
                    {salary}
                  </dd>
                </div>
              )}

              {job.deadline && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Application deadline
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">
                    {new Date(job.deadline).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
              )}
            </dl>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}