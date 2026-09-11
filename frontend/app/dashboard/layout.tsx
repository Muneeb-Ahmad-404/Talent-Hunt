import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const isApplicant = user.role === 'applicant';
  const membership = user.memberships[0];
  const links = isApplicant
    ? [['/dashboard', 'Overview'], ['/jobs', 'Browse jobs'], ['/dashboard/applications', 'My applications'], ['/dashboard/shortlist', 'Shortlist'], ['/dashboard/profile', 'Profile']]
    : [['/dashboard/company', 'Workspace'], ['/dashboard/jobs', 'Jobs'], ['/dashboard/applications', 'Applications'], ...(['owner', 'hr_manager'].includes(membership?.companyRole ?? '') ? [['/dashboard/members', 'Members']] : [])];
  return <div className="min-h-screen bg-slate-50 lg:flex">
    <aside className="border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6"><Link href="/" className="text-lg font-bold tracking-tight text-slate-950">Talent Hunt<span className="text-indigo-600">.</span></Link><span className="ml-3 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold capitalize text-indigo-700 lg:ml-0 lg:mt-5 lg:block lg:w-fit">{isApplicant ? 'Applicant' : membership?.companyRole?.replace('_', ' ') ?? 'Recruiter'}</span></div>
      <nav className="grid grid-cols-2 gap-1 px-4 pb-4 sm:grid-cols-3 lg:block lg:space-y-1 lg:px-4" aria-label="Primary navigation">{links.map(([href, label]) => <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700">{label}</Link>)}</nav>
      <form action="/api/auth/logout" method="post" className="px-7 pb-5 lg:pb-6"><button className="text-sm font-medium text-slate-400 hover:text-rose-600" type="submit">Sign out</button></form>
    </aside>
    <div className="min-w-0 flex-1"><header className="hidden h-16 items-center justify-end border-b border-slate-200 bg-white px-8 lg:flex"><span className="text-sm text-slate-500">{user.email}</span></header><main>{children}</main></div>
  </div>;
}
