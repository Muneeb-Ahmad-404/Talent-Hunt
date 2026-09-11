import Link from 'next/link';
import { ButtonLink } from '@/components/ui';

export default function Home() {
  return <main className="min-h-screen bg-slate-950 text-white">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
      <Link href="/" className="text-lg font-bold tracking-tight">Talent Hunt<span className="text-indigo-400">.</span></Link>
      <div className="flex items-center gap-3 text-sm"><Link href="/jobs" className="text-slate-300 hover:text-white">Browse jobs</Link><Link href="/login" className="rounded-lg border border-slate-700 px-4 py-2 hover:border-slate-500">Sign in</Link></div>
    </nav>
    <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-24 pt-20 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:pt-32">
      <div><p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Hiring, with clarity</p><h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">Find the right opportunity. Build the right team.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Talent Hunt brings job seekers and focused recruiting teams together in one clear, human-friendly workspace.</p><div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/jobs">Explore open roles</ButtonLink><Link href="/login" className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800">Sign in to your workspace</Link></div></div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl"><div className="rounded-2xl bg-white p-6 text-slate-900"><p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">One clear workspace</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Less noise. Better conversations.</h2><p className="mt-4 text-sm leading-6 text-slate-500">Keep job discovery, applications, and recruiting decisions focused in one place.</p><div className="mt-8 space-y-3"><div className="border-l-2 border-indigo-500 pl-4"><p className="font-medium">Discover the right fit</p><p className="mt-1 text-sm text-slate-500">Browse opportunities that match your goals.</p></div><div className="border-l-2 border-slate-200 pl-4"><p className="font-medium">Make thoughtful decisions</p><p className="mt-1 text-sm text-slate-500">Give every candidate and application a clear next step.</p></div></div></div></div>
    </section>
  </main>;
}
