import Link from 'next/link';
import { apiFetch } from '@/lib/server-api';
import type { Pipeline } from '@/lib/types';
import { ErrorState, EmptyState } from '@/components/ui-states';

const stages = [
  'applied',
  'screening',
  'interview',
  'final_interview',
  'offer',
  'hired',
  'rejected',
] as const;

const stageLabels: Record<(typeof stages)[number], string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  final_interview: 'Final interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

export default async function RecruiterPipeline() {
  const response = await apiFetch('/api/applications');

  if (response.status === 403) {
    return (
      <ErrorState message="You do not have permission to view this pipeline." />
    );
  }

  if (!response.ok) {
    return <ErrorState message="Unable to load the application pipeline." />;
  }

  const { pipeline }: { pipeline: Pipeline } = await response.json();

  return (
    <div className="overflow-x-auto pb-3">
      <div className="grid min-w-[1100px] grid-cols-4 gap-4 xl:grid-cols-7">
        {stages.map((stage) => {
          const applications = pipeline[stage] ?? [];

          return (
            <section
              key={stage}
              className="flex min-h-[360px] flex-col rounded-xl border border-slate-200 bg-slate-50/70"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-3.5 py-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  {stageLabels[stage]}
                </h2>

                <span className="min-w-6 text-right text-xs font-medium text-slate-400">
                  {applications.length}
                </span>
              </div>

              <div className="flex-1 space-y-2.5 p-2.5">
                {applications.map((application) => (
                  <article
                    key={application.id}
                    className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {(
                          application.profile_snapshot?.headline ||
                          'A'
                        )
                          .slice(0, 1)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                          {application.job_title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {application.profile_snapshot?.headline ||
                            'Applicant'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <Link
                        href={`/dashboard/applications/${application.id}`}
                        className="inline-flex items-center text-xs font-semibold text-slate-700 transition-colors hover:text-slate-950"
                      >
                        Open review
                        <span
                          className="ml-1.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </Link>
                    </div>
                  </article>
                ))}

                {applications.length === 0 && (
                  <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white/50 px-3">
                    <p className="text-xs text-slate-400">
                      No applications
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}