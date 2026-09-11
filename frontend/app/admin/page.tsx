import Link from 'next/link';
import { PageHeader, PageShell, Card } from '@/components/ui';

export default function AdminHome() {
  return <PageShell><PageHeader eyebrow="Administration" title="Platform overview" description="Choose an area to review and manage platform activity." /><div className="grid gap-4 md:grid-cols-3">{[['/admin/companies', 'Companies', 'Review verification and account status.'], ['/admin/jobs', 'Jobs', 'Monitor published opportunities.'], ['/admin/users', 'Users', 'Review platform accounts and access.']].map(([href, title, description]) => <Link key={href} href={href}><Card className="h-full p-6 transition hover:border-indigo-200 hover:shadow-md"><h2 className="font-semibold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p><span className="mt-6 block text-sm font-semibold text-indigo-600">Open {title.toLowerCase()} →</span></Card></Link>)}</div></PageShell>;
}
