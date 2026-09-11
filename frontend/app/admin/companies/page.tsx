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
    id: string; name: string; status: string; owner_email: string; created_at: string;
  }>;
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  
  const companies = await fetchCompanies(params.status);

  return (
    <PageShell><PageHeader eyebrow="Administration" title="Companies" description="Review company accounts and keep platform access healthy." /><div className="mb-5 flex flex-wrap gap-2">{[['', 'All'], ['pending', 'Pending'], ['verified', 'Verified'], ['suspended', 'Suspended']].map(([value, label]) => <Link key={label} href={value ? `/admin/companies?status=${value}` : '/admin/companies'} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-700">{label}</Link>)}</div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr>
            <th>Name</th><th>Status</th><th>Owner</th><th>Created</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td><StatusPill status={c.status} /></td>
              <td>{c.owner_email}</td>
              <td>{new Date(c.created_at).toLocaleDateString()}</td>
              <td>
                <form action={verifyCompany} className="inline">
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" disabled={c.status === 'verified'}>Verify</button>
                </form>
                <form action={suspendCompany} className="inline">
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" disabled={c.status === 'suspended'}>Suspend</button>
                </form>
              </td>
            </tr>
          ))}{companies.length === 0 && <tr><td colSpan={5}><EmptyState message="No companies match this filter." /></td></tr>}
        </tbody>
      </table></div></PageShell>
  );
}