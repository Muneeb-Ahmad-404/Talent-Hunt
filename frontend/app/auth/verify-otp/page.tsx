'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRouter } from '@/lib/api'

export default function VerifyOtpPage() {
  const router = useRouter()
  const [email, setEmail] = useState(() => typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('email') ?? '')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    setMessage('')
    const response = await apiRouter.auth.verifyEmail({ email, otp })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setError(data.error?.message ?? data.message ?? 'That verification code is invalid or expired.')
    } else {
      router.replace(`/login?verified=1&email=${encodeURIComponent(email)}`)
    }
    setPending(false)
  }

  async function resend() {
    setError('')
    setMessage('')
    const response = await apiRouter.auth.resendVerification({ email })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) setError(data.error?.message ?? data.message ?? 'Unable to resend the code.')
    else setMessage('If the account is pending verification, a new code has been sent.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm font-semibold text-primary">Talent Hunt</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Verify your email</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Enter the six-digit code sent to your email address.</p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-xl border bg-background px-3 py-3" /></label>
          <label className="flex flex-col gap-2 text-sm font-medium">Verification code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} className="rounded-xl border bg-background px-3 py-3 tracking-[0.35em]" /></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-primary">{message}</p>}
          <button disabled={pending} className="rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-60">{pending ? 'Verifying…' : 'Verify email'}</button>
        </form>
        <button type="button" onClick={resend} className="mt-4 w-full text-sm font-medium text-primary">Resend code</button>
        <p className="mt-6 text-center text-sm text-muted-foreground"><Link href="/login" className="font-medium text-primary">Back to sign in</Link></p>
      </section>
    </main>
  )
}
