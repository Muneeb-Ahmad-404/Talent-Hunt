'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRouter } from '@/lib/api'

export default function SignupPage() {
  const router = useRouter()
  const [role, setRole] = useState<'applicant' | 'recruiter'>('applicant')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError('')
    const form = new FormData(event.currentTarget)
    const response = await apiRouter.auth.register({ email: form.get('email'), password: form.get('password'), role })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) { setError(data.error?.message ?? data.message ?? 'Could not create account.'); setPending(false); return }
    router.push(`/auth/verify-otp?email=${encodeURIComponent(String(form.get('email') ?? ''))}`)
  }

  return <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12"><div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-sm"><p className="text-sm font-semibold text-primary">Talent Hunt</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Create your account</h1><p className="mt-2 text-sm text-muted-foreground">Join as an applicant or build your hiring workspace.</p><form onSubmit={submit} className="mt-8 flex flex-col gap-5"><label className="flex flex-col gap-2 text-sm font-medium">Account type<select value={role} onChange={(e) => setRole(e.target.value as typeof role)} className="rounded-xl border bg-background px-3 py-3"><option value="applicant">Applicant</option><option value="recruiter">Recruiter</option></select></label><label className="flex flex-col gap-2 text-sm font-medium">Email<input name="email" required type="email" className="rounded-xl border bg-background px-3 py-3" /></label><label className="flex flex-col gap-2 text-sm font-medium">Password<input name="password" required minLength={8} type="password" className="rounded-xl border bg-background px-3 py-3" /><span className="text-xs font-normal text-muted-foreground">At least 8 characters.</span></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button disabled={pending} className="rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-60">{pending ? 'Creating account…' : 'Create account'}</button></form><p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-medium text-primary">Sign in</Link></p></div></main>
}
