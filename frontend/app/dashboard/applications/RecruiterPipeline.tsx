import Link from 'next/link';
import { apiFetch } from '@/lib/server-api';
import type { Pipeline } from '@/lib/types';
import { ErrorState, EmptyState } from '@/components/ui-states';

const stages = ['applied', 'screening', 'interview', 'final_interview', 'offer', 'hired', 'rejected'] as const;

export default async function RecruiterPipeline() {
  const response = await apiFetch('/api/applications');
  if (response.status === 403) return <ErrorState message="You do not have permission to view this pipeline." />;
  if (!response.ok) return <ErrorState message="Unable to load the application pipeline." />;
  const { pipeline }: { pipeline: Pipeline } = await response.json();
  return (
    <div className="grid gap-4 overflow-x-auto md:grid-cols-2 xl:grid-cols-4">
      {stages.map((stage) => (
        <section key={stage} className="min-w-64 rounded-xl bg-gray-50 p-3">
          <h2 className="mb-3 text-sm font-semibold capitalize">{stage.replace('_', ' ')} <span className="text-gray-400">({pipeline[stage]?.length ?? 0})</span></h2>
          <div className="space-y-3">
            {(pipeline[stage] ?? []).map((application) => (
              <article key={application.id} className="rounded-lg border bg-white p-3 shadow-sm">
                <p className="font-medium">{application.job_title}</p>
                <p className="text-sm text-gray-500">{application.profile_snapshot?.headline ?? 'Applicant'}</p>
                <Link href={`/dashboard/applications/${application.id}`} className="mt-3 inline-block text-sm text-blue-600 hover:underline">Open review</Link>
              </article>
            ))}
            {(pipeline[stage] ?? []).length === 0 && <EmptyState message="No applications" />}
          </div>
        </section>
      ))}
    </div>
  );
}
