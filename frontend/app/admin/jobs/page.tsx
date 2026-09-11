import { cookies } from 'next/headers';
import { closeJob } from './actions';
import Link from 'next/link';
import { PageHeader, PageShell, StatusPill } from '@/components/ui';
import { EmptyState } from '@/components/ui-states';

async function fetchJobs(status?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value ?? '';

  const qs = status ? `?status=${status}` : '';

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/jobs${qs}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  );

  const data = await res.json();

  return data.jobs as Array<{
    id: string;
    title: string;
    status: string;
    company_name: string;
    created_at: string;
  }>;
}

const filters = [
  { value: '', label: 'All jobs' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const jobs = await fetchJobs(params.status);

  return (
    <PageShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Administration"
          title="Jobs"
          description="Monitor opportunities across the platform and manage their availability."
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const active = (params.status ?? '') === filter.value;

            return (
              <Link
                key={filter.label}
                href={
                  filter.value
                    ? `/admin/jobs?status=${filter.value}`
                    : '/admin/jobs'
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
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
          </div>
        </div>

        {/* Jobs table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Job
                  </th>

                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </th>

                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>

                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="group transition hover:bg-slate-50/70"
                  >
                    {/* Job */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                          <span className="text-sm font-semibold text-slate-600">
                            {job.title.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[320px] truncate font-medium text-slate-900">
                            {job.title}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Job posting
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {job.company_name}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusPill status={job.status} />
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {new Date(job.created_at).toLocaleDateString(
                          undefined,
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <form action={closeJob}>
                          <input
                            type="hidden"
                            name="id"
                            value={job.id}
                          />

                          <button
                            type="submit"
                            disabled={job.status === 'closed'}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Close job
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}

                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16">
                      <EmptyState message="No jobs match this filter." />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageShell>
  );
}