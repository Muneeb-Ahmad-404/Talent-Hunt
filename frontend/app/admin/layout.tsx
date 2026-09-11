import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/');
  return <div className="min-h-screen bg-slate-50"><nav className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-4 sm:px-8"><Link href="/" className="mr-4 text-lg font-bold tracking-tight text-slate-950">Talent Hunt<span className="text-indigo-600">.</span></Link><span className="mr-auto text-xs font-semibold uppercase tracking-wider text-slate-400">Admin</span>{[['/admin/companies', 'Companies'], ['/admin/jobs', 'Jobs'], ['/admin/users', 'Users']].map(([href, label]) => <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700">{label}</Link>)}<form action="/api/auth/logout" method="post" className="ml-2"><button type="submit" className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-rose-600">Sign out</button></form></div></nav><main>{children}</main></div>;
}
