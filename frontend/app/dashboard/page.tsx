'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unauthenticated');
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        const user = data.user ?? data;
        const role = String(user.role ?? user.userType ?? '').toLowerCase();
        if (role === 'admin') router.replace('/admin');
        else if (role === 'applicant' || role === 'candidate') router.replace('/dashboard/applications');
        else router.replace('/dashboard/jobs');
      })
      .catch(() => router.replace('/login?next=/dashboard'));
    return () => { active = false; };
  }, [router]);

  return <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading your dashboard…</main>;
}

export const dynamic = 'force-dynamic';
