import { apiFetch } from '@/lib/server-api';
import { ErrorState } from '@/components/ui-states';
import Link from 'next/link';
import { PageHeader, PageShell, Card, StatusPill } from '@/components/ui';

export default async function CompanyPage() {
  const response = await apiFetch('/api/companies/me');
  if (!response.ok) return <main className="p-6"><ErrorState message="Unable to load the company workspace." /></main>;
  const company: { id: string; name: string; status: string } = await response.json();
  return <PageShell><PageHeader eyebrow="Company workspace" title={company.name} description="Keep openings, candidates, and your recruiting team moving in one place." action={<StatusPill status={company.status} />} /><div className="grid gap-4 md:grid-cols-3"><Link href="/dashboard/jobs"><Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"><h2 className="font-semibold">Jobs</h2><p className="mt-2 text-sm leading-6 text-slate-500">Create, publish, and manage your open positions.</p><span className="mt-6 block text-sm font-semibold text-indigo-600">Manage jobs →</span></Card></Link><Link href="/dashboard/applications"><Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"><h2 className="font-semibold">Applications</h2><p className="mt-2 text-sm leading-6 text-slate-500">Review candidates and move the right people forward.</p><span className="mt-6 block text-sm font-semibold text-indigo-600">Open pipeline →</span></Card></Link><Link href="/dashboard/members"><Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"><h2 className="font-semibold">Members</h2><p className="mt-2 text-sm leading-6 text-slate-500">Keep your recruiting team and roles up to date.</p><span className="mt-6 block text-sm font-semibold text-indigo-600">View team →</span></Card></Link></div></PageShell>;
}
