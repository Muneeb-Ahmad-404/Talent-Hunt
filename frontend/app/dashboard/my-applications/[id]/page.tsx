import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/server-api';
import { getCurrentUser } from '@/lib/session';
import type { Pipeline } from '@/lib/types';
import ApplicationActions from '../ApplicationActions';
import { ErrorState } from '@/components/ui-states';
import { PageHeader, PageShell, Card, StatusPill } from '@/components/ui';

export default async function ApplicationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (user?.role === 'applicant') {
    const response = await apiFetch('/api/applicants/applications');

    if (!response.ok) {
      return (
        <PageShell>
          <ErrorState message="Unable to load this application." />
        </PageShell>
      );
    }

    const {
      applications,
    }: {
      applications: Array<{
        id: string;
        job_title: string;
        company_name: string;
        stage: string;
        created_at?: string;
        profile_snapshot?: {
          headline?: string | null;
          bio?: string | null;
          skills?: string[];
          resumeKey?: string | null;
        };
        screening_answers?: unknown[];
      }>;
    } = await response.json();

    const application = applications.find((item) => item.id === id);

    if (!application) {
      notFound();
    }

    return (
      <PageShell className="max-w-4xl">
        <PageHeader
          eyebrow="Application history"
          title={application.job_title}
          description={`${application.company_name} · Submitted application`}
        />

        <div className="space-y-5">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Application status
                </p>

                {application.created_at && (
                  <p className="mt-1 text-sm text-slate-500">
                    Submitted{' '}
                    {new Date(application.created_at).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      },
                    )}
                  </p>
                )}
              </div>

              <StatusPill
                status={application.stage.replace(/_/g, ' ')}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-semibold text-slate-900">
                Application snapshot
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                This is the information saved with your application when you
                submitted it. It may differ from your current profile.
              </p>
            </div>

            {application.profile_snapshot ? (
              <div className="mt-5 space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Headline
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-800">
                    {application.profile_snapshot.headline || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Bio
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {application.profile_snapshot.bio || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Skills
                  </p>

                  {application.profile_snapshot.skills?.length ? (
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
                      Not provided
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500">
                The saved profile snapshot is not included in the current
                application response.
              </p>
            )}
          </Card>

          <Card className="p-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-semibold text-slate-900">
                Screening answers
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your answers are part of the submitted application and are not
                editable here.
              </p>
            </div>

            {application.screening_answers ? (
              <pre className="mt-5 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
                {JSON.stringify(application.screening_answers, null, 2)}
              </pre>
            ) : (
              <p className="mt-5 text-sm text-slate-500">
                Screening answers are not included in the existing applicant
                application response.
              </p>
            )}
          </Card>
        </div>
      </PageShell>
    );
  }
  else {
    return 
    (
      <PageShell>
        <ErrorState message="Unable to load this application." />
      </PageShell>
    );
  }
}