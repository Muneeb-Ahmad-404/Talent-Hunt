'use client'

import { FormEvent, useEffect, useState } from 'react'
import { apiRouter } from '@/lib/api'

type Application = { id: string; stage?: string; headline?: string; job_title?: string; latest_interview?: { id: string; scheduled_at: string; meeting_link?: string; outcome?: string } | null }

export default function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('')
  const [application, setApplication] = useState<Application | null>(null)
  const [date, setDate] = useState('')
  const [link, setLink] = useState('')
  const [notes, setNotes] = useState('')
  const [feedback, setFeedback] = useState('')
  const [outcome, setOutcome] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => { params.then((value) => setId(value.id)) }, [params])
  useEffect(() => {
    if (!id) return
    apiRouter.applications.pipeline().then(async (response) => {
      const data = await response.json().catch(() => ({}))
      const all = Object.values(data.pipeline ?? {}).flat() as Application[]
      setApplication(all.find((item) => item.id === id) ?? null)
    })
  }, [id])

  async function schedule(event: FormEvent) {
    event.preventDefault(); setPending(true); setMessage('')
    const response = await apiRouter.applications.scheduleInterview(id, { scheduledAt: date, meetingLink: link, notes })
    const data = await response.json().catch(() => ({}))
    setMessage(response.ok ? 'Interview scheduled and candidate notified.' : data.message ?? data.error?.message ?? 'Could not schedule interview.')
    setPending(false)
  }

  async function saveFeedback(event: FormEvent) {
    event.preventDefault(); setPending(true); setMessage('')
    const interviewId = application?.latest_interview?.id
    if (!interviewId) { setMessage('Schedule an interview before adding feedback.'); setPending(false); return }
    const response = await apiRouter.applications.feedback(interviewId, { feedback, outcome })
    const data = await response.json().catch(() => ({}))
    setMessage(response.ok ? 'Interview feedback saved.' : data.message ?? data.error?.message ?? 'Could not save feedback.')
    setPending(false)
  }

  const interviewStage = application?.stage === 'interview' || application?.stage === 'final_interview'
  return <main className="mx-auto max-w-5xl px-6 py-10 md:px-10"><p className="text-sm font-semibold text-primary">Candidate review</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{application?.headline || 'Application workspace'}</h1><p className="mt-2 text-muted-foreground">{application?.job_title || 'Review application details and coordinate the next step.'}</p>{application?.stage && <div className="mt-5 inline-flex rounded-full bg-muted px-3 py-1 text-sm capitalize">{application.stage.replace('_', ' ')}</div>}<div className="mt-8 grid gap-6 lg:grid-cols-2"><form onSubmit={schedule} className="flex flex-col gap-4 rounded-2xl border bg-card p-6"><div><h2 className="font-semibold">Schedule interview</h2><p className="mt-1 text-sm text-muted-foreground">Available when the candidate reaches an interview stage.</p></div><label className="flex flex-col gap-2 text-sm font-medium">Date and time<input required type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl border bg-background px-3 py-2.5" /></label><label className="flex flex-col gap-2 text-sm font-medium">Meeting link<input type="url" value={link} onChange={(e) => setLink(e.target.value)} className="rounded-xl border bg-background px-3 py-2.5" /></label><label className="flex flex-col gap-2 text-sm font-medium">Notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-24 rounded-xl border bg-background px-3 py-2.5" /></label><button disabled={pending || !interviewStage} className="rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-50">{interviewStage ? 'Schedule interview' : 'Move candidate to interview first'}</button></form>{interviewStage && <form onSubmit={saveFeedback} className="flex flex-col gap-4 rounded-2xl border bg-card p-6"><div><h2 className="font-semibold">Interview feedback</h2><p className="mt-1 text-sm text-muted-foreground">Feedback is available only during interview stages.</p></div><label className="flex flex-col gap-2 text-sm font-medium">Outcome<select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="rounded-xl border bg-background px-3 py-2.5"><option value="">Select outcome</option><option value="advance">Advance</option><option value="reject">Reject</option></select></label><label className="flex flex-col gap-2 text-sm font-medium">Feedback<textarea required value={feedback} onChange={(e) => setFeedback(e.target.value)} className="min-h-32 rounded-xl border bg-background px-3 py-2.5" /></label><button disabled={pending || !application?.latest_interview} className="rounded-xl border px-4 py-3 font-medium disabled:opacity-50">Save feedback</button></form>}</div>{message && <p role="status" className="mt-6 rounded-xl bg-muted p-4 text-sm">{message}</p>}</main>
}
