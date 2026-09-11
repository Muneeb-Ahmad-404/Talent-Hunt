import { cookies } from 'next/headers';
import { suspendUser, activateUser } from './actions';
import Link from 'next/link';
import { PageHeader, PageShell, StatusPill } from '@/components/ui';
import { EmptyState } from '@/components/ui-states';

async function fetchUsers(status?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value ?? '';

  const qs = status ? `?status=${status}` : '';

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users${qs}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  );

  const data = await res.json();

  return data.users as Array<{
    id: string;
    email: string;
    status: string;
    role: string;
    created_at: string;
  }>;
}

const filters = [
  { value: '', label: 'All users' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
];

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const users = await fetchUsers(params.status);

  return (
    <PageShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Administration"
          title="Users"
          description="Review platform accounts and manage their access status."
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
                    ? `/admin/users?status=${filter.value}`
                    : '/admin/users'
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
            {users.length} {users.length === 1 ? 'user' : 'users'}
          </div>
        </div>

        {/* Users table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50/80">
                <tr>
                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition hover:bg-slate-50/70"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold uppercase text-slate-600">
                          {user.email.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {user.email}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            Platform account
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusPill status={user.status} />
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                        {user.role}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {new Date(user.created_at).toLocaleDateString(
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
                        <form action={activateUser}>
                          <input
                            type="hidden"
                            name="id"
                            value={user.id}
                          />

                          <button
                            type="submit"
                            disabled={user.status === 'active'}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Activate
                          </button>
                        </form>

                        <form action={suspendUser}>
                          <input
                            type="hidden"
                            name="id"
                            value={user.id}
                          />

                          <button
                            type="submit"
                            disabled={user.status === 'suspended'}
                            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Suspend
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16">
                      <EmptyState message="No users match this filter." />
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