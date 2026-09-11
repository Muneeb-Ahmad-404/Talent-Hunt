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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
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

          <div className="space-y-5">
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

            {job.screeningQuestions &&
              job.screeningQuestions.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-base font-semibold text-slate-950">
                    Application questions
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    You’ll answer these questions when submitting your
                    application.
                  </p>

                  <div className="mt-5 space-y-4">
                    {job.screeningQuestions.map((question, index) => (
                      <div
                        key={`${question.text}-${index}`}
                        className="rounded-lg border border-slate-200 bg-slate-50/60 p-4"
                      >
                        <div className="flex gap-3">
                          <span className="shrink-0 text-sm font-semibold text-slate-400">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          <p className="text-sm leading-6 text-slate-800">
                            {question.text}
                            {question.required && (
                              <span className="ml-1 text-slate-400">
                                Required
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

            <p className="px-1 text-xs text-slate-400">
              Posted{' '}
              {new Date(job.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <div className="border-b border-slate-100 pb-5">
              <p className="text-sm font-medium text-slate-500">
                {job.companyName}
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-950">
                {job.title}
              </h2>

              <div className="mt-3 space-y-1 text-sm text-slate-500">
                {job.location && <p>{job.location}</p>}

                {job.employmentType && (
                  <p>{job.employmentType.replace(/_/g, ' ')}</p>
                )}

                {salary && <p>{salary}</p>}
              </div>
            </div>

            <div className="pt-5">
              <JobApplicationActions
                jobId={id}
                questions={job.screeningQuestions ?? []}
              />
            </div>
          </Card>
        </aside>
      </div>
    </PageShell>
  );
}