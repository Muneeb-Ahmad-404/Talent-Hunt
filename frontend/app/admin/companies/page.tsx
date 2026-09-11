import { cookies } from 'next/headers';
import { verifyCompany, suspendCompany } from './actions';
import Link from 'next/link';
import { PageHeader, PageShell, StatusPill } from '@/components/ui';
import { EmptyState } from '@/components/ui-states';

async function fetchCompanies(status?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value ?? '';

  const url = status
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/companies?status=${status}`
    : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/companies`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const data = await res.json();

  return data.companies as Array<{
    id: string;
    name: string;
    status: string;
    owner_email: string;
    created_at: string;
  }>;
}

const filters = [
  { value: '', label: 'All companies' },
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'suspended', label: 'Suspended' },
];

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const companies = await fetchCompanies(params.status);

  return (
    <PageShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Administration"
          title="Companies"
          description="Review company accounts, verify organizations, and manage platform access."
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
                    ? `/admin/companies?status=${filter.value}`
                    : '/admin/companies'
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
            {companies.length}{' '}
            {companies.length === 1 ? 'company' : 'companies'}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Owner
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
                {companies.map((company) => (
                  <tr
                    key={company.id}
                    className="group transition hover:bg-slate-50/70"
                  >
                    {/* Company */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700">
                          {company.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {company.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            Company account
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusPill status={company.status} />
                    </td>

                    {/* Owner */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {company.owner_email}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {new Date(company.created_at).toLocaleDateString(
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
                      <div className="flex justify-end gap-2">
                        <form action={verifyCompany}>
                          <input
                            type="hidden"
                            name="id"
                            value={company.id}
                          />
                          <button
                            type="submit"
                            disabled={company.status === 'verified'}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Verify
                          </button>
                        </form>

                        <form action={suspendCompany}>
                          <input
                            type="hidden"
                            name="id"
                            value={company.id}
                          />
                          <button
                            type="submit"
                            disabled={company.status === 'suspended'}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Suspend
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}

                {companies.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16">
                      <EmptyState message="No companies match this filter." />
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