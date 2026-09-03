'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('owner@example.com');
  const [password, setPassword] = useState('Password1!');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setPending(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.error?.message || data.message || 'Login failed'); return; }
      const next = new URLSearchParams(window.location.search).get('next');
      if (next && next.startsWith('/jobs/')) router.push(next);
      else router.push('/dashboard');
    } catch { setError('Unable to connect. Please try again.'); }
    finally { setPending(false); }
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6"><div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm"><h1 className="text-2xl font-bold text-slate-900">Sign in</h1><p className="mt-2 text-sm text-slate-600">Access your Talent Hunt account.</p><form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5"><label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border px-3 py-2 font-normal outline-none focus:border-blue-600" required /></label><label className="flex flex-col gap-2 text-sm font-medium text-slate-700">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md border px-3 py-2 font-normal outline-none focus:border-blue-600" required /></label>{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button type="submit" disabled={pending} className="rounded-md bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{pending ? 'Signing in…' : 'Sign in'}</button></form></div></main>;
}
