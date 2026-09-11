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
    { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  );
  const data = await res.json();
  return data.jobs as Array<{
    id: string; title: string; status: string; company_name: string; created_at: string;
  }>;
}

export default async function CompaniesPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const params = await searchParams;
    
    const jobs = await fetchJobs(params.status);

  return (
    <PageShell><PageHeader eyebrow="Administration" title="Jobs" description="Monitor published opportunities across the platform." /><div className="mb-5 flex gap-2">{[['', 'All'], ['open', 'Open'], ['closed', 'Closed']].map(([value, label]) => <Link key={label} href={value ? `/admin/jobs?status=${value}` : '/admin/jobs'} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-700">{label}</Link>)}</div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr><th>Title</th><th>Company</th><th>Status</th><th>Created</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td>{j.title}</td>
              <td>{j.company_name}</td>
              <td><StatusPill status={j.status} /></td>
              <td>{new Date(j.created_at).toLocaleDateString()}</td>
              <td>
                <form action={closeJob}>
                  <input type="hidden" name="id" value={j.id} />
                  <button type="submit" disabled={j.status === 'closed'}>Close</button>
                </form>
              </td>
            </tr>
          ))}{jobs.length === 0 && <tr><td colSpan={5}><EmptyState message="No jobs match this filter." /></td></tr>}
        </tbody>
      </table></div></PageShell>
  );
}