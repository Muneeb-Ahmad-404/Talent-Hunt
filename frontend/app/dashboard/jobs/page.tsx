import Link from 'next/link';
import { apiFetch } from '@/lib/server-api';
import type { CompanyJob } from '@/lib/types';
import { getCurrentUser } from '@/lib/session';
import { PageHeader, PageShell, StatusPill } from '@/components/ui';
import { EmptyState, ErrorState } from '@/components/ui-states';

const statusFilters = [
  { value: 'all', label: 'All jobs' },
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; cursor?: string }>;
}) {
  const params = new URLSearchParams(await searchParams);
  params.set('limit', '20');

  const [res, user] = await Promise.all([
    apiFetch(`/api/jobs?${params.toString()}`),
    getCurrentUser(),
  ]);

  if (!res.ok) {
    return (
      <PageShell>
        <ErrorState message="Unable to load your company's jobs." />
      </PageShell>
    );
  }

  const data: {
    jobs: CompanyJob[];
    nextCursor: string | null;
  } = await res.json();

  const companyRole = user?.memberships[0]?.companyRole;

  const canCreateJob = [
    'owner',
    'hr_manager',
    'recruiter',
  ].includes(companyRole ?? '');

  const activeStatus = params.get('status') || 'all';

  return (
    <PageShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Company workspace"
          title="Jobs"
          description="Create, publish, and manage your company's opportunities."
          action={
            canCreateJob ? (
              <Link
                href="/dashboard/jobs/new"
                className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Post a job
                <span className="ml-2 text-base leading-none">+</span>
              </Link>
            ) : undefined
          }
        />

        {/* Filters + count */}
        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((filter) => {
            const active = activeStatus === filter.value;

            return (
              <Link
                key={filter.value}
                href={
                  filter.value === 'all'
                    ? '/dashboard/jobs'
                    : `/dashboard/jobs?status=${filter.value}`
                }
                className={[
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition',
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')}
              >
                {filter.label}
              </Link>
            );
          })}

          <div className="ml-auto text-sm text-slate-500">
            {data.jobs.length}{' '}
            {data.jobs.length === 1 ? 'job' : 'jobs'}
          </div>
        </div>

        {/* Jobs */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {data.jobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Position
                    </th>

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {data.jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="group transition hover:bg-slate-50/70"
                    >
                      {/* Position */}
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/jobs/${job.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">
                            {job.title.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[400px] truncate font-medium text-slate-900 group-hover:text-slate-700">
                              {job.title}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              View job details
                            </p>
                          </div>
                        </Link>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusPill status={job.status} />
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">
                          {new Date(job.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            },
                          )}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <Link
                            href={`/dashboard/jobs/${job.id}`}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            Manage
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16">
              <EmptyState
                message={
                  activeStatus === 'all'
                    ? 'No jobs have been created yet.'
                    : `No ${activeStatus} jobs found.`
                }
              />

              {canCreateJob && (
                <div className="mt-5 flex justify-center">
                  <Link
                    href="/dashboard/jobs/new"
                    className="text-sm font-semibold text-slate-900 hover:text-slate-600"
                  >
                    Create your first job →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {data.nextCursor && (
          <div className="flex justify-end">
            <Link
              href={`/dashboard/jobs?${params.toString()}&cursor=${encodeURIComponent(
                data.nextCursor,
              )}`}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Next page
              <span className="ml-2">→</span>
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  );
}