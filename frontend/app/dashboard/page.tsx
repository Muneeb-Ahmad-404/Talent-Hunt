'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type User = { email?: string; role?: string; name?: string };
type Company = { name?: string; website?: string; companyRole?: string; role?: string };

const roleLabels: Record<string, string> = {
  owner: 'Owner',
  hr_manager: 'HR manager',
  recruiter: 'Recruiter',
  hiring_manager: 'Hiring manager',
  applicant: 'Applicant',
  admin: 'Administrator',
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me', { credentials: 'include' }).then(async (response) => {
        if (!response.ok) throw new Error('Your session has expired.');
        return response.json();
      }),
      fetch('/api/companies/me', { credentials: 'include' }).then((response) => response.ok ? response.json() : null),
    ]).then(([auth, companyResponse]) => {
      setUser(auth.user ?? auth);
      const nextCompany = companyResponse?.company ?? companyResponse;
      if (nextCompany && !nextCompany.error) setCompany(nextCompany);
    }).catch((reason: Error) => setError(reason.message));
  }, []);

  const userRole = String(user?.role ?? '').toLowerCase();
  const companyRole = String(company?.companyRole ?? company?.role ?? '').toLowerCase();
  const canManageHiring = ['owner', 'hr_manager', 'recruiter', 'hiring_manager'].includes(companyRole);
  const canPostJobs = ['owner', 'hr_manager', 'recruiter'].includes(companyRole);
  const label = roleLabels[companyRole] ?? roleLabels[userRole] ?? 'Workspace member';

  if (error) return <main className="mx-auto max-w-5xl px-6 py-12"><div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">{error}</div></main>;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col justify-between gap-6 border-b pb-8 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Workspace overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
          <p className="mt-2 text-muted-foreground">{user?.email ?? 'Loading account details…'}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">{label}</span>
      </div>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 md:col-span-2">
          <p className="text-sm text-muted-foreground">Company workspace</p>
          <h2 className="mt-2 text-2xl font-semibold">{company?.name ?? (userRole === 'applicant' ? 'Personal workspace' : 'No company workspace')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{company ? `${label} permissions are active for this company.` : 'Join or create a company to access hiring tools.'}</p>
          {company && <Link href="/dashboard/company" className="mt-5 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Enter company mode</Link>}
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Account access</p>
          <p className="mt-3 text-lg font-semibold">{userRole === 'applicant' ? 'Candidate' : userRole === 'admin' ? 'Platform admin' : 'Company member'}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Personal tools and company workspaces available to you.</p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {userRole === 'applicant' ? <>
          <Link href="/dashboard/applications" className="rounded-xl border bg-card p-5 hover:border-primary"><h3 className="font-semibold">My applications</h3><p className="mt-2 text-sm text-muted-foreground">Track every application and interview.</p></Link>
          <Link href="/dashboard/shortlist" className="rounded-xl border bg-card p-5 hover:border-primary"><h3 className="font-semibold">Saved jobs</h3><p className="mt-2 text-sm text-muted-foreground">Review roles you saved for later.</p></Link>
          <Link href="/dashboard/profile" className="rounded-xl border bg-card p-5 hover:border-primary"><h3 className="font-semibold">My profile</h3><p className="mt-2 text-sm text-muted-foreground">Keep your candidate profile current.</p></Link>
        </> : canManageHiring && company ? <>
          {canPostJobs && <Link href="/dashboard/jobs/new" className="rounded-xl border bg-card p-5 hover:border-primary"><h3 className="font-semibold">Post a job</h3><p className="mt-2 text-sm text-muted-foreground">Create and publish a company opening.</p></Link>}
          <Link href="/dashboard/applicants" className="rounded-xl border bg-card p-5 hover:border-primary"><h3 className="font-semibold">Hiring pipeline</h3><p className="mt-2 text-sm text-muted-foreground">Review candidates and move applications forward.</p></Link>
          <Link href="/dashboard/jobs" className="rounded-xl border bg-card p-5 hover:border-primary"><h3 className="font-semibold">Company jobs</h3><p className="mt-2 text-sm text-muted-foreground">Manage openings available to your role.</p></Link>
        </> : <div className="rounded-xl border bg-card p-5 sm:col-span-2 lg:col-span-3"><h3 className="font-semibold">No additional workspace actions</h3><p className="mt-2 text-sm text-muted-foreground">Browse public jobs or update your profile from the navigation.</p></div>}
      </section>
    </main>
  );
}

export const dynamic = 'force-dynamic';
