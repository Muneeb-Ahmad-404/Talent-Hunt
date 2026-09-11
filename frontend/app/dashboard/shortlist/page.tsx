import { apiFetch } from '../../../lib/server-api';
import type { ShortlistItem } from '@/lib/types';
import Link from 'next/link';
import { PageHeader, PageShell, Card } from '@/components/ui';
import { EmptyState, ErrorState } from '@/components/ui-states';

export default async function ShortlistPage() {
  const res = await apiFetch('/api/applicants/shortlist');

  if (!res.ok && res.status !== 404) { 
    return (
      <PageShell>
        <PageHeader
          eyebrow="Applicant workspace"
          title="Your shortlist"
          description="Keep promising opportunities close while you explore your next move."
        />
        <ErrorState message="Unable to load your shortlist." />
      </PageShell>
    );
  }

  const data: { shortlist?: ShortlistItem[] } = res.status === 404 ? {} : await res.json();
  const shortlist = data.shortlist ?? [];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Applicant workspace"
        title="Your shortlist"
        description="Keep promising opportunities close while you explore your next move."
      />

      {shortlist.length === 0 ? (
        <EmptyState message="Your shortlist is empty. Save a role from its job detail page to see it here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {shortlist.map((item) => (
            <Card
              key={item.id}
              className="flex h-full flex-col p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600">
                  {item.company_name?.slice(0, 1).toUpperCase() || 'C'}
                </div>

                <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                  Saved
                </span>
              </div>

              <div className="mt-5 flex-1">
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {item.company_name}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <Link
                  href={`/jobs/${item.job_id}`}
                  className="inline-flex items-center text-sm font-semibold text-slate-900 transition-colors hover:text-slate-600"
                >
                  View opportunity
                  <span className="ml-1.5" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}