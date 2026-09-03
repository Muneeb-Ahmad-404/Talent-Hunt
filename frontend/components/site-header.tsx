'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-blue-600">Talent Hunt</Link>
        <nav className="flex items-center gap-4 text-sm" aria-label="Main navigation">
          <Link className={pathname.startsWith('/jobs') ? 'font-medium text-blue-600' : 'text-slate-600 hover:text-blue-600'} href="/jobs">Browse jobs</Link>
          <Link className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" href="/login">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return <footer className="border-t bg-white"><div className="mx-auto max-w-6xl px-6 py-6 text-sm text-slate-500">Talent Hunt · Simple hiring for growing teams</div></footer>;
}
