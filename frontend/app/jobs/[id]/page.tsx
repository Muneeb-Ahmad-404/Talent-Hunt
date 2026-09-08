'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apiRouter } from '@/lib/api'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    let active = true
    apiRouter.public.job(id).then(async (response) => {
      const payload = await response.json().catch(() => ({}))
      if (active) setJob(response.ok ? payload : null)
    }).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id])

  async function requireAuthAction(action: () => Promise<Response>, success: string) {
    setPending(true)
    setMessage('')
    const response = await action()
    const payload = await response.json().catch(() => ({}))
    if (response.status === 401) {
      router.push(`/login?next=/jobs/${id}`)
    } else {
      setMessage(response.ok ? success : payload.message ?? payload.error?.message ?? 'Unable to complete this action.')
    }
    setPending(false)
  }

  if (loading) return <main className="mx-auto max-w-5xl px-6 py-16 text-muted-foreground">Loading job details…</main>
  if (!job) return <main className="mx-auto max-w-5xl px-6 py-16"><h1 className="text-2xl font-semibold">Job not found</h1><Link href="/jobs" className="mt-4 inline-block text-primary">Back to jobs</Link></main>

  const salary = job.salaryMin || job.salaryMax ? `${job.salaryMin ?? ''}${job.salaryMin && job.salaryMax ? ' – ' : ''}${job.salaryMax ?? ''}` : null
  return <main className="min-h-screen bg-background"><header className="border-b bg-card"><div className="mx-auto max-w-5xl px-6 py-4"><Link href="/jobs" className="text-sm font-medium text-primary">← Back to jobs</Link></div></header><article className="mx-auto max-w-5xl px-6 py-12"><div className="rounded-3xl border bg-card p-8 shadow-sm md:p-12"><div className="flex flex-col gap-6 border-b pb-8 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Open position</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">{job.title}</h1><p className="mt-3 text-lg text-muted-foreground">{job.companyName}</p><div className="mt-5 flex flex-wrap gap-2 text-sm text-muted-foreground"><span className="rounded-full bg-muted px-3 py-1">{job.location}</span><span className="rounded-full bg-muted px-3 py-1">{job.employmentType}</span>{salary && <span className="rounded-full bg-muted px-3 py-1">{salary}</span>}</div></div><div className="flex shrink-0 gap-3"><button disabled={pending} onClick={() => requireAuthAction(() => apiRouter.applicants.apply({ jobIds: [id], answers: {} }), 'Application submitted.')} className="rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground disabled:opacity-60">Apply now</button><button disabled={pending} onClick={() => requireAuthAction(() => apiRouter.applicants.addShortlist(id), 'Added to shortlist.')} className="rounded-xl border px-5 py-3 font-medium disabled:opacity-60">Shortlist</button></div></div><div className="prose prose-slate mt-10 max-w-none whitespace-pre-wrap"><h2>About the role</h2><p>{job.description || 'The employer has not added a description yet.'}</p>{Array.isArray(job.attributes) && job.attributes.length > 0 && <><h2>What you’ll work on</h2><ul>{job.attributes.map((item: string) => <li key={item}>{item}</li>)}</ul></>}{Array.isArray(job.screeningQuestions) && job.screeningQuestions.length > 0 && <><h2>Application questions</h2><ol>{job.screeningQuestions.map((item: string) => <li key={item}>{item}</li>)}</ol></>}</div>{message && <p role="status" className="mt-8 rounded-xl bg-muted p-4 text-sm">{message}</p>}</div></article></main>
}
