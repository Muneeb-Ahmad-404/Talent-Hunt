'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { readApiError } from '@/lib/api';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = searchParams.get('email') ?? '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    if (!normalizedEmail) {
      setError('Enter the email address you registered with.');
      return;
    }

    if (!/^\d{6}$/.test(normalizedOtp)) {
      setError('Enter the 6-digit verification code.');
      return;
    }

    setBusy(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          otp: normalizedOtp,
        }),
      });

      if (!response.ok) {
        setError(
          await readApiError(
            response,
            'We could not verify your email. Check the code and try again.',
          ),
        );
        return;
      }

      setMessage('Email verified successfully. Redirecting to sign in…');

      setTimeout(() => {
        router.push('/login');
      }, 900);
    } catch {
      setError('Unable to reach the authentication service. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    setError(null);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Enter the email address you registered with first.');
      return;
    }

    setResending(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      if (!response.ok) {
        setError(
          await readApiError(
            response,
            'We could not resend the verification code. Please try again.',
          ),
        );
        return;
      }

      setMessage('A new verification code has been sent.');
      setOtp('');
    } catch {
      setError('Unable to reach the authentication service. Please try again.');
    } finally {
      setResending(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-slate-500">
          Account verification
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Verify your email
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Enter the 6-digit code we sent to your email address to finish
          creating your account.
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="otp"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Verification code
          </label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(event) => {
              const value = event.target.value
                .replace(/\D/g, '')
                .slice(0, 6);

              setOtp(value);
            }}
            placeholder="000000"
            className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-center text-lg font-semibold tracking-[0.35em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={busy || resending}
          className="h-11 w-full rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? 'Verifying…' : 'Verify email'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between gap-4 text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={busy || resending}
          className="font-medium text-slate-700 transition hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resending ? 'Sending…' : 'Resend code'}
        </button>

        <Link
          href="/login"
          className="text-slate-500 transition hover:text-slate-950"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

function VerifyEmailFallback() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 w-24 rounded bg-slate-200"></div>
      <div className="h-8 w-48 rounded bg-slate-200"></div>
      <div className="h-12 w-full rounded-lg bg-slate-100"></div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-slate-950"
          >
            Talent Hunt
          </Link>
        </div>

        <Suspense fallback={<VerifyEmailFallback />}>
          <VerifyEmailForm />
        </Suspense>

        <p className="mt-10 text-xs leading-5 text-slate-400">
          If you did not receive the code, check your spam folder or request a
          new one.
        </p>
      </div>
    </main>
  );
}