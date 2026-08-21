import { cookies } from 'next/headers';
import { suspendUser, activateUser } from './actions';

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
    <section>
      <h1>Users</h1>
      <div>
        <a href="/admin/users">All</a>
        <a href="/admin/users?status=active">active</a>
        <a href="/admin/users?status=suspended">suspended</a>
      </div>
      <table>
        <thead>
          <tr><th>Email</th><th>Status</th><th>Role</th><th>Created</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.status}</td>
              <td>{u.role}</td>
              <td>{new Date(u.created_at).toLocaleDateString()}</td>
              <td>
                <form action={suspendUser}>
                  <input type="hidden" name="id" value={u.id} />
                  <button type="submit" disabled={u.status === 'suspend'}>Suspend</button>
                </form>
                <form action={activateUser}>
                  <input type="hidden" name="id" value={u.id} />
                  <button type="submit" disabled={u.status === 'activate'}>Activate</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}