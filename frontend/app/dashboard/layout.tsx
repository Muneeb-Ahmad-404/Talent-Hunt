'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const recruiterNav = [['Overview', '/dashboard'], ['Jobs', '/dashboard/jobs'], ['Hiring pipeline', '/dashboard/applicants'], ['Post a job', '/dashboard/jobs/new'], ['Team members', '/dashboard/members']];
const applicantNav = [['Overview', '/dashboard'], ['My applications', '/dashboard/applications'], ['Saved jobs', '/dashboard/shortlist'], ['My profile', '/dashboard/profile']];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState('');
  useEffect(() => { fetch('/api/auth/me', { credentials: 'include' }).then((r) => r.ok ? r.json() : null).then((d) => setRole(String((d?.user ?? d)?.role ?? '').toLowerCase())); }, []);
  const isApplicant = role === 'applicant' || role === 'candidate';
  const nav = isApplicant ? applicantNav : recruiterNav;
  return <div className="flex min-h-screen bg-background"><aside className="hidden w-72 shrink-0 border-r bg-card md:flex md:flex-col"><div className="border-b px-7 py-6"><Link href="/" className="text-xl font-bold tracking-tight text-primary">Talent Hunt</Link><p className="mt-1 text-xs text-muted-foreground">{isApplicant ? 'Candidate workspace' : 'Recruiter workspace'}</p></div><nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Workspace navigation">{nav.map(([label, href]) => <Link key={href} href={href} className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${pathname === href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>{label}</Link>)}</nav><div className="border-t p-4"><Link href="/jobs" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted">Browse public jobs</Link></div></aside><main className="min-w-0 flex-1"><div className="flex items-center justify-between border-b bg-card px-6 py-4 md:hidden"><Link href="/" className="font-bold text-primary">Talent Hunt</Link><Link href={isApplicant ? '/dashboard/applications' : '/dashboard/jobs'} className="text-sm font-medium text-primary">Workspace</Link></div>{children}</main></div>;
}
