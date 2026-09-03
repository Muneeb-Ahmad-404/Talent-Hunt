import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('access_token')?.value;
  if (!token) redirect('/login');
  return <div className="flex min-h-screen bg-background"><aside className="hidden w-56 border-r bg-white p-5 md:block"><Link href="/" className="text-lg font-bold text-blue-600">Talent Hunt</Link><p className="mb-4 mt-10 text-xs font-semibold uppercase tracking-wide text-slate-400">Recruiter workspace</p><nav className="flex flex-col gap-3 text-sm"><Link href="/dashboard/jobs" className="text-slate-700 hover:text-blue-600">Jobs</Link><Link href="/dashboard/jobs/new" className="text-slate-700 hover:text-blue-600">Post a job</Link><Link href="/dashboard/members" className="text-slate-700 hover:text-blue-600">Members</Link><Link href="/dashboard/profile" className="text-slate-700 hover:text-blue-600">Profile</Link></nav></aside><main className="min-w-0 flex-1"><div className="border-b bg-white px-6 py-4 md:hidden"><Link href="/" className="font-bold text-blue-600">Talent Hunt</Link></div>{children}</main></div>;
}
