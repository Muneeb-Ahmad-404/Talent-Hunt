'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useState } from 'react'
import { apiRouter } from '@/lib/api'

type Member = { recruiterId: string; email: string; companyRole?: string }

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  async function load() {
    const response = await apiRouter.companies.members()
    const data = await response.json().catch(() => ({}))
    if (response.ok) setMembers(data.members ?? [])
  }
  useEffect(() => { load() }, [])

  async function invite(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setMessage('')
    const response = await apiRouter.companies.invite({ email, role })
    const data = await response.json().catch(() => ({}))
    setMessage(response.ok ? 'Invitation sent.' : data.message ?? data.error?.message ?? 'Could not send invitation.')
    if (response.ok) setEmail('')
    setPending(false)
  }

  return <main className="mx-auto max-w-6xl px-6 py-10 md:px-10"><div className="mb-8"><p className="text-sm font-semibold text-primary">Company settings</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Team members</h1><p className="mt-2 max-w-2xl text-muted-foreground">Invite recruiters to your company workspace. The invited email can either sign in to an existing account or create a new recruiter account from the invitation link.</p></div><div className="grid gap-6 lg:grid-cols-[1fr_380px]"><section className="overflow-hidden rounded-2xl border bg-card"><div className="border-b px-6 py-5"><h2 className="font-semibold">Workspace members</h2></div>{members.length === 0 ? <p className="p-8 text-sm text-muted-foreground">No members found.</p> : <div className="divide-y">{members.map((member) => <div key={member.recruiterId} className="flex items-center justify-between gap-4 px-6 py-5"><div><p className="font-medium">{member.email}</p><p className="mt-1 text-xs capitalize text-muted-foreground">{String(member.companyRole ?? 'member').replaceAll('_', ' ')}</p></div><span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">Active</span></div>)}</div>}</section><form onSubmit={invite} className="flex h-fit flex-col gap-5 rounded-2xl border bg-card p-6"><div><h2 className="font-semibold">Invite a member</h2><p className="mt-1 text-sm text-muted-foreground">The backend expects an email and role.</p></div><label className="flex flex-col gap-2 text-sm font-medium">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border bg-background px-3 py-2.5" /></label><label className="flex flex-col gap-2 text-sm font-medium">Role<select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-xl border bg-background px-3 py-2.5"><option value="member">Member</option><option value="owner">Owner</option></select></label><button disabled={pending} className="rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-60">{pending ? 'Sending…' : 'Send invitation'}</button>{message && <p role="status" className="rounded-xl bg-muted p-3 text-sm">{message}</p>}</form></div></main>
}
