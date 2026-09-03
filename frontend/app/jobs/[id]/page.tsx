'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  async function action(path: string, body: object, success: string) {
    setPending(true); setStatus('');
    try { const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'include' }); const data = await res.json().catch(() => ({})); setStatus(res.ok ? success : data.message ?? data.error?.message ?? 'Please sign in to continue.'); }
    catch { setStatus('Unable to connect. Please try again.'); } finally { setPending(false); }
  }
  return <main className="min-h-screen bg-background"><header className="border-b bg-white"><div className="mx-auto max-w-4xl px-6 py-4"><Link href="/jobs" className="text-sm font-medium text-blue-600">← Back to jobs</Link></div></header><section className="mx-auto max-w-4xl px-6 py-12"><div className="rounded-lg border bg-white p-8"><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Open position</p><h1 className="mt-3 text-3xl font-bold text-slate-900">Job details</h1><p className="mt-2 text-sm text-slate-500">Reference: {id}</p><div className="mt-10 flex flex-wrap gap-3"><button disabled={pending} onClick={() => action('/api/applicants/apply', { jobIds: [id], answers: {} }, 'Application submitted.')} className="rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60">Apply now</button><button disabled={pending} onClick={() => action('/api/applicants/shortlist', { jobId: id }, 'Added to your shortlist.')} className="rounded-md border px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60">Shortlist</button></div>{status && <p role="status" className="mt-5 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{status}</p>}</div></section></main>;
}
