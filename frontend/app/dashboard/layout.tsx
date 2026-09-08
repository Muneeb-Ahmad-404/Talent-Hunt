'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Access = { applicant: boolean; company: boolean; admin: boolean; companyRoles: string[] };

const personalNav = [['My overview', '/dashboard'], ['My applications', '/dashboard/applications'], ['Saved jobs', '/dashboard/shortlist'], ['My profile', '/dashboard/profile']];
const companyNav = [['Company overview', '/dashboard/company'], ['Company jobs', '/dashboard/jobs'], ['Hiring pipeline', '/dashboard/applicants'], ['Post a job', '/dashboard/jobs/new'], ['Team members', '/dashboard/members']];
const adminNav = [['Admin overview', '/admin'], ['Companies', '/admin/companies'], ['Jobs', '/admin/jobs'], ['Users', '/admin/users']];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [access, setAccess] = useState<Access>({ applicant: false, company: false, admin: false, companyRoles: [] });

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch('/api/auth/me', { credentials: 'include' }).then((response) => response.ok ? response.json() : null),
      fetch('/api/companies/me', { credentials: 'include' }).then((response) => response.ok ? response.json() : null),
      fetch('/api/applicants/profile', { credentials: 'include' }).then((response) => response.ok ? response.json() : null),
    ]).then(([auth, company, applicant]) => {
      if (!active) return;
      const user = auth?.user ?? auth ?? {};
      const companyData = company?.company ?? company ?? {};
      const companyRoles = Array.isArray(companyData.roles)
        ? companyData.roles.map((role: unknown) => String(typeof role === 'object' && role !== null ? (role as { role?: string }).role : role).toLowerCase())
        : [companyData.companyRole ?? companyData.role].filter(Boolean).map((role: string) => role.toLowerCase());
      const userRole = String(user.role ?? '').toLowerCase();
      setAccess({
        applicant: Boolean(applicant && !applicant.error) || ['applicant', 'candidate'].includes(userRole),
        company: companyRoles.length > 0,
        admin: userRole === 'admin',
        companyRoles,
      });
    });
    return () => { active = false; };
  }, []);

  const canPost = access.companyRoles.some((role) => ['owner', 'hr_manager', 'recruiter'].includes(role));
  const canHire = access.companyRoles.some((role) => ['owner', 'hr_manager', 'recruiter', 'hiring_manager'].includes(role));
  const canManageMembers = access.companyRoles.some((role) => ['owner', 'hr_manager'].includes(role));
  const nav = useMemo(() => [
    ...(access.applicant ? personalNav : []),
    ...(access.company ? companyNav.filter(([, href]) => href !== '/dashboard/jobs/new' || canPost).filter(([, href]) => href !== '/dashboard/applicants' || canHire).filter(([, href]) => href !== '/dashboard/members' || canManageMembers) : []),
    ...(access.admin ? adminNav : []),
  ], [access, canHire, canManageMembers, canPost]);

  return <div className="flex min-h-screen bg-background"><aside className="hidden w-72 shrink-0 border-r bg-card md:flex md:flex-col"><div className="border-b px-7 py-6"><Link href="/" className="text-xl font-bold tracking-tight text-primary">Talent Hunt</Link><p className="mt-1 text-xs text-muted-foreground">Your workspaces</p></div><nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Workspace navigation">{nav.map(([label, href]) => <Link key={href} href={href} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${pathname === href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>{label}</Link>)}</nav><div className="border-t p-4"><Link href="/jobs" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Browse public jobs</Link></div></aside><main className="min-w-0 flex-1"><div className="flex items-center justify-between border-b bg-card px-6 py-4 md:hidden"><Link href="/" className="font-bold text-primary">Talent Hunt</Link><Link href={access.company ? '/dashboard/company' : '/dashboard/applications'} className="text-sm font-medium text-primary">Open workspace</Link></div>{children}</main></div>;
}
