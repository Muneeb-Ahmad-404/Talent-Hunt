import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/server-api';
import { getCurrentUser } from '@/lib/session';
import type { Pipeline } from '@/lib/types';
import { redirect } from 'next/navigation';
import ApplicationActions from '../ApplicationActions';
import { ErrorState } from '@/components/ui-states';
import { PageHeader, PageShell, Card, StatusPill } from '@/components/ui';

export default async function ApplicationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await apiFetch('/api/applications');

  if (!response.ok) {
    return (
      <PageShell>
        <ErrorState message="Unable to load this application." />
      </PageShell>
    );
  }

  const { pipeline }: { pipeline: Pipeline } = await response.json();

  const application = Object.values(pipeline)
    .flat()
    .find((item) => item.id === id);

  if (!application) {
    notFound();
  }

  return (
    <PageShell className="max-w-4xl">
      <PageHeader
        eyebrow="Application review"
        title={application.job_title}
        description={
          application.profile_snapshot?.headline ?? 'Applicant profile'
        }
      />

      <div className="space-y-5">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Application stage
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Review the saved application profile and manage the hiring
                process below.
              </p>
            </div>

            <StatusPill
              status={application.stage.replace(/_/g, ' ')}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">
              Saved application profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              This information was captured when the candidate submitted the
              application.
            </p>
          </div>

          <div className="mt-5 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Headline
              </p>
              <p className="mt-2 text-sm text-slate-800">
                {application.profile_snapshot?.headline || 'Not provided'}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Bio
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {application.profile_snapshot?.bio ||
                  'No saved bio provided.'}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Skills
              </p>

              {application.profile_snapshot?.skills?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {application.profile_snapshot.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  No saved skills provided.
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-semibold text-slate-900">
              Screening answers
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Answers submitted with this application.
            </p>
          </div>

          {application.screening_answers?.length ? (
            <div className="mt-5 space-y-5">
              {application.screening_answers.map((item, index) => (
                <div key={index}>
                  <p className="text-sm font-medium text-slate-900">
                    {item.question}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {item.answer || 'No answer provided'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              No screening answers were submitted.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-slate-900">
              Hiring actions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update the application stage or manage the candidate interview.
            </p>
          </div>

          <ApplicationActions
            applicationId={application.id}
            currentStage={application.stage}
            interviewId={application.latest_interview?.id}
          />
        </Card>
      </div>
    </PageShell>
  );
}