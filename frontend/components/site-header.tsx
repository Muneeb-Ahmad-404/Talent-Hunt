'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ role?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setUser(data?.user ?? (data || null)))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  }

  const role = String(user?.role ?? '').toLowerCase();
  const dashboard = role === 'admin' ? '/admin' : role === 'applicant' || role === 'candidate' ? '/dashboard/applications' : '/dashboard/jobs';

  return <header className="border-b bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"><Link href="/" className="text-xl font-bold text-blue-600">Talent Hunt</Link><nav className="flex items-center gap-4 text-sm" aria-label="Main navigation"><Link className={pathname.startsWith('/jobs') ? 'font-medium text-blue-600' : 'text-slate-600 hover:text-blue-600'} href="/jobs">Browse jobs</Link>{!loading && user ? <><Link className="text-slate-600 hover:text-blue-600" href={dashboard}>Dashboard</Link><button onClick={logout} className="rounded-md border px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">Log out</button></> : !loading ? <Link className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" href={`/login?next=${encodeURIComponent(pathname)}`}>Sign in</Link> : null}</nav></div></header>;
}

export function SiteFooter() { return <footer className="border-t bg-white"><div className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500">Talent Hunt · Simple hiring for growing teams</div></footer>; }
