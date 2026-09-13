import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';

export default async function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-slate-950"
            >
              Talent Hunt<span className="text-indigo-600">.</span>
            </Link>

            <nav className="flex items-center gap-2" aria-label="Public navigation">
              <Link
                href="/jobs"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
              >
                Jobs
              </Link>

              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Get started
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </div>
    );
  }

  const isApplicant = user.role === 'applicant';
  const membership = user.memberships[0];
  const hasCompanyMembership = user.memberships.length > 0;

  const applicantLinks = [
    ['/dashboard', 'Overview'],
    ['/jobs', 'Browse jobs'],
    ['/dashboard/my-applications', 'My applications'],
    ['/dashboard/shortlist', 'Shortlist'],
    ['/dashboard/profile', 'Profile'],
  ];

  const companyLinks = [
    ['/dashboard/company', 'Workspace'],
    ['/dashboard/jobs', 'Jobs'],
    ['/dashboard/applications', 'Applications'],
    ...(['owner', 'hr_manager'].includes(membership?.companyRole ?? '')
      ? [['/dashboard/members', 'Members']]
      : []),
  ];

  const links = [
    ...(isApplicant ? applicantLinks : []),
    ...(hasCompanyMembership ? companyLinks : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:block lg:px-6">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-slate-950"
          >
            Talent Hunt<span className="text-indigo-600">.</span>
          </Link>

          <span className="ml-3 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold capitalize text-indigo-700 lg:ml-0 lg:mt-5 lg:block lg:w-fit">
            {isApplicant
              ? 'Applicant'
              : membership?.companyRole?.replace('_', ' ') ?? 'Recruiter'}
          </span>
        </div>

        <nav
          className="flex flex-col gap-1 px-4 pb-4"
          aria-label="Primary navigation"
        >
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              {label}
            </Link>
          ))}
        </nav>

        <form
          action="/api/auth/logout"
          method="post"
          className="px-7 pb-5 lg:pb-6"
        >
          <button
            className="text-sm font-medium text-slate-400 hover:text-rose-600"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="hidden h-16 items-center justify-end border-b border-slate-200 bg-white px-8 lg:flex">
          <span className="text-sm text-slate-500">{user.email}</span>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}