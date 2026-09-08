'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Company = {
  name?: string;
  companyRole?: string;
  role?: string;
};

export default function CompanyModePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/companies/me', { credentials: 'include' }).then(async (response) => {
      if (!response.ok) throw new Error('Unable to load your company workspace.');
      return response.json();
    }).then((data) => setCompany(data.company ?? data)).catch((reason: Error) => setError(reason.message));
  }, []);

  const role = String(company?.companyRole ?? company?.role ?? '').toLowerCase();
  const canPost = ['owner', 'hr_manager', 'recruiter'].includes(role);
  const canHire = ['owner', 'hr_manager', 'recruiter', 'hiring_manager'].includes(role);

  return <main className="mx-auto max-w-6xl px-6 py-10">
    <div className="flex flex-col justify-between gap-5 border-b pb-8 md:flex-row md:items-end"><div><Link href="/dashboard" className="text-sm text-primary">Back to overview</Link><h1 className="mt-3 text-3xl font-semibold">{company?.name ?? 'Company mode'}</h1><p className="mt-2 text-muted-foreground">Work as your company, using only the permissions assigned to you.</p></div><span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">{role || 'Loading role…'}</span></div>
    {error ? <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">{error}</div> : <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {canPost && <Link href="/dashboard/jobs/new" className="rounded-2xl border bg-card p-6 hover:border-primary"><h2 className="text-lg font-semibold">Post and manage jobs</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Create, edit, publish, and close company openings.</p></Link>}
      {canHire && <Link href="/dashboard/applicants" className="rounded-2xl border bg-card p-6 hover:border-primary"><h2 className="text-lg font-semibold">Hiring pipeline</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Review candidate details, interviews, and application stages.</p></Link>}
      {role === 'owner' || role === 'hr_manager' ? <Link href="/dashboard/members" className="rounded-2xl border bg-card p-6 hover:border-primary"><h2 className="text-lg font-semibold">Manage team</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Invite members, change roles, and remove access.</p></Link> : null}
      {!canPost && !canHire && <div className="rounded-2xl border bg-card p-6 md:col-span-2 lg:col-span-3"><h2 className="font-semibold">View-only company access</h2><p className="mt-2 text-sm text-muted-foreground">Your current company role has no hiring actions.</p></div>}
    </section>}
  </main>;
}
