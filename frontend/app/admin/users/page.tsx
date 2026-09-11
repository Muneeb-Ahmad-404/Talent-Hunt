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
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  );
  const data = await res.json();
  return data.users as Array<{
    id: string; email: string; status: string; role: string; created_at: string;
  }>;
}

export default async function CompaniesPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    
    const users = await fetchUsers(params.status);

  return (
    <PageShell><PageHeader eyebrow="Administration" title="Users" description="Review platform accounts and their current access status." /><div className="mb-5 flex gap-2">{[['', 'All'], ['active', 'Active'], ['suspended', 'Suspended']].map(([value, label]) => <Link key={label} href={value ? `/admin/users?status=${value}` : '/admin/users'} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-700">{label}</Link>)}</div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr><th>Email</th><th>Status</th><th>Role</th><th>Created</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td><StatusPill status={u.status} /></td>
              <td>{u.role}</td>
              <td>{new Date(u.created_at).toLocaleDateString()}</td>
              <td>
                <form action={suspendUser}>
                  <input type="hidden" name="id" value={u.id} />
                  <button type="submit" disabled={u.status === 'suspended'}>Suspend</button>
                </form>
                <form action={activateUser}>
                  <input type="hidden" name="id" value={u.id} />
                  <button type="submit" disabled={u.status === 'active'}>Activate</button>
                </form>
              </td>
            </tr>
          ))}{users.length === 0 && <tr><td colSpan={5}><EmptyState message="No users match this filter." /></td></tr>}
        </tbody>
      </table></div></PageShell>
  );
}