import { apiFetch } from '../../lib/server-api';
import Link from 'next/link';
import type { Job } from '@/lib/types';
import { EmptyState, ErrorState } from '@/components/ui-states';
import { PageHeader, PageShell, Card } from '@/components/ui';

export default async function JobsPage() {
  const res = await apiFetch('/api/public/jobs');

  if (!res.ok) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Opportunities"
          title="Open positions"
          description="Explore roles from companies building their next chapter."
        />
        <ErrorState message="We couldn't load open positions right now." />
      </PageShell>
    );
  }

  const data: { jobs: Job[]; nextCursor: string | null } =
    await res.json();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Opportunities"
        title="Open positions"
        description="Explore roles from companies building their next chapter."
      />

      {data.jobs.length === 0 ? (
        <EmptyState message="There are no open positions right now. Check back soon." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="group block"
            >
              <Card className="h-full p-6 transition-shadow duration-200 group-hover:shadow-md">
                <div className="flex h-full flex-col">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
                      {job.companyName?.slice(0, 1).toUpperCase() || 'C'}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-500">
                        {job.companyName}
                      </p>

                      <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-950 group-hover:text-slate-700">
                        {job.title}
                      </h2>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                    {job.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-slate-300"
                          aria-hidden="true"
                        />
                        {job.location}
                      </span>
                    )}

                    {job.employmentType && (
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-slate-300"
                          aria-hidden="true"
                        />
                        {job.employmentType.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-medium text-slate-500">
                      View opportunity
                    </span>

                    <span
                      className="text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-600"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}