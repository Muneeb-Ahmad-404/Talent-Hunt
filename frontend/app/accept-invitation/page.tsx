'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { clientApiFetch, readApiError } from '@/lib/api'

export default function AcceptInvitationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()

    if (!token) {
      setError('This invitation link is invalid.')
      return
    }

    setPending(true)
    setError('')

    try {
      const response = await clientApiFetch('/api/auth/accept-invitation', {
        method: 'POST',
        body: JSON.stringify({
          token,
          email,
          ...(password ? { password } : {}),
        }),
      })

      if (!response.ok) {
        setError(await readApiError(response))
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Unable to accept the invitation. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-sm"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Team invitation
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Join the workspace
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Use the invited email. If you don’t have an account yet, create a
          password to finish joining.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border bg-background px-3 py-2.5"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium">
            Password
            <span className="font-normal text-muted-foreground">
              (only required for a new account)
            </span>
            <input
              minLength={8}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border bg-background px-3 py-2.5"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || !token}
            className="rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-60"
          >
            {pending ? 'Joining…' : 'Accept invitation'}
          </button>
        </div>
      </form>
    </main>
  )
}