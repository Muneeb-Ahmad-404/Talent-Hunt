'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { apiRouter } from '@/lib/api'

type Application = { id: string; applicant_id?: string; stage?: string; status?: string; headline?: string; job_title?: string; latest_interview?: { id: string; scheduled_at: string; meeting_link?: string; outcome?: string } | null }
const stages = ['applied', 'screening', 'interview', 'final_interview', 'offer', 'hired', 'rejected']

export default function ApplicantsPage() {
  const [pipeline, setPipeline] = useState<Record<string, Application[]>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState('')
  const [filter, setFilter] = useState('all')

  async function load() {
    const response = await apiRouter.applications.pipeline()
    const data = await response.json().catch(() => ({}))
    if (!response.ok) return setError(data?.message ?? 'Unable to load the hiring pipeline.')
    setPipeline(data.pipeline ?? {})
  }
  useEffect(() => { load() }, [])

  const total = useMemo(() => Object.values(pipeline).reduce((sum, items) => sum + items.length, 0), [pipeline])
  async function move(id: string, stage: string) {
    setBusy(id); setError('')
    const response = await apiRouter.applications.moveStage(id, stage)
    if (!response.ok) { const data = await response.json().catch(() => ({})); setError(data?.message ?? 'That stage transition is not allowed.') }
    else await load()
    setBusy('')
  }

  return <main className="mx-auto max-w-7xl px-6 py-10 md:px-10">
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-semibold text-primary">Recruiter workspace</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Hiring pipeline</h1><p className="mt-2 text-muted-foreground">Review {total} applications and move candidates through the process.</p></div><Link href="/dashboard/jobs" className="rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">Manage jobs</Link></div>
    {error && <p role="alert" className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
    <div className="mt-8 flex gap-2 overflow-x-auto pb-2">{['all', ...stages].map((item) => <button key={item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${filter === item ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>{item.replace('_', ' ')}</button>)}</div>
    <div className="mt-5 grid gap-4 overflow-x-auto lg:grid-cols-4 xl:grid-cols-7">{stages.map((stage) => <section key={stage} className={`min-w-[235px] rounded-2xl border bg-muted/30 p-3 ${filter !== 'all' && filter !== stage ? 'hidden lg:block opacity-40' : ''}`}><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold capitalize">{stage.replace('_', ' ')}</h2><span className="rounded-full bg-background px-2 py-1 text-xs text-muted-foreground">{pipeline[stage]?.length ?? 0}</span></div><div className="flex flex-col gap-3">{(pipeline[stage] ?? []).map((item) => <article key={item.id} className="rounded-xl border bg-card p-4 shadow-sm"><div className="flex items-start justify-between gap-2"><div><p className="font-medium">{item.headline || 'Applicant'}</p><p className="mt-1 text-xs text-muted-foreground">{item.job_title || 'Job application'}</p></div><span className="text-[10px] uppercase text-muted-foreground">{item.status ?? 'active'}</span></div>{item.latest_interview && <p className="mt-3 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">Interview: {new Date(item.latest_interview.scheduled_at).toLocaleString()}</p>}<div className="mt-4 flex items-center justify-between gap-2"><Link href={`/dashboard/applicants/${item.id}`} className="text-xs font-semibold text-primary hover:underline">Open review</Link>{!['hired', 'rejected'].includes(stage) && <select aria-label={`Move application ${item.id}`} disabled={busy === item.id} defaultValue="" onChange={(event) => event.target.value && move(item.id, event.target.value)} className="max-w-[110px] rounded-md border bg-background px-2 py-1 text-xs"><option value="">Move to…</option>{stages.filter((next) => next !== stage && (next === 'rejected' || stages.indexOf(next) > stages.indexOf(stage))).map((next) => <option key={next} value={next}>{next.replace('_', ' ')}</option>)}</select>}</div></article>)}{!(pipeline[stage]?.length) && <p className="py-8 text-center text-xs text-muted-foreground">No candidates</p>}</div></section>)}</div>
  </main>
}

export const dynamic = 'force-dynamic'
