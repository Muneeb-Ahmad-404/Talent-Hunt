import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { apiFetch } from '@/lib/server-api';
import type { Application, ShortlistItem } from '@/lib/types';
import { Card, PageHeader, PageShell, StatusPill } from '@/components/ui';
import { EmptyState, ErrorState } from '@/components/ui-states';

export default async function ApplicantDashboard() {
  const user = await getCurrentUser();

  if (!user) redirect('/login');
  if (user.role === 'recruiter') redirect('/dashboard/company');
  if (user.role === 'admin') redirect('/admin');

  const [
    applicationsResponse,
    shortlistResponse,
    profileResponse,
  ] = await Promise.all([
    apiFetch('/api/applicants/applications'),
    apiFetch('/api/applicants/shortlist'),
    apiFetch('/api/applicants/profile'),
  ]);

  if (
    (!applicationsResponse.ok && applicationsResponse.status !== 404) ||
    (!shortlistResponse.ok && shortlistResponse.status !== 404)
  ) {
    return (
      <PageShell>
        <ErrorState message="We couldn't load your dashboard right now." />
      </PageShell>
    );
  }

  const { applications = [] }: { applications?: Application[] } =
    applicationsResponse.status === 404
      ? {}
      : await applicationsResponse.json();

  const { shortlist = [] }: { shortlist?: ShortlistItem[] } =
    shortlistResponse.status === 404
      ? {}
      : await shortlistResponse.json();

  const profile = profileResponse.ok
    ? await profileResponse.json()
    : null;

  const hasProfile =
    Boolean(profile?.headline) ||
    Boolean(profile?.bio) ||
    Boolean(profile?.skills?.length);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Applicant workspace"
        title={`Welcome back, ${user.email.split('@')[0]}`}
        description="Keep track of your applications, saved opportunities, and professional profile."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/my-applications" className="group">
          <Card className="h-full p-5 transition-shadow group-hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-medium text-slate-500">
                Applications
              </p>
              <span className="text-slate-300 transition-colors group-hover:text-slate-500">
                →
              </span>
            </div>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {applications.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Submitted applications
            </p>
          </Card>
        </Link>

        <Link href="/dashboard/shortlist" className="group">
          <Card className="h-full p-5 transition-shadow group-hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-medium text-slate-500">
                Shortlist
              </p>
              <span className="text-slate-300 transition-colors group-hover:text-slate-500">
                →
              </span>
            </div>

            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {shortlist.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Saved opportunities
            </p>
          </Card>
        </Link>

        <Link href="/dashboard/profile" className="group">
          <Card className="h-full p-5 transition-shadow group-hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-medium text-slate-500">
                Profile
              </p>
              <span className="text-slate-300 transition-colors group-hover:text-slate-500">
                →
              </span>
            </div>

            <p className="mt-3 text-lg font-semibold text-slate-950">
              {hasProfile ? 'Up to date' : 'Needs attention'}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Professional information
            </p>
          </Card>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
        <Card className="p-6">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Recent applications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest submissions and their current stage.
              </p>
            </div>

            <Link
              href="/dashboard/applications"
              className="text-sm font-semibold text-slate-900 hover:text-slate-600"
            >
              View all
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="pt-5">
              <EmptyState message="No applications yet. Explore open roles when you're ready." />
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((application) => (
                <Link
                  key={application.id}
                  href={`/dashboard/applications/${application.id}`}
                  className="group flex flex-col gap-3 py-4 first:pt-5 last:pb-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 group-hover:text-slate-600">
                      {application.job_title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {application.company_name}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <StatusPill status={application.stage} />
                    <span className="hidden text-slate-300 transition-colors group-hover:text-slate-500 sm:inline">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="border-b border-slate-100 pb-5">
            <h2 className="text-base font-semibold text-slate-950">
              Keep moving
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Useful actions for your next application.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <Link
              href="/jobs"
              className="group flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3.5 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Find a new role
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Browse current openings.
                </p>
              </div>

              <span className="text-slate-300 transition-colors group-hover:text-slate-500">
                →
              </span>
            </Link>

            <Link
              href="/dashboard/shortlist"
              className="group flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3.5 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Review your shortlist
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Return to roles you've saved.
                </p>
              </div>

              <span className="text-slate-300 transition-colors group-hover:text-slate-500">
                →
              </span>
            </Link>

            <Link
              href="/dashboard/profile"
              className="group flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3.5 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Update your profile
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Keep your professional information current.
                </p>
              </div>

              <span className="text-slate-300 transition-colors group-hover:text-slate-500">
                →
              </span>
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}