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
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl"><div className="rounded-2xl bg-white p-5 text-slate-900"><div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Hiring overview</p><h2 className="mt-1 text-xl font-semibold">A calmer way to hire</h2></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">On track</span></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-2xl font-semibold">24</p><p className="mt-1 text-xs text-slate-500">Active candidates</p></div><div className="rounded-xl bg-indigo-50 p-4"><p className="text-2xl font-semibold text-indigo-700">8</p><p className="mt-1 text-xs text-slate-500">Open positions</p></div></div><div className="mt-4 space-y-3">{['Senior Product Designer','Frontend Engineer','People Operations Lead'].map((role) => <div key={role} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 text-sm"><span>{role}</span><span className="text-xs text-slate-400">View role</span></div>)}</div></div></div>
    </section>
  </main>;
}
