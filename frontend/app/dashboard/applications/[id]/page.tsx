import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/server-api';
import type { Pipeline } from '@/lib/types';
import ApplicationActions from '../ApplicationActions';
import { ErrorState } from '@/components/ui-states';

export default async function ApplicationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await apiFetch('/api/applications');
  if (!response.ok) return <main className="p-6"><ErrorState message="Unable to load this application." /></main>;
  const { pipeline }: { pipeline: Pipeline } = await response.json();
  const application = Object.values(pipeline).flat().find((item) => item.id === id);
  if (!application) notFound();
  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div><p className="text-sm text-gray-500">Application review</p><h1 className="text-3xl font-semibold">{application.job_title}</h1><p className="text-gray-600">{application.profile_snapshot?.headline ?? 'Applicant'}</p></div>
      <section className="rounded-xl border p-5"><h2 className="font-semibold">Saved application profile</h2><p className="mt-3 whitespace-pre-wrap text-gray-700">{application.profile_snapshot?.bio || 'No saved bio provided.'}</p><div className="mt-4 flex flex-wrap gap-2">{(application.profile_snapshot?.skills ?? []).map((skill) => <span key={skill} className="rounded-full bg-gray-100 px-3 py-1 text-sm">{skill}</span>)}</div></section>
      <section className="rounded-xl border p-5"><h2 className="font-semibold">Screening answers</h2><p className="mt-2 text-sm text-gray-500">Screening answers are not included in the current company pipeline response.</p></section>
      <ApplicationActions applicationId={application.id} currentStage={application.stage} interviewId={application.latest_interview?.id} />
    </main>
  );
}
