import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { apiFetch } from '@/lib/server-api';
import type { Application, ShortlistItem } from '@/lib/types';
import { Card, PageHeader, PageShell, StatusPill } from '@/components/ui';
import { EmptyState, ErrorState } from '@/components/ui-states';

export default async function ApplicantDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role === 'recruiter') redirect('/dashboard/company');
  if (user.role === 'admin') redirect('/admin');

  const [applicationsResponse, shortlistResponse, profileResponse] = await Promise.all([
    apiFetch('/api/applicants/applications'),
    apiFetch('/api/applicants/shortlist'),
    apiFetch('/api/applicants/profile'),
  ]);
  if (!applicationsResponse.ok || !shortlistResponse.ok) {
    return <PageShell><ErrorState message="We couldn't load your dashboard right now." /></PageShell>;
  }
  const { applications }: { applications: Application[] } = await applicationsResponse.json();
  const { shortlist }: { shortlist: ShortlistItem[] } = await shortlistResponse.json();
  const profile = profileResponse.ok ? await profileResponse.json() : null;
  const profileFields = [profile?.headline, profile?.bio, profile?.skills?.length ? 'skills' : null];
  const completedFields = profileFields.filter(Boolean).length;
  return <PageShell><PageHeader eyebrow="Applicant workspace" title={`Welcome back, ${user.email.split('@')[0]}`} description="Pick up where you left off and keep your next opportunity moving." /><div className="grid gap-4 sm:grid-cols-3"><Card className="p-5"><p className="text-sm text-slate-500">Applications</p><p className="mt-2 text-3xl font-semibold text-slate-950">{applications.length}</p><Link href="/dashboard/applications" className="mt-4 block text-sm font-semibold text-indigo-600">View applications →</Link></Card><Card className="p-5"><p className="text-sm text-slate-500">Shortlist</p><p className="mt-2 text-3xl font-semibold text-slate-950">{shortlist.length}</p><Link href="/dashboard/shortlist" className="mt-4 block text-sm font-semibold text-indigo-600">View shortlist →</Link></Card><Card className="p-5"><p className="text-sm text-slate-500">Profile</p><p className="mt-2 text-3xl font-semibold text-slate-950">{profileResponse.ok ? `${completedFields}/3` : '—'}</p><Link href="/dashboard/profile" className="mt-4 block text-sm font-semibold text-indigo-600">Keep it current →</Link></Card></div><div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_.8fr]"><Card className="p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="font-semibold text-slate-950">Recent applications</h2><p className="mt-1 text-sm text-slate-500">Your latest submissions and current stage.</p></div><Link href="/jobs" className="text-sm font-semibold text-indigo-600">Browse jobs</Link></div>{applications.length === 0 ? <div className="mt-5"><EmptyState message="No applications yet. Explore open roles when you're ready." /></div> : <div className="mt-5 divide-y divide-slate-100">{applications.slice(0, 4).map((application) => <Link key={application.id} href={`/dashboard/applications/${application.id}`} className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-slate-900">{application.job_title}</p><p className="text-sm text-slate-500">{application.company_name}</p></div><StatusPill status={application.stage} /></Link>)}</div>}</Card><Card className="p-6"><h2 className="font-semibold text-slate-950">Next steps</h2><div className="mt-4 space-y-3 text-sm"><Link href="/jobs" className="block rounded-lg border border-slate-200 p-3 hover:border-indigo-300"><span className="font-medium text-slate-900">Find a new role</span><span className="mt-1 block text-slate-500">Browse current openings.</span></Link><Link href="/dashboard/profile" className="block rounded-lg border border-slate-200 p-3 hover:border-indigo-300"><span className="font-medium text-slate-900">Strengthen your profile</span><span className="mt-1 block text-slate-500">Help teams understand your experience.</span></Link></div></Card></div></PageShell>;
}
