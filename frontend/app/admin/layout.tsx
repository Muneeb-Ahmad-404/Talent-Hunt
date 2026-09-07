import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/lib/api-server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('access_token')?.value
  if (!token) redirect('/login?next=/admin')
  const response = await apiFetch('/auth/me')
  if (!response.ok) redirect('/login?next=/admin')
  const data = await response.json()
  if (data.user?.role !== 'admin') redirect('/dashboard')
  return <div className="min-h-screen bg-muted/30"><header className="border-b bg-card"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><Link href="/admin" className="text-lg font-semibold text-primary">Talent Hunt <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs">Admin</span></Link><Link href="/" className="text-sm text-muted-foreground hover:text-foreground">View site</Link></div></header><div className="mx-auto flex max-w-7xl gap-8 px-6 py-8"><aside className="hidden w-52 shrink-0 md:block"><nav className="flex flex-col gap-1">{[['/admin','Overview'],['/admin/companies','Companies'],['/admin/jobs','Jobs'],['/admin/users','Users']].map(([href,label]) => <Link key={href} href={href} className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground">{label}</Link>)}</nav></aside><main className="min-w-0 flex-1">{children}</main></div></div>
}
